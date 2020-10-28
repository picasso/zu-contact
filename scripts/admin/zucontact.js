// Zukit dependencies

const { renderPlugin, toggleOption } = wp.zukit.render;

// Internal dependencies

import { zucontact } from './data.js';
// import ZumediaSizes from './sizes.js';

const EditZucontact = ({
		// id,
		// info,
		zukitPanel: ZukitPanel,
		title,
		// panels,
		options,
		updateOptions,
		// setUpdateHook,
		// ajaxAction,
		// noticeOperations,
}) => {

	const { options: optionsData } = zucontact;

// console.log(panels);
// console.log(options);

	return (
			<ZukitPanel title={ title }>
				{ toggleOption(optionsData, options, updateOptions) }
			</ZukitPanel>
	);
};

renderPlugin('zucontact', {
	edit: EditZucontact,
	panels: zucontact.panels,
});
