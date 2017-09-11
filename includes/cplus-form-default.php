<?php
//
// Default Contact Form
//
function cplus_register_default_form() {
	
	$form = new cplus_Form('contact');
	
	$form->register_field(
		'name', 
		__('Name', 'contact-plus'), 
		 'text', 
		 __('Please give your name.', 'contact-plus'), 
		__('Your Name', 'contact-plus')
	);
	
	$form->register_field(
		'email', 
		__('Email', 'contact-plus'), 
		'email',
		[__('Please give your email address.', 'contact-plus'), __('Please enter a valid email address.', 'contact-plus')], 
		__('Your Email Address', 'contact-plus')
	);

	$form->register_field(
		'message', 
		__('Message', 'contact-plus'), 
		'textarea',
		__('Please give a message.', 'contact-plus'), 
		__('Your Message', 'contact-plus')
	);

	$form->register_field(
		'carbon-copy', 
		__('Send me a copy', 'contact-plus'), 
		'checkbox'
	);

	$form->register_field(
		'submit', 
		__('Send Message', 'contact-plus'), 
		'submit'
	);

	cplus_instance()->register_form($form);
}
