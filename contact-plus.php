<?php
/*
Plugin Name: Contact Plus
Plugin URI: https://***REMOVED***.ru/plugins/
GitHub Plugin URI: https://github.com/picasso/contact-plus
Description: Simple Ajax Contact Form
Version: 0.6.2
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.ru/about/
Text Domain: contact-plus
Domain Path: /lang
*/

// Prohibit direct script loading
defined( 'ABSPATH' ) || die( 'No direct script access allowed!' );
define('CPLUS_VERSION', '0.6.2');
define('CPLUS_NAME', 'Contact Plus');
define('__CPLUS_ROOT__', plugin_dir_path(__FILE__)); 

// _dbug_change_log_location(__FILE__, 2);

class Contact_Plus {

	private $cplus_form = '';
	private $cplus_nonce = 'cplus_ajax_nonce';
	
	private $defaults = [];
	private $forms = [];

	private static $_cplus_instance;
	public static function instance() {
		if(!isset(self::$_cplus_instance)) {
			$class_name = __CLASS__;
			self::$_cplus_instance = new $class_name;
		}
		return self::$_cplus_instance;
	}

	function __construct() {
		
		add_action('init', array($this, 'init'));

		if(is_admin()) {
// 			add_action('admin_enqueue_scripts', array($this, 'enqueue'), 10, 1);
// 			add_filter('attachment_fields_to_edit', array($this, 'attachment_fields_edit'), 10, 2);
		}
	}

	public function defaults() {
		
		if(empty($this->defaults)) {
			$defaults = [
				'ajaxurl'                => admin_url('admin-ajax.php'),
				'cplus_nonce'     	=> $this->ajax_nonce(),
				'cplus_form'			=> $this->cplus_form
			];
		
			$this->defaults = $defaults;
		}
		
		return $this->defaults;
	}
	
	public function ajax_nonce($create = 'true') { 
		return $create ? wp_create_nonce($this->cplus_nonce) : $this->cplus_nonce; 
	}

	public function get_value($key) {
			return isset($this->defaults[$key]) ? $this->defaults[$key] : [];
	}

	public function init() {

		$this->defaults();

		add_action('wp_ajax_cplus-submit', array($this, 'ajax_submit'));
		add_action('wp_ajax_nopriv_cplus-submit', array($this, 'ajax_submit'));

        add_filter('cplus_spam_filter', array($this, 'spam_filter'));
		add_action('phpmailer_init', array($this, 'php_mailer'));

		add_shortcode('contact-form', 'cplus_shortcode');
		add_shortcode('cplus-contact-form', 'cplus_shortcode');
	}

	public function ready() {
		
		$this->enqueue();

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
*/

	}

	public function enqueue() {

		zu()->add_style_from_file(__CPLUS_ROOT__ . 'css/contact-plus.css');
		
		wp_enqueue_script('contact-plus', plugins_url('js/contact-plus.min.js', __FILE__), array('jquery'), CPLUS_VERSION, true);
		wp_localize_script('contact-plus', 'cplus_custom', $this->defaults());
	}

	public function contact_form($form, $contact, $message) {
		
		return cplus_get_repeater_output($form, $contact, $message);
	}

	public function ajax_submit() {
		
	    $contact = new cplus_Contact;

	    $result['sent'] = false;
	    $result['is_valid'] = $contact->is_valid();
	    
	    if($result['is_valid']) $result['sent'] = $contact->send_mail();
	    
	    $result['errors'] = $contact->errors;
	    
	    $was_error = empty($contact->errors) && $result['sent'] ? false : true;
	    
	    $result['message'] = cplus_form_message($was_error);

	    if($was_error) wp_send_json_error($result);
		else wp_send_json_success($result);
	}

	public function register_form($form) {
		
		if($form instanceof cplus_Form) {

			if(empty($this->cplus_form)) $this->cplus_form = $form->name;		// first added form will be default
			
			$this->forms[$form->name] = $form;
			return true;
		
		} else return false;
	}

