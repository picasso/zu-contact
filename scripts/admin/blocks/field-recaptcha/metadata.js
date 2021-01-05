// WordPress dependencies

const { __ } = wp.i18n;

// Internal dependencies

import { recaptcha as icon, iconColor } from './../assets.js';

const name = 'zu/recaptcha';
const title = __('ReCAPTCHA v2');

const attributes = {
    theme: {
        type: 'string',
        selector: '.g-recaptcha',
        source: 'attribute',
        attribute: 'data-theme',
    },
    size: {
        type: 'string',
        selector: '.g-recaptcha',
        source: 'attribute',
        attribute: 'data-size',
    },
};

const metadata = {
    name,
    title,
    /* translators: block description */
    description: __('Field that provides the form with an "I\'m not a robot" checkbox.', 'zu-contact'),
    category: 'layout',
    keywords: [
        /* translators: block keyword */
        __('field', 'zu-contact'),
        /* translators: block keyword */
        __('recaptcha', 'zu-contact'),
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
