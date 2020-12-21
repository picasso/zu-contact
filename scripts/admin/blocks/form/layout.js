// WordPress dependencies

const { get, find } = lodash;
const { __ } = wp.i18n;
const { Placeholder } = wp.components;
const { BlockIcon } = wp.blockEditor;
const { useCallback } = wp.element;

// Zukit dependencies

const { SelectItemControl } = wp.zukit.components;

// Internal dependencies

import { assets } from './assets.js';
import { title } from './metadata.js';

const FormLayout = ({
		classPrefix,
		layout,
		setLayout,
}) => {

	// useEffect(() => {
	// 	if(columns === 1 && isNil(layout)) {
	// 		setAttributes({ layout: '100' });
	// 	}
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	//
	const selectLayout = useCallback(name => {
		setLayout(get(find(assets.layoutOptions, { value: name }), 'layout', {}));
	}, [setLayout]);

	return (
		<Placeholder
			className={ `${classPrefix}__placeholder` }
			icon={ <BlockIcon icon={ assets.svg['form'] } showColors /> }
			// we need add '  ' to separate title from SVG (css does not work!)
			label={ ' ' + title }
			instructions={ __('Select a form layout to start with.', 'zu-contact') }
		>
			<SelectItemControl
				isSmall
				withTooltip
				className="form-layout"
				columns={ assets.layoutOptions.length }
				options={ assets.layoutOptions }
				selectedItem={ layout }
				onClick={ selectLayout }
				transformValue={ value => <span className="__wrapper">{ assets.svg[value] }</span> }
			/>
		</Placeholder>
	);
}

// FormLayout.Preview = LayoutPreview;
export default FormLayout;
