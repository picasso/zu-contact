<?php
// define('CPLUS_VALIDATE_VERSION', '1.11.0');

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
		$this->debug = true;
		$this->path_autocreated = true;
    }

	protected function config() {
		return  [
			'prefix'			=> 'zucontact',
			// load 'Zukit' script & CSS
			'zukit'				=> true,

			'options'			=> [
				'use_recaptcha' 	=>	false,
				'client_validate'	=>	false,
				'custom_css'		=>	true,
				// if true - use 'Me' in subheading, otherwise 'Us'
				'me_or_us'			=>	false,
				'notify'			=>	'',
			],
		];
	}

	// Add plugin info debug actions ------------------------------------------]

	protected function extend_info() {
		$stats = $this->stats();
		return [
			'forms' => empty($stats) ? null : [
				'label'		=> __('Available Forms', 'zu-contact'),
				'value'		=> $stats['forms'] ?? 0,
			],
			'comments' 	=> empty($stats) ? null : [
				'label'		=> __('Approved Comments', 'zu-contact'),
				'value'		=> $stats['comments'] ?? 0,
			],
			'ReCAPTCHA' => $this->recaptcha_info(),
		];
	}

	protected function extend_debug_actions($actions) {
		$actions[] = [
			'label'		=> __('Check Existed Terms', 'zumedia'),
			'value'		=> 'zumedia_check_terms',
			'icon'		=> 'warning',
			'color'		=> 'gold',
		];

		return $actions;
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
		return  $is_frontend ? $this->ajax_data() : [
			'actions' 		=> [
				[
					'label'		=> __('Update Dominants', 'zumedia'),
					'value'		=> 'zumedia_update_dominants',
					'icon'		=> 'admin-customizer',
					'color'		=> 'gold',
					'help'		=> 'Dominant Colors will be updated for all existing images'
										.' in Media Library if you press this button.',
					// the button will be visible only if this option is 'true'
					'depends'	=> 'dominant',
				],
				[
					'label'		=> __('Clean Invalid Media', 'zumedia'),
					'value'		=> 'zumedia_cleanup_media',
					'icon'		=> 'trash',
					'color'		=> 'red',
					'help'		=> 'Removes all files which are no longer referenced to attachment.'
										.' Not dangerous for the valid attachments... maybe.',
					'depends'	=> false,
				],
			],
		];
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

	protected function enqueue_more($is_frontend, $hook) {
		if($is_frontend) {
			// load Google recaptcha script if required
			$this->register_recaptcha();
return false;

		    if($this->check_option('client_validate')) {
				$this->enqueue_script('jquery.validate', null, ['jquery'], 'jquery-validate');
	// 	        wp_enqueue_script('jquery-validate', __ROOT__ . '/js/jquery.validate.min.js', ['jquery'], _VALIDATE_VERSION, true);
	// 	        wp_enqueue_script('cplus-validate');
		    }
		}
	}

}

// class CPLUS_Admin extends zuplus_Admin {
//
// 	public function validate_options($input) {
//
// 		$new_values = parent::validate_options($input);
// 		$new_values['notify'] = $this->validate_emails($input, 'notify'); 	// validate e-mails
// 		return $new_values;
// 	}
// }

// Entry Point ----------------------------------------------------------------]

function zucontact($file = null) {
	return zu_Contact::instance($file);
}