// WordPress dependencies

const { isNil, trim } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const { InnerBlocks, InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { withSelect } = wp.data;
const { useCallback, useEffect } = wp.element;

// Internal dependencies

// import { pluginDefaults } from './../assets.js';
import { allowedBlocks, layoutTemplates, prefixIt } from './assets.js';
// import { mergeClasses, borderClasses, gutterClasses  } from './../../shared/utils.js';

import ZuForm from './../components/form.js';
import ZuPlainEdit from './../components/plain-edit.js';
import FormLayout from './layout.js';

const ZuFormEdit = ({
		// clientId,
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
	} = attributes;

	useEffect(() => {
		if(isNil(postId) || isNil(postLink)) {
			const link = isNil(editedPostSlug) ? '' : `/${trim(editedPostSlug, '/')}/`;
			setAttributes({ postId: currentPostId, postLink: link });
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __('Form Name', 'zu-contact') }
					help={ __('Usually you don\'t need to change it', 'zu-contact') }
					value={ name }
					onChange={ val => setAttributes({ name: val }) }
				/>
			</InspectorAdvancedControls>
			<ZuForm isEditor { ...{ className, name, title, noajax, postId, postLink, titleEdit } }>
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					template={ layoutTemplates[name] }
					// templateLock="all"
					templateInsertUpdatesSelection={ false }
					renderAppender={ () => ( null ) }
					__experimentalCaptureToolbars={ true }
				/>
			</ZuForm>
		</>
	);
}

// export default ZuFormEdit;
export default compose([
	withSelect(select => {
		const { getCurrentPostId, getEditedPostSlug } = select('core/editor');
		return {
			currentPostId: getCurrentPostId(),
			editedPostSlug: getEditedPostSlug(),
		};
	}),
])(ZuFormEdit);
