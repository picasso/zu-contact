<?php
/*
Plugin Name: Contact Plus
Plugin URI: https://***REMOVED***.ru/plugins/
GitHub Plugin URI: https://github.com/picasso/contact-plus
Description: Simple Ajax Contact Form
Version: 0.7.4
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.ru/about/
Text Domain: contact-plus
Domain Path: /lang/
*/

// Prohibit direct script loading
defined( 'ABSPATH' ) || die( 'No direct script access allowed!' );
define('CPLUS_VERSION', '0.7.4');
define('CPLUS_NAME', 'Contact Plus');
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
	cplus_register_default_form();
});
