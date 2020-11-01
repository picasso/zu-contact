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

	public $attributes;
	public $errors;
	public $form;

	private $prefix;
	private $recaptcha_public_key;
	private $recaptcha_private_key;


	function __construct() {

		$this->errors = [];
		$this->attributes = [];
		$this->form = false;
		$this->prefix = zu_ContactFields::$css_prefix;

		// if(??::UseRecaptcha()) {
		// 	$this->recaptcha_public_key  = ??::PublicKey();
		// 	$this->recaptcha_private_key = ??::PrivateKey();
		// }

		$is_post = $_SERVER['REQUEST_METHOD'] == 'POST' ? true : false;

		$form_nonce = $_POST[$this->prefix.'_nonce'] ?? null;
		$is_nonce_verified = ($is_post && wp_verify_nonce($form_nonce, zucontact()->ajax_nonce(false))) ? true : false;
		$fdata = $_POST[$this->prefix] ?? null;

		if($is_post && !$is_nonce_verified) $this->errors['_nonce'] = true;
		if($is_nonce_verified && empty($fdata)) $this->errors['_data'] = true;

		if(!empty($fdata)) {

			$this->post_id = isset($fdata['_post_id']) ? absint($fdata['_post_id']): null;
			$this->post_link = $fdata['_post_link'] ?? null;
			$this->form = zucontact()->get_form($fdata['_fname'] ?? false);
			if($this->form === false) $this->errors['_fname'] = true;

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

		$this->spam = false;
		$this->was_sent = false;
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

	public function is_recaptcha() {
		return (!empty($this->recaptcha_public_key) && !empty($this->recaptcha_private_key)) ? true : false;
	}

	public function is_valid() {

		if(!empty($this->errors) || $this->form === false) return false;

		foreach($this->form->fields() as $field) {

			if($field['is_required']) {
				$field_id = $field['name'];
				$field_type = $field['type'];
				$value = $this->attributes[$field_id];
				// convert required message from Array or String
				$this->form->get_required($field['required'], $required, $required_valid);
				//email || email invalid address
				if($field_type == 'email') {
					if(strlen($value) == 0) $this->errors[$field_id] = $required;
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_EMAIL)) $this->errors[$field_id] = $required_valid;
				}
				//name, message & general text fields - should at least 3 chars
				if($field_type == 'text' || $field_type == 'textarea') {
					if(strlen($value) < 3) $this->errors[$field_id] = $required;
				}
				// numbers should be great than 0
				if($field_type == 'number') {
					if(intval($value) <= 0) $this->errors[$field_id] = $required;
				}
				// phone should be at least 8 digits
				if($field_type == 'tel') {
					if(strlen($value) < 8) $this->errors[$field_id] = $required;
				}
				// url || invalid url
				if($field_type == 'url') {
					if(strlen($value) == 0) $this->errors[$field_id] = $required;
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_URL)) $this->errors[$field_id] = $required_valid;
				}
				//checkbox which should checked - like "I agree with terms & conditions"
				if($field_type == 'checkbox') {
					if(strlen($value) !== true) $this->errors[$field_id] = $required;
				}
			}
		}

		//check recaptcha but only if we have keys

		// if($this->is_recaptcha()) {
		//
		// 	$resp = RecaptchaV2::VerifyResponse($_SERVER['REMOTE_ADDR'], $this->recaptcha_private_key, $_POST['g-recaptcha-response']);
		//
		// 	if(!$resp->success) {
		// 		$this->errors['recaptcha'] = __('Please solve the recaptcha to continue.', 'zu-contact');
		// 	}
		// }

		return count($this->errors) == 0 ? true : false;
	}

	public function send_mail() {

		$this->was_sent = false;

		if($this->form !== false) {

			apply_filters(zu_Contact::$spam_filter, $this);

			if($this->spam === true) return ($this->was_sent = true);

			$subject = __('New entry was submitted at', 'zu-contact');
			$content = sprintf('<p>%2$s <strong>%1$s</strong></p>', date('d.m H:i'), $subject);

			foreach($this->attributes as $field_id => $value) {
				$field = $this->form->get($field_id);
				$value = is_bool($value) ? sprintf('%1$s', $value ? 'YES' :'NO') : $value;
				$content .= sprintf('<p><strong>%1$s</strong>: %2$s</p>', $field['label'], $value);
			}
			$this->was_sent = cplus_mailer($this->email, zucontact()->recipients(), $content, false, $this->post_id, $this->post_link);

			if(in_array('carbon-copy', array_keys($this->attributes)) && $this->attributes['carbon-copy']) {
				$content = str_replace($subject, __('You sent it at', 'zu-contact'), $content);
				cplus_mailer($this->email, $this->email, $content, true);
			}
		}
		return $this->was_sent;
	}

	public function as_values() {
		$values = json_decode(json_encode($this), true);
		$form = $values['form'] === false ? [] : $values['form'];
		$fields = array_intersect_key($form, array_flip(['fields']));
		$values = array_merge($values, $fields, $values['attributes']);
		unset($values['was_sent']);
		unset($values['attributes']);
		unset($values['form']);
		unset($values['errors']);

		return $values;
	}
}
