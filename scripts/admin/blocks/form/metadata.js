// WordPress dependencies

const { __ } = wp.i18n;

// Internal dependencies

import { form as icon, iconColor } from './../assets.js';

const name = 'zu/form';
/* translators: block name */
const title = __('Zu Form', 'zu-contact');

const attributes = {
    name: {
        type: 'string',
        // The documentation says:
        // "If no selector argument is specified, the source definition runs against the block’s root node"
        // https://developer.wordpress.org/block-editor/developers/block-api/block-attributes/
        // but this does not match the current Gutenberg implementation - block's root node is the first child
        // when parsing and therefore to get attributes from root node I use 'div:first-child'
        // (probably can be ':first-child' but not sure about selector)
        selector: 'div:first-child',
        source: 'attribute',
		attribute: 'data-id',
    },
    title: {
        type: 'string',
        selector: 'h2',
        source: 'text',
    },
    postId: {
        type: 'string',
        selector: 'input.__postId',
        source: 'attribute',
        attribute: 'value'
    },
    postLink: {
        type: 'string',
        selector: 'input.__postLink',
        source: 'attribute',
        attribute: 'value'
    },
    loader: {
        type: 'string',
        default: 'none',
        selector: '.zu-loader svg',
        source: 'attribute',
        attribute: 'data-id',
    },
    loaderHTML: {
        type: 'string',
        default: '',
        selector: '.zu-loader',
        source: 'html',
    },
    useRecaptcha: {
        type: 'boolean',
        default: false,
    },
};

const metadata = {
    name,
    title,
    /* translators: block description */
    description: __('Simple but smart and modern Ajax contact form.', 'zu-contact'),
    category: 'layout',
    keywords: [
        /* translators: block keyword */
        __('contact', 'zu-contact'),
        /* translators: block keyword */
        __('feedback', 'zu-contact'),
        /* translators: block keyword */
        __('form', 'zu-contact'),
    ],
    icon: { src: icon, foreground: iconColor },

    supports: {
        reusable: false,
        html: false,
		align: false,
	},

    attributes,
};

export { name, title };
export default metadata;
