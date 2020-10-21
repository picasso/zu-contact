<?php
//
// Default Contact Form
//
function cplus_register_default_form() {

	$form = new cplus_Form('default', ['carbon_copy' => true]);

	$form->register_field(
		'name',
		__('Name', 'zu-contact'),
		 'text',
		 __('Please give your name.', 'zu-contact'),
		__('Your Name', 'zu-contact')
	);

	$form->register_field(
		'email',
		__('Email', 'zu-contact'),
		'email',
		[__('Please give your email address.', 'zu-contact'), __('Please enter a valid email address.', 'zu-contact')],
		__('Your Email Address', 'zu-contact')
	);

	$form->register_field(
		'message',
		__('Message', 'zu-contact'),
		'textarea',
		__('Please give a message.', 'zu-contact'),
		__('Your Message', 'zu-contact')
	);

	$form->register_field(
		'submit',
		__('Send Message', 'zu-contact'),  			// __('Subscribe', 'zu-contact')
		'submit'
	);

	// Register default form
	cplus_instance()->register_form($form);

	$contact_form = clone $form;
	$contact_form->process_params([
		'name'				=> 	'contact',
		'rows'				=>	5,
		'carbon_copy'		=>	false,
	]);
	// Register contact form
	cplus_instance()->register_form($contact_form);

}
