// WordPress dependencies

// const { ExternalLink } = wp.components;

// const { map, has } = lodash;
const { __ } = wp.i18n;

// Internal dependencies

// 'Simple Ajax Contact Forms';

const options = {
	use_recaptcha: {
		label: 	__('Use Google recaptcha?', 'zucontact'),
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
	notify: {
		label: 	__('Notify emails', 'zucontact'),
		help:	__('List of emails to be notified when an entry occurs (comma separated).', 'zucontact'),
	},
};

const panels = {
	// folders: {
	// 	value: true,
	// 	label: 	__('Media Folders', 'zucontact'),
	// 	// Это позволит исключить эту панель когда значение option is false
	// 	depends: 'folders',
	// },
	// sizes: {
	// 	value: true,
	// 	label: 	__('Media Sizes', 'zucontact'),
	// },
};

export const zucontact = {
	options,
	panels,
}
