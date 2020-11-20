<?php

// Google reCAPTCHA V2 helpers ------------------------------------------------]

trait zu_ContactReCAPTCHA {

	private $recaptcha_handle = null;

	// static $siteVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify?';

	private function get_sitekey() {
		$recaptcha = $this->get_option('recaptcha', []);
		return $recaptcha['sitekey'] ?? null;
	}

	private function recaptcha_info() {
		return $this->is_option('use_recaptcha') ? [
			'label'		=> __('Google reCAPTCHA', 'zu-contact'),
			'value'		=> empty($this->get_sitekey()) ? __('Not Activated', 'zu-contact') : __('Activated', 'zu-contact'),
			'depends' 	=> ['use_recaptcha', 'recaptcha.sitekey'],
		] : null;
	}

	private function maybe_enqueue_recaptcha() {
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

	private function get_recaptcha() {

		$errors = [
			'invalid'	=> __('Are you a robot? Please solve reCAPTCHA correctly.', 'zu-contact'),
			'expired'	=> __('Verification expired. Check the checkbox again.', 'zu-contact'),
			'network'	=> __('Network connectivity is lost and reCAPTCHA cannot continue until connectivity is restored.', 'zu-contact'),
		];
		$recaptcha = $this->get_option('recaptcha', []);
		return empty($recaptcha['sitekey'] ?? null) ? '' : zu_sprintf(
			'<div
				class="g-recaptcha"
				data-sitekey="%1$s"
				data-theme="%2$s"
				data-size="%3$s"
				data-invalid="%4$s"
				data-expired="%5$s"
				data-network="%6$s">
			</div>',
			$recaptcha['sitekey'] ?? null,
			$recaptcha['theme'] ?? 'light',
			$recaptcha['size'] ?? 'normal',
			$errors['invalid'],
			$errors['expired'],
			$errors['network']
		);
	}

	// private function recaptcha_messages($key) {
	// 	$msg = [
	// 		'invalid'	=> __('Are you a robot? Please solve Captcha correctly!', 'zu-contact'),
	// 		'expired'	=> __('Captcha expired', 'zu-contact'),
	// 	];
	//
	// 	return array_key_exists($key, $msg) ? $msg[$key] : $msg['invalid'];
	// }

	 // * Encodes the given data into a query string format.
	// static function EncodeQS($data) {
	// 	$req = "";
	// 	foreach ($data as $key => $value) {
	// 		$req .= $key . '=' . urlencode(stripslashes($value)) . '&';
	// 	}
	// 	// Cut the last '&'
	// 	$req = substr($req, 0, strlen($req) - 1);
	//
	// 	return $req;
	// }

	 // * Submits an HTTP GET to a reCAPTCHA server.
	 // *
	 // * @param string $path url path to recaptcha server.
	 // * @param array $data array of parameters to be sent.
	// static function SubmitHTTPGet($path, $data) {
	// 	$req      = self::EncodeQS($data);
	// 	$response = file_get_contents($path . $req);
	//
	// 	return $response;
	// }



	 // * Calls the reCAPTCHA siteverify API to verify whether the user passes
	 // * CAPTCHA test.
	 // *
	 // * @param string $remoteIp IP address of end user.
	 // * @param string $secret google recaptcha secret key.
	 // * @param string $response response string from recaptcha verification.
	// static function VerifyResponse($remoteIp, $secret, $response) {
	// 	// Discard empty solution submissions
	// 	if($response == null || strlen($response) == 0) {
	// 		$recaptchaResponse             = new cplus_ReCaptchaResponseV2();
	// 		$recaptchaResponse->success    = false;
	// 		$recaptchaResponse->errorCodes = 'missing-input';
	//
	// 		return $recaptchaResponse;
	// 	}
	// 	$getResponse       = self::SubmitHttpGet(
	// 		self::$siteVerifyUrl,
	// 		[
	// 			'secret'   		=> 	$secret,
	// 			'remoteip' 	=> 	$remoteIp,
	// 			'response' 	=> 	$response
	// 		]
	// 	);
	// 	$answers           = json_decode($getResponse, true);
	// 	$recaptchaResponse = new cplus_ReCaptchaResponseV2();
	// 	if(trim($answers ['success']) == true) {
	// 		$recaptchaResponse->success = true;
	// 	} else {
	// 		$recaptchaResponse->success    = false;
	// 		$recaptchaResponse->errorCodes = $answers ['error-codes'];
	// 	}
	//
	// 	return $recaptchaResponse;
	// }
}
