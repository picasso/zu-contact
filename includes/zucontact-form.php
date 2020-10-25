<?php
require_once('fields.php');

// Form helpers ---------------------------------------------------------------]

trait zu_ContactForm {

    private $default_name = null;
	private $forms = [];

    private static $error_message = null;
    private static $success_messages = null;
    private static $subheading_us = null;
    private static $subheading_me = null;
    private static $subheading_form = null;

    private function setup_messages() {
        if(empty(self::$error_message)) {

            self::$error_message = __('There was a problem with your submission. Errors have been highlighted below.', 'zu-contact');

            self::$success_messages = [
        		'default'			=> 	__('Your Request Has Been Sent', 'zu-contact'),
        		'contact'			=> 	__('Success! Your message was sent.', 'zu-contact'),
        		'booking'			=>	__('Your Booking Request Has Been Sent', 'zu-contact'),
        		'subscribe'			=>	[
        			__('You Are Now subscribed to Our Newsletter', 'zu-contact'),
        			__('You Are Now subscribed to My Newsletter', 'zu-contact')
        		],
        	];

            self::$subheading_us = [
                'contact'			=> 	__('Contact Us', 'zu-contact'),
                'write'				=> 	__('Write Us', 'zu-contact'),
                'book'				=>	__('Book Your Place', 'zu-contact'),
                'subscribe'			=>	__('Subscribe to Our Newsletter', 'zu-contact'),
            ];

            self::$subheading_me = [
                'contact'			=> 	__('Contact Me', 'zu-contact'),
                'write'				=> 	__('Write To Me', 'zu-contact'),
                'book'				=>	__('Book Your Place', 'zu-contact'),
                'subscribe'			=>	__('Subscribe to My Newsletter', 'zu-contact'),
            ];

            self::$subheading_form = [
                'default'			=> 	'write',
                'contact'			=> 	'contact',
                'booking'			=>	'book',
            ];
        }
	}

    public function register_form($form) {

		if($form instanceof zu_ContactFields) {

            // first added form will be default
			if(empty($this->default_name)) $this->default_name = $form->name;

			if($form->carbon_copy) $form->insert_at(-1, 'carbon-copy', __('Send me a copy', 'zu-contact'), 'checkbox');
			else $form->remove('carbon-copy');

			$this->forms[$form->name] = $form;
			return true;

		} else return false;
	}

	public function get_form($form_name = null) {
		$form_name = empty($form_name) || $form_name === 'default' ? $this->default_name : $form_name;
		return $this->forms[$form_name] ?? false;
	}

    public function available_forms() {
        return array_keys($this->forms);
    }

	public function recipients() {
		return $this->option_value('notify');
	}

    // private function container($classes, $values, $errors, $name) {
    //
    //     $was_sent = isset($values['was_sent']) ? $values['was_sent'] : false;
    //     $was_error = empty($errors) ? false : true;
    //     $icon_error = function_exists('zu_get_icon_cancel') ? zu_get_icon_cancel() : '';
    //     $icon_ok = function_exists('zu_get_icon_contacts') ? zu_get_icon_contacts() : '';
    //     $subheading = isset($values['subheading']) ? sprintf('<h2 class="cplus-subheading before_posting">%s</h2>', $values['subheading']) : '';
    //
    //     return sprintf(
    //         '<div id="cplus" class="%1$s">%4$s%7$s<div class="cplus-status%2$s">
    //             <span class="icon-ok">%5$s</span>
    //             <span class="icon-error">%6$s</span>
    //             <span class="message" data-errmsg="%8$s">%3$s</span>
    //         </div>',
    //             zu()->merge_classes([$classes, 'cplus-container', ($was_error || $was_sent) ? 'cplus-processed': '' ]),
    //             ($was_error || $was_sent) ? ($was_error ? ' not-sent' : ' sent') : '',
    //             cplus_form_message($was_error, $name),
    //             zu()->loader(1, 0.8),
    //             $icon_ok,
    //             $icon_error,
    //             $subheading	,
    //             $this->form_message(true, $name)
    //     );
    // }

