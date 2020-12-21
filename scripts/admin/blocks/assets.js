// WordPress dependencies

const { includes, startCase, isNil } = lodash;
// const { __ } = wp.i18n;

// Zukit dependencies

const { externalData } = wp.zukit.utils;

// Internal dependencies

// eslint-disable-next-line no-unused-vars
import { getColor } from './icons.js';

// Available Zu Blocks
const zuBlocks = [
	'zu/field',
	'zu/form',
];

export function blockTitle(blockName) {
	return includes(zuBlocks, blockName) ? `${ startCase(blockName.replace('zu/', '')) }` : blockName;
}

// Gets JSON data (CSS prefix, form action, etc.) from PHP
export const pluginDefaults = externalData('zucontact_blocks_data', {
	prefix: 'zuc',
	action: 'submit',
	templates: {},
	types: {},
});

// re-export all named imports ------------------------------------------------]

export * from './icons.js';

const { prefix: cssPrefix } = pluginDefaults;

export function prefixIt(name, divider = '-') {
	if(isNil(name)) return cssPrefix;
	if(divider === '[]') return `${cssPrefix}[${name}]`;
	return `${cssPrefix}${divider}${name}`;
}
