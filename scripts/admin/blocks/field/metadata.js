// wordpress dependencies
import { __ } from '@wordpress/i18n'

// internal dependencies
import { field as icon, iconColor } from './../assets.js'

const name = 'zu/field'
/* translators: block name */
const title = __('Zu Field', 'zu-contact')

const attributes = {
	id: {
		type: 'string',
		selector: '.__zu-control',
		source: 'attribute',
		attribute: 'data-id',
	},
	label: {
		type: 'string',
		selector: '.__zu-control',
		source: 'attribute',
		attribute: 'data-label',
	},
	placeholder: {
		type: 'string',
		selector: '.__zu-control',
		source: 'attribute',
		attribute: 'placeholder',
	},
	rows: {
		type: 'string',
		default: 10,
		selector: '.__zu-control',
		source: 'attribute',
		attribute: 'rows',
	},
	// if specify the type 'boolean' and use attribute 'source'
	// then should output the attribute value for 'true' and 'undefined' for 'false' (like: required || undefined)
	// if just output the value (true or false) - parser will always return true!
	required: {
		type: 'boolean',
		selector: '.__zu-control',
		source: 'attribute',
		attribute: 'data-required',
	},
	type: {
		type: 'string',
	},
	value: {
		type: 'string',
	},
}

const metadata = {
	name,
	title,
	/* translators: block description */
	description: __('Form field of various types with flexible settings.', 'zu-contact'),
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

	example: {
		attributes: {
			id: 'email',
			label: __('Email', 'zu-contact'),
			type: 'email',
			required: true,
			placeholder: __('Your Email Address', 'zu-contact'),
		},
	},

	attributes,
}

export { name, title }
export default metadata
