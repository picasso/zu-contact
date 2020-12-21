// WordPress dependencies

const { __ } = wp.i18n;
const { ToolbarGroup, Disabled, Button } = wp.components;
const { BlockControls } = wp.blockEditor;
const { useCallback } = wp.element;

// Zukit dependencies

const { ConditionalWrap } = wp.zukit.components;

// Internal dependencies

import { close, placeholder as placeholderIcon,  } from './../assets.js'; // required as requiredIcon, iconColor

// Field Block Controls Component

const ZuFieldBlockControls = ({
		type,
		controls,
		// requiredEmpty,
		// requiredInvalid,

		placeholder,
		isEditingPlaceholder,
		onEditPlaceholder,
		onCancelPlaceholder,
}) => {

	// Even if the data for blocks (such as type) is 'undefined' - we still
	// display these blocks, to avoid flickering when rendering and updating blocks
	const isDisabled = type === undefined || type === 'submit';

	const isPlaceholderDisabled = type === 'checkbox';

	const placeholderLabel = isEditingPlaceholder ? __('Finish editing', 'zu-contact') :
		placeholder ? __('Edit placeholder', 'zu-contact') : __('Insert placeholder', 'zu-contact');

	const onPlaceholderClick = useCallback(() => {
		return isEditingPlaceholder ? onCancelPlaceholder() : onEditPlaceholder();
	}, [isEditingPlaceholder, onEditPlaceholder, onCancelPlaceholder]);

	return (
		<BlockControls>
			{ controls &&
				<ConditionalWrap
					wrap={ Disabled }
					condition={ isDisabled }
				>
					{ controls }
				</ConditionalWrap>
			}
			<ConditionalWrap
				wrap={ Disabled }
				condition={ isDisabled || isPlaceholderDisabled }
			>
				<ToolbarGroup>
					<Button
						icon={ isEditingPlaceholder ? close : placeholderIcon }
						className="components-toolbar__control"
						label={ placeholderLabel }
						aria-expanded={ isEditingPlaceholder }
						onClick={ onPlaceholderClick }
						// ref={ buttonRef }
					/>
				</ToolbarGroup>
			</ConditionalWrap>
		</BlockControls>
	);
}

// { withLink && (
// 	<ConditionalWrap
// 		wrap={ Disabled }
// 		condition={ isDisabled }
// 	>
// 		<ToolbarGroup>
// 			<ImageUrlInput
// 				id={ mediaId }
// 				aclick={ mediaDestination }
// 			/>
// 		</ToolbarGroup>
// 	</ConditionalWrap>
// ) }

export default ZuFieldBlockControls;
