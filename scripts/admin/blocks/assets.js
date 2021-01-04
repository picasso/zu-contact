// WordPress dependencies

const { defaults } = lodash;

// Internal dependencies

import { pluginData } from './utils.js';
import { getColor } from './icons.js';

// Create plugin defaults from JSON data (CSS prefix, form templates, etc.)
export const pluginDefaults = defaults(pluginData, {
	prefix: 'zuc',
	templates: {},
	types: {},
	recaptcha: {},
	// просто чтобы избежать предупреждения ESLint, CodeKit не понимает 'export * from'
	alertColor: getColor('red')
});

// re-export all named imports ------------------------------------------------]

export * from './icons.js';
