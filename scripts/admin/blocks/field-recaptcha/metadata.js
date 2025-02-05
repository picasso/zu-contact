// wordpress dependencies
import { __ } from '@wordpress/i18n'

// internal dependencies
import { iconColor, recaptcha as icon } from '../assets.js'

const name = 'zu/recaptcha'
const title = __('reCAPTCHA')

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
}

const metadata = {
	name,
	title,
	/* translators: block description */
	description: __(
		'Field that provides the form with an "I\'m not a robot" checkbox.',
		'zu-contact',
	),
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

	example: {
		attributes: {
			theme: 'light',
			withStub: true,
		},
	},

	attributes,
}

export { name, title }
export default metadata
