// WordPress dependencies

// const { get, set, has, includes, map } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { Button, Icon, Modal } = wp.components;
const { useState, useCallback, useRef } = wp.element;
const { withSelect } = wp.data;

// Internal dependencies

import { required } from './../assets.js';
import ZuPlainEdit from './../components/plain-edit.js';

const ZuSubmitEdit = ({
		type,
		label,
		setAttributes,

		previewLink,
		permalink,
		permalinkLabel,
}) => {

	const [ isOpen, setOpen ] = useState(false);
	const spacebarRef = useRef(null);

	const closeModal = useCallback(() => setOpen(false), []);

	const submitKeyDown = useCallback(ev => {
		const node = String(ev.target.nodeName || ev.target.tagName).toLowerCase();
		if(node === 'span') {
			spacebarRef.current = event.keyCode === 32;
		}
	}, []);

	const submitClick = useCallback(ev => {
		const node = String(ev.target.nodeName || ev.target.tagName).toLowerCase();
		if(node === 'span') ev.preventDefault();
		else {
			if(spacebarRef.current !== true) setOpen(true);
			ev.preventDefault();
		}
		spacebarRef.current = false;
	}, []);

	const message = __('Sorry, but the form submission doesn\'t work in Edit mode.\n'+
						'To test the form go to Preview mode.', 'zu-contact');

	return (type !== 'submit') ? null : (
		<>
			<button className="__edit-submit" onClick={ submitClick } onKeyDown={ submitKeyDown }>
				<ZuPlainEdit
					value={ label }
					attrKey={ 'label' }
					placeholder={ __('Add button label...', 'zu-contact') }
					setAttributes={ setAttributes }
				/>
			</button>
			{ isOpen && (
				<Modal
					className="zukit-modal"
					title={ __('Warning', 'zu-contact') }
					closeLabel={ __('Close') }
					onRequestClose={ closeModal }
				>
					<div className="__content-wrapper">
						<Icon className="__gold __icon" icon={ required }/>
						<div>
							{ message.split('\n').map((line, key) => <p key={ key }>{ line }</p>) }
						</div>
					</div>
					<div className="__button-wrapper">
						<Button
							isTertiary
							icon="external"
							href={ permalink }
							target="zu-form-view"
							rel="external noreferrer noopener"
						>
							{ permalinkLabel }
						</Button>
						<Button
							isSecondary
							href={ previewLink }
							target="zu-form-preview"
							rel="external noreferrer noopener"
						>
							{ __('Preview') }
						</Button>
						<Button isPrimary onClick={ closeModal }>
							{ __('Close') }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}

export default compose([
	withSelect(( select ) => {
		const { getEditedPostPreviewLink, getPermalink, getCurrentPostType } = select('core/editor');
		const label = [
			getCurrentPostType() === 'page' ? __('View Page') : __('View Post'),
			__('in new tab')
		].join(' ');
		return {
			previewLink: getEditedPostPreviewLink(),
			permalink: getPermalink(),
			permalinkLabel: label,
		};
	}),
])(ZuSubmitEdit);
