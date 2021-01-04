// WordPress dependencies

// const { isNil } = lodash;
const { __ } = wp.i18n;
const { Button, Icon, Modal } = wp.components;
const { useCallback, useState } = wp.element;

// Internal dependencies

import { mergeClasses } from './../utils.js';
import { required } from './../assets.js';
// import { useGetOption } from './../options/store.js';

const ZuRecaptcha = ({
		enabled,
		// setAttributes,
		isCompact,
		isDark,
}) => {

	// const recaptchaEnabled = true; //useGetOption('use_recaptcha');

	const [ isOpen, setOpen ] = useState(false);

	const closeModal = useCallback(() => setOpen(false), []);

	const recaptchaClick = useCallback(ev => {
		setOpen(true);
		ev.preventDefault();
	}, []);


	const message = __('This is just a visual emulation of Google reCAPTCHA, it doesn\'t work in Edit mode.\n'+
						'To test reCAPTCHA go to Preview mode.', 'zu-contact');

	if(!enabled) return null;

	return (
		<>
			<div id="rc-anchor-container" className={ mergeClasses('rc-anchor', {
				'rc-anchor-normal': !isCompact,
				'rc-anchor-compact': isCompact,
				'rc-anchor-light': !isDark,
				'rc-anchor-dark': isDark,
			}) }>
				<div className="rc-anchor-content">

					<div className="rc-inline-block">
						<div className="rc-anchor-center-container">
							<div className="rc-anchor-center-item">
								<span className="recaptcha-checkbox" onClick={ recaptchaClick }>
									<div className="recaptcha-checkbox-border"></div>
								</span>
							</div>
						</div>
					</div>

					<div className="rc-inline-block">
						<div className="rc-anchor-center-container">
							<label className="rc-anchor-center-item rc-anchor-checkbox-label">
								Я не робот
							</label>
						</div>
					</div>

				</div>

				<div className={ isCompact ? 'rc-anchor-compact-footer' : 'rc-anchor-normal-footer' }>
					<div className={ isCompact ? 'rc-anchor-logo-landscape' : 'rc-anchor-logo-portrait' }>
						<div className={ mergeClasses('rc-anchor-logo-img', {
							'rc-anchor-logo-img-portrait': !isCompact,
							'rc-anchor-logo-img-landscape': isCompact
						}) }/>
						{ isCompact ?
							<div className="rc-anchor-logo-landscape-text-holder">
								<div className="rc-anchor-center-container">
									<div className="rc-anchor-logo-text rc-anchor-center-item">reCAPTCHA</div>
								</div>
							</div>
						:
							<div className="rc-anchor-logo-text">reCAPTCHA</div>
						}
					</div>
					<div className="rc-anchor-pt">
						<a href="https://www.google.com/intl/ru/policies/privacy/">Конфиденциальность</a>
						<span aria-hidden="true"> - </span>
						<a href="https://www.google.com/intl/ru/policies/terms/">Условия использования</a>
					</div>
				</div>
			</div>
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
						<Button isPrimary onClick={ closeModal }>
							{ __('Close') }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
};

export default ZuRecaptcha;
