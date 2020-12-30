<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]
//
trait zu_ContactAjax {

	private $ajax_action = 'zucontact-submit';
	private $ajax_forms_key = 'zucontact-ajax-forms';
	private $custom_rest_id = 'zucontact_forms';

	private function init_ajax() {
		add_action('wp_ajax_'.$this->ajax_action, [$this, 'ajax_submit']);
		add_action('wp_ajax_nopriv_'.$this->ajax_action, [$this, 'ajax_submit']);
	}

	public function ajax_data($is_frontend = true) {
		return $is_frontend ? [
			'form'		=> $this->default_name,
			'prefix'	=> zu_ContactFields::$css_prefix,
			'action'	=> $this->ajax_action,
			'locale'	=> get_locale(),
		] : [
			'required'	=> $this->get_ajax_forms_required(),
			'prefix'	=> zu_ContactFields::$css_prefix,
			'types'		=> zu_ContactFieldDefaults::as_data(),
			'templates'	=> $this->templates(),
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

	// protected function get_custom_value($request_id, $params) {
	// 	if($request_id !== $this->custom_rest_id) return null;
	//
	// 	$post_id = $params['id'];
	// 	$form_name = $params['name'];
	//
	// 	$forms = $this->get_option($this->ajax_forms_key, []);
	//
	// 	if(empty($post_id) || empty($forms)) return null;
	// 	if(empty($form_name)) return array_key_exists($post_id, $forms) ? $forms[$post_id] : null;
	// 	else {
	// 		return array_key_exists($post_id, $forms) &&
	// 			array_key_exists($form_name, $forms[$post_id]) ? $forms[$post_id][$form_name] : null;
	// 	}
	// }

	protected function set_custom_value($request_id, $keys, $values) {
		if($request_id !== $this->custom_rest_id) return null;

		$post_id = $values['id'];
		$value = $values['value'];

		$forms = $this->get_option($this->ajax_forms_key, []);
		if(empty($post_id)) return null;

		if($value === null) {
			unset($forms[$post_id]);
		} else {
			$forms[$post_id] = $value;
		}

		// Update statistics
		$this->update_stats($post_id, $value === null);
		return $this->set_option($this->ajax_forms_key, $forms);
	}

	private function ajax_form_name($post_id, $name) {
		return sprintf('%1$s_%2$s', $post_id, $name);
	}

	private function register_ajax_forms() {
		$forms = $this->get_option($this->ajax_forms_key, []);
		foreach($forms as $post_id => $post_forms) {

			foreach($post_forms as $name => $data) {
				$form = new zu_ContactFields($this->ajax_form_name($post_id, $name));
				foreach($data ?? [] as $field) {
					$form->add($field['type'], $field['required'], [
						'id'			=> $field['id'],
						'required'		=> $field['requiredValue'] ?? null,
					]);
				}
				$this->register_form($form);
			}
		}
	}

	private function get_ajax_forms_required() {
		$forms = $this->get_option($this->ajax_forms_key, []);
		$post_id = get_the_ID();
		$forms = $forms[$post_id] ?? [];

		$required = [];
		foreach($forms as $name => $data) {
			$required[$name] = [];
			foreach($data ?? [] as $field) {
				$required[$name][$field['id']] = $field['requiredValue'] ?? null;
			}
		}
		return $required;
	}
}
