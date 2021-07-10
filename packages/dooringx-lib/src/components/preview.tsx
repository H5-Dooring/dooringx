/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:40:37
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 16:09:19
 * @FilePath: \DooringV2\packages\dooringx-lib\src\components\preview.tsx
 */
import Container from './container';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import UserConfig from '../config';

function Preview(props: { config: UserConfig; loadText?: ReactNode }): ReactElement {
	const isEdit = props.config.getStoreChanger().isEdit();
	/// 这里需要在渲染组件之前必须把所有config加载完成，否则会导致先运行的函数无法运行
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 链接数据
		props.config
			.getDataCenter()
			.initAddToDataMap(props.config.getStore().getData(), props.config.getStoreChanger());
		// 链接事件
		props.config
			.getEventCenter()
			.syncEventMap(props.config.getStore().getData(), props.config.getStoreChanger());
		setTimeout(() => {
			// 设置全局
			const bodyColor = props.config.getStore().getData().globalState?.bodyColor;
			if (bodyColor) {
				document.body.style.backgroundColor = bodyColor;
			}

			setLoading(false);
		});
	}, [props.config]);

	if (isEdit) {
		// 正常情况不会走这
		const state = props.config.getStoreChanger().getOrigin()!.now;
		return (
			<>
				<Container config={props.config} context="preview" state={state}></Container>
			</>
		);
	} else {
		if (loading) {
			return <div>{props.loadText ? props.loadText : 'loading'}</div>;
		} else {
			return (
				<>
					<Container
						config={props.config}
						context="preview"
						state={props.config.getStore().getData()}
					></Container>
				</>
			);
		}
	}
}
export default Preview;
