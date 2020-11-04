(function($) {
	// eslint-disable-next-line no-undef
	var jsdata = (typeof zucontact_jsdata !== 'undefined' && zucontact_jsdata.data !== undefined) ? zucontact_jsdata.data : {};
	var Cs_prefix = jsdata.prefix;
	// var Cs_container = `${prefix}-container`;
	var Cs_subheading = `${Cs_prefix}-subheading`;
	var Cs_status = `${Cs_prefix}-status`;
	var Cs_submit = `${Cs_prefix}-submit`;
	// set 0 for production
	var debugDelay = 0;

	$(document).ready( function() {

		// Cache selectors
		var $body = $('body'),
		$container = $(`.${Cs_prefix}-container`),
		$subheading = $container.find(`.${Cs_subheading}`),
		$status = $container.find(`.${Cs_status}`),
		$form = $container.find('form'),
		$button = $form.find(`#${Cs_submit}`);

		if($container.length) {
			// add classes which could be used in others elements
			inlineStyle();
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
		} else {
			// something wrong but we do not want to break JS
			return;
		}

		// NOTE: подключить captcha потом
		// $form.find('#recaptcha_response_field').focus(function() {
		//     $errele = $form.find(`div[for="${Cs_prefix}_recaptcha"]`);
		//     $errele.html('');
		// });

		// NOTE: сделать валидацию на клиенте?
		// $form.validate({
		//
		//     errorElement: 'span',
		//
		//     highlight: function(label, errorClass, validClass) {
		//         $(label).closest('.form-group').removeClass('has-success').addClass('has-error');
		//         $(label).closest('.control-group').removeClass('success').addClass('error'); // support for bootstrap 2
		//
		//     },
		//     unhighlight: function(label, errorClass, validClass) {
		//         $(label).closest('.form-group').removeClass('has-error').addClass('has-success');
		//         $(label).closest('.control-group').removeClass('error').addClass('success'); // support for bootstrap 2
		//     }
		// });

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

		function removePrevErrors(success) {
			$form.find(`.${Cs_prefix}-control.error`).removeClass('error');
			$status.removeClass('sent not-sent').addClass(success ? 'sent' : 'not-sent');
		}

		function processPostData(data) {

			var $message = $status.find('.message');
			var msg = data.message === undefined ? $message.data('errmsg') : data.message;

			// maybe we have general AJAX or server errors
			if(data.errors && data.errors.ajax) msg = msg.replace(/<i>[^<]+/g, '<i>' + data.errors.ajax);
			$message.html(msg);

			$container.addClass(`${Cs_prefix}-processed`).removeClass(`${Cs_prefix}-general-errors`);

			if(data.is_valid === true) {
				// remove previous errors and mark as 'sent'
				removePrevErrors(true);

				// if(isScrolledIntoView($div) === false) {
				// 	$('html,body').animate({
				// 		scrollTop: $($div.selector).offset().top
				// 	}, 'slow');
				// }
			} else {
				// remove previous errors and mark as 'not-sent'
				removePrevErrors(false);

				$.each(data.errors, function(name, value) {
					var $validated = $form.find(`span[for="${Cs_prefix}-${name}"]`);
					if($validated.length) {
						$validated.html(value);
						$validated.closest(`.${Cs_prefix}-control`).addClass('error');
					}
				});
			}
			// we need to delay the form animation until the errors animation completes
			setTimeout(function() { ajaxLoading(false); }, 300);
		}

		function ajaxLoading(initiated) {
			if(initiated) {
				$subheading.removeClass('before_posting');
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
					processPostData({
						is_valid: false,
						errors: { ajax: `${jqXHR.status} : ${errorThrown}.` }
					});
					if(window.console && window.console.log) {
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
			ajaxLoading(true);
			setTimeout(ajaxCall, debugDelay);
		});

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