    public function sprint_form($name, $values, $errors, $message = null, $classes = '') {

        $form = $this->get_form($name);
        if($form === false) return '';

        // Format container output
        $css_prefix = $form->css_prefix;
        $was_sent = $values['_was_sent'] ?? false;
        $was_error = !empty($errors);

        $subheading = empty($values['_subheading']) ? '' : sprintf(
            '<h2 class="%2$s-subheading before_posting">%1$s</h2>',
            $this->subheading($values['_subheading'], $name),
            $css_prefix
        );

        $output = zu_sprintf(
            '<div id="%9$s-%10$s" class="%1$s">
                %4$s%7$s
                <div class="%9$s-status%2$s">
                    <span class="icon-ok">%5$s</span>
                    <span class="icon-error">%6$s</span>
                    <span class="message" data-errmsg="%8$s">%3$s</span>
                </div>',
                $this->snippets('merge_classes', [$classes, $css_prefix.'-container', ($was_error || $was_sent) ? $css_prefix.'-processed': '']),
                // zu()->merge_classes([$classes, 'cplus-container', ($was_error || $was_sent) ? 'cplus-processed': '' ]),
                ($was_error || $was_sent) ? ($was_error ? ' not-sent' : ' sent') : '',
                $was_error ? $this->error_message($name) : $this->success_message($name),
                $this->snippets('loader', 1, 0.8),
                // zu()->loader(1, 0.8),
                $values['icon_ok'] ?? (function_exists('zu_get_icon_contacts') ? zu_get_icon_contacts() : ''),
                $values['icon_cancel'] ?? (function_exists('zu_get_icon_cancel') ? zu_get_icon_cancel() : ''),
                $subheading,
                $this->error_message($name),
                $css_prefix,
                $name
        );

        $recaptcha = '';
        // if(isset($errors['recaptcha'])) {
        //     <div class="control-group form-group">
        //     <p class="text-error"> echo $errors['recaptcha']; </p>
        //     </div>
        //  }

        // Add form container and FORM opening tags
        $output .= zu_sprintf(
            '<div class="%7$s-form-container %2$s">
                %1$s
                <form role="form" id="%7$s-form" name="%7$s-form" method="post" class="%7$s-form %2$s">
                %3$s
                <input type="hidden" name="%7$s_fname" value="%2$s"/>
                <input type="hidden" name="post_link" value="%5$s"/>
                <input type="hidden" name="post_id" value="%4$s"/>
                %6$s',
            empty($message) ? '' : sprintf('<p>%1$s</p>', $message),
            $name,
            wp_nonce_field($this->ajax_nonce(false), $css_prefix.'_nonce', true, false),
            get_the_ID(),
            trailingslashit($_SERVER['REQUEST_URI']),
            $recaptcha,
            $css_prefix
        );

        // print($output);
        // echo preg_replace('/\s+/', ' ', $output);
        // $rows = isset($values['rows']) ? $values['rows'] : $form->rows_in_message;

        foreach($form->fields() as $field) {
            // $field_id = $field['name'];
            $output .= $form->sprint($field['name'], $values[$field['name']] ?? '', $errors, $values['_rows'] ?? null);

            // $this->print_field(
            //     $field_id,
            //     $field['type'],
            //     isset($values[$field_id]) ? $values[$field_id] : '',
            //     $field['label'],
            //     $errors,
            //     $field['required'],
            //     $field['placeholder'],
            //     $field['type'] == 'textarea' ? $rows : 0
            // );
        }

        $output .= sprintf('</form></div><!-- .%1$s --></div>', $name);
        return $output;
    }

    private function success_message($key = null) {
        $message = self::$success_messages[$key] ?? self::$success_messages['default'];
        if(is_array($message)) $message = $this->is_option('me_or_us') ? $message[1] : $message[0];
        return $message;
    }

    private function error_message() {
        return self::$error_message;
    }

    private function subheading($subheading, $key = null) {
        $key = self::$subheading_form[$key] ?? null;
        $index = empty($key) ? $subheading : $key;
        $selected = $this->is_option('me_or_us') ? self::$subheading_me : self::$subheading_us;
        return $selected[$index] ?? $subheading;
    }
}
