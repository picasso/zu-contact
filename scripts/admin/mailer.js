// WordPress dependencies

const { get, mapKeys, split } = lodash;
const { Button, ToggleControl, ExternalLink } = wp.components;
const { useCallback } = wp.element;

// Zukit dependencies

const { ZukitDivider, ZukitPanel, AdvTextControl } = wp.zukit.components;

// NOTE: delete after tests
const test = {
	server: "***REMOVED***",
	port: 25,
	ssl: false,
	auth: true,
	username: "***REMOVED***",
	password: "***REMOVED***_a4763150cf844ba269e4497f2eb8290f",
	from: "mailer@***REMOVED***.ru",
};

const ZucontactMailer = ({
		data,
		options,
		updateOptions,
}) => {

// Zubug.data({options});

	const settings = get(options, 'mailer') || {};
	const updateMailerOptions = useCallback(update => {
		const mailerUpdate = mapKeys(update, (_, key) => `mailer.${key}`);
		updateOptions(mailerUpdate);
	}, [updateOptions]);

	const [beforeLinks = '', afterLinks = ''] = split(data.note, '$links');

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
					// onKeyDown={ onKeyDown }
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

					<Button
						isSecondary
						className="__plugin_actions __auto magenta"
						icon="lightbulb"
						onClick={ () => updateOptions({ mailer: test }) }
					>
						{ 'Restore Pepipost Settings' }
					</Button>

					<Button
						isSecondary
						isLarge
						className="__plugin_actions __auto admin-blue"
						label={ data.resetAll }
						icon="trash"
						onClick={ () => updateOptions({ mailer: null }) }
					>
						{ data.resetAll }
					</Button>
				</div>
			</ZukitPanel>
	);
};

export default ZucontactMailer;
