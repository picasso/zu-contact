// WordPress dependencies

const { get, mapKeys, split } = lodash;
const { Button, ToggleControl, ExternalLink } = wp.components;
const { useCallback } = wp.element;

// Zukit dependencies

const { testComponentWithUpdate } = wp.zukit.render;
const { ZukitDivider, ZukitPanel, AdvTextControl } = wp.zukit.components;

const ZucontactMailer = ({
		data,
		options,
		updateOptions,
}) => {

	const settings = get(options, 'mailer') || {};
	const updateMailerOptions = useCallback(update => {
		const mailerUpdate = mapKeys(update, (_, key) => `mailer.${key}`);
		updateOptions(mailerUpdate);
	}, [updateOptions]);

	const [beforeLinks = '', afterLinks = ''] = split(data.note, '$links');

	const restore = testComponentWithUpdate('RestoreMailer', updateOptions);

	return (
			<ZukitPanel id="mailer" initialOpen={ false }>
				<div className="__note">
					{ beforeLinks }
					<ExternalLink href="https://pepipost.com/">Pepipost</ExternalLink>
					{ ` ${data.or} ` }
					<ExternalLink href="https://www.mailjet.com/">Mailjet</ExternalLink>
					{ afterLinks }
				</div>
				<AdvTextControl
					strict="url"
					label={ data.server }
					value={ settings.server || '' }
					onChange={ value => updateMailerOptions({ server: value }) }
				/>
				<AdvTextControl
					strict="number"
					label={ data.port }
					value={ settings.port || '' }
					onChange={ value => updateMailerOptions({ port: value }) }
				/>
				<ZukitDivider size={ 2 }/>
				<ToggleControl
					label={ data.ssl }
					help={ data.ssl_help  }
					checked={ !!settings.ssl }
					onChange={ () => updateMailerOptions({ ssl: !settings.ssl }) }
				/>
				<ToggleControl
					label={ data.auth }
					help={ data.auth_help  }
					checked={ !!settings.auth }
					onChange={ () => updateMailerOptions({ auth: !settings.auth }) }
				/>
				{ settings.auth &&
					<>
						<AdvTextControl
							label={ data.username }
							value={ settings.username || '' }
							onChange={ value => updateMailerOptions({ username: value }) }
						/>
						<AdvTextControl
							isPassword
							label={ data.password }
							value={ settings.password }
							onChange={ value => updateMailerOptions({ password: value }) }
						/>
					</>
				}
				<AdvTextControl
					strict="email"
					label={ data.from }
					value={ settings.from || '' }
					onChange={ value => updateMailerOptions({ from: value }) }
				/>
				<ZukitDivider size={ 2 }/>
				<div className="__flex __right">
					{ restore }
					<Button
						isSecondary
						className="__plugin_actions __auto magenta"
						label={ data.resetAll }
						icon="image-rotate"
						onClick={ () => updateOptions({ mailer: null }) }
					>
						{ data.resetAll }
					</Button>
				</div>
			</ZukitPanel>
	);
};

export default ZucontactMailer;
