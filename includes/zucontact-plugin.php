<?php
// Includes all traits --------------------------------------------------------]

include_once('zucontact-ajax.php');
include_once('zucontact-form.php');
include_once('zucontact-mailer.php');
include_once('zucontact-recaptcha.php');
include_once('zucontact-shortcode.php');

class zu_Contact extends zukit_Plugin {

	// Form helpers, shortcode, ajax, mailer & ReCAPTCHA
	use zu_ContactAjax,
		zu_ContactForm,
		zu_ContactMailer,
		zu_ContactReCAPTCHA,
		zu_ContactShortcode;

	protected function construct_more() {
		// init static messages
		$this->setup_messages();
		$this->path_autocreated = true;
    }

	protected function config() {
		return  [
			'prefix'			=> 'zucontact',
			// load 'Zukit' script & CSS
			'zukit'				=> true,
			// translations
			// 'path'				=> 'lang',
			'domain'			=> 'zu-contact',
			// appearance
			'colors'			=> [
				'backdrop'			=> '#f0f2f1',
				'header'			=> '#b1eed5',
				'title'				=> '#016760',
			],
			'options'			=> [
				'use_recaptcha' 	=> false,
				'custom_css'		=> true,
				// if true - use 'Me' in subheading, otherwise 'Us'
				'me_or_us'			=> false,
				'notify'			=> '',
			],
		];
	}

	// Add plugin info debug actions ------------------------------------------]

	protected function extend_info() {
		$stats = $this->stats();
		return [
			'forms' => empty($stats['forms']) ? null : [
				'label'		=> __('Available Forms', 'zu-contact'),
				'value'		=> $stats['forms'],
			],
			'comments' 	=> empty($stats['comments']) ? null : [
				'label'		=> __('Saved Entries', 'zu-contact'),
				'value'		=> $stats['comments'],
			],
			'approved' 	=> empty($stats['comments']) ? null : [
				'label'		=> __('Approved Entries', 'zu-contact'),
				'value'		=> $stats['approved'],
			],
			'ReCAPTCHA' => $this->recaptcha_info(),
		];
	}

	protected function extend_debug_options() {
		return [
			'smtp'	=> [
				'label'		=> __('Debug SMTP mailer', 'zu-contact'),
				'value'		=> false,
			],
		];
	}
	protected function extend_debug_actions() {
		return [
			[
				'label'		=> __('Send Test Mail', 'zu-contact'),
				'value'		=> 'zucontact_test_mail',
				'icon'		=> 'email-alt',
				'color'		=> 'gold',
			]
		];
	}

	public function init() {

		// Add all predefined forms -------------------------------------------]

		foreach(glob(dirname(__FILE__).'/forms/*.php') as $filename) {
			include_once($filename);
		}

		// Some 'inits' from traits -------------------------------------------]

		$this->init_ajax();
		$this->init_shortcode();
		$this->init_mailer();
	}

	// Custom menu position ---------------------------------------------------]

	protected function custom_admin_submenu() {

		return [
			'reorder'	=>	[
				[
					'menu'			=> 	'zucontact-settings',
					'after_index2'	=>	'zuplus-settings',
				],
			],
		];
	}

	// Script enqueue ---------------------------------------------------------]

	protected function js_data($is_frontend) {
		return  $is_frontend ? $this->ajax_data() : null;
	}

	protected function should_load_css($is_frontend, $hook) {
		return $is_frontend ? $this->is_option('custom_css') : $this->ends_with_slug($hook);
	}

	protected function should_load_js($is_frontend, $hook) {
	    return $is_frontend ? true : $this->ends_with_slug($hook);
	}

	// we don't want the enqueue frontend script always, only when shortcode is used
	protected function js_params($is_frontend) {
		return [
			'deps'			=> $is_frontend ? ['jquery'] : null,
			'register_only'	=> $is_frontend ? true : false,
		];
	}
	protected function css_params($is_frontend) {
		return [
			'register_only'	=> $is_frontend ? true : false,
		];
	}

	// register Google recaptcha script if required
	protected function enqueue_more($is_frontend, $hook) {
		if($is_frontend) {
			$this->register_recaptcha();
		}
	}
}

// Entry Point ----------------------------------------------------------------]

function zucontact($file = null) {
	return zu_Contact::instance($file);
}
