import { keys } from 'lodash-es'

// Zukit dependencies
const { setupOptionsStore, setupCoreStore } = wp.zukit.data

// internal dependencies
import { zucontact } from './../../data.js'
import { pluginDefaults } from './../assets.js'

// Setup and register Options Store ---------------------------------------------------------------]

const { router } = pluginDefaults

const { registerOptionsStore, useGetOption, useSetOption, useGetOptions, useUpdateOptions } =
	setupOptionsStore(router)

registerOptionsStore()

const { useSvgFromFile, useCoreData } = setupCoreStore(router)

// Prepare data for Plugin Options section --------------------------------------------------------]

const { options: optionsData, recaptcha: recaptchaData } = zucontact
const pluginOptions = keys(optionsData)
// const recaptchaData = pick(recaptcha, ['theme', 'themeOptions']);
const recaptchaTheme = {
	key: 'recaptcha.theme',
	label: recaptchaData.theme,
	options: recaptchaData.themeOptions,
}

export {
	useSvgFromFile,
	useCoreData,
	useGetOption,
	useGetOptions,
	useSetOption,
	useUpdateOptions,
	pluginOptions,
	optionsData,
	recaptchaTheme,
	router as pluginRouter,
}
