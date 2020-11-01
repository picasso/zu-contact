<?php
require_once('data.php');

// Shortcode helpers ----------------------------------------------------------]

trait zu_ContactShortcode {

	private function init_shortcode() {
		add_shortcode('zu-contact', [$this, 'shortcode']);
		add_shortcode('zu-booking', [$this, 'booking_shortcode']);
	}

	public function booking_shortcode($atts, $content = null) {
		return $this->shortcode(array_merge(['form' => 'booking'], $atts), $content);
	}

	public function shortcode($atts, $content = null) {

		extract(shortcode_atts([
			'form' 				=> 'contact',
			'class' 			=> '',
			'ajax' 				=> true,
			'message' 			=> '',
			'subheading'		=> '',
			'rows'				=> -1,
		], $atts));

		// if $ajax is true enqueue both css and script (null), otherwise css only (true)
		$this->enqueue_only($ajax ? null : true);

		if(!in_array($form, $this->available_forms())) $form = 'contact';
		if(!is_null($content)) $message = do_shortcode($content);

	    $contact = new zu_ContactData;
_dbug($contact);
	    if($contact->is_valid()) $contact->send_mail();

		$values = $contact->as_values();
		$values['_was_sent'] = $contact->was_sent;
		$values['_subheading'] = $subheading;
		if($rows !== -1) $values['_rows'] = absint($rows);

		return $this->sprint_form($form, $values, $contact->errors, $message, $class);
	}
}
