# Zu Contact: Contact Forms with Gutenberg

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/zu-contact?style=for-the-badge)](https://wordpress.org/plugins/zu-contact/)
[![WordPress Plugin: Tested WP Version](https://img.shields.io/wordpress/plugin/tested/zu-contact?color=4ab866&style=for-the-badge)](https://wordpress.org/plugins/zu-contact/)
[![WordPress Plugin Required PHP Version](https://img.shields.io/wordpress/plugin/required-php/zu-contact?color=bc2a8d&style=for-the-badge)](https://www.php.net/)
 [![License](https://img.shields.io/badge/license-GPL--2.0%2B-fcbf00.svg?style=for-the-badge)](https://github.com/picasso/zu-contact/blob/master/LICENSE)

 <!-- ![WordPress Plugin Downloads](https://img.shields.io/wordpress/plugin/dt/zu-contact?color=00aced&style=for-the-badge) -->

Simple but smart and modern Ajax contact form. With Form Blocks and Gutenberg based settings page.

[![Zu Contact, a simple but smart Ajax contact forms.](https://ps.w.org/zu-contact/assets/banner-1544x500.png)](https://github.com/picasso/zu-contact/)


## Description

Unfortunately WordPress does not come with built-in functionality for a simple contact form. Although, there are a bunch of plugins that allow you to create various forms of any configuration and complexity. But for me the problem with all these plugins is that they are too huge and functional. When the site needs only one simple (but convenient) feedback form, then a multifunctional monster is too much for me. That's why I wrote this plugin. And then, when Gutenberg appeared, I decided to rewrite the settings page using React components... it turned out very conveniently.

> &#x1F383; Of course, all that plugin has is its lightweight size and simple settings. No unnecessary flexibility and functionality. The simple must remain simple.

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
<!-- * GDPR Compliant -->

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


<!--
### Connect

-   [Download on WordPress.org](https://wordpress.org/plugins/zu-contact/)
-   [Follow on Twitter](https://twitter.com/??)
-   [Like me on Facebook](https://www.facebook.com/??/)
-->

### Download

+ [Zu Contact on WordPress.org](https://downloads.wordpress.org/plugin/zu-contact.zip)
+ [Zu Contact on GitHub](https://github.com/picasso/zu-contact/archive/master.zip)

## Installation

> &#x2757; Plugin only works under __WordPress 5.1__ or higher and __PHP 7.0__ or higher

1. Upload the `zu-contact` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin using the `Plugins` menu in your WordPress admin panel.
3. You can adjust the necessary settings using your WordPress admin panel in "Settings > Zu Contact".
4. Create a page or a post and insert the shortcode `[zu-contact]` or `[zu-booking]` into the text.

<!-- 1. You'll need to install the [Gutenberg](https://wordpress.org/plugins/gutenberg/) plugin if you are not running WordPress 5.0+
2. Download Zu Contact from the [WordPress plugin directory](https://wordpress.org/plugins/zu-contact/). -->

## Extensions

&#x2757; After creating blocks for the Gutenberg block editor, creating forms in PHP is no longer relevant and practically does not have any advantages over creating a form interactively using Gutenberg blocks. The only benefit I see right now is creating a form in PHP using the `__()` functions to access various translations of field labels and other attributes. Therefore, for now, I leave here a description for creating forms in PHP. In the future, I plan to modify this plugin to work with the [QTranslate-XT](https://github.com/qtranslate/qtranslate-xt) plugin, and then this section will completely lose its relevance.

----

Basically, adding new forms is not intended for the user. The simple must remain simple. But it is possible to create new forms using PHP. You just need to add a little code to your theme's `functions.php` file or any other `php` file that will be called on loading (you need to understand a little about how WordPress works).

First, you need to create an object of the `zu_ContactFields` class and set the form `name` and possibly some other parameters. Then add the required fields and finally register the form. After that, you can use the name of the new form in the shortcode:

```php
// check if plugin is activated
if(function_exists('zucontact')) {

    // available form options:
    // 'rows' - rows amount in textarea
    // 'carbon_copy' - if true then sends a 'copy' of the message to the submitter
    // 'prefix' - prefix which will be used for all CSS classes with this form
    $form = new zu_ContactFields('booking', ['carbon_copy' => true]);

    $form->add(
        // field id (could be any)
        'name',
        // field label
        __('Name', 'my-theme'),
        // field type
         'text',
         // if there is validation message - filed is required
         // field validation message (if empty)
         __('Please give your name.', 'my-theme'),
         // field placeholder
        __('Your Name', 'my-theme')
    );

    $form->add(
        // field id
        'email',
        // field label
        __('Email', 'my-theme'),
        // field type
        'email',
        // if there is validation message - filed is required
        // field validation message (array)
        //  [
        //      0 - if empty,
        //      1 - if non valid
        //  ]
        [
            __('Please give your email address.', 'my-theme'),
            __('Please enter a valid email address.', 'my-theme')
        ],
        // field placeholder
        __('Your Email Address', 'my-theme')
    );

    $form->add(
        // field id
        'phone',
        // field label
        __('Phone', 'my-theme'),
        // field type
         'tel',
         // if there is no validation message - filed is not required
         '',
         // field placeholder
        __('Your Phone Number eg. +49-541-754-3010', 'my-theme')
    );

    $form->add(
        // field id
        'places',
        // field label
        __('Places', 'my-theme'),
        // field type
         'number',
         __('Please give the amount of places to book for you.', 'my-theme'),
         // field placeholder
        __('How Many Places?', 'my-theme')
    );

    $form->add(
        // field id
        'message',
        // field label
        __('Message', 'my-theme'),
        // field type
        'textarea',
        '',
        // field placeholder
        __('Your Message', 'my-theme')
    );

    $form->add(
        // field id
        'submit',
        // field label
        __('Book', 'my-theme'),
        // field type
        'submit'
    );

    zucontact()->register_form($form);
}

```

Using the new form in `shortcode` is pretty simple:

`[zu-contact form="my-form"]`


## Support

Need help? This is a developer's portal for __Zu Contact__ and should not be used for general support and queries. Please visit the [support forum on WordPress.org](https://wordpress.org/support/plugin/zu-contact) for assistance.

## Screenshots

## [![Plugin Settings Page](https://ps.w.org/zu-contact/assets/screenshot-01.jpg)](https://github.com/picasso/zu-contact/)

## [![Google reCAPTCHA Settings Section](https://ps.w.org/zu-contact/assets/screenshot-02.jpg)](https://github.com/picasso/zu-contact/)

## [![Editing form fields in the Gutenberg block editor](https://ps.w.org/zu-contact/assets/screenshot-03.jpg?rev=2452727)](https://github.com/picasso/zu-contact/)

## [![Editing form attributes in the Gutenberg block editor](https://ps.w.org/zu-contact/assets/screenshot-04.jpg?rev=2452727)](https://github.com/picasso/zu-contact/)

## [![Contact Form Displaying](https://ps.w.org/zu-contact/assets/screenshot-05.jpg)](https://github.com/picasso/zu-contact/)

## [![Another Contact Form Displaying (Russian)](https://ps.w.org/zu-contact/assets/screenshot-06.jpg)](https://github.com/picasso/zu-contact/)
