// WordPress dependencies

// const { isArray, get } = lodash;
// const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;
const { useCallback } = wp.element;

// Zukit dependencies

// const { mergeClasses } = wp.zukit.utils;

// Internal dependencies

const ZuPlainEdit = ({
		attrKey,
		value,
		placeholder,
		setAttributes,
		keepOnFocus = true,
		onBlur,
		onFocus,
}) => {

	const setText = useCallback(val => {
		const doc = document.implementation.createHTMLDocument('');
		doc.body.innerHTML = val;
		setAttributes({ [attrKey]: doc.body.innerText });
	}, [attrKey, setAttributes]);

	return (
		<RichText
			tagName="span"
			className="__edit"
			allowedFormats={ [] }
			value={ value }
			onChange={ setText }
			onBlur={ onBlur }
			unstableOnFocus={ onFocus }
			placeholder={ placeholder }
			keepPlaceholderOnFocus={ keepOnFocus }
			__unstablePastePlainText
		/>
	);
};

export default ZuPlainEdit;
