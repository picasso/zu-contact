// WordPress dependencies

const { __ } = wp.i18n;

// Internal dependencies

import { field as icon, iconColor } from './../assets.js';

const name = 'zu/field';
/* translators: block name */
const title = __('Zu Field', 'zu-contact');

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
        type: 'boolean',
    },
    value: {
        type: 'string',
    },
    placeholder: {
        type: 'string',
    },
    rows: {
        type: 'number',
        default: 10,
    },
};

const metadata = {
    name,
    title,
    /* translators: block description */
    description: __('A text box for longer responses.', 'zu-contact'),
    category: 'layout',
    keywords: [
        /* translators: block keyword */
        __('field', 'zu-contact'),
        /* translators: block keyword */
        __('feedback', 'zu-contact'),
        /* translators: block keyword */
        __('form', 'zu-contact'),
    ],
    icon: { src: icon, foreground: iconColor },
    parent: ['zu/form'],
    supports: {
		align: false,
        reusable: false,
        html: false,
	},

    attributes,
};

export { name, title };
export default metadata;
