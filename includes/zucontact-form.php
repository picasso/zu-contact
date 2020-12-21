<?php
require_once('defaults.php');
require_once('fields.php');
require_once('data.php');

// Form helpers ---------------------------------------------------------------]

trait zu_ContactForm {

    private $default_name = null;
	private $forms = [];

    private static $error_messages = null;
    private static $success_messages = null;
    private static $subheading_us = null;
    private static $subheading_me = null;
    private static $subheading_aliases = null;

    private function init_messages() {
        if(empty(self::$error_messages)) {

            self::$error_messages = [
                'basic'             => 	__('There was a problem with your submission.', 'zu-contact'),
                'fields'            => 	__('Errors have been highlighted below.', 'zu-contact'),
                'nonce'				=>	__('Nonce failed - is not correct or expired.', 'zu-contact'),
                'data'              =>	__('Form data not found.', 'zu-contact'),
                'fname'             =>	__('Form name not found.', 'zu-contact'),
                'comment'           =>	__('Failed to insert a comment into the database.', 'zu-contact'),
                'spam'              =>	__('Message content rejected due to suspected spam.', 'zu-contact'),
                'recaptcha'         => $this->recaptcha_error_messages(),
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

            self::$subheading_aliases = [
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

			if($form->carbon_copy) $form->insert_at(-1, 'checkbox', false, [
                'id'    => 'carbon-copy',
                'label' => __('Send me a copy', 'zu-contact')
            ]);
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

    public function available_errors() {
        return array_keys(self::$error_messages);
    }

    // Output -----------------------------------------------------------------]

    public function sprint_form($name, $values, $errors, $message = null, $classes = '') {

        $form = $this->get_form($name);
        if($form === false) return '';

        // Format container output
        $css_prefix = zu_ContactFields::$css_prefix;
        $was_sent = $values['_was_sent'] ?? false;
        $was_notified = $values['_was_notified'] ?? false;
        $was_error = !empty($errors);

        $subheading = $this->subheading($values['_subheading'], $name);
        $subheading = empty($subheading) ? '' : sprintf(
            '<h2 class="%2$s-subheading before_posting">%1$s</h2>',
            $subheading,
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
                $this->message($errors, $name, $was_notified),
                $this->snippets('loader', 0, 0.8, $css_prefix.'-loader'),
                $this->snippets('insert_svg_from_file', $this->dir, 'mail', [
    	            'preserve_ratio'	=> true,
    	            'strip_xml'			=> true,
    	            'subdir'			=> 'images/',
    			]),
                $this->snippets('insert_svg_from_file', $this->dir, 'flag', [
    	            'preserve_ratio'	=> true,
    	            'strip_xml'			=> true,
    	            'subdir'			=> 'images/',
    			]),
                $subheading,
                $this->error_message($errors),
                $css_prefix,
                $name
        );

        // Add form container and FORM opening tags
        $output .= zu_sprintf(
            '<div class="%6$s-form-container %2$s">
                %1$s
                <form role="form" id="%6$s-form" name="%6$s" method="post" class="%6$s-form %2$s">
                %3$s
                <input type="hidden" name="%6$s[_fname]" value="%2$s"/>
                <input type="hidden" name="%6$s[_post_link]" value="%5$s"/>
                <input type="hidden" name="%6$s[_post_id]" value="%4$s"/>',
            empty($message) ? '' : sprintf('<p>%1$s</p>', $message),
            $name,
            wp_nonce_field($this->ajax_nonce(false), $css_prefix.'_nonce', true, false),
            get_the_ID(),
            trailingslashit($_SERVER['REQUEST_URI']),
            $css_prefix
        );

        foreach($form->fields() as $field) {
            $field_id = $field['name'];
            if($field_id === 'submit') $output .= $this->get_recaptcha($values['_recaptcha'] ?? null);
            $output .= $form->sprint($field_id, $values[$field_id] ?? '', $errors, $values['_rows'] ?? null);
        }

        $output .= sprintf('</form></div><!-- .%1$s --></div>', $name);
        return $output;
    }

    public function templates() {
        $forms = [];
        foreach($this->available_forms() as $name) {
            $form = $this->get_form($name);
            if($form === false) continue;
            $forms[$name] = [
                'name'      => $name,
                'title'     => $this->subheading(null, $name),
                'fields'    => [],
            ];
            foreach($form->fields('order', true) as $field) {
                $forms[$name]['fields'][] = $field;
            }
        }
        return $forms;
    }

    // Messages ---------------------------------------------------------------]

    private function subheading($subheading, $key = null) {
        if(is_string($subheading)) return $subheading;
        $selected = $this->is_option('me_or_us') ? self::$subheading_me : self::$subheading_us;
        $index = array_key_exists($key, $selected) ? $key : self::$subheading_aliases[$key] ?? 'contact';
        return $selected[$index];
    }

    private function success_message($key = null) {
        $message = self::$success_messages[$key] ?? self::$success_messages['default'];
        if(is_array($message)) $message = $this->is_option('me_or_us') ? $message[1] : $message[0];
        return $message;
    }

    private function error_message($errors) {
        $key = 'fields';
        $reserved_keys = $this->snippets('array_prefix', $this->available_errors(), '_');
        foreach($reserved_keys as $val) {
            if(array_key_exists($val, $errors)) {
                $key = ltrim($val, '_');
                break;
            }
        }
        $template = $key === 'fields' ? '%1$s <b>%2$s</b>' : '%1$s <b><span>%2$s</span></b>';
        return sprintf($template, self::$error_messages['basic'], self::$error_messages[$key]);
    }

    public function message($errors, $name, $was_notified = true) {
        if(!empty($errors)) return $this->error_message($errors);
        if($was_notified) return $this->success_message($name);
        return sprintf('%1$s <span>%2$s</span>', $this->success_message($name), self::$success_messages['without_notify']);
    }

    // Statistics -------------------------------------------------------------]

    private function get_used_ids() {
        $stats = $this->get_option('stats', []);
        return wp_parse_id_list($stats);
    }

    private function update_stats($contact) {
        if($contact instanceof zu_ContactData) {
            // update stats only if entry was sent
            if(!$contact->was_sent) return;

            $stats = $this->get_used_ids();
            if(!in_array($contact->post_id, $stats)) {
                $stats[] = $contact->post_id;
                $this->set_option('stats', implode(',', $stats));
            }
		}
    }

    private function stats() {
        $stats = $this->get_used_ids();
        return [
            'forms'     => count($this->forms),
            'comments'  => empty($stats) ? null : get_comments([
                'post__in'  => $stats,
                'count'     => true     // return only the count
            ]),
            'approved'  => empty($stats) ? null : get_comments([
                'post__in'  => $stats,
                'status'    => 1,       // 'approve' (comment_status=1)
                'count'     => true
            ]),
        ];
    }
}
