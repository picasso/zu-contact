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
		'phone', 
		__('Phone', 'contact-plus'), 
		 'tel', 
		 '', //__('Please give your phone number.', 'contact-plus'), 
		__('Your Phone Number eg. +49-541-754-3010', 'contact-plus')
	);

	$form->register_field(
		'city', 
		__('City', 'contact-plus'), 
		 'text', 
		 '', //__('Please give the city where you live.', 'contact-plus'), 
		__('Your City', 'contact-plus')
	);

	$form->register_field(
		'places', 
		__('Places', 'contact-plus'), 
		 'number', 
		 __('Please give the amount of places to book for you.', 'contact-plus'), 
		__('How Many Places?', 'contact-plus')
	);


	$form->register_field(
		'message', 
		__('Message', 'contact-plus'), 
		'textarea',
		'', 
		__('Your Message', 'contact-plus')
	);

	$form->register_field(
		'submit', 
		__('Book', 'contact-plus'), 
		'submit'
	);

	cplus_instance()->register_form($form);
}
