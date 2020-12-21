<?php
// Class for holding and manage contact form fields
//
class zu_ContactFields {

	public static $css_prefix = 'zuc';

	public $name = null;
	public $fields = [];
	public $rows_in_message = 10;
	public $carbon_copy = false;

	function __construct($name = 'zucontact', $params = []) {
		$this->name = $name;
		$this->update($params);
	}

	public function update($params) {
		$this->name = $params['name'] ?? $this->name;
		$this->rows_in_message = $params['rows'] ?? 10;
		$this->carbon_copy = $params['carbon_copy'] ?? false;
		self::$css_prefix = $params['prefix'] ?? 'zuc';
	}

	private function field($id = null, $label = null, $type = null, $required = null, $placeholder = null) {
		// $required: String or Array of Strings
		// if $required is string then it's only error message
		// if $required is array then array[0] is message when input is missing, array[1] when input is wrong
		return [
			'name'              => $id,
			'order'				=> -1,
			'label'     		=> is_null($label) ? '' : $label,
			'type'     			=> $type,
			'is_required'		=> empty($required) ? false : true,
			'required'			=> $required,
			'placeholder'		=> $placeholder
		];
	}

	public function attr($id, $name, $value) {

		if(!isset($this->fields[$id])) return false;
		$available_attrs = array_keys($this->field());
		if(!in_array($name, $available_attrs)) return false;

		$this->fields[$id][$name] = $value;
		if($name === 'required') $this->fields[$id]['is_required'] = empty($this->fields[$id][$name]) ? false : true;
		return true;
	}

	// можно создавать поле передавая все параметры, а можно только тип и
	// массив с параметрами, которые будут смержены с дефолтными значениями
	public function add($id_or_type, $label_or_required = false, $type_or_params = [], $required = null, $placeholder = null) {

		if(is_array($type_or_params)) {
			$is_required = $label_or_required;
			$type = zu_ContactFieldDefaults::aliases($id_or_type);
			$params = array_merge(zu_ContactFieldDefaults::type_defaults($type), $type_or_params);
			extract($params, EXTR_OVERWRITE);
			if($is_required === false) $required = null;
		} else {
			$id = $id_or_type;
			$label = $label_or_required;
			$type = $type_or_params;
		}

		if(is_null($id) || isset($this->fields[$id])) return false;

		$field = $this->field($id, $label, $type, $required, $placeholder);
		$field['order'] = count($this->fields) + 1;
		$this->fields[$id] = $field;
		return $id;
	}

	// insert field at given position
	// if $position is -1 then insert before last field (which is usually 'submit' button)
	public function insert_at($position, $id_or_type, $label_or_required = false, $type_or_params = [], $required = null, $placeholder = null) {

		if($position === -1) $position = (count($this->fields) + 1) - 1; // count after insert - 1
		if($position < 1 || $position > (count($this->fields) + 1)) return false;

		$id = $this->add($id_or_type, $label_or_required, $type_or_params, $required, $placeholder);
		if($id === false) return false;

		$this->fields = array_map(function($field) use($position) {
			if($field['order'] >= $position) $field['order']++;
			return $field;
		}, $this->fields);

		$this->fields[$id]['order'] = $position;
		return $id;
	}

	public function remove($id) {

		if(!isset($this->fields[$id])) return false;

		$position = $this->fields[$id]['order'];

		$this->fields = array_map(function($field) use($position) {
			if($field['order'] >= $position) $field['order']--;
			return $field;
		}, $this->fields);

		unset($this->fields[$id]);
		return true;
	}

	public function get($id) {
		return $this->fields[$id] ?? null;
	}

	public function get_required($value, &$required, &$required_valid) {
		if(empty($value)) {
			$required = $required_valid = '';
			return;
		}
		$required = is_array($value) ? $value[0] : $value;
		$required_valid = is_array($value) ? $value[1] : $value;
	}

