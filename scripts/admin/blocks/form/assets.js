import { get, map, pick, transform } from 'lodash-es'

// wordpress dependencies
import { __ } from '@wordpress/i18n'

// internal dependencies
import { booking, contact, form, pluginDefaults, subscribe } from './../assets.js'
import { name as recaptchaBlockName } from './../field-recaptcha/metadata.js'

const { templates = {}, recaptcha } = pluginDefaults

// options & values
function params(name) {
	return pick(get(templates, name, {}), ['name', 'title'])
}

export const layoutOptions = [
	{ value: 'contact', label: __('Contact Layout', 'zu-contact'), layout: params('contact') },
	{ value: 'booking', label: __('Booking Layout', 'zu-contact'), layout: params('booking') },
	{
		value: 'subscribe',
		label: __('Subscribe Layout', 'zu-contact'),
		layout: params('subscribe'),
	},
	{ value: 'skip', label: __('Skip', 'zu-contact'), layout: params('default') },
]

export const fieldBlock = 'zu/field'
export const allowedBlocks = [fieldBlock, recaptchaBlockName]
export { recaptchaBlockName, recaptcha as recaptchaDefaults }

// Create template object based on layout options
// 'contact': [
// 			[ 'zu/field', { id:'name', label:'Name', placeholder:'Your Name', required: true, type: 'text' } ],
// 			[ 'zu/field', { id:'email', label:'Email', placeholder:'Your Email Address', required: false, type: 'text' } ],
// 	],
export const layoutTemplates = transform(templates, (values, layout, name) => {
	values[name] = map(layout['fields'] || {}, (attrs) => [fieldBlock, { ...attrs }])
})

export const assets = {
	layoutOptions,
	svg: {
		form,
		contact,
		booking,
		subscribe,
	},
}
