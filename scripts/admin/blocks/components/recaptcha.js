// WordPress dependencies

// const { isNil } = lodash;
const { __ } = wp.i18n;
const { Button, Icon, Modal } = wp.components;
const { useCallback, useState } = wp.element;

// Internal dependencies

import { mergeClasses } from './../utils.js';
import { pluginDefaults, required } from './../assets.js';

const stubMessage = __('This is just a visual emulation of Google reCAPTCHA, it doesn\'t work in Edit mode.\n'+
					'To test reCAPTCHA go to Preview mode.', 'zu-contact');

const ZuRecaptchaStub = ({
		isCompact,
		isDark,
		locale = 'en',
}) => {

	const [ isOpen, setOpen ] = useState(false);

	const closeModal = useCallback(() => setOpen(false), []);

	const recaptchaClick = useCallback(ev => {
		setOpen(true);
		ev.preventDefault();
	}, []);

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
								{ __('I\'m not a robot', 'zu-contact') }
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
						<a href={ `https://www.google.com/intl/${locale}/policies/privacy/` }>{ __('Privacy', 'zu-contact') }</a>
						<span aria-hidden="true"> - </span>
						<a href={ `https://www.google.com/intl/${locale}/policies/terms/` }>{ __('Terms', 'zu-contact') }</a>
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
							{ stubMessage.split('\n').map((line, key) => <p key={ key }>{ line }</p>) }
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

const { locale, recaptcha: { sitekey: recaptchaSitekey = '' } } = pluginDefaults;

const ZuRecaptcha = ({
		withStub,
		size,
		theme,
}) => {
	return (
		<div className="g-recaptcha"
			data-sitekey={ recaptchaSitekey }
			data-theme={ theme }
			data-size={ size }
		>
			{ withStub && (
				<ZuRecaptchaStub
					isCompact={ size === 'compact' }
					isDark={ theme === 'dark' }
					locale={ locale }
				/>
			) }
		</div>
	);
};

export default ZuRecaptcha;
