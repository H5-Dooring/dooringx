/*
 * @Author: yehuozhili
 * @Date: 2021-08-05 10:50:57
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-23 23:38:31
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\registComponents\inputCo.tsx
 */

import { Input } from 'antd';
import React, { useState } from 'react';
import { ComponentItemFactory, createPannelOptions, UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { IBlockType } from '../../../../dooringx-lib/dist/core/store/storetype';
import Store from '../../../../dooringx-lib/dist/core/store';
import { useEffect } from 'react';

interface InputProps {
	data: IBlockType;
	context: string;
	store: Store;
	config: UserConfig;
}

const InputTemp = (pr: InputProps) => {
	const { props } = pr.data;
	const data = pr.data;
	const dataCenter = pr.config.getDataCenter();
	const eventCenter = pr.config.getEventCenter();

	const [value, setValue] = useState('');
	const [err, setErr] = useState('');
	useEffect(() => {
		let unregist = () => {};
		if (props.op1) {
			const functionCenter = eventCenter.getFunctionCenter();
			unregist = functionCenter.register({
				id: `${pr.data.id}+validate-func`,
				fn: async (_ctx, next, _config, _args: any, _eventList, _iname) => {
					if (value === '') {
						setErr(props.warnning);
					} else {
						setErr('');
						next();
					}
				},
				config: [
					{
						name: '验证已填函数',
						data: [],
						options: {
							receive: '_changeval',
							multi: false,
						},
					},
				],
				name: `${pr.data.id}+验证已填函数`,
				componentId: pr.data.id,
			});
		}
		return () => {
			unregist();
		};
	}, [value, props.warnning, props.op1]);

	useEffect(() => {
		let unregist = () => {};
		if (props.op2) {
			const functionCenter = eventCenter.getFunctionCenter();
			unregist = functionCenter.register({
				id: `${pr.data.id}+get-input`,
				fn: async (ctx, next, _config, args: any, _eventList, _iname) => {
					const key = args['_changeval'][0];
					ctx[key] = value;
					next();
				},
				config: [
					{
						name: '获取数据至上下文',
						data: ['ctx'],
						options: {
							receive: '_changeval',
							multi: false,
						},
					},
				],
				name: `${pr.data.id}+获取输入数据`,
				componentId: pr.data.id,
			});
		}
		return () => {
			unregist();
		};
	}, [value, props.op2]);

	return (
		<div
			style={{
				display: 'inline-block',
				zIndex: data.zIndex,
				width: data.width,
				height: data.height,
				overflow: 'hidden',
			}}
		>
			<Input
				value={value}
				type={props.type}
				placeholder={props.placeholder}
				style={{ height: 'calc( 100% - 20px )' }}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			></Input>

			<div style={{ height: '20px', color: 'red', fontSize: '12px' }}>{err}</div>
		</div>
	);
};

const InputCo = new ComponentItemFactory(
	'input',
	'输入组件',
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'placeholder', //用于发送回的props，必传 ,跨组件传递需要指定额外字
				label: '文本',
			}),
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'warnning', //用于发送回的props，必传 ,跨组件传递需要指定额外字
				label: '验证消息',
			}),
		],
		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '开启验证函数',
			}),
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op2',
				label: '开启获取文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	{
		syncList: ['synckey'],
		props: {
			type: 'text',
			placeholder: '请输入',
			warnning: '输入框不可为空',
			op1: false,
			op2: false,
		},
		width: 200,
		height: 55,
	},
	(data, context, store, config) => {
		return <InputTemp data={data} context={context} store={store} config={config}></InputTemp>;
	},
	true
);

export default InputCo;
