// WordPress dependencies

// const { isNil } = lodash;

// Zukit dependencies

const { Loader } = wp.zukit.components;

// Internal dependencies

import { mergeClasses, toBool, prefixIt } from './../utils.js';
import { mail as okIcon, flag as errorIcon } from './../assets.js';

const formPrefix = 'components-zu-form';
const defaultMessage = null;

const ZuForm = ({
		className,
		titleEdit,
		loaderEdit,
		// recaptchaEdit,

		postId = '',
		postLink = '',

		name,
		title,
		noajax,

		loaderHTML,
		withoutNonce,
		children,
}) => {

	const nameWithPrefix = prefixIt(name);
	const formTitle = titleEdit ? titleEdit : !title ? null : (
		<h2 className={ mergeClasses(prefixIt('subheading'), 'before_posting') }>{ title }</h2>
	);

	const formNonce = withoutNonce ? null : (
		<>
			<input type="hidden" id={ prefixIt('nonce') } name={ prefixIt('nonce', '_') } value={ '__nonce__' }/>
			<input type="hidden" name="_wp_http_referer" value={ postLink }/>
		</>
	);

	const formLoader = loaderEdit ? loaderEdit : (
		<Loader className={ prefixIt('loader') } loaderHTML={ loaderHTML } />
	);

	return (
		<div
			id={ nameWithPrefix }
			className={ mergeClasses(
				prefixIt('container'),
				name,
				formPrefix,
				{ '__edit-mode': titleEdit },
				className)
			}
			data-id={ name }
			data-noajax={ toBool(noajax, true) }
		>
			{ formLoader }
			{ formTitle }
			<div className={ prefixIt('status') } style={ { visibility: 'hidden' } }>
                <span className="icon-ok">{ okIcon }</span>
                <span className="icon-error">{ errorIcon }</span>
                <span className="message" data-errmsg={ defaultMessage }></span>
            </div>
			<div className={ mergeClasses(prefixIt('form-container'), name) }>
				<form className={ mergeClasses(prefixIt('form'), name) }
					id={ prefixIt('form') }
					name={ prefixIt() }
					role="form"
					method="post"
				>
					{ formNonce }
					<input type="hidden" name={ prefixIt('_fname', '[]') } value={ name }/>
					<input type="hidden" className="__postLink" name={ prefixIt('_post_link', '[]') } value={ postLink }/>
					<input type="hidden" className="__postId" name={ prefixIt('_post_id', '[]') } value={ postId }/>
					{ children }

				</form>
			</div>
		</div>
	);
};

ZuForm.formPrefix = formPrefix;
export default ZuForm;
