// WordPress dependencies

// const { isNil, get, set, has, map, indexOf } = lodash;
const { __ } = wp.i18n;
const { PanelBody, ToggleControl } = wp.components;
const { InspectorControls } = wp.blockEditor;
// const { useState, useCallback, useRef, useEffect } = wp.element;

// Zukit dependencies

// const { SelectItemControl, AdvTextControl } = wp.zukit.components;

// Internal dependencies

// import { uniqueValue } from './../utils.js';
// import { name as blockName } from './metadata.js';
// import { useFormContext, useRecaptchaContext, useOnFieldRemove, TYPES } from './../data/form-context.js';

import ZuRecaptcha from './../components/recaptcha.js';

// const fieldPrefix = `${ZuField.fieldPrefix}__settings`;

const ZuRecaptchaEdit = ({
		attributes,
		setAttributes,
}) => {

	const {
		theme,
		size,
	} = attributes;

	// Sync field changes with information stored on the server ---------------]
	// * * *
	// need to update form store on events:
	// * * *
	// + ADD_FIELD: { id, type, required, requiredValue }
	// + REMOVE_FIELD:
	// + UPDATE_FIELD (type): { 'updated': 'type' }, { id, type, required, requiredValue }
	// + UPDATE_FIELD (requiredValue): { 'updated': 'requiredValue' }, temporaryRequired
	// + UPDATE_FIELD (required): { 'updated': 'required' }, required
	// + RENAME_FIELD: newId
	// const updateField = useFormContext();

	// useOnFieldRemove(id, updateField);

	// Recaptcha helpers ------------------------------------------------------]

	// const recaptcha = useRecaptchaContext();
	//
	// const recaptchaEdit = type !== 'submit' ? null : (
	// 	<ZuRecaptcha { ...recaptcha }/>
	// );

	// Other helpers ----------------------------------------------------------]

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __('reCAPTCHA Settings', 'zu-contact') }>
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
