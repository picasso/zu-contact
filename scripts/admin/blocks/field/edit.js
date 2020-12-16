// WordPress dependencies

const { isEmpty,  } = lodash;
const { __ } = wp.i18n;
// const { compose } = wp.compose;
const { PanelBody, ToggleControl, TextControl } = wp.components; //Button, SelectControl,

const { InspectorControls } = wp.blockEditor;
// const { withSelect, withDispatch } = wp.data;

// Internal dependencies

import ZuField from './../components/field.js';

const ZuFieldEdit = ({
		attributes,
		className,
		setAttributes,
}) => {

	const {
		id,
		label,
		type,
		required,
		value,
		placeholder,
		rows,
	} = attributes;

	// const layoutSet = columnAttributes(width, className, columnLayout);
	// const widthValues = columnValues(parentColumns, columnIndex);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __('Field Settings', 'zu-contact') }>
					<TextControl
						label={ __('Field Id', 'zu-contact') }
						value={ id || '' }
						onChange={ (val) => setAttributes({ id: val }) }
					/>
					<ToggleControl
						label={ __('This is a required field.', 'zu-contact') }
						checked={ !isEmpty(required) }
						onChange={ () => setAttributes({ required: !required }) }
					/>
				</PanelBody>
			</InspectorControls>
			<ZuField { ...{ className, id, type, required, value, placeholder, label, rows } }/>
		</>
	);
}

export default ZuFieldEdit;
