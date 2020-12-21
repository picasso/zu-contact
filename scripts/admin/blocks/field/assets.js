// WordPress dependencies

const { map, transform, includes, omit } = lodash;
const { __ } = wp.i18n;

// 'text'+
// 'textarea'+
// 'email'+
// 'url'+
// 'tel'+
// 'checkbox'+
// 'submit'+
// 'number'+

// recaptcha


// Internal dependencies

import { types as typesSvg, iconColor, pluginDefaults, prefixIt } from './../assets.js';

const { types: fullTypeDefaults = {} } = pluginDefaults;

// Options & Values

// function params(name) { return pick(get(templates, name, {}), ['name', 'title']); }

// text
// textarea
// mail
// tel
// url
// checkbox
// number
// submit

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

export { prefixIt, iconColor };

// Create template object based on Field options
// 'contact': [
// 			[ 'zu/field', { id:'name', label:'Name', placeholder:'Your Name', required: true, type: 'text' } ],
// 			[ 'zu/field', { id:'email', label:'Email', placeholder:'Your Email Address', required: false, type: 'text' } ],
// 	],
// export const FieldTemplates = transform(templates, (values, Field, name)  => {
// 	values[name] = map(Field['fields'] || {}, attrs => [fieldBlock, { ...attrs }]);
// });

export const assets = {
	typeOptions,
	svg: typesSvg,
};
