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
		$ajax_data = $this->plugin->ajax_data();
		return $is_frontend ? null : array_merge([
			// 'jsdata_name'	=> $this->prefix_it('blocks_data', '_'),
			'nonce'     	=> $this->ajax_nonce(true),
			'types'			=> zu_ContactFieldDefaults::as_data(),
			'templates'		=> $this->plugin->templates(),
		], $ajax_data);
	}
}
