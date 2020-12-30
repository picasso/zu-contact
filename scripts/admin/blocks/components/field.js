// WordPress dependencies

// const { isArray, get } = lodash;
const { forwardRef } = wp.element;

// Zukit dependencies

const { mergeClasses } = wp.zukit.utils;

// Internal dependencies

import { prefixIt } from './../assets.js';

const fieldPrefix = 'components-zu-field';
const inputClass = 'form-control';

const ZuField = ({
		// isEditor,
		labelEdit,
		validationEdit,
		submitEdit,
		placeholderEdit,
		temporaryValue,
		onChange,

		className,
		id,
		type,
		required,
		value,
		placeholder,
		label,

		rows = 10,
}, ref) => {

	const idWithPrefix = prefixIt(id);
	const inputValue = (onChange ? temporaryValue : value) || (type === 'checkbox' ? false : '');
	const placeholderValue = type === 'checkbox' || placeholderEdit ? null : placeholder;

	const control = type === 'textarea' ? (
		<>
			<textarea
				ref={ ref }
				className={ inputClass }
				id={ idWithPrefix }
				name={ prefixIt(id, '[]') }
				rows={ rows }
				placeholder={ placeholderValue }
				onChange={ onChange }
				value={ inputValue }
			/>
			{ placeholderEdit }
		</>
	) : (type === 'submit' ? (submitEdit ? submitEdit :
		<input
			className="button button-submit"
			type={ type }
			id={ idWithPrefix }
			value={ label || '' }
		/>
	) : (
		<>
			<input
				ref={ ref }
				className={ inputClass }
				type={ type }
				id={ idWithPrefix }
				name={ prefixIt(id, '[]') }
				value={ type === 'checkbox' ? "1" : inputValue }
				checked={ type === 'checkbox' ? inputValue : null }
				placeholder={ placeholderValue }
				onChange={ onChange }
			/>
			{ placeholderEdit }
		</>
	));

	const controlLabel = labelEdit ? labelEdit : type === 'submit' ? null : (
		<label htmlFor={ idWithPrefix }>
			{ label }
			{ required ? <span className="required">*</span> : null }
		</label>
	);

	const controlValidation = validationEdit ? validationEdit : type === 'submit' ? null : (
		<span htmlFor={ idWithPrefix } className="__validation"></span>
	);

	return (
		<div className={ mergeClasses(
			fieldPrefix,
			prefixIt('control'), {
				__submit: type === 'submit',
				__success: true,
				__error: validationEdit,
			}, className)
		}>
			{ type === 'checkbox' ? null : controlLabel }
			<div className={ mergeClasses(prefixIt('input'), type) }>
				{ control }
				{ type === 'checkbox' ? controlLabel : null }
				{ controlValidation }
			</div>
		</div>
	);
};

const ForwardZuField = forwardRef(ZuField);
ForwardZuField.fieldPrefix = fieldPrefix;

export default ForwardZuField;
