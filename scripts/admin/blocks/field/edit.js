// WordPress dependencies

const { get, set, has, includes, map } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { PanelBody, ToggleControl, TextControl } = wp.components; //Button, SelectControl,
const { InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { withSelect } = wp.data; // , withDispatch
const { useState, useCallback, useRef } = wp.element;

// Zukit dependencies

const { SelectItemControl } = wp.zukit.components;

// Internal dependencies

import { assets, typeDefaults, iconColor } from './assets.js';
import ZuSubmitEdit from './edit-submit.js';
import ZuField from './../components/field.js';
import ZuPlainEdit from './../components/plain-edit.js';
import ZuFieldBlockControls from './../components/field-block-controls.js';

const fieldPrefix = 'components-zu-field__settings';

const ZuFieldEdit = ({
		attributes,
		className,
		setAttributes,
		uniqueId,
}) => {

	const {
		id,
		label,
		type,
		required,
		value,
		placeholder,
		rows,
	} = attributes;

	const [ temporaryValue, setTemporaryValue ] = useState(type === 'checkbox' ? false : '');
	const [ isEditingPlaceholder, setIsEditingPlaceholder ] = useState(false);
	const [ isEditingRequired, setIsEditingRequired ] = useState(false);
	const attrRef = useRef(null);

	const labelEdit = (type === 'submit') ? null : (
		<label>
			<ZuPlainEdit
				value={ label }
				attrKey={ 'label' }
				placeholder={ __('Add field label...', 'zu-contact') }
				setAttributes={ setAttributes }
			/>
			{ required && <span className="required">*</span> }
		</label>
	);

	const validationEdit = (!isEditingRequired || type === 'submit') ? null : (
		<ZuPlainEdit
			className="__validation"
			value={ "Please give your email address." }
			attrKey={ 'label' }
			placeholder={ __('Add field error message...', 'zu-contact') }
			setAttributes={ setAttributes }
		/>
	);

	const submitEdit = (
		<ZuSubmitEdit { ...{ type, label, setAttributes } }/>
	);

	// const onEditPlaceholder = useCallback(() => {
	// 	setIsEditingPlaceholder(true);
	// }, []);

	const placeholderEdit = !isEditingPlaceholder ? null : (
		<div className="__edit-placeholder">
			<ZuPlainEdit
				value={ placeholder }
				attrKey={ 'placeholder' }
				placeholder={ __('Add field placeholder...', 'zu-contact') }
				setAttributes={ setAttributes }
			/>
		</div>
	);

	const onChangeValue = (event) => setTemporaryValue(event.target[type === 'checkbox' ? 'checked' : 'value']);

	const selectType = useCallback(selected => {
		const { type } = attributes;
		if(selected === type) return;
		// keep current attributes, maybe they will be used later
		attrRef.current = set(attrRef.current || {}, type, attributes);
		const newAttrs = has(attrRef.current, selected) ? attrRef.current[selected] : typeDefaults[selected];
		// we should avoid duplicate field id
		setAttributes({ ...newAttrs, id: uniqueId(newAttrs.id) });
	}, [attributes, setAttributes, uniqueId]);

	return (
		<>
			<InspectorControls>
				<PanelBody className={ fieldPrefix } title={ __('Field Settings', 'zu-contact') }>
					<SelectItemControl
						isSmall
						withTooltip
						label={ __('Field Type', 'zu-contact') }
						className="__field-type"
						columns={ 3 }
						options={ assets.typeOptions }
						selectedItem={ type }
						onClick={ selectType }
						transformValue={ value => <span className="__wrapper">{ assets.svg[value] }</span> }
						recap={ { label: __('Current Field Type', 'zu-contact'), style: { color: iconColor } } }
					/>
					{ type !== 'submit' &&
						<ToggleControl
							label={ __('This is a required field.', 'zu-contact') }
							checked={ !!required }
							onChange={ () => setAttributes({ required: !required }) }
						/>
					}
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __('Field Id', 'zu-contact') }
					help={ __('Usually you don\'t need to change it', 'zu-contact') }
					value={ id }
					onChange={ val => setAttributes({ id: uniqueId(val) }) }
				/>
			</InspectorAdvancedControls>
			<ZuFieldBlockControls
				isEditingPlaceholder={ isEditingPlaceholder }
				onEditPlaceholder={ () => setIsEditingPlaceholder(true) }
				onCancelPlaceholder={ () => setIsEditingPlaceholder(false) }

				isEditingRequired={ isEditingRequired }
				onEditRequired={ () => setIsEditingRequired(true) }
				onCancelRequired={ () => setIsEditingRequired(false) }

				{ ...{ id, type, required, placeholder } }
			/>
			<ZuField
				isEditor
				labelEdit={ labelEdit }
				validationEdit={ validationEdit }
				submitEdit={ submitEdit }
				placeholderEdit={ placeholderEdit }
				temporaryValue={ temporaryValue }
				onChange={ onChangeValue }
				{ ...{ className, id, type, required, value, placeholder, label, rows } }
			/>
		</>
	);
}

// export default ZuFieldEdit;
export default compose([
	withSelect(( select, { clientId }) => {
		const { getBlockOrder, getBlockRootClientId, getBlockAttributes } = select('core/block-editor');
		// const { getBlockTypes } = select('core/blocks');

		// const block = getBlock(clientId);
		const parentId = getBlockRootClientId(clientId);
		const fieldIds = getBlockOrder(parentId);
		const availableFieldIds= map(fieldIds, id => get(getBlockAttributes(id), 'id', null));

		const uniqueId = id => {
			if(includes(availableFieldIds, id)) {
				let index = 0;
				const idBody = String(id).replace(/-\d+$/, '').replace(/\d+$/, '') || 'id';
				while(++index > 0) {
					const testId = `${idBody}-${index}`;
					if(!includes(availableFieldIds, testId)) return testId;
				}
			}
			return id;
		}
		return {
			uniqueId,
			// availableFieldIds,
		};
	}),
	// withDispatch( ( dispatch ) => {
	// 	const { updateBlockAttributes } = dispatch('core/block-editor');
	// 	return { updateBlockAttributes };
	// }),

])(ZuFieldEdit);