	public function get_form($form_name = '') {
		$form_name = empty($form_name) ? $this->cplus_form : $form_name;
		return isset($this->forms[$form_name]) ? $this->forms[$form_name] : false;
	}
	
   //
   // This is all we need to do to weed out the spam.
   //  If Akismet plugin is enabled then it will be hooked into these filters.
   //
    public function spam_filter($contact) {
        
        $comment_data = apply_filters('preprocess_comment', [
            'comment_post_ID' => $contact->post_id,
            'comment_author' => $contact->name,
            'comment_author_email' => $contact->email,
            'comment_content' => $contact->message,
            'comment_type' => 'contact-plus',
            'comment_author_url' => '',
        ]);

        $contact->spam = false;

        //If it is spam then log as a comment
        if(isset($comment_data['akismet_result']) && $comment_data['akismet_result'] === 'true') {
			$comment_data['comment_approved'] = 'spam';
			wp_insert_comment($comment_data);
			$contact->spam = true;
        } 
        
        return $contact;
    }    

/*
    function RegisterScripts() {
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

    }
*/

	public function php_mailer($phpmailer) {
/*
	    $phpmailer->isSMTP();     
	    $phpmailer->Host = 'smtp.example.com';
	    $phpmailer->SMTPAuth = true; // Force it to use Username and Password to authenticate
	    $phpmailer->Port = 25;
	    $phpmailer->Username = 'yourusername';
	    $phpmailer->Password = 'yourpassword';
*/
	
	    // Additional settings…
	    //$phpmailer->SMTPSecure = "tls"; // Choose SSL or TLS, if necessary for your server
	    //$phpmailer->From = "you@yourdomail.com";
	    //$phpmailer->FromName = "Your Name";

/*
		add_action( 'phpmailer_init', 'my_phpmailer_init' );
		function my_phpmailer_init( PHPMailer $phpmailer ) {
		    $phpmailer->Host = 'smtp.yourSMTPhost.net';
		    $phpmailer->Port = 465; // could be different
		    $phpmailer->Username = 'YOURUSERNAME'; // if required
		    $phpmailer->Password = 'YOURPASSWORD'; // if required
		    $phpmailer->SMTPAuth = true; // if required
		    $phpmailer->SMTPSecure = 'ssl'; // enable if required, 'tls' is another possible value
		    $phpmailer->IsSMTP();
		}
*/
	}

	private function email_recipients() { 
		return '';
	}

	public function send_contact($contact_email, $content) {

		return cplus_mailer($contact_email, $this->email_recipients(), $content);
	}
}

//
// Activation & Deactivation Hook  --------------------------------------------]
//
register_activation_hook(__FILE__, function() {

	if(!version_compare(PHP_VERSION, '7.0.0', '>=')) {
		add_action('update_option_active_plugins', function() { deactivate_plugins(plugin_basename(__FILE__));});
		wp_die(sprintf('%1$s required PHP at least 7.0. %1$s was deactivated. <a href="%2$s">Go Back</a>', CPLUS_NAME, admin_url()));
	}

	if(!get_option('cplus_options')) {
// 		add_option('cplus_options', array('interval' => 3600, 'files' => '', 'delete' => 1, 'keyword' => 'automator', 'debug' => 0, 'full' => 0, 'previous_month' => 0));
	}
// 	if(!get_option('cplus_revisions')) add_option('cplus_revisions', array());
// 	if(!get_option('cplus_lastconverted')) add_option('cplus_lastconverted', 'unknown');
	
});
register_deactivation_hook(__FILE__, function() {
/*
	delete_option('cplus_options');
	delete_option('cplus_revisions');
	delete_option('cplus_lastconverted');
*/
});

function cplus_instance() { 
	return Contact_Plus::instance(); 
}
function cplus_get_form($name = '') { return cplus_instance()->get_form($name); }

require_once(__CPLUS_ROOT__ . 'includes/cplus-functions.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-contact.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-form-default.php');
require_once(__CPLUS_ROOT__ . 'includes/cplus-loader.php');


add_action('plugins_loaded', function() { 
	cplus_instance();
	cplus_register_default_form();
});
