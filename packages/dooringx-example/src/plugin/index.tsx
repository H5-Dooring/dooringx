/*
 * @Author: yehuozhili
 * @Date: 2021-02-27 21:33:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 19:32:16
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\index.tsx
 */

import { InitConfig } from 'dooringx-lib';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { ContainerOutlined, HighlightOutlined } from '@ant-design/icons';
import commandModules from './commanderModules';
import { functionMap } from './functionMap';
import { Formmodules } from './formComponentModules';

const LeftRegistMap: LeftRegistComponentMapItem[] = [
	// build 时如果用代码分割会生成多个文件，这样就不能生成多类型文件。
	// 建议基础包全部不分割。后面插件包可以用webpack的特性，所以插件包用新脚手架制作
	// 基础包不独立出去的原因是部分左侧分类起始值最好规定住
	// {
	//   type: 'xxa',
	//   component: 'asyncCo',
	//   img: '',
	//   urlFn: () => import('./registComponents/asyncCo'),
	//  displayName:'xxx'
	// },
	{
		type: 'basic',
		component: 'button',
		img: 'icon-anniu',
		displayName: '按钮',
		urlFn: () => import('./registComponents/button'),
	},
];

export const defaultConfig: Partial<InitConfig> = {
	leftAllRegistMap: LeftRegistMap,
	leftRenderListCategory: [
		{
			type: 'basic',
			icon: <HighlightOutlined />,
			displayName: '基础组件',
		},
		{
			type: 'xxc',
			icon: <ContainerOutlined />,
			custom: true,
			customRender: <div>我是自定义渲染</div>,
		},
	],
	initComponentCache: {},
	rightRenderListCategory: [
		{
			type: 'style',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					外观
				</div>
			),
		},
		{
			type: 'animate',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					动画
				</div>
			),
		},
		{
			type: 'actions',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					事件
				</div>
			),
		},
	],
	initFunctionMap: functionMap,
	initCommandModule: commandModules,
	initFormComponents: Formmodules,
};

export default defaultConfig;
