// WordPress dependencies

const { includes, startCase } = lodash;
// const { __ } = wp.i18n;

// Zukit dependencies

const { externalData } = wp.zukit.utils;

// Internal dependencies

// eslint-disable-next-line no-unused-vars
import * as icons from './icons.js';

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
	prefix: 'zu',
	action: 'submit',
});

// re-export all named imports ------------------------------------------------]

export * from './icons.js';
