<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]
//
trait zu_ContactAjax {

	private $ajax_action = 'zucontact-submit';

	private function init_ajax() {
		add_action('wp_ajax_'.$this->ajax_action, [$this, 'ajax_submit']);
		add_action('wp_ajax_nopriv_'.$this->ajax_action, [$this, 'ajax_submit']);
	}

	private function ajax_data() {
		return [
			'form'		=> $this->default_name,
			'prefix'	=> zu_ContactFields::$css_prefix,
			'action'	=> $this->ajax_action,
		];
	}

	public function ajax_submit() {

	    $contact = new zu_ContactData;

		if($contact->has_recaptcha()) $this->check_recaptcha($contact);
	    if($contact->is_valid()) $this->send_with_notify($contact);

		$this->update_stats($contact);

		wp_send_json_success($contact->as_response());
	}

	public function ajax_more($action, $value) {
	    if($action === 'zucontact_test_mail') return $this->send_test_email();
	    else return null;
	}

	public function send_test_email() {
	    $was_sent = $this->test_smtp();
		$error = $this->get_ajax_error();
	    return $error !== false ? $error : $this->create_notice(
			'success',
			__('Test mail was successfully sent.', 'zu-contact')
		);
	}
}
