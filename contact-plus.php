<?php
/*
Plugin Name: Contact Plus
Plugin URI: https://***REMOVED***.ru/plugins/
GitHub Plugin URI: https://github.com/picasso/contact-plus
Description: Simple Ajax Contact Forms
Version: 0.9.2
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.ru/about/
Text Domain: contact-plus
Domain Path: /lang/
*/

// Prohibit direct script loading
defined( 'ABSPATH' ) || die( 'No direct script access allowed!' );
define('CPLUS_VERSION', '0.9.2');
define('CPLUS_NAME', 'Contact Plus');
define('CPLUS_MENU', 'Contact+');
define('__CPLUS_ROOT__', plugin_dir_path(__FILE__)); 
define('__CPLUS_FILE__', __FILE__); 

define('__CPLUS_LOG__', false);					// set to TRUE to change log location 

// Helpers --------------------------------------------------------------------]

function cplus_get_my_dir() {
	return untrailingslashit(__CPLUS_ROOT__);
}

function cplus_get_my_url() {
	return untrailingslashit(plugin_dir_url(__FILE__));
}

// Start! --------------------------------------------------------------------]

add_action('zuplus_loaded', function() { 	//  All ZU+ classes are loaded now
	
	if(__CPLUS_LOG__) _dbug_change_log_location(__FILE__, 2);
	
	require_once(__CPLUS_ROOT__ . 'includes/cplus-loaded.php');
	cplus_instance();
});

add_action('after_setup_theme', function() { 	//  All translations & forms loaded only after the theme

	// load translations
	
	load_child_theme_textdomain('contact-plus', cplus_get_my_dir() .'/lang');
	
	// register all available forms
	
	cplus_register_default_form();
	cplus_register_booking_form();
});
	
