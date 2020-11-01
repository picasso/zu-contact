<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]

trait zu_ContactAjax {

	private $ajax_action = 'zucontact-submit';

	private function init_ajax() {
		add_action('wp_ajax_'.$this->ajax_action, [$this, 'ajax_submit']);
		add_action('wp_ajax_nopriv_'.$this->ajax_action, [$this, 'ajax_submit']);
	}

	private function ajax_data() {
		return $this->merge_js_data([
			'form'		=> $this->default_name,
			'prefix'	=> zu_ContactFields::$css_prefix,
			'action'	=> $this->ajax_action,
		]);
	}

	public function ajax_submit() {

	    $contact = new zu_ContactData;

		$result = [
			'sent'		=> false,
			'is_valid'	=> $contact->is_valid(),
			'errors'	=> $contact->get_errors(),
		];

	    if($result['is_valid']) $result['sent'] = $this->send_mail($contact);
	    $result['message'] = $contact->get_message();

		wp_send_json_success($result);
	}
}
