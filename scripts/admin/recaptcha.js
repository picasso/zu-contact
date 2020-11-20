// WordPress dependencies

const { get, mapKeys, split } = lodash;
const { Button, SelectControl, ExternalLink } = wp.components;
const { useCallback } = wp.element;

// Zukit dependencies

const { ZukitDivider, ZukitPanel, AdvTextControl } = wp.zukit.components;

// NOTE: delete after tests
const test = {
	sitekey: '***REMOVED***',
	secret: '***REMOVED***',
	theme: 'dark',
	size: 'compact',
};

const ZucontactRecaptcha = ({
		data,
		options,
		updateOptions,
}) => {

// Zubug.data({options});

	const settings = get(options, 'recaptcha') || {};
	const updateRecaptchaOptions = useCallback(update => {
		const mailerUpdate = mapKeys(update, (_, key) => `recaptcha.${key}`);
		updateOptions(mailerUpdate);
	}, [updateOptions]);

	const [beforeLinks = '', afterLinks = ''] = split(data.note, '$links');

	return (
			<ZukitPanel id="recaptcha_keys" initialOpen={ true }>
				<div className="__note">
					{ beforeLinks }
					<ExternalLink href=" https://www.google.com/recaptcha/admin/">Google reCAPTCHA</ExternalLink><br/>
					{ afterLinks }
				</div>
				<AdvTextControl
					isPassword
					label={ data.sitekey }
					value={ settings.sitekey }
					onChange={ value => updateRecaptchaOptions({ sitekey: value }) }
				/>
				<AdvTextControl
					isPassword
					label={ data.secret }
					value={ settings.secret }
					onChange={ value => updateRecaptchaOptions({ secret: value }) }
				/>
				<SelectControl
					// id={ id }
					label={ data.theme }
					value={ settings.theme || 'light' }
					onChange={ value => updateRecaptchaOptions({ theme: value }) }
					options={ data.themeOptions }
				/>
				<ZukitDivider size={ 2 }/>
				<div className="__flex __right">

					<Button
						isSecondary
						className="__plugin_actions __auto magenta"
						icon="lightbulb"
						onClick={ () => updateOptions({ recaptcha: test }) }
					>
						{ 'Restore Settings' }
					</Button>

					<Button
						isSecondary
						isLarge
						className="__plugin_actions __auto admin-blue"
						label={ data.resetAll }
						icon="trash"
						onClick={ () => updateOptions({ recaptcha: null }) }
					>
						{ data.resetAll }
					</Button>
				</div>
			</ZukitPanel>
	);
};

export default ZucontactRecaptcha;
