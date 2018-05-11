<?php
// Shortcode functions --------------------------------------------------------]

function cplus_shortcode($atts, $content = null) {

	extract(shortcode_atts([
		'form' 				=> 'contact',
		'class' 				=> '',
		'ajax' 				=> true,
		'message' 			=> '',
		'subheading'		=> '',
	], $atts));

	$subheading_defaults = [
		'default'			=> 	__('Contact Us', 'contact-plus'),
		'contact'			=> 	__('Write Us', 'contact-plus'),
		'booking'			=>	__('Book Your Place', 'contact-plus'),
	];

	$available_forms = ['contact', 'default', 'booking'];
	if(!in_array($form, $available_forms)) $form =  'contact';

	if(!is_null($content)) $message = do_shortcode($content);

    $contact = new cplus_Contact;
    if($contact->is_valid()) $contact->send_mail();
  
	cplus_instance()->ready(filter_var($ajax, FILTER_VALIDATE_BOOLEAN));
	
	$args = [];	

	$args['was_sent'] = $contact->was_sent;
	$args['message'] = $message;
	$args['errors'] = $contact->errors;
	$args['values'] = $contact->as_values();
	
	$args['values']['was_sent'] = $contact->was_sent;

	if(!empty($subheading)) $args['values']['subheading'] = filter_var($subheading, FILTER_VALIDATE_BOOLEAN) ? $subheading_defaults[$form] : $subheading;

	$repeater = new ZU_PlusRepeaters(cplus_get_my_dir(), 'forms');
	return $repeater->get_repeater_output($form, $args, $class);
}

// AJAX functions -------------------------------------------------------------]

function cplus_ajax_submit() {
	
    $contact = new cplus_Contact;

    $result['sent'] = false;
    $result['is_valid'] = $contact->is_valid();
    
    if($result['is_valid']) $result['sent'] = $contact->send_mail();
    
    $result['errors'] = $contact->errors;
    
    $was_error = empty($contact->errors) && $result['sent'] ? false : true;
    
    $result['message'] = cplus_form_message($was_error);

    if($was_error) wp_send_json_error($result);
	else wp_send_json_success($result);
}

// Form printing functions ----------------------------------------------------]

function cplus_form_message($was_error) {
	return $was_error ? 
		__('There was a problem with your submission. Errors have been highlighted below.', 'contact-plus') : 
		__('Success! Your message was sent.', 'contact-plus');
}

function cplus_get_container($classes, $values, $errors) {
	
	$was_sent = isset($values['was_sent']) ? $values['was_sent'] : false;	
	$was_error = empty($errors) ? false : true;
	$icon_error = function_exists('zu_get_icon_cancel') ? zu_get_icon_cancel() : '';
	$icon_ok = function_exists('zu_get_icon_contacts') ? zu_get_icon_contacts() : '';
	$subheading = isset($values['subheading']) ? sprintf('<h2 class="cplus-subheading before_posting">%s</h2>', $values['subheading']) : '';

	return sprintf(
		'<div id="cplus" class="%1$s">%4$s%7$s<div class="cplus-status%2$s">
			<span class="icon-ok">%5$s</span>
			<span class="icon-error">%6$s</span>
			<span class="message" data-errmsg="%8$s">%3$s</span>
		</div>',
			zu()->merge_classes([$classes, 'cplus-container', ($was_error || $was_sent) ? 'cplus-processed': '' ]),
			($was_error || $was_sent) ? ($was_error ? ' not-sent' : ' sent') : '',
			cplus_form_message($was_error),
			zu()->loader(1, 0.8),
			$icon_ok,
			$icon_error,
			$subheading	,
			cplus_form_message(true)	
	);
}

function cplus_get_required($required_data, &$required, &$required_valid) {
	$required = is_array($required_data) ? $required_data[0] : $required_data;
	$required_valid = is_array($required_data) ? $required_data[1] : $required_data;
}

function cplus_get_data_required($required_data) {
	
	if(empty($required_data)) return '';
	cplus_get_required($required_data, $required, $required_valid);
	
	$data_required = empty($required) ? '' : sprintf('data-required_rule="true" data-required="%1$s"', $required);
	$data_required .= empty($required_valid) ? '' : sprintf('data-required_valid="%1$s"', $required_valid);
	return $data_required;
}

function cplus_get_input($field_id, $field_type, $value, $required_data = '', $placeholder = '') {
	
	$class = $field_type == 'submit' ? 'button button-submit' : 'form-control';
	$value = $field_type == 'checkbox' ? ($value == true ? 'checked' : '') : sprintf('value="%1$s"', empty($value) ? '' : esc_attr($value));
	$placeholder = empty($placeholder) ? '' : sprintf('placeholder="%1$s"', $placeholder);
	$name = $field_type == 'submit' ? '' : sprintf('name="cplus[%1$s]"', $field_id);
	
	$input = sprintf(
		'<input class="%6$s" %1$s
			type="%2$s" id="cplus-%3$s" 
			%7$s
			%4$s
			%5$s
		/>',
		cplus_get_data_required($required_data),
		$field_type,
		$field_id,
		$value,
		$placeholder,
		$class,
		$name
	);	
	
	return preg_replace('/\s+/', ' ', $input);
}

