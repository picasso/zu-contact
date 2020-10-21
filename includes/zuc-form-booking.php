<?php
//
// Booking Form
//
function cplus_register_booking_form() {
	
	$form = new cplus_Form('booking', ['rows' => 4]); 		
	
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
		'phone', 
		__('Phone', 'zu-contact'), 
		 'tel', 
		 '', //__('Please give your phone number.', 'zu-contact'), 
		__('Your Phone Number eg. +49-541-754-3010', 'zu-contact')
	);

	$form->register_field(
		'city', 
		__('City', 'zu-contact'), 
		 'text', 
		 '', //__('Please give the city where you live.', 'zu-contact'), 
		__('Your City', 'zu-contact')
	);

	$form->register_field(
		'places', 
		__('Places', 'zu-contact'), 
		 'number', 
		 __('Please give the amount of places to book for you.', 'zu-contact'), 
		__('How Many Places?', 'zu-contact')
	);

	$form->register_field(
		'message', 
		__('Message', 'zu-contact'), 
		'textarea',
		'', 
		__('Your Message', 'zu-contact')
	);

	$form->register_field(
		'submit', 
		__('Book', 'zu-contact'), 
		'submit'
	);

	cplus_instance()->register_form($form);
}
