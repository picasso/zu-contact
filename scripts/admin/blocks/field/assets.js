import { get, includes, isArray, isNil, map, omit, omitBy, transform } from 'lodash-es'

// wordpress dependencies
import { __ } from '@wordpress/i18n'

// internal dependencies
import { iconColor, pluginDefaults, types as typesSvg } from './../assets.js'

const { types: fullTypeDefaults = {} } = pluginDefaults

// options & Values
export const typeOptions = [
	{ value: 'text', label: __('Text Field', 'zu-contact') },
	{ value: 'textarea', label: __('Message Field', 'zu-contact') },
	{ value: 'email', label: __('E-mail Field', 'zu-contact') },
	{ value: 'tel', label: __('Phone Field', 'zu-contact') },
	{ value: 'url', label: __('URL Field', 'zu-contact') },
	{ value: 'checkbox', label: __('Checkbox Field', 'zu-contact') },
	{ value: 'number', label: __('Number Field', 'zu-contact') },
	{ value: 'submit', label: __('Submit Button Field', 'zu-contact') },
]

const availableTypes = map(typeOptions, (t) => t.value)

export const typeDefaults = transform(fullTypeDefaults, (values, attr, name) => {
	if (includes(availableTypes, name)) values[name] = omit(attr, 'required')
})

export const requiredDefaults = omitBy(
	transform(fullTypeDefaults, (values, attr, name) => {
		values[name] =
			(isArray(attr.required) ? get(attr, ['required', '0']) : attr.required) || null
	}),
	isNil,
)

export const assets = {
	typeOptions,
	svg: typesSvg,
}

export { iconColor }
