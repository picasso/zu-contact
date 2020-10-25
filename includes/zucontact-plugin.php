<?php
// define('CPLUS_VALIDATE_VERSION', '1.11.0');

// Includes all traits --------------------------------------------------------]

include_once('zucontact-ajax.php');
include_once('zucontact-form.php');
include_once('zucontact-shortcode.php');

class zu_Contact extends zukit_Plugin {

	// Form helpers, shortcode, ajax & mailer
	use zu_ContactForm, zu_ContactShortcode, zu_ContactAjax;

	protected function construct_more() {
		// init static messages
		$this->setup_messages();
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

	public function init() {

		// Add all predefined forms -------------------------------------------]

		foreach(glob(dirname(__FILE__).'/forms/*.php') as $filename) {
			include_once($filename);
		}

		// Add info rows & debug actions --------------------------------------]

		add_filter('zukit_plugin_info', function() {
			$stats = ['folders' => 2, 'galleries' => 4];
			return [
				'folders' 		=> empty($stats) ? null : [
						'label'		=> __('Folders', 'zumedia'),
						'value'		=> $stats['folders'],
						'depends' 	=> 'folders',
				],
				'galleries' 	=> empty($stats) ? null : [
						'label'		=> __('Galleries', 'zumedia'),
						'value'		=> $stats['galleries'],
				],
			];
		});

		add_filter('zukit_debug_actions', function($debug_actions) {

			$debug_actions[] = [
					'label'		=> __('Fix Orphaned Attachments', 'zumedia'),
					'value'		=> 'zumedia_fix_orphaned',
					'icon'		=> 'hammer',
					'color'		=> 'blue',
			];
			$debug_actions[] = [
					'label'		=> __('Check Existed Terms', 'zumedia'),
					'value'		=> 'zumedia_check_terms',
					'icon'		=> 'warning',
					'color'		=> 'gold',
			];
			return $debug_actions;
		});

		// Some 'inits' from traits -------------------------------------------]

		$this->init_ajax();
		$this->init_shortcode();
	}

	// Custom menu position ---------------------------------------------------]

	protected function custom_admin_submenu() {

		return [
			'reorder'	=>	[
				[
					'menu'				=> 	'zucontact-settings',
					'after_index2'		=>	'zuplus-settings',
				],
			],
		];
	}

	// Script enqueue ---------------------------------------------------------]

	protected function js_data($is_frontend, $default_data) {
		return  $is_frontend ? $this->ajax_data() : array_merge($default_data, [
			'jsdata_name'	=> 'zucontact_settings',
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
		]);
	}

	protected function should_load_css($is_frontend, $hook) {
		return $is_frontend ? $this->is_option('custom_css') : false;
	}

	protected function should_load_js($is_frontend, $hook) {
	    return $is_frontend ? true : $this->ends_with_slug($hook);
	}

	// We don't want the enqueue frontend script always, only when shortcode is used
	protected function js_params($is_frontend) {
		return [
			'deps'			=> $is_frontend ? ['jquery'] : null, // parent::js_params(false)['deps']
			'register_only'	=> $is_frontend ? true : false,
		];
	}
	protected function css_params($is_frontend) {
		return [
			'register_only'	=> $is_frontend ? true : false,
		];
	}

	protected function enqueue_more($is_frontend, $hook) {
		return false;

		if($is_frontend) {

			//	load Google recaptcha script if required
			if($this->is_option('use_recaptcha')) {
				// if we use absolute path then $file should start with '!'
				$absolute_path = '!https://www.google.com/recaptcha/api.js?hl=' . get_locale();
		        // if we use absolute path then $file should start with '!'
		        $this->enqueue_script($absolute_path, null, null, $this->prefix_it('recaptcha2'));
			}

		    if($this->check_option('client_validate')) {
				$this->enqueue_script('jquery.validate', null, ['jquery'], 'jquery-validate');
	// 	        wp_enqueue_script('jquery-validate', __CPLUS_ROOT__ . '/js/jquery.validate.min.js', ['jquery'], CPLUS_VALIDATE_VERSION, true);
	// 	        wp_enqueue_script('cplus-validate');
		    }
		}
	}

}

class CPLUS_Admin extends zuplus_Admin {

	protected function options_defaults() {
		return [
			'use_recaptcha' 	=>	false,
			'client_validate'	=>	false,
			'custom_css'		=>	true,
			'me_or_us'			=>	false,		// if true - use 'Me' in subheading, otherwise 'Us'
			'notify'			=>	'',
		];
	}

	public function validate_options($input) {

		$new_values = parent::validate_options($input);
		$new_values['notify'] = $this->validate_emails($input, 'notify'); 	// validate e-mails
		return $new_values;
	}

	public function print_options($post) {

		$this->form->checkbox('use_recaptcha', 'Use Google Recaptcha', 'Loads Google <span>recaptcha</span> script if required.');
		$this->form->checkbox('client_validate', 'Client Validation', 'Add scripts for validation on client (without AJAX).');
		$this->form->checkbox('custom_css', 'Use Plugin CSS', 'If switched off the plugin stylesheet won\'t be loaded.');
		$this->form->checkbox('me_or_us', 'use "Me" instead of "Us"', 'If switched off - "Us" will be used in the form subheading.');
		$this->form->text('notify', 'Notify emails', 'List of emails to be notified when an entry occurs (comma separated).');

		echo $this->form->fields('Simple Ajax Contact Forms');
		echo $this->form->print_save_mobile();
	}
}

// Entry Point ----------------------------------------------------------------]

function zucontact($file = null) {
	return zu_Contact::instance($file);
}
