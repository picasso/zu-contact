// WordPress dependencies

const { isNil, trim } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const { InnerBlocks, InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { withSelect } = wp.data;
const { useCallback, useEffect } = wp.element;

// Zukit dependencies

const { LoaderControl, Loader } = wp.zukit.components;
const { useLoaders } = wp.zukit.data;

// Internal dependencies

// import { pluginDefaults } from './../assets.js';
import { allowedBlocks, layoutTemplates, prefixIt } from './assets.js';
// import { useGetOption,   } from './../options.js';

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
		setAttributes({ name: layout.name, title: layout.title });
	}, [setAttributes]);

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
				<TextControl
					label={ __('Form Name', 'zu-contact') }
					help={ __('Usually you don\'t need to change it', 'zu-contact') }
					value={ name }
					onChange={ val => setAttributes({ name: val }) }
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
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					template={ layoutTemplates[name] }
					templateLock={ false }
					templateInsertUpdatesSelection={ false }
					renderAppender={ () => ( null ) }
					__experimentalCaptureToolbars={ true }
				/>
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
