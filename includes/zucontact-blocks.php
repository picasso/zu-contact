<?php
// AJAX & WP Mailer helpers ---------------------------------------------------]
//
class zu_ContactBlocks extends zukit_Blocks {

	protected function config() {
		return [
			'namespace'	=> 'zu',
			'blocks'	=> ['form', 'field', 'recaptcha'],
		];
	}

	protected function frontend_blocks() { return 'form'; }

	protected function js_data($is_frontend) {
		return $is_frontend ? null :  $this->plugin->ajax_data(false);
	}

	public function is_frontend_block($block) {
		return $this->is_block($block, $this->frontend_blocks());
	}
}
