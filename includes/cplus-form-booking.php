<?php
//
// Booking Form
//
function cplus_register_booking_form() {
	
	$form = new cplus_Form('booking');
	
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
		'submit', 
		__('Book', 'contact-plus'), 
		'submit'
	);

	cplus_instance()->register_form($form);
}