	public function fields($sorting_key = 'order', $template = false, $rows = null) {

		$available_attrs = array_keys($this->field());
		if(!in_array($sorting_key, $available_attrs)) $sorting_key = 'order';

		$fields = $this->fields;
		usort($fields, function($a, $b) use ($sorting_key) {
			return ($a[$sorting_key] == $b[$sorting_key]) ? 0 : ($a[$sorting_key] > $b[$sorting_key] ? 1 : -1);
		});

		if($template) {
			$fields = array_map(function($field) {
				$field['id'] = $field['name'];
				$field['required'] = $field['is_required'];
				unset($field['order']);
				unset($field['is_required']);
				unset($field['name']);
				if($field['type'] === 'textarea') $field['rows'] = $rows ?? $this->rows_in_message;
				return $field;
			}, $fields);
		}

		return $fields;
	}

	public function available_fields() {
		return array_keys($this->fields);
	}

	// Printing helpers -------------------------------------------------------]

	private function data_required($required_value) {

		if(empty($required_value)) return '';
		$this->get_required($required_value, $required, $required_valid);

		$data_required = empty($required) ? '' : sprintf('data-required_rule="true" data-required="%1$s"', $required);
		$data_required .= empty($required_valid) ? '' : sprintf('data-required_valid="%1$s"', $required_valid);
		return $data_required;
	}

	private function input($field, $value) {

		$class = $field['type'] === 'submit' ? 'button button-submit' : 'form-control';
		$value_attr = sprintf('value="%1$s"', empty($value) ? '' : esc_attr($value));
		$value = $field['type'] === 'checkbox' ? ($value == true ? 'checked' : '') : $value_attr;
		$placeholder = empty($field['placeholder']) ? '' : sprintf('placeholder="%1$s"', $field['placeholder']);
		$name = $field['type'] === 'submit' ? '' : sprintf('name="%2$s[%1$s]"', $field['name'], self::$css_prefix);

		return zu_sprintf(
			'<input class="%6$s" %1$s
				type="%2$s" id="%8$s-%3$s"
				%7$s
				%4$s
				%5$s
			/>',
			$this->data_required($field['required']),
			$field['type'],
			$field['name'],
			$value,
			$placeholder,
			$class,
			$name,
			self::$css_prefix
		);
	}

	private function textarea($field, $value, $rows = null) {
		return zu_sprintf(
			'<textarea class="form-control" %1$s id="%6$s-%3$s" name="%6$s[%3$s]" rows="%2$s"%5$s>
				%4$s
			</textarea>',
			$this->data_required($field['required']),
			empty($rows) ? $this->rows_in_message : $rows,
			$field['name'],
			esc_textarea($value),
			empty($field['placeholder']) ? '' : sprintf(' placeholder="%1$s"', $field['placeholder']),
			self::$css_prefix
		);
	}

	public function sprint($id, $value, $errors, $rows = null) {

		$field = $this->get($id);
		if(empty($field)) return;

		if($field['type'] === 'textarea') $field_output = $this->textarea($field, $value, $rows);
		else if($field['type'] === 'submit') $field_output = $this->input($field, $field['label']);
		else $field_output = $this->input($field, $value);

		$msg_class = isset($errors[$id]) ? 'error' : 'success';
		$error_text = isset($errors[$id]) ? $errors[$id] : '';

		$label = zu_sprintf(
			'<label for="%4$s-%1$s">
				%2$s%3$s
			</label>',
			$id,
			$field['label'],
			empty($field['required']) ? '' : '<span class="required">*</span>',
			self::$css_prefix
		);

		if($field['type'] === 'submit') {
			$output = zu_sprintf(
				'<div class="%2$s-control __submit">%1$s</div>',
				$field_output,
				self::$css_prefix
			);
		} else if($field['type'] === 'checkbox') {
			$output = zu_sprintf(
				'<div class="%1$s-control %5$s">
					<div class="%1$s-input checkbox">
						<div class="__align-middle">
							%2$s%4$s
						</div>
			        	<span for="%1$s-%3$s" class="__validation">
							%6$s
						</span>
					</div>
				</div>',
				self::$css_prefix,
				$field_output,
				$id,
				$label,
				$msg_class,
				$error_text,
			);
		} else {
			$output = zu_sprintf(
				'<div class="%7$s-control %5$s">
					%4$s
					<div class="%7$s-input %1$s">
						%2$s
			        	<span for="%7$s-%3$s" class="__validation">
							%6$s
						</span>
					</div>
				</div>',
				$field['type'],
				$field_output,
				$id,
				$label,
				$msg_class,
				$error_text,
				self::$css_prefix
			);
		}

		return $output;
	}
}
