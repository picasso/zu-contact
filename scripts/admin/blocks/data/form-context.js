// WordPress dependencies

const { set, unset, values } = lodash;
const { useContext, createContext } = wp.element;
const { useCallback, useRef, useEffect } = wp.element;
const { select, subscribe } = wp.data;




// const { createHigherOrderComponent } = wp.compose;

// Internal dependencies

import { useUpdateForm as useUpdateFormGeneric, TYPES, persistForms } from './form-store.js';
export { TYPES };

// Context to make 'updateForm' and 'updateField' be accessible by many components in the tree,
// and at different nesting levels
export const FormContext = createContext();
FormContext.displayName = 'ZuContactFormContext';

export function useFormContext() {
	return useContext(FormContext);
}

export const useUpdateForm = (formName) => {
    const update = useUpdateFormGeneric();

    const updateForm = useCallback((name, action, value) => {
        console.log('UPDATE:', { name, action, value });
        update(name, action, value);
    }, [update]);

    const updateField = useCallback((action, value) => updateForm(formName, action, value)
    , [formName, updateForm]);

    return [updateForm, updateField];
};

// Collect and update the list of used form names

let names = {};
let forbiddenNames = [];

const updateName = (clientId, name, remove = false) => {
	if(remove) unset(names, clientId);
	else set(names, clientId, name);

	forbiddenNames = values(names);
}

export const getUsedNames = () => forbiddenNames;

// Custom hook to notify on form removal (also collect form names)
export const useOnFormRemove = (clientId, postId, name, updateForm) => {

	const formRef = useRef({ clientId, postId, name, updateForm });

	// 'updateForm' will be called on form removing only
	useEffect(() => {
		return () => {
			const { clientId, name, updateForm } = formRef.current || {};
			updateForm(name, TYPES.PURGE_FORM);
			// delete form name from common list
			updateName(clientId, name, true);
		}
	}, []);

	// in order to maintain a list of all the names for the forms on the page
	useEffect(() => {
		updateName(clientId, name);
		formRef.current = { clientId, postId, name, updateForm };
	}, [clientId, postId, name, updateForm]);
}

// Custom hook to notify on field removal
export const useOnFieldRemove = (id, updateField) => {
	const fieldRef = useRef({ id, updateField });

	useEffect(() => {
		fieldRef.current = { id, updateField };
	}, [id, updateField]);

	// 'updateField' will be called on field removing only
	useEffect(() => {
		return () => {
			// need to update 'updateField' because it's stuck in closure
			const { id, updateField: updateFieldSynced } = fieldRef.current || {};
			updateFieldSynced(TYPES.REMOVE_FIELD, { id });
		}
	}, []);
}

// Recommended hack for custom actions after post has been saved

const { isSavingPost } = select('core/editor');
let formsPersisted = true;

subscribe(() => {
    if(isSavingPost()) {
		formsPersisted = false;
    } else {
		if(!formsPersisted) {
            persistForms();
            formsPersisted = true;
        }
    }
} );
