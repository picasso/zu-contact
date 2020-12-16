<?php
//
// Booking Form
//
function zuc_register_booking_form() {

	$form = new zu_ContactFields('booking', ['rows' => 4]);

	$form->add('name', true);
	$form->add('email', true);
	$form->add('phone');
	$form->add('city');
	$form->add('places', true);
	$form->add('message');
	$form->add('book');
	zucontact()->register_form($form);
}

zuc_register_booking_form();

// $form->add(
// 	'name',
// 	__('Name', 'zu-contact'),
// 	 'text',
// 	 __('Please give your name.', 'zu-contact'),
// 	__('Your Name', 'zu-contact')
// );
//
// $form->add(
// 	'email',
// 	__('Email', 'zu-contact'),
// 	'email',
// 	[__('Please give your email address.', 'zu-contact'), __('Please enter a valid email address.', 'zu-contact')],
// 	__('Your Email Address', 'zu-contact')
// );
//
// $form->add(
// 	'phone',
// 	__('Phone', 'zu-contact'),
// 	 'tel',
// 	 '', //__('Please give your phone number.', 'zu-contact'),
// 	__('Your Phone Number eg. +49-541-754-3010', 'zu-contact')
// );
//
// $form->add(
// 	'city',
// 	__('City', 'zu-contact'),
// 	 'text',
// 	 '', //__('Please give the city where you live.', 'zu-contact'),
// 	__('Your City', 'zu-contact')
// );
//
// $form->add(
// 	'places',
// 	__('Places', 'zu-contact'),
// 	 'number',
// 	 __('Please give the amount of places to book for you.', 'zu-contact'),
// 	__('How Many Places?', 'zu-contact')
// );
//
// $form->add(
// 	'message',
// 	__('Message', 'zu-contact'),
// 	'textarea',
// 	'',
// 	__('Your Message', 'zu-contact')
// );
//
// $form->add(
// 	'submit',
// 	__('Book', 'zu-contact'),
// 	'submit'
// );
