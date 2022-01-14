// Internal dependencies

import ZuRecaptcha from './../components/recaptcha.js';

const save = ({ attributes }) => {
	const {
		theme,
		size,
	} = attributes;

	return (
		<ZuRecaptcha { ...{ theme, size } }/>
	);
};

export default save;
