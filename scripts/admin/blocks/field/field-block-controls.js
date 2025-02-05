import { isFunction } from 'lodash-es'

// wordpress dependencies
import { BlockControls } from '@wordpress/block-editor'
import { Disabled, ToolbarButton, ToolbarGroup } from '@wordpress/components'
import { useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

// Zukit dependencies
const { ConditionalWrap } = wp.zukit.components

// internal dependencies
import {
	append as appendIcon,
	placeholder as placeholderIcon,
	remove as removeIcon,
	required as requiredIcon,
	submit as submitIcon,
} from './../assets.js'

// Field Block Controls component
const ZuFieldBlockControls = ({
	type,
	controls,

	placeholder,
	isEditingPlaceholder,
	onEditPlaceholder,
	onSubmitPlaceholder,

	required,
	isEditingRequired,
	onEditRequired,
	onSubmitRequired,

	remove,
	insert,
}) => {
	// Even if the data for blocks (such as type) is 'undefined' - we still
	// display these blocks, to avoid flickering when rendering and updating blocks
	const isDisabled = type === undefined || type === 'submit'

	const isPlaceholderDisabled = type === 'checkbox'
	const isRequiredDisabled = required !== true

	const placeholderLabel = isEditingPlaceholder
		? __('Submit editing', 'zu-contact')
		: placeholder
			? __('Edit placeholder', 'zu-contact')
			: __('Insert placeholder', 'zu-contact')

	const onPlaceholderClick = useCallback(() => {
		return isEditingPlaceholder ? onSubmitPlaceholder() : onEditPlaceholder()
	}, [isEditingPlaceholder, onEditPlaceholder, onSubmitPlaceholder])

	const onRequiredClick = useCallback(() => {
		return isEditingRequired ? onSubmitRequired() : onEditRequired()
	}, [isEditingRequired, onEditRequired, onSubmitRequired])

	const requiredLabel = isEditingRequired
		? __('Submit editing', 'zu-contact')
		: placeholder
			? __('Edit error message for the required field', 'zu-contact')
			: __('Insert error message for the required field', 'zu-contact')

	return (
		<BlockControls>
			{controls && (
				<ConditionalWrap wrap={Disabled} condition={isDisabled}>
					{controls}
				</ConditionalWrap>
			)}
			<ToolbarGroup>
				<ToolbarButton
					icon={isEditingPlaceholder ? submitIcon : placeholderIcon}
					className="components-toolbar__control"
					label={placeholderLabel}
					// aria-expanded={ false }
					disabled={isDisabled || isPlaceholderDisabled}
					onClick={onPlaceholderClick}
				/>
				<ToolbarButton
					icon={isEditingRequired ? submitIcon : requiredIcon}
					className="components-toolbar__control"
					label={requiredLabel}
					disabled={isDisabled || isRequiredDisabled}
					onClick={onRequiredClick}
				/>
			</ToolbarGroup>

			<ToolbarGroup>
				<ToolbarButton
					icon={appendIcon}
					className="components-toolbar__control"
					label={__('Append field', 'zu-contact')}
					disabled={!isFunction(insert)}
					onClick={insert}
				/>
				<ToolbarButton
					icon={removeIcon}
					className="components-toolbar__control"
					label={__('Remove field', 'zu-contact')}
					disabled={!isFunction(remove)}
					onClick={remove}
				/>
			</ToolbarGroup>
		</BlockControls>
	)
}

export default ZuFieldBlockControls
