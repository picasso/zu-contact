<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]

trait zu_ContactAjax {

	private $ajax_action = 'zucontact-submit';

	private function init_ajax() {
		add_action('wp_ajax_'.$this->ajax_action, [$this, 'ajax_submit']);
		add_action('wp_ajax_nopriv_'.$this->ajax_action, [$this, 'ajax_submit']);

		add_filter('zucontact_spam_filter', [$this, 'spam_filter']);
		// add_action('phpmailer_init', 'cplus_php_mailer');
	}

	private function ajax_data() {
		return $this->merge_js_data(['form'	=> $this->default_name]);
	}

	public function ajax_submit() {

	    $contact = new zucontact_Data;

	    $result['sent'] = false;
	    $result['is_valid'] = $contact->is_valid();

	    if($result['is_valid']) $result['sent'] = $contact->send_mail();

	    $result['errors'] = $contact->errors;

	    $was_error = empty($contact->errors) && $result['sent'] ? false : true;

	    $form_name = $_POST['cplus_fname'] ?? '';

	    $result['message'] = cplus_form_message($was_error, $form_name);

	    if($was_error) wp_send_json_error($result);
		else wp_send_json_success($result);
	}

	// WP Mailer functions --------------------------------------------------------]

	public function spam_filter($contact) {
	   //
	   // This is all we need to do to weed out the spam.
	   //  If Akismet plugin is enabled then it will be hooked into these filters.
	   //

	  	if(!($contact instanceof zucontact_Data)) return $contact;

	    $comment_data = apply_filters('preprocess_comment', [
	        'comment_post_ID' => $contact->post_id,
	        'comment_author' => $contact->name,
	        'comment_author_email' => $contact->email,
	        'comment_content' => $contact->message,
	        'comment_type' => 'contact-plus',
	        'comment_parent' => 0,
	        'comment_author_url' => '',
	    ]);

	    $contact->spam = false;

	    //If it is spam then log as a comment
	    if(isset($comment_data['akismet_result']) && $comment_data['akismet_result'] === 'true') {
			$comment_data['comment_approved'] = 'spam';
			wp_insert_comment($comment_data);
			$contact->spam = true;
	    } else {
			$comment_data['comment_approved'] = 0;
			$cid =wp_insert_comment($comment_data);
	    }

	    return $contact;
	}

	public function php_mailer($phpmailer) {
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

	public function from_email() {

		$admin_email = $this->admin_email();
		$sitename = strtolower($_SERVER['SERVER_NAME']);
		if(substr($sitename, 0, 4) == 'www.') $sitename = substr($sitename, 4);

		if(strpbrk($admin_email, '@') == '@'.$sitename) return $admin_email;

		return sprintf('mailer@%1$s', $sitename);
	}

	public function admin_email() {
		return get_option('admin_email');
	}

	public function mailer($contact_email, $notify_email, $content, $carbon_copy = false, $post_id = null, $post_link = '') {

		$site_name = htmlspecialchars_decode(get_bloginfo('name'));

		// Notification recipients
		$email_recipients = sanitize_text_field($notify_email);
		$email_recipients = explode(',', $email_recipients);
		$email_recipients = array_map('trim', $email_recipients);
		$email_recipients = array_map('sanitize_email', $email_recipients);
		$email_recipients = implode(',', $email_recipients);

		// "From" email address
		$send_from_email = $this->from_email();
		$send_from_name = $site_name;
		$send_from = sprintf('%1$s <%2$s>', $send_from_name, $send_from_email);

		if(empty($email_recipients)) $email_recipients = [$this->admin_email()];

		$subject = sprintf($carbon_copy ? 'Submitted from %s': 'New entry from %s', $site_name);
		$headers = [sprintf('From: %s', $send_from)];

		if(!$carbon_copy) {
			$headers[] = sprintf('Reply-To: %s', $contact_email);
			$content = sprintf('<p><strong>Submitted for</strong>: <a href="%2$s">%1$s</a></p>%3$s', get_the_title($post_id), get_permalink($post_id), $content);
		}

		$content_html_filter = function() { return 'text/html'; };
		add_filter('wp_mail_content_type', $content_html_filter);
		$result = wp_mail($email_recipients, $subject, $content, $headers);
		remove_filter('wp_mail_content_type', $content_html_filter);

		return $result;
	}
}
