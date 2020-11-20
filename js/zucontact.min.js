(function($) {
	// eslint-disable-next-line no-undef
	var jsdata = (typeof zucontact_jsdata !== 'undefined' && zucontact_jsdata.data !== undefined) ? zucontact_jsdata.data : {};

	var Cs_prefix = jsdata.prefix;
	var Cs_processed = `${Cs_prefix}-processed`;
	var Cs_errors = `${Cs_prefix}-general-errors`;

	var Ds_container = `.${Cs_prefix}-container`;
	var Ds_subheading = `.${Cs_prefix}-subheading`;
	var Ds_status = `.${Cs_prefix}-status`;
	var Ds_control= `.${Cs_prefix}-control`
	var Ds_submit = `#${Cs_prefix}-submit`;

	var Fn_verified = `${Cs_prefix}_verified`;
	var Fn_expired = `${Cs_prefix}_expired`;
	var Fn_network = `${Cs_prefix}_network`;
	// set 0 for production
	var debugDelay = 0;

	$(document).ready( function() {

		// Cache selectors
		var $body = $('body'),
		$container = $(Ds_container),
		$subheading = $container.find(Ds_subheading),
		$status = $container.find(Ds_status),
		$form = $container.find('form'),
		$button = $form.find(Ds_submit);

		var errorMessages = {
			generic: $status.find('.message').data('errmsg'),
			invalid: '',
			expired: '',
		}

		if($container.length) {
			// add classes which could be used in others elements
			inlineStyle();
			// init reCAPTCHA callbacks if needed
			initReCaptcha();
		} else {
			// something wrong but we do not want to break JS
			return;
		}

		function inlineStyle() {
			var offset = $container.parent().offset().top;
			var container_margin = Math.floor($container.offset().top - offset);
			var status_margin = Math.floor($status.offset().top - offset);
			var form_margin = Math.floor($form.offset().top - offset);

			$(`<style type="text/css">
				.${Cs_prefix}-container-margin{margin-top:${container_margin}px !important;}
				.${Cs_prefix}-subheading-margin{margin-top:${status_margin}px !important;}
				.${Cs_prefix}-form-margin{margin-top:${form_margin}px !important;}
			</style>`)
				.appendTo('body');

			if($subheading.length) $subheading.css({top: status_margin - container_margin});
		}

		function removePrevErrors() {
			$form.find(`.${Cs_prefix}-control.error`).removeClass('error');
		}

		function processMessage(errors, message) {

			var msgLimit = 80;
			var $message = $status.find('.message');
			if(message === undefined) message = errorMessages.generic;

			// maybe we have general AJAX, server or reCAPTCHA errors
			var errMessage = errors.ajax || errors.recaptcha || null;
			if(errMessage && errMessage.length > msgLimit) errMessage = `${errMessage.substring(0, msgLimit)}...`;
			errMessage = errMessage ? `<span>${errMessage}</span>` : null;

			if(errMessage) message = message.replace(/<b>[^<]+/g, `<b>${errMessage}`);
			$message.html(message);
		}

		function switchHeading(isHeading, isError, isSuccess) {
			$subheading[isHeading ? 'addClass': 'removeClass']('before_posting');
			$container[isHeading ? 'removeClass': 'addClass'](Cs_processed);
			$container[isError ? 'addClass': 'removeClass'](Cs_errors);
			$status[isError ? 'addClass': 'removeClass']('was-error')[isSuccess ? 'addClass': 'removeClass']('sent');
		}

		function processPostData(data) {

			var errors = data.errors || {};
			processMessage(errors, data.message);
			switchHeading(false, !data.is_valid, data.is_valid === true);
			removePrevErrors();

			if(data.is_valid === true) {
				// if(isScrolledIntoView($div) === false) {
				// 	$('html,body').animate({
				// 		scrollTop: $($div.selector).offset().top
				// 	}, 'slow');
				// }
			} else {
				$.each(errors, function(name, value) {
					var $validated = $form.find(`span[for="${Cs_prefix}-${name}"]`);
					if($validated.length) {
						$validated.html(value);
						$validated.closest(Ds_control).addClass('error');
					}
				});
			}
			// we need to delay the form animation until the errors animation completes
			setTimeout(function() { ajaxLoading(false); }, 300);
		}

		function ajaxLoading(initiated) {
			if(initiated) {
				$button.attr('disabled', 'disabled');
			} else {
				$button.removeAttr('disabled');
			}
			$body.toggleClass('ajaxed', initiated);
		}

		function ajaxCall() {
			$.ajax({
				type: 'post',
				dataType: 'json',
				cache: false,
				url: jsdata.ajaxurl,
				data: `${$form.serialize()}&action=${jsdata.action}`,

				success: function(data) { processPostData(data.data); },
				error: function(jqXHR, textStatus, errorThrown) {

					var smtp = jqXHR.responseText.match(/SMTP Error:[^<]+/ig) || [];
					var data = { ajax: smtp[0] ? smtp[0] : `${jqXHR.status} : ${errorThrown}.` };
					processPostData({
						is_valid: false,
						errors: data,
					});
					if(smtp.length === 0 && window.console && window.console.log) {
						window.console.log({
							textStatus: textStatus,
							errorThrown: errorThrown,
							jqXHR: jqXHR,
						});
					}
				}
			}); // end of $.ajax
		}

		$form.submit(function(e) {
			e.preventDefault();
			if(needsReCaptcha()) return false;
			ajaxLoading(true);
			setTimeout(ajaxCall, debugDelay);
		});

		// Google reCAPTCHA V2 helpers ----------------------------------------]

		function reVerified() {
			switchHeading(true);
			markReCaptcha(false);
		}

		function reExpired() {
			processMessage({ recaptcha: errorMessages.expired });
			switchHeading(false, true);
			markReCaptcha(true);
		}

		function reNetwork() {
			processMessage({ recaptcha: errorMessages.network });
			switchHeading(false, true);
			markReCaptcha(true);
		}

		function markReCaptcha(isError) {
			$('.g-recaptcha')[isError ? 'addClass': 'removeClass']('error');
		}

		function initReCaptcha() {
			var $recaptcha = $('.g-recaptcha');
			if($recaptcha.length) {
				window[Fn_verified] = reVerified;
				window[Fn_expired] = reExpired;
				window[Fn_network] = reNetwork;
				$recaptcha.attr({
					'data-callback': Fn_verified,
					'data-expired-callback': Fn_expired,
					'data-error-callback': Fn_network,
				});
				errorMessages.invalid = $recaptcha.data('invalid');
				errorMessages.expired = $recaptcha.data('expired');
				errorMessages.network = $recaptcha.data('network');
			}
		}

		function needsReCaptcha() {
			// maybe we should check recaptcha first
			if(typeof grecaptcha !== 'undefined' && $('.g-recaptcha').length) {
				// eslint-disable-next-line no-undef
				var response = grecaptcha.getResponse();
				if(response.length === 0) {
					processMessage({ recaptcha: errorMessages.invalid });
					switchHeading(false, true);
					markReCaptcha(true);
					return true;
				}
			}
			return false;
		}

	}); // end of $(document).ready


	// function isScrolledIntoView(elem) {
	// 	var docViewTop = $(window).scrollTop();
	// 	var docViewBottom = docViewTop + $(window).height();
	//
	// 	var elemTop = $(elem).offset().top;
	// 	var elemBottom = elemTop + $(elem).height();
	//
	// 	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	// }

})(jQuery);
// var parent_offset = $container.parent().offset().top;
// var 	cplus_container_margin = Math.floor($container.offset().top - parent_offset),
// 		cplus_status_margin = Math.floor($status.offset().top - parent_offset),
// 		cplus_form_margin = Math.floor($form.offset().top - parent_offset);
//
// $(`<style type="text/css">
// 	cplus-container-margin{margin-top:'+cplus_container_margin+'px !important;}
// 	.cplus-subheading-margin{margin-top:'+cplus_status_margin+'px !important;}
// 	.cplus-form-margin{margin-top:'+cplus_form_margin+'px !important;} ' +
// 	</style>`).appendTo('body');
// if($subheading.length) $subheading.css({top: cplus_status_margin-cplus_container_margin});
