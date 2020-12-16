// WordPress dependencies

const { __ } = wp.i18n;

// Internal dependencies

import { form as icon, iconColor, blockTitle } from './../assets.js';

const name = 'zu/form';
const title = blockTitle(name);

const attributes = {
    name: {
        type: 'string',
        // source: 'attribute',
		// attribute: 'id',
    },
    // title: {
    //     type: 'number',
    //     // selector: '.x_row',
    //     // source: 'attribute',
    //     // attribute: 'data-columns',
    // },
    title: {
        type: 'string',
        // source: 'attribute',
		// attribute: 'data-layout',
    },
};

// id, ['data-columns']: columns, ['data-layout']: layout

const metadata = {
    name,
    title,
    description: __('Add a contact form to your page.'),
    category: 'layout',
    keywords: [
        __('contact'),
        __('feedback'),
        __('form'),
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
