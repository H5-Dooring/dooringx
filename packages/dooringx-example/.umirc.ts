/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 11:11:52
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-17 10:15:46
 * @FilePath: \dooringx\packages\dooringx-example\.umirc.ts
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
				{ path: '/iframeTest', component: '@/pages/iframeTest' },
				{ path: '/container', component: '@/pages/container' },
				{ path: '/preview', component: '@/pages/preview' },
				{ path: '/iframe', component: '@/pages/iframe' },
			],
		},
	],
	fastRefresh: {},
});
