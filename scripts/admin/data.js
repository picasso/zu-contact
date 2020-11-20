// WordPress dependencies

// const { map, has } = lodash;
const { __ } = wp.i18n;
// const { ExternalLink } = wp.components;

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

const mailer = {
	server: __('Enter SMTP server name', 'zucontact'),
	ssl: __('SSL Required', 'zucontact'),
	ssl_help: __('When switched on - SSL encryption system will be used (TLS instead).', 'zucontact'),
	port: __('Server port', 'zucontact'),
	auth: __('Authentication Required', 'zucontact'),
	auth_help: __('If authentication required you should provide Username and Password.', 'zucontact'),
	username: __('Username (this is usually your email address)', 'zucontact'),
	password: __('Password', 'zucontact'),
	from: __('"From" email address (usually you should own the domain you are sending from)', 'zucontact'),
	note: __('In order for the notifications to work, you need to have transactional emails configured in your copy of WordPress. This is usually done by your ISP, but if notifications are not sent, then I strongly recommend that you use one of the plugins that can be easily found on the Internet (for example, $links). As a last resort, you can configure access to the SMPT server manually using the fields below, but you must understand exactly what you are doing. To avoid possible conflicts with the plugin, I recommend to reset all SMPT server settings with "Reset Server Settings" button.', 'zucontact'),
	or: __('or', 'zucontact'),
	resetAll: __('Reset Server Settings', 'zucontact'),
};

const recaptcha = {
	sitekey: 	__('Site key', 'zucontact'),
	secret: 	__('Secret key', 'zucontact'),
	note:	__('For getting started, you need to register your site here: $links Choose the option "reCAPTCHA v2" which gives an "I’m not a robot" Checkbox. Once you entered all needed details you will get your Site key and Secret key.', 'zucontact'),
	theme: __('The color theme of the reCAPTCHA widget', 'zucontact'),
	size: __('The size of the reCAPTCHA widget', 'zucontact'),
	themeOptions: [
		{ value: 'light', label: __('Light Theme', 'zucontact') },
		{ value: 'dark', label: __('Dark Theme', 'zucontact') },
	],
};

const panels = {
	recaptcha_keys: {
		value: true,
		label: 	__('Google reCAPTCHA', 'zucontact'),
		// Это позволит исключить эту панель когда значение option is false
		depends: 'use_recaptcha',
	},
	mailer: {
		value: false,
		label: 	__('Mail Server Settings', 'zucontact'),
	},
};

export const zucontact = {
	options,
	panels,
	notify,
	mailer,
	recaptcha,
}
