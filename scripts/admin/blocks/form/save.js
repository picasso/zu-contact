// wordpress dependencies
import { InnerBlocks } from '@wordpress/block-editor'

// internal dependencies
import ZuForm from '../components/form.js'

const save = ({ className, attributes }) => {
	const { postId, postLink, name, title, noajax, loaderHTML } = attributes

	return (
		<ZuForm {...{ className, name, title, noajax, postId, postLink, loaderHTML }}>
			<InnerBlocks.Content />
		</ZuForm>
	)
}

export default save
