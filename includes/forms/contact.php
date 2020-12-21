<?php
//
// Contact Form
//
function zuc_register_contact_form() {

	$form = new zu_ContactFields('contact', ['rows' => 5]);

	$form->add('name', true);
	$form->add('email', true);
	$form->add('message', true);
	$form->add('submit');

	zucontact()->register_form($form);
}

zuc_register_contact_form();
