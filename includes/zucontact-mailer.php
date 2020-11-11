<?php
// WP Mailer helpers ----------------------------------------------------------]

trait zu_ContactMailer {

	// public static $spam_filter = 'zucontact_spam_filter';

	// private function init_mailer() {
	//
	// 	add_filter(self::$spam_filter, [$this, 'spam_filter']);
	// 	// add_action('phpmailer_init', 'cplus_php_mailer');
	// }

	// this is used to weed out the spam.
	// if Akismet plugin is enabled then it will be hooked into 'preprocess_comment' filter.
	public function spam_filter($contact) {

	  	if(!($contact instanceof zu_ContactData)) return $contact;

	    $comment_data = apply_filters('preprocess_comment', [
	        'comment_post_ID'		=> $contact->post_id,
	        'comment_author'		=> $contact->name,
	        'comment_author_email'	=> $contact->email,
	        'comment_content'		=> $contact->message,
	        'comment_type'			=> 'zu-contact',
	        'comment_parent'		=> 0,
	        'comment_author_url'	=> '',
	    ]);

	    // even if it is spam then log as a comment
	    if(isset($comment_data['akismet_result']) && $comment_data['akismet_result'] === 'true') {
			$comment_data['comment_approved'] = 'spam';
			wp_insert_comment($comment_data);
			$contact->spam = true;
	    } else {
			$comment_data['comment_approved'] = 0;
			$cid = wp_insert_comment($comment_data);
			$contact->spam = false;
	    }
	    return $contact;
	}

	public function from_email() {
		$admin_email = $this->admin_email();
		$sitename = strtolower($_SERVER['SERVER_NAME']);
		if(substr($sitename, 0, 4) === 'www.') $sitename = substr($sitename, 4);
		if(strpbrk($admin_email, '@') === '@'.$sitename) return $admin_email;

		return sprintf('mailer@%1$s', $sitename);
	}

	public function admin_email() {
		return get_option('admin_email');
	}

	public function mailer($contact_email, $notify_email, $content, $params) {

		$params = array_merge([
            'carbon_copy'		=> false,
            'post_id'			=> null,
            'post_link'			=> '',
			'site_name'			=> htmlspecialchars_decode(get_bloginfo('name')),
		], $params);

		extract($params, EXTR_OVERWRITE);

		// Notification recipients
		$email_recipients = sanitize_text_field($notify_email);
		$email_recipients = explode(',', $email_recipients);
		$email_recipients = array_map('trim', $email_recipients);
		$email_recipients = array_map('sanitize_email', $email_recipients);
		$email_recipients = implode(',', $email_recipients);

		// "From" email address
		$send_from = sprintf('%1$s <%2$s>', $site_name, $this->from_email());

		if(empty($email_recipients)) $email_recipients = [$this->admin_email()];

		$subject = sprintf($carbon_copy ? 'Submitted from %s': 'New entry from %s', $site_name);
		$headers = [sprintf('From: %s', $send_from)];

		if(!$carbon_copy) {
			$headers[] = sprintf('Reply-To: %s', $contact_email);
			$content = sprintf('<p><strong>Submitted for</strong>: <a href="%2$s">%1$s</a></p>%3$s',
				get_the_title($post_id),
				get_permalink($post_id),
				$content
			);
		}

		$content_html_filter = function() { return 'text/html'; };
		add_filter('wp_mail_content_type', $content_html_filter);
		$result = wp_mail($email_recipients, $subject, $content, $headers);
		remove_filter('wp_mail_content_type', $content_html_filter);

		return $result;
	}

	public function send_mail($data) {

		if($data instanceof zu_ContactData) {
			$data->was_sent = false;
			if($data->form !== false) {

				$this->spam_filter($data);
				// apply_filters(zu_Contact::$spam_filter, $this);

				if($data->spam === true) {
					$data->was_sent = true;
				} else {
					$subject = __('New entry was submitted at', 'zu-contact');
					$content = sprintf('<p>%2$s <strong>%1$s</strong></p>', date('d.m H:i'), $subject);

					foreach($data->attributes as $field_id => $value) {
						$field = $data->form->get($field_id);
						$value = is_bool($value) ? sprintf('%1$s', $value ? 'YES' :'NO') : $value;
						$content .= sprintf('<p><strong>%1$s</strong>: %2$s</p>', $field['label'], $value);
					}
					$data->was_sent = $this->mailer($data->email, $this->recipients(), $content, [
						'post_id'		=> $data->post_id,
						'post_link'		=> $data->post_link,
					]);

					if(in_array('carbon-copy', array_keys($data->attributes)) && $data->attributes['carbon-copy']) {
						$content = str_replace($subject, __('You sent it at', 'zu-contact'), $content);
						$this->mailer($data->email, $data->email, $content, ['carbon_copy' => true]);
					}
				}
			}
			return $data->was_sent;
		}
		return false;
	}

	// public function php_mailer($phpmailer) {
	//
	//     $phpmailer->isSMTP();
	//     $phpmailer->Host = 'smtp.example.com';
	//     $phpmailer->SMTPAuth = true; // Force it to use Username and Password to authenticate
	//     $phpmailer->Port = 25;
	//     $phpmailer->Username = 'yourusername';
	//     $phpmailer->Password = 'yourpassword';
	//
	//
	//     // Additional settings…
	//     //$phpmailer->SMTPSecure = "tls"; // Choose SSL or TLS, if necessary for your server
	//     //$phpmailer->From = "you@yourdomail.com";
	//     //$phpmailer->FromName = "Your Name";
	//
	//
	// 	add_action( 'phpmailer_init', 'my_phpmailer_init' );
	// 	function my_phpmailer_init( PHPMailer $phpmailer ) {
	// 	    $phpmailer->Host = 'smtp.yourSMTPhost.net';
	// 	    $phpmailer->Port = 465; // could be different
	// 	    $phpmailer->Username = 'YOURUSERNAME'; // if required
	// 	    $phpmailer->Password = 'YOURPASSWORD'; // if required
	// 	    $phpmailer->SMTPAuth = true; // if required
	// 	    $phpmailer->SMTPSecure = 'ssl'; // enable if required, 'tls' is another possible value
	// 	    $phpmailer->IsSMTP();
	// 	}
	// }
}
