// WordPress dependencies

// const { find } = lodash;
const { __ } = wp.i18n;
// const { compose } = wp.compose;
const { PanelBody, TextControl } = wp.components;
const { InnerBlocks, InspectorControls } = wp.blockEditor;
// const { useMemo } = wp.element;

// Internal dependencies

import { pluginDefaults } from './../assets.js';
// import { allowedBlocks, template } from './assets.js';
// import { mergeClasses, borderClasses, gutterClasses  } from './../../shared/utils.js';

import ZuForm from './../components/form.js';

// const rowClassPrefix = 'components-zu-row';
const { templates = {} } = pluginDefaults;

const ZuFormEdit = ({
		// clientId,
		className,
		// noticeUI,
		attributes,
		setAttributes,
}) => {

	const {
		name,
		title,
	} = attributes;

	// if the layout was not selected - display the layout selection
	// if(!layout) {
	// 	return (
	// 		<RowLayout
	// 			classPrefix={ ZuForm.rowPrefix }
	// 			columns={ columns }
	// 			layout={ layout }
	// 			setAttributes={ setAttributes }
	// 		/>
	// 	);
	// }

	// grid row with classes & attributtes
	// Create template object based on layout options
	// 	'50_50': [
	// 				[ columnBlock, { width: '50%' } ],
	// 				[ columnBlock, { width: '50%' } ],
	// 			 ],
// console.log(templates['booking']);
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __('Form Settings', 'zu-contact') }>
					<TextControl
						label={ __('Form Id', 'zu-contact') }
						value={ title || '' }
						onChange={ (val) => setAttributes({ title: val }) }
					/>
				</PanelBody>
			</InspectorControls>
			<ZuForm isEditor { ...{ className, name, title } }>
				<InnerBlocks
					allowedBlocks={ [ 'zu/filed' ] }
					template={ templates['booking'] }
					templateLock="all"
					// templateInsertUpdatesSelection={ columns === 1 }
					renderAppender={ () => ( null ) }
					__experimentalCaptureToolbars={ true }
				/>
			</ZuForm>
		</>
	);
}

export default ZuFormEdit;
