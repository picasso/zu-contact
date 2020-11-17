<?php
require_once('fields.php');

// Form helpers ---------------------------------------------------------------]

trait zu_ContactForm {

    private $default_name = null;
	private $forms = [];

    private static $error_messages = null;
    private static $success_messages = null;
    private static $subheading_us = null;
    private static $subheading_me = null;
    private static $subheading_form = null;

    private function setup_messages() {
        if(empty(self::$error_messages)) {

            self::$error_messages = [
                'basic'             => 	__('There was a problem with your submission.', 'zu-contact'),
                'fields'            => 	__('Errors have been highlighted below.', 'zu-contact'),
                'nonce'				=>	__('Nonce failed - is not correct or expired.', 'zu-contact'),
                'data'              =>	__('Form data not found.', 'zu-contact'),
                'name'              =>	__('Form name not found.', 'zu-contact'),
            ];

            self::$success_messages = [
        		'default'			=> 	__('Your Request Has Been Sent.', 'zu-contact'),
        		'contact'			=> 	__('<b>Success!</b> Your message was sent.', 'zu-contact'),
        		'booking'			=>	__('Your booking request has been sent.', 'zu-contact'),
        		'subscribe'			=>	[
        			__('You Are Now subscribed to Our Newsletter.', 'zu-contact'),
        			__('You Are Now subscribed to My Newsletter.', 'zu-contact')
        		],
                'without_notify'    => __('<b>Attention!</b> No notification was sent to owner.', 'zu-contact'),
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

            // first added form or form with name 'default' will be default
			if(empty($this->default_name)) $this->default_name = $form->name;
            if($form->name === 'default') $this->default_name = $form->name;

			if($form->carbon_copy) $form->insert_at(-1, 'carbon-copy', __('Send me a copy', 'zu-contact'), 'checkbox');
			else $form->remove('carbon-copy');

			$this->forms[$form->name] = $form;
			return true;

		} else return false;
	}

	public function get_form($form_name = null) {
		$form_name = is_null($form_name) || $form_name === 'default' ? $this->default_name : $form_name;
		return $this->forms[$form_name] ?? false;
	}

    public function available_forms() {
        return array_keys($this->forms);
    }

	public function recipients() {
		return $this->get_option('notify');
	}

    public function sprint_form($name, $values, $errors, $message = null, $classes = '') {

        $form = $this->get_form($name);
        if($form === false) return '';

        // Format container output
        $css_prefix = zu_ContactFields::$css_prefix;
        $was_sent = $values['_was_sent'] ?? false;
        $was_error = !empty($errors);

        $subheading = empty($values['_subheading']) ? '' : sprintf(
            '<h2 class="%2$s-subheading before_posting">%1$s</h2>',
            $this->subheading($values['_subheading'], $name),
            $css_prefix
        );

        // in CSS you should use .zuc-status { visibility: visible !important; }
        // to compensate CSS specificity of in-line style="visibility:hidden;"
        // "visibility:hidden;" is used to hide status when form CSS is missing
        $output = zu_sprintf(
            '<div id="%9$s-%10$s" class="%1$s">
                %4$s%7$s
                <div class="%9$s-status%2$s" style="visibility:hidden;">
                    <span class="icon-ok">%5$s</span>
                    <span class="icon-error">%6$s</span>
                    <span class="message" data-errmsg="%8$s">%3$s</span>
                </div>',
                $this->snippets('merge_classes', [
                    $classes,
                    $css_prefix.'-container',
                    ($was_error || $was_sent) ? $css_prefix.'-processed': ''
                ]),
                $was_error ? ' was-error' : ($was_sent ? ' sent' : ''),
                $this->message($errors, $name, $was_sent),
                $this->snippets('loader', 0, 0.8),
                $values['icon_ok'] ?? (function_exists('zu_get_icon_contacts') ? zu_get_icon_contacts() : ''),
                $values['icon_cancel'] ?? (function_exists('zu_get_icon_cancel') ? zu_get_icon_cancel() : ''),
                $subheading,
                $this->error_message($errors),
                $css_prefix,
                $name
        );

        $recaptcha = '';
        // if(isset($errors['recaptcha'])) {
        //     <div class="control-group form-group">
        //     <p class="text-error"> echo $errors['recaptcha']; </p>
        //     </div>
        //  }
// name="%2$s[%1$s]
        // Add form container and FORM opening tags
        $output .= zu_sprintf(
            '<div class="%7$s-form-container %2$s">
                %1$s
                <form role="form" id="%7$s-form" name="%7$s" method="post" class="%7$s-form %2$s">
                %3$s
                <input type="hidden" name="%7$s[_fname]" value="%2$s"/>
                <input type="hidden" name="%7$s[_post_link]" value="%5$s"/>
                <input type="hidden" name="%7$s[_post_id]" value="%4$s"/>
                %6$s',
            empty($message) ? '' : sprintf('<p>%1$s</p>', $message),
            $name,
            wp_nonce_field($this->ajax_nonce(false), $css_prefix.'_nonce', true, false),
            get_the_ID(),
            trailingslashit($_SERVER['REQUEST_URI']),
            $recaptcha,
            $css_prefix
        );

        foreach($form->fields() as $field) {
            $field_id = $field['name'];
            $output .= $form->sprint($field_id, $values[$field_id] ?? '', $errors, $values['_rows'] ?? null);
        }

        $output .= sprintf('</form></div><!-- .%1$s --></div>', $name);
        return $output;
    }

    private function success_message($key = null) {
        $message = self::$success_messages[$key] ?? self::$success_messages['default'];
        if(is_array($message)) $message = $this->is_option('me_or_us') ? $message[1] : $message[0];
        return $message;
    }

    private function error_message($errors) {
        $key = 'fields';
        if(($errors['_nonce'] ?? false) === true) $key = 'nonce';
        else if(($errors['_data'] ?? false) === true) $key = 'data';
        else if(($errors['_fname'] ?? false) === true) $key = 'name';
        return sprintf('%1$s <b>%2$s</b>', self::$error_messages['basic'], self::$error_messages[$key]);
    }

    private function subheading($subheading, $key = null) {
        $key = self::$subheading_form[$key] ?? null;
        $index = empty($key) ? $subheading : $key;
        $selected = $this->is_option('me_or_us') ? self::$subheading_me : self::$subheading_us;
        return $selected[$index] ?? $subheading;
    }

    public function message($errors, $name, $was_sent = true) {
        if(!empty($errors)) return $this->error_message($errors);
        if($was_sent) return $this->success_message($name);
        return sprintf('%1$s <span>%2$s</span>', $this->success_message($name), self::$success_messages['without_notify']);
    }

    private function stats() {
        // NOTE: придумать как выбирать посты с формой...
        $form_post_id = 1;
        return [
            'forms'     => count($this->forms),
            'comments'  => get_comments([
                'post_id'   => $form_post_id,
                'count'     => true   // return only the count
            ]),
        ];
    }
}
