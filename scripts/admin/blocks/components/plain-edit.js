import { isNil } from 'lodash-es'

// wordpress dependencies
import { RichText } from '@wordpress/block-editor'
import { forwardRef, useCallback } from '@wordpress/element'

// internal dependencies
import { mergeClasses } from '../utils.js'

const ZuPlainEdit = ({ className, attrKey, value, placeholder, setAttributes }, ref) => {
	const setText = useCallback(
		(val) => {
			const doc = document.implementation.createHTMLDocument('')
			doc.body.innerHTML = val
			setAttributes(isNil(attrKey) ? doc.body.innerText : { [attrKey]: doc.body.innerText })
		},
		[attrKey, setAttributes],
	)

	return (
		<RichText
			ref={ref}
			tagName="span"
			className={mergeClasses('__edit', className)}
			allowedFormats={[]}
			value={value}
			onChange={setText}
			placeholder={placeholder}
			__unstablePastePlainText
		/>
	)
}

export default forwardRef(ZuPlainEdit)
