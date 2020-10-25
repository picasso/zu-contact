<?php
require_once('data.php');

// Shortcode helpers ----------------------------------------------------------]

trait zu_ContactShortcode {

	private function init_shortcode() {
		add_shortcode('zu-contact', [$this, 'shortcode']);
		// как передать booking?
		add_shortcode('zu-booking', [$this, 'booking_shortcode']);
	}

	public function booking_shortcode($atts, $content = null) {
		return $this->shortcode(array_merge(['form' => 'booking'], $atts), $content);
	}

	public function shortcode($atts, $content = null) {
_dbug($atts);
		extract(shortcode_atts([
			'form' 				=> 'contact',
			'class' 			=> '',
			'ajax' 				=> true,
			'message' 			=> '',
			'subheading'		=> '',
			'rows'				=> -1,
		], $atts));

		if(!in_array($form, $this->available_forms())) $form = 'contact';

		if(!is_null($content)) $message = do_shortcode($content);

	    $contact = new zu_ContactData;
	    if($contact->is_valid()) $contact->send_mail();


		// ->ready нет!!!
		$this->enqueue_only();
		// zucontact()->ready(filter_var($ajax, FILTER_VALIDATE_BOOLEAN));

		// $args = [];
		//
		// $args['was_sent'] = $contact->was_sent;
		// $args['message'] = $message;
		// $args['errors'] = $contact->errors;

		$values = $contact->as_values();
_dbug('shortcode ready', $values);	
		$values['_was_sent'] = $contact->was_sent;
		$values['_subheading'] = $subheading;
		if($rows !== -1) $values['_rows'] = absint($rows);

		// if(!empty($subheading))
		// $args['values']['subheading'] = $this->subheading($subheading, filter_var($subheading, FILTER_VALIDATE_BOOLEAN) ? $form : '');


		return $this->sprint_form($form, $values, $contact->errors, $message, $class);

		// $repeater = new ZU_PlusRepeaters($this->dir, 'includes/forms');
		// return $repeater->get_repeater_output($form, $args, $class);
	}
}
