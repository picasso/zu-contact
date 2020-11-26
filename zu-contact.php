<?php
/*
Plugin Name: Zu Contact
Plugin URI: https://github.com/picasso/zu-contact
GitHub Plugin URI: https://github.com/picasso/zu-contact
Description: Simple but smart Ajax contact forms. With Gutenberg based settings page.
Version: 1.0.1
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.com/about/
Text Domain: zu-contact
Domain Path: /lang/
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

// Start! ---------------------------------------------------------------------]

add_action('plugins_loaded', function() { 	//  All 'Zukit' classes are loaded now
	// Check - maybe all parent classes were loaded in other plugin?
	if(!class_exists('zukit_Plugin')) require_once('zukit/zukit-plugin.php');

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);
});
