<?php
//
// This file loaded only when all parent classes are loaded from plugin
//	
class Contact_Plus extends zuplus_Plugin {

	private $default_form = null;
	private $forms = [];

	protected function extend_config() {
		return  [
			'prefix'					=> 	'cplus',
			'admin'					=> 	'CPLUS_Admin',
			'plugin_file'			=> 	__CPLUS_FILE__,
			'plugin_name'		=>	CPLUS_NAME,
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

/*
	//load google recaptcha script if required
	if($contact->is_recaptcha()) {
		wp_enqueue_script('csf-recaptcha2');
	}
  
    //here we need some jquery scripts and styles, so load them here
    if ( cplus_PluginSettings::UseClientValidation() == true) {
        wp_enqueue_script('jquery-validate');
        wp_enqueue_script('cplus-validate');
    }

    //only load the stylesheet if required
    if ( cplus_PluginSettings::LoadStyleSheet() == true)
         wp_enqueue_style('cplus-bootstrap');
         
        wp_register_script('jquery-validate', CSCF_PLUGIN_URL . '/js/jquery.validate.min.js', array(
            'jquery'
        ) , '1.11.0', true);
        
        wp_register_script( 'cscf-validate', CSCF_PLUGIN_URL . "/js/jquery.validate.contact.form.js", 
            'jquery', 
            CSCF_VERSION_NUM, true );
        
        wp_localize_script( 'cscf-validate', 'cscfvars', 
            array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );

 	    wp_register_script( 'csf-recaptcha2',
		    'https://www.google.com/recaptcha/api.js?hl=' . get_locale(), null, null, true );
         
*/

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
		return '';
	}
}

class CPLUS_Admin extends zuplus_Admin {
	
	//
	// Should/Could be Redefined in Child Class ----------------------------------]
	//

	protected function options_defaults() { 
		return [
			'use_recaptcha' 	=>	false,
			'client_validate'		=>	false,
			'custom_css'			=>	true,
		]; 
	}
	protected function should_enqueue_css() {
		return false;
	}

	protected function should_enqueue_js() {
		return false;
	}

	public function status_callback() {
		return ''; //sprintf('<p>xx: <span>%1$s</span></p><p>xxx: <span>%2$s</span></p>', 1, 2);		
	}
	
	public function print_options($post) {

		$this->form->checkbox('use_recaptcha', 'Use Google Recaptcha', 'Load Google <span>recaptcha</span> script if required.');
		$this->form->checkbox('client_validate', 'Client Validation', '');
		$this->form->checkbox('custom_css', 'Use Plugin CSS', 'If switched off the plugin stylesheet won\'t be loaded.');		
	
		echo $this->form->fields('Simple Ajax Contact Form');
		echo $this->form->print_save_mobile();
	}
}

// Additional Files -----------------------------------------------------------]

require_once(__CPLUS_ROOT__ . 'includes/cplus-functions.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-contact.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form-default.php');

// Helpers --------------------------------------------------------------------]

function cplus_instance() { 
	return Contact_Plus::instance(); 
}

function cplus_options() {
	return cplus_instance()->options();
}

function cplus_get_form($name = '') { return cplus_instance()->get_form($name); }

