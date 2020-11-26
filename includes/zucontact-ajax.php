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
}
