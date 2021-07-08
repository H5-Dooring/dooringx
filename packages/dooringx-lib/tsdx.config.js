/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:02:28
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-04 16:40:17
 * @FilePath: \DooringV2\packages\dooring-v2-lib\tsdx.config.js
 */
const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');

module.exports = {
	rollup(config, options) {
		config.plugins.push(
			postcss({
				inject: false,
				extract: true,
				extensions: ['.less', '.css'],
				modules: true, // 使用css modules
			})
		);
		config.plugins = config.plugins.map((p) =>
			p.name === 'replace'
				? replace({
						'process.env.NODE_ENV': JSON.stringify(options.env),
						preventAssignment: true,
				  })
				: p
		);
		return config;
	},
};
