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
