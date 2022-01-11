<?php
/*
Plugin Name: Zu Contact
Plugin URI: https://wordpress.org/plugins/zu-contact/
GitHub Plugin URI: https://github.com/picasso/zu-contact
Description: Simple but smart and modern Ajax contact form. With Form Blocks and Gutenberg based settings page.
Version: 1.1.5
Author: Dmitry Rudakov
Author URI: https://dmitryrudakov.com/about/
Text Domain: zu-contact
Domain Path: /lang/
Requires at least: 5.3.0
Requires PHP: 7.2.0
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

// DEBUG-ONLY
// add_action('plugins_loaded', function() {

// Always load Zukit even if we don't use it later ('wp_doing_ajax' or 'wp_doing_cron')
// as other plugins or themes may want to use it
require_once('zukit/load.php');

// Exit early if a WordPress heartbeat comes
if(wp_doing_ajax() && isset($_POST['action']) && ($_POST['action'] === 'heartbeat')) return;
// Let's not load plugin during cron events
if(wp_doing_cron()) return;

// Start! ---------------------------------------------------------------------]

// compatibility check for Zukit
if(Zukit::is_compatible(__FILE__)) {

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);
}

// DEBUG-ONLY
// });