function cplus_get_textarea($field_id, $value, $required_data = '', $placeholder = '', $rows = 10) {

	return sprintf(
		'<textarea class="form-control" %1$s id="cplus-%3$s" name="cplus[%3$s]" rows="%2$s"%5$s>%4$s</textarea>',
		cplus_get_data_required($required_data),
		$rows,
		$field_id,
		esc_textarea($value),
		empty($placeholder) ? '' : sprintf(' placeholder="%1$s"', $placeholder)
	);	
}

function cplus_print_field($field_id, $type, $value, $label, $errors, $required_data = '', $placeholder = '', $maybe_param = 0) {
_dbug_log('$maybe_param=', $maybe_param);
	if($type == 'textarea') $field = cplus_get_textarea($field_id, $value, $required_data, $placeholder, $maybe_param);
	else if($type == 'submit') $field = cplus_get_input($field_id, $type, $label, $required_data, $placeholder);
	else $field = cplus_get_input($field_id, $type, $value, $required_data, $placeholder);
	
	$error_class = isset($errors[$field_id]) ? ' error' : ' success';
	$error_text = isset($errors[$field_id]) ? $errors[$field_id] : '';
	
	$label = sprintf('<label for="cplus-%1$s">%2$s%3$s</label>', $field_id, $label, empty($required_data) ? '' : '<span class="required">*</span>');
	
	if($type == 'submit') {
		printf('<div class="cplus-control">%1$s</div>', $field);
	} else {
		printf(preg_replace('/\s+/', ' ',
			'<div class="cplus-control%6$s">
				%4$s
				<div class="cplus-input %1$s">
					%2$s%5$s
		        <span for="cplus-%3$s" class="validation">%7$s</span>
				</div>
			</div>'),
			$type, 
			$field,
			$field_id,
			$type == 'checkbox' ? '' : $label,
			$type == 'checkbox' ? $label : '',
			$error_class,
			$error_text
		);
	} 
}

function cplus_print_form($form_name, $form_values, $form_errors, $form_message = '', $classes = '') {
	
	$form = cplus_instance()->get_form($form_name);
	if($form === false) return;

	$output = cplus_get_container($classes, $form_values, $form_errors);

	$output .= sprintf(
	'<div class="cplus-form-container %2$s">%1$s
		<form role="form" id="cplus-form" name="cplus-form" method="post" class="cplus-form %2$s">
		%3$s
		<input type="hidden" name="cplus_fname" value="%2$s">
		<input type="hidden" name="post_link" value="%5$s">
		<input type="hidden" name="post_id" value="%4$s">%6$s',
		empty($form_message) ? '' : sprintf('<p>%1$s</p>', $form_message),
		$form_name,
		wp_nonce_field(cplus_instance()->ajax_nonce(false), 'cplus_nonce', true, false),
		get_the_ID(),
		trailingslashit($_SERVER['REQUEST_URI']),
		'' // should be recaptcha ??
/*
if(isset($contact->Errors['recaptcha'])) { 
				<div class="control-group form-group">
					<p class="text-error"> echo $contact->errors['recaptcha']; </p>
				</div>
 } 
*/
	);
	
	echo preg_replace('/\s+/', ' ', $output);

	foreach($form->get_fields() as $field) {
		$field_id = $field['name'];
		cplus_print_field(
			$field_id, 
			$field['type'], 
			isset($form_values[$field_id]) ? $form_values[$field_id] : '', 
			$field['label'], 
			$form_errors, 
			$field['required'], 
			$field['placeholder'],
			$field['type'] == 'textarea' ? $form->rows_in_message : 0
		);
	}

	printf('</form></div><!-- .%1$s --></div>', $form_name);
}

// WP Mailer functions --------------------------------------------------------]

function cplus_spam_filter($contact) {
   //
   // This is all we need to do to weed out the spam.
   //  If Akismet plugin is enabled then it will be hooked into these filters.
   //
	if(!($contact instanceof cplus_Contact)) return $contact;
   
    $comment_data = apply_filters('preprocess_comment', [
        'comment_post_ID' => $contact->post_id,
        'comment_author' => $contact->name,
        'comment_author_email' => $contact->email,
        'comment_content' => $contact->message,
        'comment_type' => 'contact-plus',
        'comment_author_url' => '',
    ]);

    $contact->spam = false;

    //If it is spam then log as a comment
    if(isset($comment_data['akismet_result']) && $comment_data['akismet_result'] === 'true') {
		$comment_data['comment_approved'] = 'spam';
		wp_insert_comment($comment_data);
		$contact->spam = true;
    } 
    
    return $contact;
}    

function cplus_php_mailer($phpmailer) {
/*
    $phpmailer->isSMTP();     
    $phpmailer->Host = 'smtp.example.com';
    $phpmailer->SMTPAuth = true; // Force it to use Username and Password to authenticate
    $phpmailer->Port = 25;
    $phpmailer->Username = 'yourusername';
    $phpmailer->Password = 'yourpassword';
*/

    // Additional settings…
    //$phpmailer->SMTPSecure = "tls"; // Choose SSL or TLS, if necessary for your server
    //$phpmailer->From = "you@yourdomail.com";
    //$phpmailer->FromName = "Your Name";

/*
	add_action( 'phpmailer_init', 'my_phpmailer_init' );
	function my_phpmailer_init( PHPMailer $phpmailer ) {
	    $phpmailer->Host = 'smtp.yourSMTPhost.net';
	    $phpmailer->Port = 465; // could be different
	    $phpmailer->Username = 'YOURUSERNAME'; // if required
	    $phpmailer->Password = 'YOURPASSWORD'; // if required
	    $phpmailer->SMTPAuth = true; // if required
	    $phpmailer->SMTPSecure = 'ssl'; // enable if required, 'tls' is another possible value
	    $phpmailer->IsSMTP();
	}
*/
}

function cplus_from_email() {

	$admin_email = cplus_admin_email();
	$sitename = strtolower($_SERVER['SERVER_NAME']);
	if(substr($sitename, 0, 4) == 'www.') $sitename = substr($sitename, 4);

	if(strpbrk($admin_email, '@') == '@'.$sitename) return $admin_email;

	return sprintf('mailer@%1$s', $sitename);
}

function cplus_admin_email() {
	return get_option('admin_email');
}

function  cplus_mailer($contact_email, $notify_email, $content, $carbon_copy = false) {

	$site_name = htmlspecialchars_decode(get_bloginfo('name'));
	 
	// Notification recipients
	$email_recipients = sanitize_text_field($notify_email);
	$email_recipients = explode(',', $email_recipients);
	$email_recipients = array_map('trim', $email_recipients);
	$email_recipients = array_map('sanitize_email', $email_recipients);
	$email_recipients = implode(',', $email_recipients);

	// "From" email address
	$send_from_email = cplus_from_email();
	$send_from_name = $site_name;
	$send_from = sprintf('%1$s <%2$s>', $send_from_name, $send_from_email);

	if(empty($email_recipients)) $email_recipients = [cplus_admin_email()];

	$subject = sprintf($carbon_copy ? 'Submitted from %s': 'New entry from %s', $site_name);
	$headers = [sprintf('From: %s', $send_from)];
	
	if(!$carbon_copy) $headers[] = sprintf('Reply-To: %s', $contact_email);

	$content_html_filter = function() { return 'text/html'; };
	add_filter('wp_mail_content_type', $content_html_filter);
	$result = wp_mail($email_recipients, $subject, $content, $headers);
	remove_filter('wp_mail_content_type', $content_html_filter);
	
	return $result;
}


/*
		<!-- recaptcha -->
			<?php if($contact->RecaptchaPublicKey <> '' && $contact->RecaptchaPrivateKey <> '') { ?>

				<div class="control-group form-group<?php
				if(isset($contact->Errors['recaptcha'])) {
					echo ' error has-error';
				} ?>">
					<div id="recaptcha_div">
						<div class="g-recaptcha" data-theme="<?php echo cplus_PluginSettings::Theme(); ?>"
						     data-sitekey="<?php echo $contact->RecaptchaPublicKey; ?>"></div>


						<div for="cplus_recaptcha"
						     class="help-block has-error error"><?php if(isset($contact->Errors['recaptcha'])) {
								echo $contact->Errors['recaptcha'];
							} ?></div>


						<noscript>
							<div style="width: 302px; height: 422px;">
								<div style="width: 302px; height: 422px; position: relative;">
									<div style="width: 302px; height: 422px; position: absolute;">
										<iframe
											src="https://www.google.com/recaptcha/api/fallback?k=<?php echo $contact->RecaptchaPublicKey; ?>"
											frameborder="0" scrolling="no"
											style="width: 302px; height:422px; border-style: none;">
										</iframe>
									</div>
									<div style="width: 300px; height: 60px; border-style: none;
                  bottom: 12px; left: 25px; margin: 0px; padding: 0px; right: 25px;
                  background: #f9f9f9; border: 1px solid #c1c1c1; border-radius: 3px;">
        <textarea id="g-recaptcha-response" name="g-recaptcha-response"
                  class="g-recaptcha-response"
                  style="width: 250px; height: 40px; border: 1px solid #c1c1c1;
                         margin: 10px 25px; padding: 0px; resize: none;">
        </textarea>
									</div>
								</div>
							</div>
						</noscript>

					</div>
				</div>
			<?php } ?>
*/
