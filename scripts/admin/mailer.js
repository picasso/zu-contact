import { get, mapKeys, split } from 'lodash-es'

// wordpress dependencies
import { Button, ExternalLink, ToggleControl } from '@wordpress/components'
import { useCallback } from '@wordpress/element'

// Zukit dependencies
const { testComponentWithUpdate } = wp.zukit.render
const { ZukitDivider, ZukitPanel, AdvTextControl } = wp.zukit.components

const ZucontactMailer = ({ data, options, updateOptions }) => {
	const settings = get(options, 'mailer') || {}
	const updateMailerOptions = useCallback(
		(update) => {
			const mailerUpdate = mapKeys(update, (_, key) => `mailer.${key}`)
			updateOptions(mailerUpdate)
		},
		[updateOptions],
	)

	const [beforeLinks = '', afterLinks = ''] = split(data.note, '$links')

	const restore = testComponentWithUpdate('RestoreMailer', updateOptions)

	return (
		<ZukitPanel id="mailer" initialOpen={false}>
			<div className="__note">
				{beforeLinks}
				<ExternalLink href="https://pepipost.com/">Pepipost</ExternalLink>
				{` ${data.or} `}
				<ExternalLink href="https://www.mailjet.com/">Mailjet</ExternalLink>
				{afterLinks}
			</div>
			<AdvTextControl
				strict="url"
				label={data.server}
				value={settings.server || ''}
				onChange={(value) => updateMailerOptions({ server: value })}
			/>
			<AdvTextControl
				strict="number"
				label={data.port}
				value={settings.port || ''}
				onChange={(value) => updateMailerOptions({ port: value })}
			/>
			<ZukitDivider size={2} />
			<ToggleControl
				label={data.ssl}
				help={data.ssl_help}
				checked={!!settings.ssl}
				onChange={() => updateMailerOptions({ ssl: !settings.ssl })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={data.auth}
				help={data.auth_help}
				checked={!!settings.auth}
				onChange={() => updateMailerOptions({ auth: !settings.auth })}
				__nextHasNoMarginBottom
			/>
			{settings.auth && (
				<>
					<AdvTextControl
						label={data.username}
						value={settings.username || ''}
						onChange={(value) => updateMailerOptions({ username: value })}
					/>
					<AdvTextControl
						isPassword
						label={data.password}
						value={settings.password}
						onChange={(value) => updateMailerOptions({ password: value })}
					/>
				</>
			)}
			<AdvTextControl
				strict="email"
				label={data.from}
				value={settings.from || ''}
				onChange={(value) => updateMailerOptions({ from: value })}
			/>
			<ZukitDivider bottomHalf size={2} />
			<div className="__flex __right">
				{restore}
				<Button
					variant="secondary"
					className="__plugin_actions __auto magenta"
					label={data.resetAll}
					icon="image-rotate"
					onClick={() => updateOptions({ mailer: null })}
					__next40pxDefaultSize
				>
					{data.resetAll}
				</Button>
			</div>
		</ZukitPanel>
	)
}

export default ZucontactMailer
