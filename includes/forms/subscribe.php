<?php
//
// Contact Form
//
function zuc_register_subscribe_form() {

	$form = new zu_ContactFields('subscribe', ['carbon_copy' => true]);

	$form->add('name', true);
	$form->add('email', true);
	$form->add('subscribe');

	zucontact()->register_form($form);
}

zuc_register_subscribe_form();
