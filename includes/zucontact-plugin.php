<?php
// Includes all traits --------------------------------------------------------]

include_once('traits/ajax.php');
include_once('traits/form.php');
include_once('traits/mailer.php');
include_once('traits/recaptcha.php');
include_once('traits/shortcode.php');

class zu_Contact extends zukit_Plugin {

	// Form helpers, shortcode, ajax, mailer & ReCAPTCHA
	use zu_ContactAjax,
		zu_ContactForm,
		zu_ContactMailer,
		zu_ContactReCAPTCHA,
		zu_ContactShortcode;

	protected function construct_more() {
		$this->path_autocreated = true;
    }

	protected function config() {
		return  [
			'prefix'			=> 'zucontact',
			// load 'Zukit' script & CSS
			'zukit'				=> true,

			'translations'		=> [
				'path'				=> 'lang',
				'domain'			=> 'zu-contact',
			],

			// front-end script & style
			'script'	=> [
				'deps'			=> ['jquery'],
				'data'			=> [$this, 'ajax_data'],
				// we don't want the enqueue frontend script always,
				// only when shortcode is used
				'register_only'	=> true,
			],
			'style'		=> [
				'register_only'	=> true,
			],

			'appearance'		=> [
				'colors'	=> [
					'backdrop'		=> '#f7fffb',
					'header'		=> '#b1eed5',
					'title'			=> '#016760',
				],
			],

			'options'			=> [
				'use_recaptcha' 	=> false,
				'custom_css'		=> true,
				// if true - use 'Me' in subheading, otherwise 'Us'
				'me_or_us'			=> false,
				'notify'			=> '',
			],

			'blocks'			=> [
				'namespace'			=> 'zu',
				'blocks'			=> ['form', 'field', 'recaptcha'],
				'frontend_blocks'	=> 'form',
				'script'			=> [
					'data'	=> [$this, 'ajax_data'],
				]
			],
		];
	}

	// Add plugin info debug actions ------------------------------------------]

	protected function extend_info() {
		$stats = $this->stats();
		return [
			'forms' => [
				'label'		=> __('Available Forms', 'zu-contact'),
				'value'		=> empty($stats['forms']) ? null : $stats['forms'],
			],
			'comments' 	=> [
				'label'		=> __('Saved Entries', 'zu-contact'),
				'value'		=> empty($stats['comments']) ? null : $stats['comments'],
			],
			'approved' 	=> [
				'label'		=> __('Approved Entries', 'zu-contact'),
				'value'		=> empty($stats['comments']) ? null : $stats['approved'],
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

		$this->register_ajax_forms();

		// Some 'inits' from traits -------------------------------------------]

		$this->init_messages();
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

	protected function should_load_css($is_frontend, $hook) {
		return $is_frontend ? $this->is_option('custom_css') : $this->ends_with_slug($hook);
	}

	protected function should_load_js($is_frontend, $hook) {
	    return $is_frontend ? true : $this->ends_with_slug($hook);
	}

	// register Google recaptcha script if required
	protected function enqueue_more($is_frontend, $hook) {
		if($is_frontend) {
			$this->register_recaptcha();
		}
	}

	// enqueue Google recaptcha script if block 'zu/form' with needed attrs found on page
	public function blocks_enqueue_more($is_frontend, $block_name, $attributes) {
		if($is_frontend && $block_name === 'zu/form') {
			$this->enqueue_recaptcha_with_block($attributes);
		}
	}
}

// Entry Point ----------------------------------------------------------------]

function zucontact($file = null) {
	return zu_Contact::instance($file);
}
