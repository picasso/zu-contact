// WordPress dependencies

const { isNil } = lodash;
// const { compose } = wp.compose;
// const { withSelect } = wp.data;

// Zukit dependencies

const { mergeClasses, toBool } = wp.zukit.utils;

// Internal dependencies

import { pluginDefaults, prefixIt } from './../assets.js';

const { nonce } = pluginDefaults;
const formPrefix = 'components-zu-form';

const okIcon = null;
const errorIcon = null;
const defaultMessage = null;

const ZuForm = ({
		className,
		titleEdit,

		postId,
		postLink,

		name,
		title,
		noajax,

		children,
}) => {

	const nameWithPrefix = prefixIt(name);
	const formTitle = titleEdit ? titleEdit : !title ? null : (
		<h2 className={ mergeClasses(prefixIt('subheading'), 'before_posting') }>{ title }</h2>
	);

	// const postLink = isNil(postSlug) ? '' : `/${trim(postSlug, '/')}/`;
	const formNonce = isNil(nonce) ? null : (
		<>
			<input type="hidden" id={ prefixIt('nonce', '_') } name={ prefixIt('nonce', '_') } value={ '__nonce__' }/>
			<input type="hidden" name="_wp_http_referer" value={ postLink }/>
		</>
	);

	const loader = null;

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
			{ loader }
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
