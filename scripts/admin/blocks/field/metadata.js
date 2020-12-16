// WordPress dependencies

const { __ } = wp.i18n;

// Internal dependencies

import { field as icon, iconColor, blockTitle } from './../assets.js';

const name = 'zu/field';
const title = blockTitle(name);

const attributes = {
    id: {
        type: 'string',
    },
    label: {
        type: 'string',
    },
    type: {
        type: 'string',
    },
    required: {
        type: 'string',
    },
    value: {
        type: 'string',
    },
    placeholder: {
        type: 'string',
    },
    rows: {
        type: 'string',
    },
};

const metadata = {
    name,
    title,
    description: __('A text box for longer responses.'),
    category: 'layout',
    keywords: [
        __('field'),
        __('feedback'),
        __('form'),
    ],
    icon: { src: icon, foreground: iconColor },
    parent: ['zu/form'],
    supports: {
		align: false,
	},

    attributes,
};

export { name, title };
export default metadata;
