<?php
/*
Plugin Name: Zu Contact
Plugin URI: https://github.com/picasso/zu-contact
Description: Simple but smart Ajax contact forms. With Gutenberg based settings page.
Version: 1.0.11
Author: Dmitry Rudakov
Author URI: https://dmitryrudakov.com/about/
Text Domain: zu-contact
Domain Path: /lang/
Requires at least: 5.1.0
Requires PHP: 7.0.0
*/

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');
// Exit early if a WordPress heartbeat comes
if(wp_doing_ajax() && isset($_POST['action']) && ($_POST['action'] === 'heartbeat')) return;
// Let's not load plugin during cron events
if(wp_doing_cron()) return;

// Start! ---------------------------------------------------------------------]

// add_action('plugins_loaded', function() { 	// DEBUG: only

require_once('zukit/load.php');

// compatibility check for Zukit
if(Zukit::is_compatible(__FILE__)) {

	require_once('includes/zucontact-plugin.php');
	zucontact(__FILE__);

}

// });
