<?php
//
// Class for holding and validating data captured from the contact form
//

class cplus_Contact {
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

	private $recaptcha_public_key;
	private $recaptcha_private_key;


	function __construct() {
		
		$this->errors = [];
		$this->attributes = [];
		$this->form = false;
/*
		if(cplus_PluginSettings::UseRecaptcha()) {
			$this->recaptcha_public_key  = cplus_PluginSettings::PublicKey();
			$this->recaptcha_private_key = cplus_PluginSettings::PrivateKey();
		}
*/
		$is_post = $_SERVER['REQUEST_METHOD'] == 'POST' ? true : false;

		$is_nonce_verified = ($is_post && wp_verify_nonce($_POST['cplus_nonce'], cplus_instance()->ajax_nonce(false))) ? true : false;
		$is_cplus_object = ($is_post && $is_nonce_verified && isset($_POST['cplus'])) ? true : false;
		
		if($is_post && !$is_nonce_verified) $this->errors['nonce'] = __('Nonce failed - is not correct or expired', 'contact-plus');
		if($is_nonce_verified && !$is_cplus_object) $this->errors['form'] = __('Form data not found', 'contact-plus');

		if($is_cplus_object) {
			
			$cplus = $_POST['cplus'];
			$this->form = cplus_instance()->get_form(isset($_POST['cplus_fname']) ? $_POST['cplus_fname'] : '');
			if($this->form === false) $this->errors['form'] = __('Form name not found', 'contact-plus');
			
			if($this->form !== false) {
				foreach($this->form->get_fields() as $field) {
				
					$field_id = $field['name'];
					$field_type = $field['type'];

					if($field_type == 'text' || $field_type == 'textarea') $value = filter_var($cplus[$field_id], FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
					if($field_type == 'email') $value = filter_var($cplus[$field_id], FILTER_SANITIZE_EMAIL);
					if($field_type == 'url') $value = filter_var($cplus[$field_id], FILTER_SANITIZE_URL);
					if($field_type == 'number') $value = filter_var($cplus[$field_id], FILTER_SANITIZE_NUMBER_INT);
					if($field_type == 'tel') $value = preg_replace('/[^0-9+-]/', '', $cplus[$field_id]);
					if($field_type == 'checkbox') $value = isset($cplus[$field_id]) ? true : false;
					if($field_type == 'submit') continue;

					$this->attributes[$field_id] = $value;
					
					if($field_id == 'name') $this->name = $value;
					if($field_id == 'email') $this->email = $value;
					if($field_id == 'message') $this->message = $value;
				}
				
				$this->post_id = isset($_POST['post_id']) ? $_POST['post_id'] : 0;
				$this->post_link = isset($_POST['post_link']) ? $_POST['post_link'] : '';
			}
			unset($_POST['cplus']);
		}

		$this->spam = false;
		$this->was_sent = false;
	}

	public function is_recaptcha() { return (!empty($this->recaptcha_public_key) && !empty($this->recaptcha_private_key)) ? true : false; }

	public function is_valid() {
		
		if(!empty($this->errors) || $this->form === false) return false;

		foreach($this->form->get_fields() as $field) {
			
			if($field['is_required']) {
				
				$field_id = $field['name'];
				$field_type = $field['type'];
				$value = $this->attributes[$field_id];
				cplus_get_required($field['required'], $required, $required_valid); 	// convert required values from Array or String
							
				if($field_type == 'email') {		//email || email invalid address
		
					if(strlen($value) == 0) $this->errors[$field_id] = $required;
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_EMAIL)) $this->errors[$field_id] = $required_valid;
				}

				if($field_type == 'text' || $field_type == 'textarea') {		//name, message & general text fields - should at least 3 chars
					
					if(strlen($value) < 3) $this->errors[$field_id] = $required;
				}

				if($field_type == 'number') {											// numbers should be great than 0

					if(intval($value) <= 0) $this->errors[$field_id] = $required;
				}

				if($field_type == 'tel') {													// phone should be at least 8 digits
					
					if(strlen($value) < 8) $this->errors[$field_id] = $required;
				}

				if($field_type == 'url') {													// url || invalid url
					
					if(strlen($value) == 0) $this->errors[$field_id] = $required;
					if(strlen($value) > 0 && !filter_var($value, FILTER_VALIDATE_URL)) $this->errors[$field_id] = $required_valid;
				}

				if($field_type == 'checkbox') {										//checkbox which should checked - like "I agree with terms & conditions"
					
					if(strlen($value) !== true) $this->errors[$field_id] = $required;
				}
			}
		}

		//check recaptcha but only if we have keys
/*
		if($this->is_recaptcha()) {
			
			$resp = csf_RecaptchaV2::VerifyResponse($_SERVER['REMOTE_ADDR'], $this->recaptcha_private_key, $_POST['g-recaptcha-response']);

			if(!$resp->success) {
				$this->errors['recaptcha'] = __('Please solve the recaptcha to continue.', 'contact-plus');
			}
		}
*/

		return count($this->errors) == 0 ? true : false;
	}

	public function send_mail() {
		
		$this->was_sent = false;
		
		if($this->form !== false) {
			
			apply_filters('cplus_spam_filter', $this);
	
			if($this->spam === true) return ($this->was_sent = true);
			
			$subject = __('New entry was submitted at', 'contact-plus');
			$content = sprintf('<p>%2$s <strong>%1$s</strong></p>', date('d.m H:i'), $subject);
	
			foreach($this->attributes as $field_id => $value) {
				$field = $this->form->get_field($field_id);
				$value = is_bool($value) ? sprintf('%1$s', $value ? 'YES' :'NO') : $value;
				$content .= sprintf('<p><strong>%1$s</strong>: %2$s</p>', $field['label'], $value);
			}	
			$this->was_sent = cplus_mailer($this->email, cplus_instance()->email_recipients(), $content);
			
			if(in_array('carbon-copy', array_keys($this->attributes)) && $this->attributes['carbon-copy']) {
				$content = str_replace($subject, __('You sent it at', 'contact-plus'), $content);
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
		unset($values['attributes']);
		unset($values['form']);
		unset($values['errors']);
		
		return $values;
	}
}
