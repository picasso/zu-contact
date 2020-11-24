<?php
// Class for holding and validating data captured from the contact form
//
class zu_ContactData {
	public $name;
	public $email;
	public $message;

	public $post_id;
	public $post_link;
	public $spam;
	public $was_sent;
	public $was_notified;
	public $recaptcha;

	public $attributes;
	public $errors;
	public $form;

	private $prefix;
	private $available_errors;
	private $was_checked;

	function __construct() {

		$this->errors = [];
		$this->attributes = [];
		$this->form = false;
		$this->prefix = zu_ContactFields::$css_prefix;
		$this->available_errors = zucontact()->available_errors();

		$is_post = $_SERVER['REQUEST_METHOD'] === 'POST' ? true : false;

		$form_nonce = $_POST[$this->prefix.'_nonce'] ?? null;
		$is_nonce_verified = ($is_post && wp_verify_nonce($form_nonce, zucontact()->ajax_nonce(false))) ? true : false;
		$fdata = $_POST[$this->prefix] ?? null;
		$this->recaptcha = $_POST['g-recaptcha-response'] ?? false;

		if($is_post && !$is_nonce_verified) $this->add_error('nonce');
		if($is_nonce_verified && empty($fdata)) $this->add_error('data');
		if($is_post && $this->recaptcha !== false && strlen($this->recaptcha) === 0) $this->add_error('recaptcha');

		if(!empty($fdata)) {
			$this->post_id = isset($fdata['_post_id']) ? absint($fdata['_post_id']): null;
			$this->post_link = $fdata['_post_link'] ?? null;
			$this->form = zucontact()->get_form($fdata['_fname'] ?? false);
			if($this->form === false) $this->add_error('fname');

			if($this->form !== false) {
				foreach($this->form->fields() as $field) {

					$field_id = $field['name'];
					$value = $this->validate_field($field, $fdata);
					if($value === null) continue;

					$this->attributes[$field_id] = $value;

					if($field_id === 'name') $this->name = $value;
					else if($field_id === 'email') $this->email = $value;
					else if($field_id === 'message') $this->message = $value;
				}
			}
			unset($_POST[$this->prefix]);
		}

		$this->was_sent = false;
		$this->spam = false;
		$this->was_notified = false;
		$this->was_checked = -1;
	}

	private function validate_field($field, $form) {
		$field_id = $field['name'] ?? '';
		$field_type = $field['type'] ?? '';

		if($field_type === 'text' || $field_type === 'textarea') {
			return filter_var($form[$field_id], FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
		}
		if($field_type === 'email') return filter_var($form[$field_id], FILTER_SANITIZE_EMAIL);
		if($field_type === 'url') return filter_var($form[$field_id], FILTER_SANITIZE_URL);
		if($field_type === 'number') return filter_var($form[$field_id], FILTER_SANITIZE_NUMBER_INT);
		if($field_type === 'tel') return preg_replace('/[^0-9+-]/', '', $form[$field_id]);
		if($field_type === 'checkbox') return isset($form[$field_id]) ? true : false;

		return null;
	}

	public function is_valid($force_repeat = false) {

		if(!empty($this->errors) || $this->form === false) return false;

		// avoid repeat check if was not requested
		if($force_repeat === false && $this->was_checked !== -1) return $this->was_checked;

		foreach($this->form->fields() as $field) {

			if($field['is_required']) {
				$field_id = $field['name'];
				$field_type = $field['type'];
				$value = $this->attributes[$field_id];
				// convert required message from Array or String
				$this->form->get_required($field['required'], $required, $required_valid);
				//email || email invalid address
				if($field_type === 'email') {
					if(strlen($value) === 0) $this->add_error($field_id, $required);
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_EMAIL)) $this->add_error($field_id, $required_valid);
				}
				//name, message & general text fields - should at least 3 chars
				if($field_type === 'text' || $field_type === 'textarea') {
					if(strlen($value) < 3) $this->add_error($field_id, $required);
				}
				// numbers should be great than 0
				if($field_type === 'number') {
					if(intval($value) <= 0) $this->add_error($field_id, $required);
				}
				// phone should be at least 8 digits
				if($field_type === 'tel') {
					if(strlen($value) < 8) $this->add_error($field_id, $required);
				}
				// url || invalid url
				if($field_type === 'url') {
					if(strlen($value) === 0) $this->add_error($field_id, $required);
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_URL)) $this->add_error($field_id, $required_valid);
				}
				//checkbox which should checked - like "I agree with terms & conditions"
				if($field_type === 'checkbox') {
					if(strlen($value) !== true) $this->add_error($field_id, $required);
				}
			}
		}
		$this->was_checked = count($this->errors) === 0;
		return $this->was_checked;
	}

	public function add_error($key, $message = null) {
		if(!empty($message)) $this->errors[$key] = $message;
		else if(in_array($key, $this->available_errors)) $this->errors['_'.$key] = true;
	}

	public function has_recaptcha() {
		return $this->recaptcha !== false && strlen($this->recaptcha) > 0;
	}

	public function get_message() {
		$fname = empty($this->form) ? null : $this->form->name;
		return zucontact()->message($this->errors, $fname, $this->was_notified);
	}

	// remove all general errors (like _nonce, _data etc.)
	public function get_errors() {
		return array_filter($this->errors, function($key) {
			return substr($key, 0, 1) !== '_';
		}, ARRAY_FILTER_USE_KEY);
	}

	public function as_response() {
		return [
			'sent'		=> $this->was_sent,
			'notified'	=> $this->was_notified,
			'is_valid'	=> $this->is_valid(),
			'errors'	=> $this->get_errors(),
			'message'	=> $this->get_message(),
		];
	}

	public function as_values() {
		$values = json_decode(json_encode($this), true);
		$values = array_merge($values, $this->attributes);
		$public_props = ['was_sent', 'was_notified', 'attributes', 'form', 'errors', 'recaptcha', 'spam'];
		foreach($public_props as $val) unset($values[$val]);
// _dbug('after', $values);
		return $values;
	}
}
