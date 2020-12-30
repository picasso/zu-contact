<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]
//
class zu_ContactBlocks extends zukit_Blocks {

	protected function config() {
		return [
			'namespace'	=> 'zu',
			'blocks'	=> ['form', 'field'],
		];
	}

	// protected function should_load_css($is_frontend) {
	// 	return false;
	// }

	protected function js_data($is_frontend) {
		return $is_frontend ? null :  $this->plugin->ajax_data(false);
	}
}
