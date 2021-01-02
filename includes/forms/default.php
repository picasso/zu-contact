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
