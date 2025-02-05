// internal dependencies
import ZuField from '../components/field.js'

const save = ({ className, attributes }) => {
	const { id, label, type, required, value, placeholder, rows } = attributes

	return <ZuField {...{ className, id, type, required, value, placeholder, label, rows }} />
}

export default save
