/* eslint-disable no-undef */
// See https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#advanced-usage

const defaultConfig = require('@wordpress/scripts/config/webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

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
		zucontact: ['./scripts/admin/zucontact.js', './sass/admin/zucontact.scss'],
		'zucontact-blocks': [
			'./scripts/admin/zucontact-blocks.js',
			'./sass/admin/zucontact-blocks.scss',
		],
	},
	output: {
		filename: 'js/[name].min.js',
		path: path.resolve(__dirname, 'admin'),
	},
	plugins: [
		...defaultPlugins,
		new MiniCSSExtractPlugin({
			filename: 'css/[name].css',
		}),
		new CleanWebpackPlugin({
			protectWebpackAssets: false,
			cleanOnceBeforeBuildPatterns: ['**/*.map', 'css/*.css', 'js/*.js'],
			cleanAfterEveryBuildPatterns: ['**/*asset.php'],
			cleanStaleWebpackAssets: false,
		}),
	],
	stats: {
		children: false,
		assets: false,
		modules: false,
	},
}
