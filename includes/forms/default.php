<?php
//
// Default Contact Form
//
function zuc_register_default_form() {

	$form = new zu_ContactFields('default', ['carbon_copy' => true]);

	$form->add('name', true);
	$form->add('email', true);
	$form->add('message', true);
	$form->add('submit');

	// Register default form
	zucontact()->register_form($form);

	$contact_form = clone $form;
	$contact_form->update([
		'name'				=> 'contact',
		'rows'				=> 5,
		'carbon_copy'		=> false,
	]);

	// Register contact form
	zucontact()->register_form($contact_form);
}

zuc_register_default_form();

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
// 	'message',
// 	__('Message', 'zu-contact'),
// 	'textarea',
// 	__('Please give a message.', 'zu-contact'),
// 	__('Your Message', 'zu-contact')
// );
//
// $form->add(
// 	'submit',
// 	__('Send Message', 'zu-contact'),  
// 	'submit'
// );
