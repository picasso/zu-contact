#### 1.1.5 / 2022-01-11

* tested for compatibility with WP 5.8.3
* moved `contact fields` classes to a separate folder
* moved traits files to a separate folder
* __Zukit__ updated to version 1.4.8
* fixed bug with `getColor` method
* removed `keepPlaceholderOnFocus` because the prop has been removed from `RichText` component
* fixed bug with `shortcode_atts_with_cast` snippet
* other small improvements

#### 1.1.3 / 2021-05-03

* __Zukit__ updated to version 1.2.2
* according to the changes in __Zukit__, rows in `Plugin Info` are now hidden through the value equal to null
* min `php` and `wp` versions updated
* replace `log_error` with `logc` method

#### 1.1.2 / 2021-04-13

* __Zukit__ updated to `1.2.0`
* adapted after changing the position of the divider
* adapted to the latest changes in Zukit
* improved CSS to be compatible with WP 5.6
* fixed bug that occurred when changing the field type
* new screenshots added
* changed default loader from `none` to 0
* README updated

#### 1.1.0 / 2021-01-08

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

#### 1.0.9 / 2021-01-06

* intermediate version for testing the latest changes

#### 1.0.8 / 2020-12-08

* added assets for WordPress.org

#### 1.0.6 / 2020-12-08

* all fields are sanitized before processing
* scroll in view before AJAX call
* __Zukit__ updated
* bug fixing and css improvements

#### 1.0.5 / 2020-12-06

* refactoring CSS to support different themes
* added `scroll in view` functionality
* used SVG files for icons
* added skip for `heartbeat` and `cron`
* some changes for wordpress.org
* small improvements

#### 1.0.4 / 2020-12-01

* implemented compatibility check (for PHP and WordPress)
* improved archive ignore options

#### 1.0.2 / 2020-11-29

* implemented `Test Mail` action
* refactoring `stats`
* refactoring test data usage
* added translations and appearance
* added plugin banner and screenshots
* added README
* bug fixing and css improvements

#### 1.0.0 / 2020-11-24

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

#### 0.9.9 / 2020-11-11

* refactoring front-end JS
* improved error message handling
* split `ajax` and `mailer` traits
* support of `ajax` shortcode param
* moving `css_prefix` to static property
* updated to use new `extend...` methods
* __Zukit__ updated
* adapted to latest changes in __Zukit__
* bug fixing and css improvements

#### 0.9.8 / 2020-10-28

* added admin JS to render settings page
* included `Zukit` framework
* renaming and refactoring before adapting to `Zukit`
* small improvements

#### 0.9.7 / 2020-10-24

* refactoring after adaptation for `Zukit` (not finished)

---

&#x274C;  __Attention!__ Breaking changes in version 0.9.7.

---

#### 0.9.3 / 2018-09-16

* all forms now are added to DB as comments

#### 0.9.1 / 2018-05-11

* bug fixing
* updated language dictionaries
* added `append_field()` method to `cplus_Form` class
* added `carbon_copy` attribute to `cplus_Form` class
* added `get_success_message()`method to `Contact_Plus` class
* processed `post_id` from posting page
* added `rows` attribute to shortcode
* added `me_or_us` option to select between predefined headings and messages
* improved  js error processing

#### 0.8.2 / 2018-05-11

* added `subheading` attribute
* added new fields types: `number`, `tel`, `url`
* improved  js error processing
* added support of `carbon-copy` attribute
* updated language dictionaries
* added `$rows_in_message` attribute for forms
* dynamically added classes with form margins
* css optimization

#### 0.7.6 / 2018-03-20

* added language dictionaries for `en` and `ru`
* bug fixing

#### 0.7.5 / 2018-03-20

* added _draft_ `booking` form
* added template for `booking` form
* submenu of settings moved in `ZU+` section

#### 0.7.4 / 2017-09-17

* adaptation to ZU+
* added support for list of emails to be notified
* bug fixing

#### 0.6.2 / 2017-09-12

* initial commit
* added support for [GitHub Updater](https://github.com/afragen/github-updater/)
