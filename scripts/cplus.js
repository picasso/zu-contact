/* global cplus_custom */
(function($) {

	$(document).ready( function() {
	  
		var 	//$window = $(window), 				// Cache selectors
				$body = $('body'),
				$container = $('#cplus'),
				$subheading = $container.find('.cplus-subheading'),
				$form = $container.find('form'),
				$button = $form.find('#cplus-submit');

				$subheading.css({ top: Math.floor($container.find('.cplus-status').outerHeight() / 2) });
/*
	    $form.find('#recaptcha_response_field').focus(function () {
	
	        $errele = $form.find('div[for='cplus_recaptcha']');
	        $errele.html('');
	
	    });
*/

/*
	    $form.validate({
	
	        errorElement: 'span',
	
	        highlight: function (label, errorClass, validClass) {
	            $(label).closest('.form-group').removeClass('has-success').addClass('has-error');
	            $(label).closest('.control-group').removeClass('success').addClass('error'); // support for bootstrap 2
	
	        },
	        unhighlight: function (label, errorClass, validClass) {
	            $(label).closest('.form-group').removeClass('has-error').addClass('has-success');
	            $(label).closest('.control-group').removeClass('error').addClass('success'); // support for bootstrap 2
	        }
	    });
*/

		function cplus_processPostData(data) {
			
			var $status = $container.find('.cplus-status');
			var $message = $status.find('.message');
			
			$container.addClass('cplus-processed');
			$message.html(data.message === undefined ? $message.data('errmsg') : data.message);
			
		    if(data.is_valid === true) {
			    
			    $form.find('.cplus-control.error').removeClass('error');		// Remove previous errors
			    $status.removeClass('sent not-sent').addClass('sent');
/*
		        if (isScrolledIntoView($div) == false) {
		            jQuery('html,body')
		                .animate({
		                    scrollTop: jQuery($div.selector)
		                        .offset().top
		                }, 'slow');
		        }
*/
		    } else {

			    $form.find('.cplus-control.error').removeClass('error');		// Remove previous errors
			    $status.removeClass('sent not-sent').addClass('not-sent');
			    
	            $.each(data.errors, function(name, value) {
		            if(name === 'nonce' || name === 'form') {	// General errors
			            $message.append('<span>' + value + '</span>');
		            } else {
		                var $er_span = $form.find('span[for="cplus-' + name + '"]');
		                $er_span.html(value);
		                $er_span.closest('.cplus-control').addClass('error');
		            }
	            });
		    }
		    
			ajaxCalled(false);
		}
		
		function ajaxCalled(is_init) {
			
			if(is_init) {
				$subheading.removeClass('before_posting');
				$button.attr('disabled', 'disabled');
			}
			else $button.removeAttr('disabled');
			
			$body.toggleClass('ajaxed', is_init);
		}
		
	    $form.submit(function(e) {
	        
	        e.preventDefault();
	
	//         if($form.validate().valid()) {
	
	        ajaxCalled(true);
	
	        $.ajax({
	            type: 'post',
	            dataType: 'json',
	            cache: false,
	            url: cplus_custom.ajaxurl,
	            data: $form.serialize() + '&action=cplus-submit',
	
				success: function (data) { cplus_processPostData(data.data); },
				
				error: function (jqXHR, textStatus, errorThrown) {
	                 
					var data = { is_valid: false,  errors: { form: textStatus+' : '+errorThrown} };
					cplus_processPostData(data);
					
					if(window.console && window.console.log) {
						console.log(jqXHR, textStatus, errorThrown); 
					}
				}
	        });
	    });

	}); // end of $(document).ready


/*
function isScrolledIntoView(elem) {
    var docViewTop = jQuery(window).scrollTop();
    var docViewBottom = docViewTop + jQuery(window).height();

    var elemTop = jQuery(elem).offset().top;
    var elemBottom = elemTop + jQuery(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
*/

})(jQuery);

