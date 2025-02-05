// wordpress dependencies
import { registerBlockType } from '@wordpress/blocks'

// internal dependencies
import { brandAssets, registerCategory, registerCollection } from './blocks/utils.js'

// register ZU blocks collection or category
const supportsCollections = registerCollection()
if (!supportsCollections) registerCategory()

// register blocks --------------------------------------------------------------------------------]

import * as field from './blocks/field/index.js'
import * as recaptcha from './blocks/field-recaptcha/index.js'
import * as form from './blocks/form/index.js'

export function registerBlocks() {
	;[form, field, recaptcha].forEach((block) => {
		if (!block) return

		const { name, settings } = block
		if (!supportsCollections) settings.category = brandAssets.slug
		registerBlockType(name, settings)
	})
}

registerBlocks()
