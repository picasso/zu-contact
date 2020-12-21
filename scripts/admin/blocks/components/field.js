// WordPress dependencies

// const { isArray, get } = lodash;

// Zukit dependencies

const { mergeClasses } = wp.zukit.utils;

// Internal dependencies

// import { mergeClasses } from './../utils.js';
import { prefixIt } from './../assets.js';

const ZuField = ({
		// isEditor,
		labelEdit,
		submitEdit,
		placeholderEdit,
		temporaryValue,
		onChange,

		className,
		id,
		type,
		required,
		// required_valid,
		value,
		placeholder,
		label,

		rows = 10,
}) => {

	const idWithPrefix = prefixIt(id);
	// const isRequired =

	// const requiredData = {
	// 	'data-required_rule': required ? true : null,
	// 	'data-required': required ? (isArray ? get(required, '0', null) : required) : null,
	// 	'data-required_valid': isArray ? get(required, '1', null) : null,
	// }

// if(value === null) console.log('input with null', {className,
// id,
// type,
// required,
// value,
// placeholder,
// label,});
//
// { onChange ? tempValue : value }
// </textarea>

	const control = type === 'textarea' ? (
		<>
			<textarea
				className="form-control"
				id={ idWithPrefix }
				name={ prefixIt(id, '[]') }
				rows={ rows }
				placeholder={ placeholderEdit ? null : placeholder }
				onChange={ onChange }
				value={ onChange ? temporaryValue : value }
				// { ...requiredData }
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
				className="form-control"
				type={ type }
				id={ idWithPrefix }
				name={ idWithPrefix }
				value={ onChange ? temporaryValue : value }
				checked={ type === 'checkbox' ? (value === true ? true : null) : null }
				placeholder={ placeholderEdit ? null : placeholder }
				onChange={ onChange }
				// { ...requiredData }
			/>
			{ placeholderEdit }
		</>
	));

	const controlLabel = labelEdit ? labelEdit : type === 'checkbox' || type === 'submit' ? null : (
		<label htmlFor={ idWithPrefix }>
			{ label }
			{ required ? <span className="required">*</span> : null }
		</label>
	);

	return (
		<div className={ mergeClasses(prefixIt('control'), 'success', { __submit: type === 'submit' }, className) }>
			{ controlLabel }
			<div className={ mergeClasses(prefixIt('input'), type) }>
				{ control }
				{ type === 'checkbox' ? label : null }
				{ type === 'submit' ? null :
					<span htmlFor={ idWithPrefix } className="validation"></span>
				}
			</div>
		</div>
	);
};

export default ZuField;
