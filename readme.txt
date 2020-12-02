=== Zu Contact ===
Contributors: ***REMOVED***
Tags: contact, contact form, feedback, feedback form, email, gutenberg, ajax
Requires at least: 5.1
Tested up to: 5.4
Stable tag: 1.0.4
License: GPLv2 or later
Requires PHP: 7.0

Simple but smart Ajax contact forms. With Gutenberg based settings page.

== Description ==

The plugin allows you to add a feedback form or booking form to the page. The data is sent to the server via AJAX (this can be disabled using the settings and the form will be submitted as usual). To a certain extent, you can personalize the form and its fields. The form is added to the page using the shortcode `[zu-contact]` or `[zu-booking]`.

### Features

* Lightweight `JS script` & `CSS`
* Adding a contact form to any post or page using a shortcode
* Form submission via AJAX (*configurable by settings*)
* Data validation on the server
* Support for required fields
* Responsive layout
* Notification of submissions to default admin or custom email addresses
* Send a `carbon copy` of the submitted message (*configurable by settings*)
* Basic `SMTP` (*Simple Mail Transfer Protocol*) configuration
* Protect submissions from spam with Google `reCAPTCHA` (*configurable by settings*)
* Automatically checks all submissions against global database of spam (with [Akismet](https://wordpress.org/plugins/akismet/))
* Save messages to the database as comments to a post or page
* Compatible with the latest version of WordPress

### Shortcode attributes

You can also personalize the form by adding attributes to the shortcode:

* __class__ - Change CSS class of form: `class="my-contact-form"`
* __form__ - Select one of preloaded forms: `form="contact"`
* __subheading__ - Change form subheading: `subheading="My Contact Form"`
* __ajax__ - Disable form submission via AJAX: `ajax=false`
* __recaptcha__ - Disable Google reCAPTCHA widget: `recaptcha=false`
* __rows__ - Change rows amount in textarea: `rows=12`
* __message__ - Set predefined form message: `message="Thanks for your hard work!"`

#### Examples

* With custom subheading and without reCAPTCHA:

`[zu-contact subheading="My Contact Form" recaptcha=false]`

* With custom class, without AJAX and with 8 rows in textarea:

`[zu-contact class="my-contact-form" ajax=false rows=8]`

== Installation ==

Plugin only works under __WordPress 5.1__ or higher and __PHP 7.0__ or higher

1. Upload the `zu-contact` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin using the `Plugins` menu in your WordPress admin panel.
3. You can adjust the necessary settings using your WordPress admin panel in "Zu Contact" settings.
4. Create a page or a post and insert the shortcode `[zu-contact]` or `[zu-booking]` into the text.

== Screenshots ==

1. Plugin Settings Page
2. Google reCAPTCHA Settings Section
3. Contact Form displaying
4. Booking Form displaying

== Changelog ==

### 1.0.4 ###
* implemented compatibility check (for PHP and WordPress)
* improved archive ignore options

### 1.0.2 ###
* implemented `Test Mail` action
* refactoring `stats`
* refactoring test data usage
* added translations and appearance
* added plugin banner and screenshots
* added README
* bug fixing and css improvements

### 1.0.0 ###
* adapted to `shortcode_atts_with_cast` snippet
* added support for Google `reCAPTCHA`
* added `ZucontactRecaptcha` panel to manage `reCAPTCHA Settings`
* added `ZucontactMailer` panel to manage `Mail Server Settings`
* added support for SMTP error processing
* added `Debug SMTP mailer` option
* refactoring error processing
* __Zukit__ updated
* improved contact form messages
* added `zucontact` admin css
* cleaning and bug fixing

### 0.9.9 ###
* refactoring front-end JS
* improved error message handling
* split `ajax` and `mailer` traits
* support of `ajax` shortcode param
* moving `css_prefix` to static property
* updated to use new `extend...` methods
* __Zukit__ updated
* adapted to latest changes in __Zukit__
* bug fixing and css improvements

### 0.9.8 ###
* added admin JS to render settings page
* included `Zukit` framework
* renaming and refactoring before adapting to `Zukit`
* small improvements

### 0.9.7 ###
* refactoring after adaptation for `Zukit` (not finished)

---
__Attention!__ Breaking changes in version 0.9.7.
---

### 0.9.3 ###
* all forms now are added to DB as comments

### 0.9.1 ###
* bug fixing
* updated language dictionaries
* added `append_field()` method to `cplus_Form` class
* added `carbon_copy` attribute to `cplus_Form` class
* added `get_success_message()`method to `Contact_Plus` class
* processed `post_id` from posting page
* added `rows` attribute to shortcode
* added `me_or_us` option to select between predefined headings and messages
* improved  js error processing

### 0.8.2 ###
* added `subheading` attribute
* added new fields types: `number`, `tel`, `url`
* improved  js error processing
* added support of `carbon-copy` attribute
* updated language dictionaries
* added `$rows_in_message` attribute for forms
* dynamically added classes with form margins
* css optimization

### 0.7.6 ###
* added language dictionaries for `en` and `ru`
* bug fixing

### 0.7.5 ###
* added _draft_ `booking` form
* added template for `booking` form
* submenu of settings moved in `ZU+` section

### 0.7.4 ###
* adaptation to ZU+
* added support for list of emails to be notified
* bug fixing
