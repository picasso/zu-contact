// wordpress dependencies
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

// internal dependencies
import ZuRecaptcha from '../components/recaptcha.js'

const ZuRecaptchaEdit = ({ attributes, setAttributes }) => {
	const { theme, size } = attributes

	// other helpers ------------------------------------------------------------------------------]

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ToggleControl
						label={__('Use Dark Theme', 'zu-contact')}
						checked={theme === 'dark'}
						onChange={(val) => setAttributes({ theme: val ? 'dark' : 'light' })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Use Compact Widget Size', 'zu-contact')}
						checked={size === 'compact'}
						onChange={(val) => setAttributes({ size: val ? 'compact' : 'normal' })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<ZuRecaptcha withStub {...{ theme, size }} />
		</>
	)
}

export default ZuRecaptchaEdit
