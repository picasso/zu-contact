// WordPress dependencies

const { isArray, get } = lodash;

// Zukit dependencies

const { mergeClasses } = wp.zukit.utils;

// Internal dependencies

// import { mergeClasses } from './../utils.js';
import { pluginDefaults } from './../assets.js';

const { prefix: cssPrefix = 'zu' } = pluginDefaults;

const ZuField = ({
		className,
		id,
		type,
		required,
		value,
		placeholder,
		label,

		rows = 10,
}) => {

	const nameWithPrefix = `${cssPrefix}-${id}`;

	const requiredData = {
		'data-required_rule': required ? true : null,
		'data-required': required ? (isArray ? get(required, '0', null) : required) : null,
		'data-required_valid': isArray ? get(required, '1', null) : null,
	}

// if(value === null) console.log('input with null', {className,
// id,
// type,
// required,
// value,
// placeholder,
// label,});

	const control = type === 'textarea' ? (
		<textarea
			className="form-control"
			id={ nameWithPrefix }
			name={ `${cssPrefix}[${id}]` }
			rows={ rows }
			placeholder={ placeholder }
			{ ...requiredData }
		>
			{ value }
		</textarea>
	) : (type === 'submit' ? (
		<input
			className="button button-submit"
			type={ type }
			id={ nameWithPrefix }
			value={ label || '' }
		/>
	) : (
		<input
			className="form-control"
			type={ type }
			id={ nameWithPrefix }
			name={ nameWithPrefix }
			value={ value || '' }
			checked={ type === 'checkbox' ? (value === true ? true : null) : null }
			placeholder={ placeholder }
			onChange={ () => value }
			{ ...requiredData }
		/>
	));

	const controlLabel = type === 'checkbox' || type === 'submit' ? null : (
		<label htmlFor={ nameWithPrefix }>
			{ label }
			{ required ? <span className="required">*</span> : null }
		</label>
	);

	return (
		<div className={ mergeClasses(`${cssPrefix}-control`, 'success', { __submit: type === 'submit' }, className) }>
			{ controlLabel }
			<div className={ mergeClasses(`${cssPrefix}-input`, type) }>
				{ control }
				{ type === 'checkbox' ? label : null }
				{ type === 'submit' ? null :
					<span htmlFor={ nameWithPrefix } className="validation"></span>
				}
			</div>
		</div>
	);
};

export default ZuField;
