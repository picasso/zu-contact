<?php
//
// Class for holding contact form fields
//
class cplus_Form {
	
	public $name;
	public $fields;
	
	function __construct($name = 'cplus') {
		
		$this->name = $name;
		$this->fields = [];
	}

	private function create_field($id, $label, $type, $required, $placeholder) {		// $required - String or Array of Strings
		
		return [
			'name'              => $id,
			'order'				=> -1,
			'label'     			=> $label,
			'type'     			=> $type,
			'is_required'		=> empty($required) ? false : true,
			'required'			=> $required,
			'placeholder'		=> $placeholder
	];
	}

	public function register_field($id, $label, $type = 'text', $required = '', $placeholder = '') {
		
		if(isset($this->fields[$id])) return false;
		
		$field = $this->create_field($id, $label, $type, $required, $placeholder);
		$field['order'	] = count($this->fields) + 1;
		$this->fields[$id] = $field;

		return true;
	}

	public function set_field_attr($id, $attr_name, $attr_value) {
		
		if(isset($this->fields[$id])) return false;
		$this->fields[$id][$attr_name] = $attr_value;
		if($attr_name == 'required') $this->fields[$id]['is_required'] = empty($this->fields[$id][$attr_name]) ? false : true;
		return true;
	}
	
	public function set_field_label($id, $label) { return set_field_attr($id, 'label', $label); }
	public function set_field_type($id, $type) { return set_field_attr($id, 'type', $type); }
	public function set_field_placeholder($id, $placeholder) { return set_field_attr($id, 'placeholder', $placeholder); }
	public function set_field_required($id, $required) { return set_field_attr($id, 'required', $required); }

	public function add_field($position, $id, $label, $type = 'text', $required = '', $placeholder = '') {
		
		$this->fields = array_map(function($field) use($position) {
			if($field['order'] >= $position) $field['order']++; 
		}, $this->fields);
	
		$field = $this->create_field($id, $label, $type, $required, $placeholder);
		$field['order'	] = $position;
		$this->fields[$id] = $field;
	}

	public function remove_field($id) {
		
		$position = $this->fields[$id]['order'];
		
		$this->fields = array_map(function($field) use($position) {
			if($field['order'] >= $position) $field['order']--; 
		}, $this->fields);
	
		unset($this->fields[$id]);
	}
	
	public function get_field($id) {
		if(!isset($this->fields[$id])) return false;
		return $this->fields[$id];
	}
	
	public function get_fields($sorting_key = 'order') {
		$fields = $this->fields;
		usort($fields, function($a, $b) use ($sorting_key) { return ($a[$sorting_key] == $b[$sorting_key]) ? 0 : ($a[$sorting_key] > $b[$sorting_key] ? 1 : -1); });
		return $fields;
	}
}

function cplus_add_field($position, $id, $label, $type = 'text', $required = '', $placeholder = '', $form_name = '') {		// $required - String or Array of Strings
	
	$form = cplus_get_form($form_name);
	if($form === false) return false;
	
	$form->add_field($position, $id, $label, $type, $required, $placeholder);
}

function cplus_remove_field($id, $form_name = '') {
	
	$form = cplus_get_form($form_name);
	if($form === false) return false;
	$form->remove_field($id);
}
