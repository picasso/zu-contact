// wordpress dependencies
import { Button } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'
import { useCallback, useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

// Zukit dependencies
const { ModalMessage } = wp.zukit.components

// internal dependencies
import ZuPlainEdit from '../components/plain-edit.js'

const submitMessage = __(
	"Sorry, but the form submission doesn't work in **Edit** mode.\n" +
		'To test the form go to [Preview]($link1) mode.',
	'zu-contact',
)

const ZuSubmitEdit = ({
	type,
	label,
	setAttributes,

	previewLink,
	permalink,
	permalinkLabel,
}) => {
	const [isOpen, setOpen] = useState(false)
	const spacebarRef = useRef(null)

	const submitKeyDown = useCallback((ev) => {
		const node = String(ev.target.nodeName || ev.target.tagName).toLowerCase()
		if (node === 'span') {
			spacebarRef.current = event.keyCode === 32
		}
	}, [])

	const submitClick = useCallback((ev) => {
		const node = String(ev.target.nodeName || ev.target.tagName).toLowerCase()
		if (node === 'span') ev.preventDefault()
		else {
			if (spacebarRef.current !== true) setOpen(true)
			ev.preventDefault()
		}
		spacebarRef.current = false
	}, [])

	return type !== 'submit' ? null : (
		<>
			<button className="__edit-submit" onClick={submitClick} onKeyDown={submitKeyDown}>
				<ZuPlainEdit
					value={label}
					attrKey={'label'}
					placeholder={__('Add button label...', 'zu-contact')}
					setAttributes={setAttributes}
				/>
			</button>
			<ModalMessage
				isOpen={isOpen}
				icon="warning"
				message={submitMessage}
				links={previewLink}
				onClose={() => setOpen(false)}
			>
				<Button
					variant="tertiary"
					icon="external"
					href={permalink}
					target="zu-form-view"
					rel="external noreferrer noopener"
					__next40pxDefaultSize
				>
					{permalinkLabel}
				</Button>
			</ModalMessage>
		</>
	)
}

export default compose([
	withSelect((select) => {
		const { getEditedPostPreviewLink, getPermalink, getCurrentPostType } = select('core/editor')
		const label = [
			getCurrentPostType() === 'page' ? __('View Page') : __('View Post'),
			__('in new tab'),
		].join(' ')
		return {
			previewLink: getEditedPostPreviewLink(),
			permalink: getPermalink(),
			permalinkLabel: label,
		}
	}),
])(ZuSubmitEdit)
