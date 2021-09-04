<?php
// Class for holding and manage contact form fields
//
class zu_ContactFieldDefaults {

	private static $defaults = null;

	public static function type_defaults($type) {
		$defaults = self::defaults();
		return $defaults[$type] ?? $defaults['unknown'];
	}

	public static function as_data() {
		$defaults = self::defaults();
		unset($defaults['unknown']);
		foreach($defaults as $type => $value) {
			if(!isset($value['type'])) $defaults[$type]['type'] = $type;
		}
		return $defaults;
	}

	public static function aliases($type) {
		$aliases = [
			'name'		=> 'text',
			'phone'		=> 'tel',
			'message'	=> 'textarea',
		];
		return $aliases[$type] ?? $type;
	}

	private static function defaults() {

		if(self::$defaults !== null) return self::$defaults;

		self::$defaults = [
			'text'		=> [
				'id'			=>	'name',
				'label'			=> __('Name', 'zu-contact'),
				'required'		=> __('Please give your name.', 'zu-contact'),
				'placeholder'	=> __('Your Name', 'zu-contact'),
			],
			'textarea'		=> [
				'id'			=>	'message',
				'label'			=> __('Message', 'zu-contact'),
				'required'		=> __('Please give a message.', 'zu-contact'),
				'placeholder'	=> __('Your Message', 'zu-contact'),
			],
			'email'		=> [
				'id'			=>	'email',
				'label'			=> __('Email', 'zu-contact'),
				'required'		=> [
					__('Please give your email address.', 'zu-contact'),
					__('Please enter a valid email address.', 'zu-contact')
				],
				'placeholder'	=> __('Your Email Address', 'zu-contact'),
			],
			'url'		=> [
				'id'			=> 'url',
				'label'			=> __('Website URL', 'zu-contact'),
				'required'		=> __('Please enter the URL of your site.', 'zu-contact'),
				'placeholder'	=> __('Your Website URL', 'zu-contact'),
			],
			'tel'		=> [
				'id'			=>	'phone',
				'label'			=> __('Phone', 'zu-contact'),
				'required'		=> __('Please give your phone number.', 'zu-contact'),
				'placeholder'	=> __('Your Phone Number eg. +49-541-754-3010', 'zu-contact'),
			],
			'checkbox'		=> [
				'id'			=> 'terms',
				'label'			=> __('I agree to the terms and conditions', 'zu-contact'),
				'required'		=> __('Please accept terms and conditions.', 'zu-contact'),
				'placeholder'	=> null,
			],
			'number'		=> [
				'id'			=> 'age',
				'label'			=> __('How old are you?', 'zu-contact'),
				'required'		=> __('Please enter your age to continue.', 'zu-contact'),
				'placeholder'	=> __('Your Age', 'zu-contact'),
			],
			'submit'		=> [
				'id'			=> 'submit',
				'label'			=> __('Send Message', 'zu-contact'),
				'required'		=> null,
				'placeholder'	=> null,
			],

			// pseudo-types, which will be redefined by EXTR_OVERWRITE
			'book'		=> [
				'id'			=> 'submit',
				'label'			=> __('Book', 'zu-contact'),
				'required'		=> null,
				'placeholder'	=> null,
				'type'			=> 'submit',
			],
			'subscribe'	=> [
				'id'			=> 'subscribe',
				'label'			=> __('Subscribe', 'zu-contact'),
				'required'		=> null,
				'placeholder'	=> null,
				'type'			=> 'submit',
			],
			'city'		=> [
				'id'			=> 'city',
				'label'			=> __('City', 'zu-contact'),
				'required'		=> __('Please give the city where you live.', 'zu-contact'),
				'placeholder'	=> __('Your City', 'zu-contact'),
				'type'			=> 'text',
			],
			'places'		=> [
				'id'			=> 'places',
				'label'			=> __('Places', 'zu-contact'),
				'required'		=> __('Please give the amount of places to book for you.', 'zu-contact'),
				'placeholder'	=> __('How Many Places?', 'zu-contact'),
				'type'			=> 'number',
			],

			// when type is unknown
			'unknown'		=> [
				'id'			=> null,
				'label'			=> null,
				'required'		=> null,
				'placeholder'	=> null,
			],
		];
		return self::$defaults;
	}
}
