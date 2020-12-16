// WordPress dependencies

const { find, isNil } = lodash;
const { __, sprintf } = wp.i18n;
const { Placeholder, Button } = wp.components;
const { BlockIcon } = wp.blockEditor;
const { useCallback, useEffect } = wp.element;

// Internal dependencies

import { assets } from './assets.js';
import SelectItemControl from './../../components/inspector/select-item-control.js';
import LayoutPreview from './../../components/inspector/layout-preview.js';

const RowLayout = ({
		classPrefix,
		columns,
		layout,
		setAttributes,
}) => {

	useEffect(() => {
		if(columns === 1 && isNil(layout)) {
			setAttributes({ layout: '100' });
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setColumns = useCallback((columns) => {
		setAttributes({
			columns,
			layout: columns === 1 ? '100' : null,
		});
	}, [setAttributes]);

	const resetLayouts = useCallback(() => {
		setAttributes({ columns: null });
	}, [setAttributes]);

	const setLayouts = useCallback((layout) => {
		setAttributes({ layout: layout });
	}, [setAttributes]);

	return (
		<Placeholder
			key="placeholder"
			className={ `${classPrefix}__placeholder` }
			icon={ <BlockIcon icon={ assets.svg[columns ? 'layout' : 'row'] } showColors /> }
			// we need add '  ' to separate title from SVG (css does not work!)
			label={ ' ' + (columns ? __('Row Layout') : __('Row')) }
			instructions={ columns ?
				sprintf(__('Select a layout for this %s column row.'), columns)
				:	__('Select the number of columns for this row.')
			}
		>
			{ !columns ?
				<SelectItemControl
					isSmall
					withTooltip
					className="row-layout"
					columns={ assets.columnOptions.length }
					label={ __('Select Row Columns') }
					options={ assets.columnOptions }
					selectedItem={ columns }
					onClick={ setColumns }
					transformValue={ value =>
						<LayoutPreview isSmall withoutLabels layoutSet={ find(assets.columnOptions, { value }).layout }/>
					}
				/>
			:
				<SelectItemControl
					isSmall
					withTooltip
					className="row-layout"
					columns={ assets.layoutOptions[columns].length }
					label={ __('Select Row Layout') }
					options={ assets.layoutOptions[columns] }
					selectedItem={ layout }
					onClick={ setLayouts }
					transformValue={ value =>
						<LayoutPreview isSmall layoutSet={ value }/>
					}
					beforeItem={
						<Button
							icon="exit"
							className={ `${classPrefix}__back` }
							onClick={ resetLayouts }
							label={ __('Back to Columns') }
						/>
					}
				/>
			}
		</Placeholder>
	);
}

RowLayout.Preview = LayoutPreview;
export default RowLayout;
