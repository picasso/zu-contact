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
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

// Start! ---------------------------------------------------------------------]

require_once('zukit/load.php');

// compatibility check for Zukit
if(Zukit::is_compatible(__FILE__)) {

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);
}
