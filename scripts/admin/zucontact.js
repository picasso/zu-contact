// WordPress dependencies

const { useCallback } = wp.element;

// Zukit dependencies

const { renderPage, toggleOption } = wp.zukit.render;
const { ListInput, ZukitPanel } = wp.zukit.components; // ZukitDivider

// Internal dependencies

import { zucontact } from './data.js';
// import ??Sizes from './sizes.js';

const EditZucontact = ({
		// id,
		// info,
		title,
		// panels,
		options,
		updateOptions,
		// setUpdateHook,
		// ajaxAction,
		// noticeOperations,
}) => {


	const { options: optionsData, notify } = zucontact;

	const onNotifyChange = useCallback(value => {
		updateOptions({ notify: value })
	}, [updateOptions]);

// console.log(panels);
// console.log(options);

	return (
		<>
			<ZukitPanel title={ title }>
				{ toggleOption(optionsData, options, updateOptions) }
				<ListInput
					strict="email"
					label={ notify.label }
					inputLabel={ notify.input }
					help={ notify.help }
					value={ options.notify }
					onChange={ onNotifyChange }
				/>
			</ZukitPanel>
		</>

	);
};

renderPage('zucontact', {
	edit: EditZucontact,
	panels: zucontact.panels,
});
