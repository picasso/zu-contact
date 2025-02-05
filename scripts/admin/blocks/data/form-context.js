import { set, unset, values } from 'lodash-es'

// wordpress dependencies
import { select, subscribe } from '@wordpress/data'
import { createContext, useCallback, useContext, useEffect, useRef } from '@wordpress/element'

// Internal dependencies
import { persistForms, TYPES, useUpdateForm as useUpdateFormGeneric } from './form-store.js'
export { TYPES }

// Context to make 'updateForm' and 'updateField' be accessible by many components in the tree,
// and at different nesting levels
export const FormContext = createContext()
FormContext.displayName = 'ZuContactFormContext'

export function useFormContext() {
	return useContext(FormContext)
}

export const useUpdateForm = (fname) => {
	const update = useUpdateFormGeneric()

	const updateForm = useCallback(
		(name, action, value) => {
			update(name, action, value)
		},
		[update],
	)

	const updateField = useCallback(
		(action, value) => {
			update(fname, action, value)
		},
		[fname, update],
	)

	return [updateForm, updateField]
}

// Collect and update the list of used form names

let names = {}
let forbiddenNames = []

const updateName = (clientId, name, remove = false) => {
	if (remove) unset(names, clientId)
	else set(names, clientId, name)

	forbiddenNames = values(names)
}

export const getUsedNames = () => forbiddenNames

// Custom hook to notify on form removal (also collect form names)
export const useOnFormRemove = (clientId, postId, name, updateForm) => {
	const formRef = useRef({ clientId, postId, name, updateForm })

	// 'updateForm' will be called on form removing only
	useEffect(() => {
		return () => {
			const { clientId, name, updateForm } = formRef.current || {}
			updateForm(name, TYPES.PURGE_FORM)
			// delete form name from common list
			updateName(clientId, name, true)
		}
	}, [])

	// in order to maintain a list of all the names for the forms on the page
	useEffect(() => {
		updateName(clientId, name)
		formRef.current = { clientId, postId, name, updateForm }
	}, [clientId, postId, name, updateForm])
}

// Custom hook to notify on field removal
export const useOnFieldRemove = (id, updateField) => {
	const fieldRef = useRef({ id, updateField })

	useEffect(() => {
		fieldRef.current = { id, updateField }
	}, [id, updateField])

	// 'updateField' will be called on field removing only
	useEffect(() => {
		return () => {
			// need to get 'updateField' again because it could be stuck in closure
			const { id, updateField: updateFieldSynced } = fieldRef.current || {}
			updateFieldSynced({ type: TYPES.REMOVE_FIELD, id })
		}
	}, [])
}

// recommended hack for custom actions after post has been saved

const { isSavingPost } = select('core/editor')
let formsPersisted = true

subscribe(() => {
	if (isSavingPost()) {
		formsPersisted = false
	} else {
		if (!formsPersisted) {
			persistForms()
			formsPersisted = true
		}
	}
})
