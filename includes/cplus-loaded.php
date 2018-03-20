<?php
//
// This file loaded only when all parent classes are loaded from plugin
//	
define('CPLUS_VALIDATE_VERSION', '1.11.0');

class Contact_Plus extends zuplus_Plugin {

	private $default_form = null;
	private $forms = [];

	protected function extend_config() {
		return  [
			'prefix'					=> 	'cplus',
			'admin'					=> 	'CPLUS_Admin',
			'plugin_file'			=> 	__CPLUS_FILE__,
			'plugin_name'		=>	CPLUS_NAME,
			'menu'					=>	CPLUS_MENU,
			'version'				=> 	CPLUS_VERSION,
			'options_nosave'	=>	[],
		];
	}
	
	protected function extend_defaults() {
		return [
			'cplus_form'	=> $this->default_form,
		];
	}

	public function init() {

		$this->defaults();

		add_action('wp_ajax_cplus-submit', 'cplus_ajax_submit');
		add_action('wp_ajax_nopriv_cplus-submit', 'cplus_ajax_submit');

        add_filter('cplus_spam_filter', 'cplus_spam_filter');
		add_action('phpmailer_init', 'cplus_php_mailer');

		add_shortcode('contact-form', 'cplus_shortcode');
		add_shortcode('cplus-contact-form', 'cplus_shortcode');
	}

	public function should_load_css() {
		return $this->check_option('custom_css');
	}

	public function frontend_enqueue() {
		
		parent::frontend_enqueue();
		
		if($this->check_option('use_recaptcha')) {		//	load Google recaptcha script if required
			
// 	 	    wp_enqueue_script($this->prefix.'-recaptcha2', 'https://www.google.com/recaptcha/api.js?hl=' . get_locale(), null, null, true);
		}
  
	    if($this->check_option('client_validate')) {
	
// 	        wp_enqueue_script('jquery-validate', __CPLUS_ROOT__ . '/js/jquery.validate.min.js', ['jquery'], CPLUS_VALIDATE_VERSION, true);
// 	        wp_enqueue_script('cplus-validate');
	    }
	}

	public function register_form($form) {
		
		if($form instanceof cplus_Form) {

			if(empty($this->default_form)) $this->default_form = $form->name;		// first added form will be default
			
			$this->forms[$form->name] = $form;
			return true;
		
		} else return false;
	}

	public function get_form($form_name = '') {
		$form_name = empty($form_name) ? $this->default_form : $form_name;
		return isset($this->forms[$form_name]) ? $this->forms[$form_name] : false;
	}
	
	public function email_recipients() { 
		return $this->option_value('notify');
	}
}

class CPLUS_Admin extends zuplus_Admin {
	
	//
	// Should/Could be Redefined in Child Class ----------------------------------]
	//
	
	// 	To modify menu and submenu you should pass array with optional keys  ['reorder', 'rename', 'remove', 'separator']
	//		If presented key should array of array with the following keys
	//		'menu'					- item-slug
	//		'new_index'			- new item position
	//		'after_index'			- item position will be after item with this slug
	//		'after_index2'		- item position will be after item with this slug + 1 (the space could be used for separator later)
	//		'before_index'		- item position will be before item with this slug
	//		'before_index2'		- item position will be before item with this slug - 1 (the space could be used for separator later)
	//		'new_name'			- new item name
	//		'parent'					- parent menu slug (if absent then  'options-general.php' will be used)

	protected function custom_admin_submenu() {
		return [
			'reorder'	=>	[
				[
					'menu'					=> 	'cplus-settings',
					'after_index2'		=>	'zuplus-settings',
				],
			],
		];
	}

	protected function options_defaults() { 
		return [
			'use_recaptcha' 	=>	false,
			'client_validate'		=>	false,
			'custom_css'			=>	true,
			'notify'					=>	'',
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
		$this->form->text('notify', 'Notify emails', 'List of emails to be notified when an entry occurs (comma separated).');		
	
		echo $this->form->fields('Simple Ajax Contact Forms');
		echo $this->form->print_save_mobile();
	}
}

// Additional Classes & Functions ---------------------------------------------]

require_once(__CPLUS_ROOT__ . 'includes/cplus-functions.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-contact.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form-default.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form-booking.php');

// Helpers --------------------------------------------------------------------]

function cplus_instance() { 
	return Contact_Plus::instance(); 
}

function cplus_options() {
	return cplus_instance()->options();
}

function cplus_get_form($name = '') { return cplus_instance()->get_form($name); }

function cplus_use_recaptcha() {
	return cplus_instance()->check_option('use_recaptcha');
}