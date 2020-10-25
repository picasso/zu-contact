<?php
// Form printing helpers ------------------------------------------------------]

trait zu_ContactPrint {

	private $css_prefix = 'zuc';

	public function form_message($was_error, $form_name = null) {
		return $was_error ? $this->error_message($form_name) : $this->success_message($form_name);
	}

	private function container($classes, $values, $errors, $form_name) {

		$was_sent = isset($values['was_sent']) ? $values['was_sent'] : false;
		$was_error = empty($errors) ? false : true;
		$icon_error = function_exists('zu_get_icon_cancel') ? zu_get_icon_cancel() : '';
		$icon_ok = function_exists('zu_get_icon_contacts') ? zu_get_icon_contacts() : '';
		$subheading = isset($values['subheading']) ? sprintf('<h2 class="cplus-subheading before_posting">%s</h2>', $values['subheading']) : '';

		return sprintf(
			'<div id="cplus" class="%1$s">%4$s%7$s<div class="cplus-status%2$s">
				<span class="icon-ok">%5$s</span>
				<span class="icon-error">%6$s</span>
				<span class="message" data-errmsg="%8$s">%3$s</span>
			</div>',
				zu()->merge_classes([$classes, 'cplus-container', ($was_error || $was_sent) ? 'cplus-processed': '' ]),
				($was_error || $was_sent) ? ($was_error ? ' not-sent' : ' sent') : '',
				cplus_form_message($was_error, $form_name),
				zu()->loader(1, 0.8),
				$icon_ok,
				$icon_error,
				$subheading	,
				$this->form_message(true, $form_name)
		);
	}

//?
	public function cplus_get_required($required_data, &$required, &$required_valid) {
		$required = is_array($required_data) ? $required_data[0] : $required_data;
		$required_valid = is_array($required_data) ? $required_data[1] : $required_data;
	}

	private function data_required($required_data) {

		if(empty($required_data)) return '';
		cplus_get_required($required_data, $required, $required_valid);

		$data_required = empty($required) ? '' : sprintf('data-required_rule="true" data-required="%1$s"', $required);
		$data_required .= empty($required_valid) ? '' : sprintf('data-required_valid="%1$s"', $required_valid);
		return $data_required;
	}

	private function input($field_id, $field_type, $value, $required_data = '', $placeholder = '') {

		$class = $field_type == 'submit' ? 'button button-submit' : 'form-control';
		$value = $field_type == 'checkbox' ? ($value == true ? 'checked' : '') : sprintf('value="%1$s"', empty($value) ? '' : esc_attr($value));
		$placeholder = empty($placeholder) ? '' : sprintf('placeholder="%1$s"', $placeholder);
		$name = $field_type == 'submit' ? '' : sprintf('name="cplus[%1$s]"', $field_id);

		$input = sprintf(
			'<input class="%6$s" %1$s
				type="%2$s" id="cplus-%3$s"
				%7$s
				%4$s
				%5$s
			/>',
			data_required($required_data),
			$field_type,
			$field_id,
			$value,
			$placeholder,
			$class,
			$name
		);

		return preg_replace('/\s+/', ' ', $input);
	}

	private function textarea($field_id, $value, $required_data = '', $placeholder = '', $rows = 10) {

		return zu_sprintf(
			'<textarea class="form-control" %1$s id="cplus-%3$s" name="cplus[%3$s]" rows="%2$s"%5$s>
				%4$s
			</textarea>',
			data_required($required_data),
			$rows,
			$field_id,
			esc_textarea($value),
			empty($placeholder) ? '' : sprintf(' placeholder="%1$s"', $placeholder)
		);
	}

	private function print_field($field_id, $type, $value, $label, $errors, $required_data = '', $placeholder = '', $maybe_param = 0) {

		if($type == 'textarea') $field = $this->textarea($field_id, $value, $required_data, $placeholder, $maybe_param);
		else if($type == 'submit') $field = $this->input($field_id, $type, $label, $required_data, $placeholder);
		else $field = $this->input($field_id, $type, $value, $required_data, $placeholder);

		$error_class = isset($errors[$field_id]) ? ' error' : ' success';
		$error_text = isset($errors[$field_id]) ? $errors[$field_id] : '';

		$label = sprintf('<label for="cplus-%1$s">%2$s%3$s</label>', $field_id, $label, empty($required_data) ? '' : '<span class="required">*</span>');

		if($type == 'submit') {
			printf('<div class="cplus-control">%1$s</div>', $field);
		} else {
			zu_printf(
				'<div class="cplus-control%6$s">
					%4$s
					<div class="cplus-input %1$s">
						%2$s%5$s
			        <span for="cplus-%3$s" class="validation">%7$s</span>
					</div>
				</div>',
				$type,
				$field,
				$field_id,
				$type == 'checkbox' ? '' : $label,
				$type == 'checkbox' ? $label : '',
				$error_class,
				$error_text
			);
		}
	}

}
