// WordPress dependencies

const { isNil } = lodash;
const { RichText } = wp.blockEditor;
const { useCallback, forwardRef } = wp.element;

// Internal dependencies

import { mergeClasses } from './../utils.js';

const ZuPlainEdit = ({
		className,
		attrKey,
		value,
		placeholder,
		setAttributes,
		keepOnFocus = true,
}, ref) => {

	const setText = useCallback(val => {
		const doc = document.implementation.createHTMLDocument('');
		doc.body.innerHTML = val;
		setAttributes(isNil(attrKey) ? doc.body.innerText : { [attrKey]: doc.body.innerText });
	}, [attrKey, setAttributes]);

	return (
		<RichText
			ref={ ref }
			tagName="span"
			className={ mergeClasses('__edit', className) }
			allowedFormats={ [] }
			value={ value }
			onChange={ setText }
			placeholder={ placeholder }
			keepPlaceholderOnFocus={ keepOnFocus }
			__unstablePastePlainText
		/>
	);
};

export default forwardRef(ZuPlainEdit);
