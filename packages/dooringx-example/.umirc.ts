/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 11:11:52
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 20:18:39
 * @FilePath: \visual-editor\.umirc.ts
 */
import { defineConfig } from 'umi';

export default defineConfig({
	nodeModulesTransform: {
		type: 'none',
	},
	dynamicImport: {
		loading: '@/components/Loading',
	},
	locale: {
		default: 'zh-CN',
		antd: true,
		baseNavigator: true,
	},
	routes: [
		{
			exact: false,
			path: '/',
			component: '@/layouts/index',
			routes: [
				{ path: '/', component: '@/pages/index' },
				{ path: '/preview', component: '@/pages/preview' },
				{ path: '/iframe', component: '@/pages/iframe' },
			],
		},
	],
	fastRefresh: {},
});
