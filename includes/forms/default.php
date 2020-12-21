<?php
//
// Default Form
//
function zuc_register_default_form() {

	$form = new zu_ContactFields('default');

	$form->add('name');
	$form->add('submit');

	zucontact()->register_form($form);
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
