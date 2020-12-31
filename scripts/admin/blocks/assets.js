// WordPress dependencies

const { isNil } = lodash;

// Internal dependencies

import { externalData } from './utils.js';

import { getColor } from './icons.js';

// Gets JSON data (CSS prefix, form action, etc.) from PHP
export const pluginDefaults = externalData('zucontact_blocks_data', {
	prefix: 'zuc',
	action: 'submit',
	templates: {},
	types: {},
	// просто чтобы избежать предупреждения ESLint, CodeKit не понимает 'export * from'
	alertColor: getColor('red')
});

// re-export all named imports ------------------------------------------------]

export * from './icons.js';

const { prefix: cssPrefix } = pluginDefaults;

export function prefixIt(name, divider = '-') {
	if(isNil(name)) return cssPrefix;
	if(divider === '[]') return `${cssPrefix}[${name}]`;
	return `${cssPrefix}${divider}${name}`;
}
