// WordPress dependencies

const { defaults } = lodash;

// Internal dependencies

import { pluginData } from './utils.js';

// Create plugin defaults from JSON data (CSS prefix, form templates, etc.)
export const pluginDefaults = defaults(pluginData, {
	prefix: 'zuc',
	templates: {},
	types: {},
	recaptcha: {},
});

// re-export all named imports ------------------------------------------------]

export * from './icons.js';
