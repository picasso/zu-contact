// WordPress dependencies

const { __ } = wp.i18n;
const { PanelBody, ToggleControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

// Internal dependencies

import ZuRecaptcha from './../components/recaptcha.js';

const ZuRecaptchaEdit = ({
		attributes,
		setAttributes,
}) => {

	const {
		theme,
		size,
	} = attributes;

	// Other helpers ----------------------------------------------------------]

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __('Settings') }>
					<ToggleControl
						label={ __('Use Dark Theme', 'zu-contact') }
						checked={ theme === 'dark' }
						onChange={ val => setAttributes({ theme: val ? 'dark' : 'light' }) }
					/>
					<ToggleControl
						label={ __('Use Compact Widget Size', 'zu-contact') }
						checked={ size === 'compact' }
						onChange={ val => setAttributes({ size: val ? 'compact' : 'normal' }) }
					/>
				</PanelBody>
			</InspectorControls>
			<ZuRecaptcha
				withStub
				{ ...{ theme, size } }
			/>
		</>
	);
}

export default  ZuRecaptchaEdit;
