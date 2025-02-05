<?php
// Shortcode helpers ------------------------------------------------------------------------------]
//
trait zu_ContactShortcode {

	private function init_shortcode() {
		add_shortcode('zu-contact', [$this, 'contact_shortcode']);
		add_shortcode('zu-booking', [$this, 'booking_shortcode']);
	}

	public function booking_shortcode($atts, $content = null) {
		return $this->contact_shortcode(array_merge(['form' => 'booking'], $atts), $content);
	}

	public function contact_shortcode($atts, $content = null) {

		$atts = $this->snippets('shortcode_atts_with_cast', [
			'form' 				=> 'contact',
			'class' 			=> '',
			'ajax' 				=> true,
			'message' 			=> '',
			'subheading'		=> null,
			'recaptcha'			=> -1,
			'rows'				=> -1,
		], $atts, ['ajax', 'recaptcha']);
		extract($atts, EXTR_OVERWRITE);

		// if $ajax is true enqueue both css and script (null), otherwise css only (true)
		$this->enqueue_only($ajax ? null : true);
		// if 'recaptcha' is true but 'use_recaptcha' option is false - nothing will happen
		// use 'recaptcha' set to false to disable 'recaptcha' when 'use_recaptcha' is true
		$this->maybe_enqueue_recaptcha($recaptcha);

		if (!in_array($form, $this->available_forms())) $form = 'contact';
		if (!is_null($content)) $message = do_shortcode($content);

		$contact = new zu_ContactData;
		// _dbug($contact);
		if ($contact->has_recaptcha()) $this->check_recaptcha($contact);
		if ($contact->is_valid()) $this->send_with_notify($contact);

		$values = $contact->as_values();
		$values['_was_sent'] = $contact->was_sent;
		$values['_was_notified'] = $contact->was_notified;
		$values['_subheading'] = $subheading;
		$values['_recaptcha'] = $recaptcha;
		if ($rows !== -1) $values['_rows'] = absint($rows);

		$this->update_stats($contact);

		return $this->sprint_form($form, $values, $contact->errors, $message, $class);
	}
}
