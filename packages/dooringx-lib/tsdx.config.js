/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:02:28
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 14:55:29
 * @FilePath: \dooringx\packages\dooringx-lib\tsdx.config.js
 */
const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');

module.exports = {
	rollup(config, options) {
		config.output.banner = '// 有问题请加QQ 673632758 by yehuozhili';
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
