<?php
/*
Plugin Name: Zu Contact
Plugin URI: https://github.com/picasso/zu-contact
GitHub Plugin URI: https://github.com/picasso/zu-contact
Description: Simple but smart Ajax contact forms. With Gutenberg based settings page.
Version: 1.0.4
Author: Dmitry Rudakov
Author URI: https://***REMOVED***.com/about/
Text Domain: zu-contact
Domain Path: /lang/
Requires at least: 5.1.0
Requires PHP: 7.0.0
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

// Start! ---------------------------------------------------------------------]

require_once('zukit/load.php');

// compatibility check for Zukit
if(Zukit::is_compatible(__FILE__)) {
// add_action('plugins_loaded', function() { 	// DEBUG: only

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);
// });
}
