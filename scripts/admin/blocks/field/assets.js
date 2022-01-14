// WordPress dependencies

const { isArray, isNil, get, map, transform, includes, omit, omitBy } = lodash;
const { __ } = wp.i18n;

// Internal dependencies

import { types as typesSvg, iconColor, pluginDefaults } from './../assets.js';

const { types: fullTypeDefaults = {} } = pluginDefaults;

// Options & Values

export const typeOptions = [
	{ value: 'text', label: __('Text Field', 'zu-contact')},
	{ value: 'textarea', label: __('Message Field', 'zu-contact') },
	{ value: 'email', label: __('E-mail Field', 'zu-contact') },
	{ value: 'tel', label: __('Phone Field', 'zu-contact') },
	{ value: 'url', label: __('URL Field', 'zu-contact') },
	{ value: 'checkbox', label: __('Checkbox Field', 'zu-contact') },
	{ value: 'number', label: __('Number Field', 'zu-contact') },
	{ value: 'submit', label: __('Submit Button Field', 'zu-contact') },
];

const availableTypes = map(typeOptions, t => t.value);

export const typeDefaults = transform(fullTypeDefaults, (values, attr, name)  => {
	if(includes(availableTypes, name)) values[name] = omit(attr, 'required');
});

export const requiredDefaults = omitBy(transform(fullTypeDefaults, (values, attr, name)  => {
	values[name] = (isArray(attr.required) ? get(attr, ['required', '0']) : attr.required) || null;
}), isNil);

export const assets = {
	typeOptions,
	svg: typesSvg,
};

export { iconColor };
