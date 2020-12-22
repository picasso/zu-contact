// WordPress dependencies

const { isNil, get, set, has, includes, map, indexOf } = lodash;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { PanelBody, ToggleControl, TextControl } = wp.components; //Button, SelectControl,
const { createBlock } = wp.blocks;
const { InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { withSelect, withDispatch } = wp.data;
const { useState, useCallback, useRef, useEffect } = wp.element;

// Zukit dependencies

const { SelectItemControl } = wp.zukit.components;

// Internal dependencies

import { name as blockName } from './metadata.js';
import { assets, typeDefaults, requiredDefaults, iconColor } from './assets.js';
import ZuSubmitEdit from './edit-submit.js';
import ZuFieldBlockControls from './field-block-controls.js';
import ZuField from './../components/field.js';
import ZuPlainEdit from './../components/plain-edit.js';

const fieldPrefix = 'components-zu-field__settings';

const ZuFieldEdit = ({
		attributes,
		className,
		setAttributes,
		uniqueId,

		remove,
		insert,
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
	const attrRef = useRef(null);
	const requiredRef = useRef(null);
	const inputRef = useRef();
	const modeRef = useRef({
		required: false,
		invalid: false,
		placeholder: false,
	});

	// create 'text' field as default if no attributes found
	useEffect(() => {
		if(isNil(id)) {
			const newAttrs = typeDefaults[type || 'text'];
			// avoid duplicate field id
			setAttributes({ ...newAttrs, id: uniqueId(newAttrs.id) });
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Label helpers ----------------------------------------------------------]

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

	// Required helpers -------------------------------------------------------]

	const [ isEditingRequired, setIsEditingRequired ] = useState(false);
	const [ temporaryRequired, setTemporaryRequired ] = useState(requiredDefaults[type] || null);
	const requiredEditRef = useRef();

	const validationEdit = (!isEditingRequired || type === 'submit') ? null : (
		<ZuPlainEdit
			ref={ requiredEditRef }
			className="__validation"
			value={ temporaryRequired }
			placeholder={ __('Add field error message...', 'zu-contact') }
			setAttributes={ setTemporaryRequired }
		/>
	);

	const onEditRequired = useCallback(() => {
		setIsEditingRequired(true);
		modeRef.current.required = true;
	}, []);

	useEffect(() => {
		if(isEditingRequired) {
			requiredEditRef.current.focus();
		} else if(modeRef.current.required === true) {
			inputRef.current.focus();
			modeRef.current.required = false;
		}
	}, [isEditingRequired]);

	const onSubmitRequired = useCallback(() => {
		setIsEditingRequired(false);
	}, []);

	// Placeholder helpers ----------------------------------------------------]

	const [ isEditingPlaceholder, setIsEditingPlaceholder ] = useState(false);
	const placeholderEditRef = useRef();

	const placeholderEdit = !isEditingPlaceholder ? null : (
		<div className="__edit-placeholder">
			<ZuPlainEdit
				ref={ placeholderEditRef }
				value={ placeholder }
				attrKey={ 'placeholder' }
				placeholder={ __('Add field placeholder...', 'zu-contact') }
				setAttributes={ setAttributes }
			/>
		</div>
	);

	const onEditPlaceholder = useCallback(() => {
		setIsEditingPlaceholder(true);
		modeRef.current.placeholder = true;
	}, []);

	useEffect(() => {
		if(isEditingPlaceholder) {
			placeholderEditRef.current.focus();
		} else if(modeRef.current.placeholder === true) {
			inputRef.current.focus();
			modeRef.current.placeholder = false;
		}
	}, [isEditingPlaceholder]);

	// Other helpers ----------------------------------------------------------]

	const submitEdit = <ZuSubmitEdit { ...{ type, label, setAttributes } }/>;

	const onChangeValue = (event) => setTemporaryValue(event.target[type === 'checkbox' ? 'checked' : 'value']);

	const selectType = useCallback(selected => {
		const { type } = attributes;
		if(selected === type) return;

		// keep current attributes, maybe they will be used later
		attrRef.current = set(attrRef.current || {}, type, attributes);
		// keep current error message for required, maybe it will be used later
		requiredRef.current = set(requiredRef.current || {}, type, temporaryRequired);

		const newAttrs = has(attrRef.current, selected) ? attrRef.current[selected] : typeDefaults[selected];
		const newRequired = has(requiredRef.current, selected) ? requiredRef.current[selected] : requiredDefaults[selected];

		// avoid duplicate field id
		setAttributes({ ...newAttrs, id: uniqueId(newAttrs.id) });
		setTemporaryRequired(newRequired);

	}, [attributes, setAttributes, temporaryRequired, uniqueId]);

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
				onEditPlaceholder={ onEditPlaceholder } //() => setIsEditingPlaceholder(true) }
				onSubmitPlaceholder={ () => setIsEditingPlaceholder(false) }

				isEditingRequired={ isEditingRequired }
				onEditRequired={ onEditRequired } //() => setIsEditingRequired(true) }
				onSubmitRequired={ onSubmitRequired }

				{ ...{ id, type, required, placeholder, remove, insert } }
			/>
			<ZuField
				ref={ inputRef }
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
			parentId,
			insertIndex: indexOf(fieldIds, clientId) + 1,
		};
	}),
	withDispatch(( dispatch, { clientId, parentId, insertIndex }) => {
		const { removeBlock, insertBlock } = dispatch('core/block-editor');
		return {
			remove: () => removeBlock(clientId, false),
			insert: () => insertBlock(
				createBlock(blockName, { type: 'text' }),
				insertIndex,
				parentId,
				false
			),
		};
	}),

])(ZuFieldEdit);
