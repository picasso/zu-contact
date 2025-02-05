import { isNil, noop, reduce, trim } from 'lodash-es'

// wordpress dependencies
import { InnerBlocks, InspectorAdvancedControls, InspectorControls } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { withDispatch, withSelect } from '@wordpress/data'
import { useCallback, useEffect, useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

// Zukit dependencies
const { LoaderControl, Loader, AdvTextControl } = wp.zukit.components
const { useLoaders } = wp.zukit.data

// internal dependencies
import ZuForm from '../components/form.js'
import ZuPlainEdit from '../components/plain-edit.js'
import {
	FormContext,
	getUsedNames,
	TYPES,
	useOnFormRemove,
	useUpdateForm,
} from '../data/form-context.js'
import { prefixIt, uniqueValue } from '../utils.js'
import { allowedBlocks, layoutTemplates, recaptchaBlockName, recaptchaDefaults } from './assets.js'
// import PluginOptionsEdit from '../options/plugin.js';
import FormLayout from './layout.js'

const ZuFormEdit = ({
	clientId,
	className,
	currentPostId,
	editedPostSlug,
	attributes,
	setAttributes,

	reClientId,
	enableRe,
}) => {
	const {
		name,
		title,
		postId,
		postLink,
		loader,
		// useRecaptcha,
	} = attributes

	// Sync form changes with information stored on the server ------------------------------------]

	// * * *
	// need to update form store on events:
	// * * *
	// + create: { name, 'CREATE_FORM', value(=templateName) }
	// + purge: { name, 'PURGE_FORM' }
	// + rename: { name, 'RENAME_FORM', value(=newName) }

	const [updateForm = noop, updateField] = useUpdateForm(name)
	const [templateName, setTemplateName] = useState('contact')

	useOnFormRemove(clientId, postId, name, updateForm)

	const onChangeName = useCallback(
		(value) => {
			setAttributes({ name: value })
			updateForm(name, TYPES.RENAME_FORM, value)
		},
		[name, setAttributes, updateForm],
	)

	useEffect(() => {
		if (isNil(postId) || isNil(postLink)) {
			const link = isNil(editedPostSlug) ? '' : `/${trim(editedPostSlug, '/')}/`
			setAttributes({ postId: currentPostId, postLink: link })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Loader -------------------------------------------------------------------------------------]

	// get all possible options for 'loaders'
	const loaders = useLoaders()

	// setup default loader if none
	useEffect(() => {
		if (loaders && isNil(loader)) {
			setAttributes({ loader: 0, loaderHTML: loaders[0] })
		}
	}, [loader, loaders, setAttributes])

	const loaderEdit = <Loader.WithOptions className={prefixIt('loader')} id={loader} />

	// Title --------------------------------------------------------------------------------------]

	const [withoutTitle, setWithoutTitle] = useState(!title)
	const peviousTitle = useRef(title)

	const titleEdit = withoutTitle ? null : (
		<h2 className={prefixIt('subheading')}>
			<ZuPlainEdit
				value={title}
				attrKey={'title'}
				placeholder={__('Add form title...', 'zu-contact')}
				setAttributes={setAttributes}
			/>
		</h2>
	)

	const disableTitle = useCallback(
		(val) => {
			setAttributes({ title: val ? '' : peviousTitle.current })
			if (val) peviousTitle.current = title
			setWithoutTitle(val)
		},
		[title, setAttributes],
	)

	// ReCAPTCHA ----------------------------------------------------------------------------------]

	const enableRecaptcha = useCallback(
		(val) => {
			setAttributes({ useRecaptcha: val })
			enableRe(val)
		},
		[setAttributes, enableRe],
	)

	// <PanelBody title={ __('Plugin options', 'zu-contact') }>
	// 	<PluginOptionsEdit/>
	// </PanelBody>

	// Layouts ------------------------------------------------------------------------------------]

	const setLayout = useCallback(
		(layout) => {
			const uniqueName = uniqueValue(layout.name, getUsedNames())
			setTemplateName(layout.name)
			setAttributes({ name: uniqueName, title: layout.title })
			setWithoutTitle(!layout.title)
			updateForm(uniqueName, TYPES.CREATE_FORM, layout.name)
		},
		[updateForm, setAttributes],
	)

	// if the name is not defined - display the layout selection
	if (!name) {
		return <FormLayout classPrefix={ZuForm.formPrefix} layout={name} setLayout={setLayout} />
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Form Settings', 'zu-contact')}>
					<ToggleControl
						label={__('Without Form Heading', 'zu-contact')}
						checked={withoutTitle}
						onChange={disableTitle}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Enable reCAPTCHA', 'zu-contact')}
						checked={reClientId || false}
						onChange={enableRecaptcha}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Form Loader', 'zu-contact')} initialOpen={false}>
					<LoaderControl
						clientId={clientId}
						editClassName="__reveal-loader"
						shape={loader}
						loaders={loaders}
						setAttributes={setAttributes}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvTextControl
					withDebounce
					withoutClear
					label={__('Form Name', 'zu-contact')}
					help={__("Usually you don't need to change it.", 'zu-contact')}
					value={name}
					onChange={onChangeName}
					withoutValues={getUsedNames()}
				/>
			</InspectorAdvancedControls>
			<ZuForm
				isEditor
				{...{
					className,
					name,
					title,
					postId,
					postLink,
					loaderEdit,
					titleEdit,
				}}
			>
				<FormContext.Provider value={updateField}>
					<InnerBlocks
						allowedBlocks={allowedBlocks}
						template={layoutTemplates[templateName]}
						templateLock={false}
						templateInsertUpdatesSelection={false}
						renderAppender={() => null}
						__experimentalCaptureToolbars={true}
					/>
				</FormContext.Provider>
			</ZuForm>
		</>
	)
}

export default compose([
	withSelect((select, { clientId }) => {
		const { getCurrentPostId, getEditedPostSlug } = select('core/editor')
		const { getBlockOrder, getBlock } = select('core/block-editor')
		const fieldIds = getBlockOrder(clientId)
		const reClientId = reduce(
			fieldIds,
			(reId, id) => {
				const block = getBlock(id)
				return block.name === recaptchaBlockName ? block.clientId : reId
			},
			null,
		)

		return {
			currentPostId: getCurrentPostId(),
			editedPostSlug: getEditedPostSlug(),
			insertIndex: fieldIds.length ? fieldIds.length - 1 : 0,
			reClientId,
		}
	}),
	withDispatch((dispatch, { clientId, insertIndex, reClientId }) => {
		const { removeBlock, insertBlock } = dispatch('core/block-editor')
		return {
			enableRe: (val) =>
				val
					? insertBlock(
							createBlock(recaptchaBlockName, { ...recaptchaDefaults }),
							insertIndex,
							clientId,
							false,
						)
					: removeBlock(reClientId, false),
		}
	}),
])(ZuFormEdit)
