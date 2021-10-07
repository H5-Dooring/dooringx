/*
 * @Author: yehuozhili
 * @Date: 2021-09-30 10:01:24
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-30 11:19:59
 * @FilePath: \dooringx\packages\dooringx-plugin-template\.babelrc.js
 */
const envPreset = [
	"@babel/preset-env",
	{
		modules: false,
		// Allow importing core-js in entrypoint and use browserlist to select polyfills
		useBuiltIns: "entry",
		// Set the corejs version we are using to avoid warnings in console
		corejs: 3,
		// Exclude transforms that make all code slower
		exclude: ["transform-typeof-symbol"],
		loose: true,
		targets: {
			node: "current",
		},
	},
];

module.exports = {
	presets: [
		[
			"@babel/preset-react",
			{
				development: false,
			},
		],
		[
			"@babel/preset-typescript",
			{
				isTSX: true,
				allExtensions: true,
			},
		],
		envPreset,
	],
	plugins: [
		["@babel/plugin-proposal-class-properties", { loose: true }],
		["@babel/plugin-syntax-dynamic-import"],
		["@babel/plugin-transform-runtime"],
	],
	env: {
		production: {
			plugins: [
				[
					"babel-plugin-transform-react-remove-prop-types",
					{
						removeImport: true,
					},
				],
			],
		},
	},
};
