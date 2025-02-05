import { find, get } from 'lodash-es'

// wordpress dependencies
import { BlockIcon } from '@wordpress/block-editor'
import { Placeholder } from '@wordpress/components'
import { useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

// Zukit dependencies
const { SelectItemControl } = wp.zukit.components

// internal dependencies
import { assets } from './assets.js'
import { title } from './metadata.js'

const FormLayout = ({ classPrefix, layout, setLayout }) => {
	const selectLayout = useCallback(
		(name) => {
			setLayout(get(find(assets.layoutOptions, { value: name }), 'layout', {}))
		},
		[setLayout],
	)

	const renderItem = (value, label) => (
		<span className="__wrapper">
			{value === 'skip' ? <span className="__skip">{label}</span> : assets.svg[value]}
		</span>
	)

	return (
		<Placeholder
			className={`${classPrefix}__placeholder`}
			icon={<BlockIcon icon={assets.svg['form']} showColors />}
			// we need add '  ' to separate title from SVG (css does not work!)
			label={' ' + title}
			instructions={__('Select a form layout to start with.', 'zu-contact')}
		>
			<SelectItemControl
				isSmall
				withTooltip
				className="form-layout"
				columns={assets.layoutOptions.length}
				options={assets.layoutOptions}
				selectedItem={layout}
				onClick={selectLayout}
				transformValue={renderItem}
			/>
		</Placeholder>
	)
}

export default FormLayout
