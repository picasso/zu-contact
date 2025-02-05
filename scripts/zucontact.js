import $ from 'jquery'

const jsdata = window.zucontact_jsdata?.data ? window.zucontact_jsdata.data : {}

const Cs_prefix = jsdata.prefix
const Cs_processed = `${Cs_prefix}-processed`
const Cs_errors = `${Cs_prefix}-general-errors`
const Cs_error = '__error'

const Ds_container = `.${Cs_prefix}-container`
const Ds_subheading = `.${Cs_prefix}-subheading`
const Ds_loader = `.${Cs_prefix}-loader`
const Ds_status = `.${Cs_prefix}-status`
const Ds_control = `.${Cs_prefix}-control`
const Ds_submit = `#${Cs_prefix}-submit`
const Ds_validation = '.__validation'
const Ds_nonce = `#${Cs_prefix}-nonce`

const Fn_verified = `${Cs_prefix}_verified`
const Fn_expired = `${Cs_prefix}_expired`
const Fn_network = `${Cs_prefix}_network`

const MessageSplitWidth = 960
// set 0 for production
const debugDelay = 0

$(function () {
	// cache selectors
	const $body = $('body')
	const $container = $(Ds_container)
	const $loader = $(Ds_loader)
	const $subheading = $container.find(Ds_subheading)
	const $status = $container.find(Ds_status)
	const $form = $container.find('form')
	const $button = $form.find(Ds_submit)

	const errorMessages = {
		generic: jsdata.error,
		invalid: '',
		expired: '',
		network: '',
	}

	const AdminBarHeight = $('#wpadminbar').height() || 0

	function initAndInjectInlineStyle() {
		const offset = $container.parent().offset().top
		const container_margin = Math.floor($container.offset().top - offset)
		const status_margin = Math.floor($status.offset().top - offset)
		const form_margin = Math.floor($form.offset().top - offset)

		$(`<style type="text/css">
				.${Cs_prefix}-container-margin{margin-top:${container_margin}px !important;}
				.${Cs_prefix}-subheading-margin{margin-top:${status_margin}px !important;}
				.${Cs_prefix}-form-margin{margin-top:${form_margin}px !important;}
			</style>`).appendTo('body')

		$status.removeAttr('style')
		// center the heading in the middle of the status bar
		if ($subheading.length) {
			const top_center = ($status.outerHeight() - $subheading.outerHeight()) / 2
			$subheading.css({ top: status_margin - container_margin + top_center })
		}

		// set nonce value - it may be absent if it's Ajax form
		$container.find(Ds_nonce).val(jsdata.nonce)
	}

	function initReCaptcha() {
		const $recaptcha = $('.g-recaptcha')
		if ($recaptcha.length) {
			// eslint-disable-next-line no-use-before-define
			window[Fn_verified] = reVerified
			// eslint-disable-next-line no-use-before-define
			window[Fn_expired] = reExpired
			// eslint-disable-next-line no-use-before-define
			window[Fn_network] = reNetwork
			$recaptcha.attr({
				'data-callback': Fn_verified,
				'data-expired-callback': Fn_expired,
				'data-error-callback': Fn_network,
			})
			errorMessages.invalid = jsdata.recaptcha.invalid
			errorMessages.expired = jsdata.recaptcha.expired
			errorMessages.network = jsdata.recaptcha.network
		}
	}

	if ($container.length) {
		// add classes which could be used in others elements
		initAndInjectInlineStyle()
		// init reCAPTCHA callbacks if needed
		initReCaptcha()
	} else {
		// something wrong but we do not want to break JS
		return
	}

	function removePrevErrors() {
		$form
			.find(`.${Cs_prefix}-control.${Cs_error}`)
			.removeClass(Cs_error)
			.find(Ds_validation)
			.html('')
	}

	function processMessage(errors, message) {
		const msgLimit = 80
		const $message = $status.find('.message')
		if (message === undefined) message = errorMessages.generic

		// maybe we have general AJAX, server or reCAPTCHA errors
		let errMessage = errors.ajax || errors.recaptcha || null
		if (errMessage && errMessage.length > msgLimit) {
			errMessage = `${errMessage.substring(0, msgLimit)}...`
		}
		errMessage = errMessage ? `<span>${errMessage}</span>` : null

		if (errMessage) message = message.replace(/<b>[^<]+/g, `<b>${errMessage}`)
		if ($status.outerWidth() < MessageSplitWidth) message = message.replace(/\./, '.<br/>')
		$message.html(message)

		if (errors.recaptcha && errors.recaptcha.length) {
			// eslint-disable-next-line no-use-before-define
			markReCaptcha(true)
			// eslint-disable-next-line no-use-before-define
			resetReCaptcha()
		}
	}

	function switchHeading(isHeading, isError, isSuccess) {
		$subheading[isHeading ? 'addClass' : 'removeClass']('before_posting')
		$container[isHeading ? 'removeClass' : 'addClass'](Cs_processed)
		$container[isError ? 'addClass' : 'removeClass'](Cs_errors)
		$status[isError ? 'addClass' : 'removeClass']('was-error')[
			isSuccess ? 'addClass' : 'removeClass'
		]('sent')
	}

	function ajaxLoading(initiated) {
		if (initiated) {
			$button.prop('disabled', true)
			// put loader to center
			const topCss = ($status.outerHeight() - $loader.outerHeight()) / 2
			const leftCss = ($status.outerWidth() - $loader.outerWidth()) / 2
			$loader.css({ top: topCss, left: leftCss })
		} else {
			$button.prop('disabled', false)
		}
		$body.toggleClass('ajaxed', initiated)
	}

	function processPostData(data) {
		const errors = data.errors || {}
		processMessage(errors, data.message)
		switchHeading(false, !data.is_valid, data.is_valid === true)
		removePrevErrors()

		if (data.is_valid !== true) {
			$.each(errors, function (name, value) {
				const $validated = $form.find(`span[for="${Cs_prefix}-${name}"]`)
				if ($validated.length) {
					$validated.html(value)
					$validated.closest(Ds_control).addClass(Cs_error)
				}
			})
		}

		// we need to delay the form animation until the errors animation completes
		setTimeout(function () {
			ajaxLoading(false)
		}, 300)
	}

	function maybeScrollTop() {
		const fixedHeaderHeight = $('.site-header.fixed').height() || 0
		const docViewTop = $(window).scrollTop() + AdminBarHeight + fixedHeaderHeight,
			docViewBottom = docViewTop + $(window).height() - AdminBarHeight - fixedHeaderHeight,
			formTop = $container.offset().top,
			formBottom = formTop + $container.height()

		if (formBottom > docViewBottom || formTop < docViewTop) {
			const shift =
				docViewTop - (docViewTop - formTop) - AdminBarHeight * 2 - fixedHeaderHeight
			$('html,body').animate(
				{
					scrollTop: shift > 0 ? shift : 0,
				},
				'slow',
			)
		}
	}

	function ajaxCall() {
		maybeScrollTop()

		$.ajax({
			type: 'post',
			dataType: 'json',
			cache: false,
			url: jsdata.ajaxurl,
			data: `${$form.serialize()}&action=${jsdata.action}`,

			success(data) {
				processPostData(data.data)
			},
			error(jqXHR, textStatus, errorThrown) {
				const smtp = jqXHR.responseText.match(/SMTP Error:[^<]+/gi) || []
				const fromJSON = jqXHR.responseJSON?.message ?? 'Unknown Error'
				const data = {
					ajax: smtp[0] ? smtp[0] : `${jqXHR.status} : ${errorThrown || fromJSON}.`,
				}
				processPostData({
					is_valid: false,
					errors: data,
				})
				if (smtp.length === 0 && window.console && window.console.log) {
					window.console.log({
						textStatus,
						errorThrown,
						jqXHR,
					})
				}
			},
		}) // end of $.ajax
	}

	// Google reCAPTCHA V2 helpers ----------------------------------------------------------------]

	function markReCaptcha(isError) {
		$('.g-recaptcha')[isError ? 'addClass' : 'removeClass'](Cs_error)
	}

	function reVerified() {
		switchHeading(true)
		markReCaptcha(false)
		removePrevErrors()
	}

	function reExpired() {
		maybeScrollTop()
		processMessage({ recaptcha: errorMessages.expired })
		switchHeading(false, true)
		markReCaptcha(true)
	}

	function reNetwork() {
		maybeScrollTop()
		processMessage({ recaptcha: errorMessages.network })
		switchHeading(false, true)
		markReCaptcha(true)
	}

	function resetReCaptcha() {
		// eslint-disable-next-line no-undef
		if (typeof grecaptcha !== 'undefined') grecaptcha.reset()
	}

	function needsReCaptcha() {
		// maybe we should check recaptcha first
		if (typeof grecaptcha !== 'undefined' && $('.g-recaptcha').length) {
			// eslint-disable-next-line no-undef
			const response = grecaptcha.getResponse()
			if (response.length === 0) {
				maybeScrollTop()
				processMessage({ recaptcha: errorMessages.invalid })
				switchHeading(false, true)
				markReCaptcha(true)
				return true
			}
		}
		return false
	}

	$form.on('submit', function (e) {
		e.preventDefault()
		if (needsReCaptcha()) return false
		ajaxLoading(true)
		setTimeout(ajaxCall, debugDelay)
	})
}) // end of $(document).ready
