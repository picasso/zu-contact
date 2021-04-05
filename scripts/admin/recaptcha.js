// WordPress dependencies

const { get, mapKeys, split } = lodash;
const { Button, SelectControl, ExternalLink } = wp.components;
const { useCallback } = wp.element;

// Zukit dependencies

const { testComponentWithUpdate } = wp.zukit.render;
const { ZukitDivider, ZukitPanel, AdvTextControl } = wp.zukit.components;

const ZucontactRecaptcha = ({
		data,
		options,
		updateOptions,
}) => {

	const settings = get(options, 'recaptcha') || {};
	const updateRecaptchaOptions = useCallback(update => {
		const mailerUpdate = mapKeys(update, (_, key) => `recaptcha.${key}`);
		updateOptions(mailerUpdate);
	}, [updateOptions]);

	const [beforeLinks = '', afterLinks = ''] = split(data.note, '$links');

	const restore = testComponentWithUpdate('RestoreRecaptcha', updateOptions);

	return (
			<ZukitPanel id="recaptcha_keys" options={ options } initialOpen={ false }>
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
					className="__block_label"
					label={ data.theme }
					value={ settings.theme || 'light' }
					onChange={ value => updateRecaptchaOptions({ theme: value }) }
					options={ data.themeOptions }
				/>
				<SelectControl
					className="__block_label"
					label={ data.size }
					value={ settings.size || 'normal' }
					onChange={ value => updateRecaptchaOptions({ size: value }) }
					options={ data.sizeOptions }
				/>
				<ZukitDivider bottomHalf size={ 2 }/>
				<div className="__flex __right">
					{ restore }
					<Button
						isSecondary
						className="__plugin_actions __auto magenta"
						label={ data.resetAll }
						icon="image-rotate"
						onClick={ () => updateOptions({ recaptcha: null }) }
					>
						{ data.resetAll }
					</Button>
				</div>
			</ZukitPanel>
	);
};

export default ZucontactRecaptcha;
