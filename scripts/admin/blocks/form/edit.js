// WordPress dependencies

const { isNil, trim } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { PanelBody, ToggleControl } = wp.components;
const { InnerBlocks, InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { withSelect } = wp.data;
const { useCallback, useEffect, useState } = wp.element;

// Zukit dependencies

const { LoaderControl, Loader, AdvTextControl } = wp.zukit.components;
const { useLoaders } = wp.zukit.data;

// Internal dependencies

import { uniqueValue } from './../utils.js';
import { allowedBlocks, layoutTemplates, prefixIt } from './assets.js';
import { FormContext, TYPES, useUpdateForm, useOnFormRemove, getUsedNames } from './../data/form-context.js';

import ZuForm from './../components/form.js';
import ZuPlainEdit from './../components/plain-edit.js';
// import PluginOptionsEdit from './../options/plugin.js';
import FormLayout from './layout.js';

const ZuFormEdit = ({
		clientId,
		className,
		currentPostId,
		editedPostSlug,
		attributes,
		setAttributes,
}) => {

	const {
		name,
		title,
		noajax,
		postId,
		postLink,
		loader,
	} = attributes;

	// Sync form changes with information stored on the server ----------------]

	// * * *
	// need to update form attributes on events:
	// * * *
	// + create: { postId, name, 'create', value(=templateName) }
	// + purge: { postId, name, 'purge' }
	// + 'name' changing: { postId, name, 'rename', value(=newName) }

	const [ updateForm, updateField ] = useUpdateForm(name);
	const [ templateName, setTemplateName ] = useState();

	useOnFormRemove(clientId, postId, name, updateForm);

	const onChangeName = useCallback(value => {
		setAttributes({ name: value });
		updateForm(name, TYPES.RENAME_FORM, value);
	}, [name, setAttributes, updateForm]);


	useEffect(() => {
		if(isNil(postId) || isNil(postLink)) {
			const link = isNil(editedPostSlug) ? '' : `/${trim(editedPostSlug, '/')}/`;
			setAttributes({ postId: currentPostId, postLink: link });
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Loader -----------------------------------------------------------------]

	// get all possible options for 'loaders'
	const loaders = useLoaders();

	const loaderEdit = <Loader.WithOptions className={ prefixIt('loader') } id={ loader }/>;

	// Layouts ----------------------------------------------------------------]

	const setLayout = useCallback(layout => {
		const uniqueName = uniqueValue(layout.name, getUsedNames());
		setTemplateName(layout.name);
		setAttributes({ name: uniqueName, title: layout.title });
		updateForm(uniqueName, TYPES.CREATE_FORM, layout.name)
	}, [updateForm, setAttributes]);

	// if the name is not defined - display the layout selection
	if(!name) {
		return (
			<FormLayout
				classPrefix={ ZuForm.formPrefix }
				layout={ name }
				setLayout={ setLayout }
			/>
		);
	}

	// Title ------------------------------------------------------------------]

	const titleEdit = (
		<h2 className={ prefixIt('subheading') }>
			<ZuPlainEdit
				value={ title }
				attrKey={ 'title' }
				placeholder={ __('Add form title...', 'zu-contact') }
				setAttributes={ setAttributes }
			/>
		</h2>
	);

// console.log(name, layoutTemplates[name]);
// <PanelBody title={ __('Plugin options', 'zu-contact') }>
// 	<PluginOptionsEdit/>
// </PanelBody>

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __('Form Settings', 'zu-contact') }>
					<ToggleControl
						label={ __('Submit via Ajax', 'zu-contact') }
						checked={ !noajax }
						onChange={ () => setAttributes({ noajax: !noajax }) }
					/>
				</PanelBody>

				<PanelBody title={ __('Form Loader', 'zu-contact') } initialOpen={ false }>
					<LoaderControl
						clientId={ clientId }
						editClassName="__reveal-loader"
						shape={ loader }
						loaders={ loaders }
						setAttributes={ setAttributes }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvTextControl
					withDebounce
					withoutClear
					label={ __('Form Name', 'zu-contact') }
					help={ __('Usually you don\'t need to change it.', 'zu-contact') }
					value={ name }
					onChange={ onChangeName }
					withoutValues={ getUsedNames() }
				/>
			</InspectorAdvancedControls>
			<ZuForm { ...{
				className,
				name,
				title,
				noajax,
				postId,
				postLink,
				titleEdit,
				loaderEdit }
			}>
				<FormContext.Provider value={ updateField }>
					<InnerBlocks
						allowedBlocks={ allowedBlocks }
						template={ layoutTemplates[templateName] }
						templateLock={ false }
						templateInsertUpdatesSelection={ false }
						renderAppender={ () => ( null ) }
						__experimentalCaptureToolbars={ true }
					/>
				</FormContext.Provider>
			</ZuForm>
		</>
	);
}

export default compose([
	withSelect(select => {
		const { getCurrentPostId, getEditedPostSlug } = select('core/editor');

		return {
			currentPostId: getCurrentPostId(),
			editedPostSlug: getEditedPostSlug(),
		};
	}),
])(ZuFormEdit);
