=== Zu Contact ===
Contributors: dmitryrudakov
Tags: gutenberg, ajax, contact form, feedback, email, feedback form, contact
Requires at least: 5.3.0
Tested up to: 5.8.3
Stable tag: 1.1.5
License: GPLv2 or later
Requires PHP: 7.2.0

Simple but smart and modern Ajax contact form. With Form Blocks and Gutenberg based settings page.

== Description ==

The plugin allows you to add a feedback form or booking form to the page. The data is sent to the server via AJAX (*this can be disabled using the settings and the form will be submitted as usual, with a page reload... but why do you need it?*). You can flexibly personalize the form and its fields.

The form is added to a page using the __Gutenberg Custom Blocks__ - with these blocks, the possibilities for customizing your form are greatly increased.

You can also add a form to a page using the shortcode `[zu-contact]` or `[zu-booking]`.

### Features

* Lightweight `JS script` & `CSS` (only __4 KB__ minified and gzipped)
* Includes form blocks for the new __Gutenberg__ WordPress block editor
* Also supports adding a contact form to any post or page using a shortcode
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

### Gutenberg blocks

With custom blocks for Gutenberg WordPress editor you can easily create new contact forms and customize them with great flexibility:

* You can create a form based on templates or from scratch
* Add and remove form fields
* Change the position of fields, their type and other attributes
* Change field labels, placeholders and validation error messages
* Add to verification form using Google `reCAPTCHA`
* Change the animation of the form loader (used during form submission)

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

1. Upload the `zu-contact` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin using the `Plugins` menu in your WordPress admin panel.
3. You can adjust the necessary settings using your WordPress admin panel in "Settings > Zu Contact".
4. Create a page or a post and insert the shortcode `[zu-contact]` or `[zu-booking]` into the text.

== Screenshots ==

1. Plugin Settings Page
2. Google reCAPTCHA Settings Section
3. Editing form fields in the Gutenberg block editor
4. Editing form attributes in the Gutenberg block editor
5. Contact Form Displaying
6. Another Contact Form Displaying (Russian)

== Changelog ==

### 1.1.5 ###
* tested for compatibility with WP 5.8.3
* moved `contact fields` classes to a separate folder
* moved traits files to a separate folder
* __Zukit__ updated to version 1.4.8
* fixed bug with `getColor` method
* removed `keepPlaceholderOnFocus` because the prop has been removed from `RichText` component
* fixed bug with `shortcode_atts_with_cast` snippet
* other small improvements

### 1.1.3 ###
* __Zukit__ updated to version 1.2.2
* according to the changes in __Zukit__, rows in `Plugin Info` are now hidden through the value equal to null
* min `php` and `wp` versions updated
* replace `log_error` with `logc` method

### 1.1.2 ###
* __Zukit__ updated to `1.2.0`
* adapted after changing the position of the divider
* adapted to the latest changes in Zukit
* improved CSS to be compatible with WP 5.6
* fixed bug that occurred when changing the field type
* new screenshots added
* changed default loader from `none` to 0
* README updated

### 1.1.0 ###
* added `zu_ContactFieldDefaults` class to keep all default values for templates
* added new forms based on default field values
* created `zu/form` and `zu/field` Сustom Blocks
* added `reCAPTCHA` support and created `zu/recaptcha` Custom Block
* added store to support Ajax created forms
* added form `Loader`
* added focus control for editing components
* added concept of `dirty` forms to avoid unnecessary updates
* added examples to all Custom Blocks
* fixed bug with `default` template
* fixed bug which occurs after `recaptcha` expired
* moved error messages to `jsdata` (more language independent)
* __Zukit__ updated
* updated SVG for icons
* improved front-end JS and CSS
* many other small improvements

### 1.0.9 ###
* intermediate version for testing the latest changes

### 1.0.8 ###
* added assets for WordPress.org

### 1.0.6 ###
* all fields are sanitized before processing
* scroll in view before AJAX call
* __Zukit__ updated
* bug fixing and css improvements

### 1.0.5 ###
* refactoring CSS to support different themes
* added `scroll in view` functionality
* used SVG files for icons
* added skip for `heartbeat` and `cron`
* some changes for wordpress.org
* small improvements

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

