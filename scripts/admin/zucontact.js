// WordPress dependencies

const { useCallback } = wp.element;

// Zukit dependencies

const { renderPage, toggleOption } = wp.zukit.render;
const { ListInput, ZukitPanel } = wp.zukit.components;

// Internal dependencies

import { zucontact } from './data.js';
import ZucontactMailer from './mailer.js';
import ZucontactRecaptcha from './recaptcha.js';

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


	const { options: optionsData, notify, mailer, recaptcha } = zucontact;

	const onNotifyChange = useCallback(value => {
		updateOptions({ notify: value })
	}, [updateOptions]);

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
			<ZucontactRecaptcha
				data={ recaptcha }
				options={ options }
				updateOptions={ updateOptions }
			/>
			<ZucontactMailer
				data={ mailer }
				options={ options }
				updateOptions={ updateOptions }
			/>
		</>

	);
};

renderPage('zucontact', {
	edit: EditZucontact,
	panels: zucontact.panels,
});