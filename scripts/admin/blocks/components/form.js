// Zukit dependencies
const { Loader } = wp.zukit.components

// internal dependencies
import { flag as errorIcon, mail as okIcon } from './../assets.js'
import { mergeClasses, prefixIt } from './../utils.js'

const formPrefix = 'components-zu-form'
const defaultMessage = null

const ZuForm = ({
	isEditor,
	className,
	titleEdit,
	loaderEdit,

	postId = '',
	postLink = '',

	name,
	title,

	loaderHTML,
	withoutNonce,
	children,
}) => {
	const nameWithPrefix = prefixIt(name)
	const formTitle = titleEdit ? (
		titleEdit
	) : !title ? null : (
		<h2 className={mergeClasses(prefixIt('subheading'), 'before_posting')}>{title}</h2>
	)

	const formNonce = withoutNonce ? null : (
		<>
			<input
				type="hidden"
				id={prefixIt('nonce')}
				name={prefixIt('nonce', '_')}
				value={'__nonce__'}
			/>
			<input type="hidden" name="_wp_http_referer" value={postLink} />
		</>
	)

	const formLoader = loaderEdit ? (
		loaderEdit
	) : (
		<Loader className={prefixIt('loader')} loaderHTML={loaderHTML} />
	)

	return (
		<div
			id={nameWithPrefix}
			className={mergeClasses(
				prefixIt('container'),
				name,
				formPrefix,
				{ '__edit-mode': isEditor },
				className,
			)}
			data-id={name}
		>
			{formLoader}
			{formTitle}
			<div className={prefixIt('status')} style={{ visibility: 'hidden' }}>
				<span className="icon-ok">{okIcon}</span>
				<span className="icon-error">{errorIcon}</span>
				<span className="message" data-errmsg={defaultMessage} />
			</div>
			<div className={mergeClasses(prefixIt('form-container'), name)}>
				<form
					className={mergeClasses(prefixIt('form'), name)}
					id={prefixIt('form')}
					name={prefixIt()}
					role="form"
					method="post"
				>
					{formNonce}
					<input type="hidden" name={prefixIt('_fname', '[]')} value={name} />
					<input
						type="hidden"
						className="__postLink"
						name={prefixIt('_post_link', '[]')}
						value={postLink}
					/>
					<input
						type="hidden"
						className="__postId"
						name={prefixIt('_post_id', '[]')}
						value={postId}
					/>
					{children}
				</form>
			</div>
		</div>
	)
}

ZuForm.formPrefix = formPrefix
export default ZuForm
