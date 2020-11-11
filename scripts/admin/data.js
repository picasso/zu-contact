// WordPress dependencies

// const { ExternalLink } = wp.components;

// const { map, has } = lodash;
const { __ } = wp.i18n;

// Internal dependencies

// 'Simple Ajax Contact Forms';

const options = {
	use_recaptcha: {
		label: 	__('Use Google reCAPTCHA?', 'zucontact'),
		help:	__('Loads Google recaptcha script if required.', 'zucontact'),
	},
	client_validate: {
		label: 	__('Use client validation instead of server?', 'zucontact'),
		help:	__('Add scripts for validation on client (without AJAX).', 'zucontact'),
	},
	custom_css: {
		label: 	__('Use plugin CSS?', 'zucontact'),
		help:	__('If switched off the plugin stylesheet won\'t be loaded.', 'zucontact'),
		// depends: 'responsive',
	},
	me_or_us: {
		label: 	__('Use "Me" instead of "Us"?', 'zucontact'),
		help:	__('If switched off - "Us" will be used in the form subheading.', 'zucontact'),
		// 2em -> margins above and under the divider
		divider: 2,
	},
};

const notify = {
	label: 	__('Notify emails', 'zucontact'),
	input: 	__('Enter an email to add to the list', 'zucontact'),
	help:	__('List of emails to be notified when a form entry occurs.', 'zucontact'),
};

const panels = {
	recaptcha_keys: {
		value: true,
		label: 	__('Google reCAPTCHA API Keys', 'zucontact'),
		// Это позволит исключить эту панель когда значение option is false
		depends: 'use_recaptcha',
	},
	// sizes: {
	// 	value: true,
	// 	label: 	__('Media Sizes', 'zucontact'),
	// },
};

export const zucontact = {
	options,
	panels,
	notify,
}
