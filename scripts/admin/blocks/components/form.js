// WordPress dependencies

const { isNil } = lodash;

// Zukit dependencies

const { mergeClasses } = wp.zukit.utils;

// Internal dependencies

// import { mergeClasses } from './../utils.js';
import { pluginDefaults } from './../assets.js';

const { prefix: cssPrefix } = pluginDefaults;
// export const rowPrefix = 'components-zu-form';

const okIcon = null;
const errorIcon = null;
const defaultMessage = null;

function prefix_it(name, divider = '-') {
	if(isNil(name)) return cssPrefix;
	if(divider === '[]') return `${cssPrefix}[${name}]`;
	return `${cssPrefix}${divider}${name}`;
}

const ZuForm = ({
		className,
		name,
		title,

		children,
}) => {

	const nameWithPrefix = prefix_it(name);
	const formTitle = !title ? null : (
		<h2 className={ mergeClasses(prefix_it('subheading'), 'before_posting') }>{ title }</h2>
	);
	const loader = null;
	const nonce = null;
	const postId = 0; //get_the_ID(),
    const postLink = ''; //        trailingslashit($_SERVER['REQUEST_URI']),

	return (
		<div id={ nameWithPrefix } className={ mergeClasses(prefix_it('container'), name, className) }>
			{ loader }
			{ formTitle }
			<div className={ prefix_it('status') } style={ { visibility: 'hidden' } }>
                <span className="icon-ok">{ okIcon }</span>
                <span className="icon-error">{ errorIcon }</span>
                <span className="message" data-errmsg={ defaultMessage }></span>
            </div>
			<div className={ mergeClasses(prefix_it('form-container'), name) }>
				<form className={ mergeClasses(prefix_it('form'), name) }
					id={ prefix_it('form') }
					name={ prefix_it() }
					role="form"
					method="post"
				>
					{ nonce }
					<input type="hidden" name={ prefix_it('_fname', '[]') } value={ name }/>
					<input type="hidden" name={ prefix_it('_post_link', '[]') } value={ postLink }/>
					<input type="hidden" name={ prefix_it('_post_id', '[]') } value={ postId }/>
					{ children }
				</form>
			</div>
		</div>
	);
};

export default ZuForm;
