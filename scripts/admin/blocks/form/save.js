// WordPress dependencies

const { InnerBlocks } = wp.blockEditor;

// Internal dependencies

import ZuForm from './../components/form.js';

const save = ({ className, attributes }) => {
	const {
		name,
		title,
	} = attributes;

	return (
		<ZuForm { ...{ className, name, title } }>
			<InnerBlocks.Content />
		</ZuForm>
	);
};

export default save;
