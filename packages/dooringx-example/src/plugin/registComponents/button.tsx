/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:35:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 14:03:01
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\registComponents\button.tsx
 */

import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
	changeUserValue,
	ComponentItemFactory,
	createPannelOptions,
	useDynamicAddEventCenter,
} from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';

function ButtonTemp(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const eventCenter = useMemo(() => {
		return pr.config.getEventCenter();
	}, [pr.config]);

	useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
	useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');

	useEffect(() => {
		// 模拟抛出事件
		if (pr.context === 'preview') {
			eventCenter.runEventQueue(`${pr.data.id}-init`, pr.config);
		}
	}, [eventCenter, pr.config, pr.context, pr.data.id]);

	const [text, setText] = useState('');
	useEffect(() => {
		const functionCenter = eventCenter.getFunctionCenter();
		const unregist = functionCenter.register(
			`${pr.data.id}+改变文本函数`,
			async (ctx, next, config, args: any, _eventList, iname) => {
				const userSelect = iname.data;
				const ctxVal = changeUserValue(
					userSelect['改变文本数据源'],
					args,
					'_changeval',
					config,
					ctx
				);
				const text = ctxVal[0];
				setText(text);
				next();
			},
			[
				{
					name: '改变文本数据源',
					data: ['ctx', 'input', 'dataSource'],
					options: {
						receive: '_changeval',
						multi: false,
					},
				},
			]
		);
		return () => {
			unregist();
		};
	}, []);

	return (
		<Button
			style={{
				width: pr.data.width ? pr.data.width : props.sizeData[0],
				height: pr.data.height ? pr.data.height : props.sizeData[1],
				borderRadius: props.borderRadius + 'px',
				border: `${props.borderData.borderWidth}px ${props.borderData.borderStyle} ${props.borderData.borderColor}`,
				backgroundColor: props.backgroundColor,
				color: props.fontData.color,
				fontSize: props.fontData.fontSize,
				fontWeight: props.fontData.fontWeight,
				fontStyle: props.fontData.fontStyle,
				textDecoration: props.fontData.textDecoration,
				lineHeight: props.lineHeight,
			}}
			onClick={() => {
				eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
			}}
		>
			{text ? text : props.text}
		</Button>
	);
}

const MButton = new ComponentItemFactory(
	'button',
	'按钮',
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
				text: 'yehuozhili',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	{
		props: {
			text: 'yehuozhili',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
			borderData: {
				borderWidth: 0,
				borderColor: 'rgba(0,0,0,1)',
				borderStyle: 'solid',
			},
			fontData: {
				fontSize: 14,
				textDecoration: 'none',
				fontStyle: 'normal',
				color: 'rgba(255,255,255,1)',
				fontWeight: 'normal',
			},
		},
		width: 100, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		height: 30, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		rotate: {
			canRotate: true,
			value: 0,
		},
	},
	(data, context, store, config) => {
		return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
	},
	true
);

export default MButton;
