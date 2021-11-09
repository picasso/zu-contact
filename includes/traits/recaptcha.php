<?php
// Google reCAPTCHA V2 helpers ------------------------------------------------]
//
trait zu_ContactReCAPTCHA {

	private $recaptcha_handle = null;
	private static $verify_url = 'https://www.google.com/recaptcha/api/siteverify';

	private function recaptcha_info() {
		$recaptcha = $this->get_option('recaptcha', []);
		$value = empty($recaptcha['sitekey']) ? __('Not Activated', 'zu-contact') : __('Activated', 'zu-contact');
		return [
			'label'		=> __('Google reCAPTCHA', 'zu-contact'),
			'value'		=> $this->is_option('use_recaptcha') ? $value : null,
			'depends' 	=> ['use_recaptcha', 'recaptcha.sitekey'],
		];
	}

	private function maybe_enqueue_recaptcha($enabled = true) {
		// only 'false' is taken into account, all other values are 'true'
		if($enabled === false) return;
		if($this->recaptcha_handle) $this->enqueue_only(false, $this->recaptcha_handle);
	}

	private function register_recaptcha() {
		// load Google recaptcha script if required
		if($this->is_option('use_recaptcha')) {
			$this->recaptcha_handle = $this->prefix_it('recaptcha2');
			$absolute_path = 'https://www.google.com/recaptcha/api.js?hl=' . get_locale();
			$this->enqueue_script($absolute_path, [
				'register_only' => true,
				'handle'        => $this->recaptcha_handle,
				'bottom'        => false,
				'absolute'		=> true,
				'async'         => true,
				'defer'         => true,
			]);
		}
	}

	private function get_recaptcha($enabled = true) {
		// only 'false' is taken into account, all other values are 'true'
		if($enabled === false) return '';

		$recaptcha = $this->get_option('recaptcha', []);

		return empty($recaptcha['sitekey'] ?? null) ? '' : zu_sprintf(
			'<div
				class="g-recaptcha"
				data-sitekey="%1$s"
				data-theme="%2$s"
				data-size="%3$s">
			</div>',
			$recaptcha['sitekey'] ?? null,
			$recaptcha['theme'] ?? 'light',
			$recaptcha['size'] ?? 'normal'
		);
	}

	private function recaptcha_error_messages($key = null, $as_array = false) {
		$errors = [
			'invalid'	=> __('Are you a robot? Please solve reCAPTCHA correctly to continue.', 'zu-contact'),
			'expired'	=> __('Verification expired. Check the checkbox again.', 'zu-contact'),
			'failed'	=> __('Robot verification failed, please try again.', 'zu-contact'),
			'network'	=> __('Network connectivity is lost and reCAPTCHA cannot continue until connectivity is restored.', 'zu-contact'),
		];
		return $as_array ? $errors : (array_key_exists($key, $errors) ? $errors[$key] : $errors['invalid']);
	}

	private function check_recaptcha($data) {

		if($data instanceof zu_ContactData) {
			$recaptcha = $this->get_option('recaptcha', []);
			$secret = $recaptcha['secret'] ?? null;
			$response = $data->recaptcha;

			// check recaptcha but only if we have private key
			if(!empty($secret) && !empty($response)) {
				$check = $this->verify_response($secret, $response);
				if(!$check) $data->add_error('recaptcha', $this->recaptcha_error_messages('failed'));
				else return true;
			}
		}
		return false;
	}

	// Calls the reCAPTCHA '$verify_url' API to verify
	// whether the user passes CAPTCHA test
	private function verify_response($secret, $response) {

		// encodes the given params into a query string format
		$query = add_query_arg(urlencode_deep([
			'secret'   	=> $secret,
			'remoteip' 	=> $_SERVER['REMOTE_ADDR'],
			'response' 	=> $response,
		]), self::$verify_url);

		$verify_response = file_get_contents($query);
		$data = json_decode($verify_response);
		return $data->success;
	}

	private function ajax_recaptcha_data($is_frontend) {

		if($is_frontend) return $this->recaptcha_error_messages(null, true);

		$recaptcha = $this->get_option('recaptcha', []);
		unset($recaptcha['secret']);
		return $recaptcha;
	}

	private function enqueue_recaptcha_with_block($attrs) {
		// on the page there may be several blocks,
		// so '$attrs' is an array of attributes for all blocks on the page
		foreach($attrs as $block_attr) {
			$recaptcha_enabled = $block_attr['useRecaptcha'] ?? false;
			if($recaptcha_enabled) {
				$this->maybe_enqueue_recaptcha($recaptcha_enabled);
				// we can enqueue reCaptcha only once, therefore, we interrupt the loop
				break;
			}
		}
	}
}
