/* eslint-disable no-undef */
// See https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#advanced-usage
const defaultConfig = require('@wordpress/scripts/config/webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
// const {
// 	defaultConfig,
// 	defaultPlugins,
// 	updatedOptimization,
// 	updatedRules,
// 	createBannerPlugin,
// 	commonAlias,
// } = require('./wp-common.config.cjs')

// remove default `CleanWebpackPlugin`, `MiniCSSExtractPlugin` & `RtlCssPlugin` plugins
const defaultPlugins = defaultConfig.plugins.filter(
	(p) =>
		p.constructor?.name !== 'MiniCssExtractPlugin' &&
		p.constructor?.name !== 'RtlCssPlugin' &&
		p.constructor?.name !== 'CleanWebpackPlugin',
)

module.exports = {
	...defaultConfig,
	entry: {
		zucontact: ['./scripts/zucontact.js', './sass/zucontact.scss'],
	},
	output: {
		filename: 'js/[name].min.js',
		path: path.resolve(__dirname),
	},
	// optimization: updatedOptimization,
	plugins: [
		...defaultPlugins,
		new MiniCSSExtractPlugin({
			filename: 'css/[name].css',
		}),
		new CleanWebpackPlugin({
			protectWebpackAssets: false,
			cleanOnceBeforeBuildPatterns: ['*.map', 'js/*.map', 'css/*.map', 'js/*.js'],
			cleanAfterEveryBuildPatterns: ['**/*asset.php'],
			cleanStaleWebpackAssets: false,
		}),
	],
	// module: {
	// 	...defaultConfig.module,
	// 	rules: updatedRules,
	// },
	// resolve: { alias: commonAlias },
	stats: {
		children: false,
		assets: false,
		modules: false,
	},
}
