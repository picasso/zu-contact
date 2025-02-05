// internal dependencies
import edit from './edit.js'
import metadata from './metadata.js'
import save from './save.js'
import transforms from './transforms.js'

export { name, title } from './metadata.js'
export const settings = {
	...metadata,

	transforms,
	edit,
	save,
}
