<?php
/*
Plugin Name: Zu Contact
Plugin URI: https://github.com/picasso/zu-contact
GitHub Plugin URI: https://github.com/picasso/zu-contact
Description: Simple but smart Ajax contact forms. With Gutenberg based settings page. 
Version: 0.9.7
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.com/about/
Text Domain: zu-contact
Domain Path: /lang/
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

// Start! ---------------------------------------------------------------------]

add_action('plugins_loaded', function() { 	//  All 'Zukit' classes are loaded now
	// _dbug_change_log_location(__FILE__, 2);
	// Check - maybe all parent classes were loaded in other plugin?
	if(!class_exists('zukit_Plugin')) require_once('zukit/zukit-plugin.php');

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);
});

//  All translations & forms loaded only after the theme
add_action('after_setup_theme', function() {

	// load translations

	load_child_theme_textdomain('zu-contact', plugin_dir_path(__FILE__) .'lang');

});
