/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:40:37
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-19 16:46:56
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\preview.tsx
 */
import Container from './container';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import UserConfig from '../config';

export interface PreviewProps {
	config: UserConfig;
	/**
	 *
	 * loading node
	 * @type {ReactNode}
	 * @memberof PreviewProps
	 */
	loadText?: ReactNode;
	/**
	 *
	 * 手动维护状态
	 * @type {boolean}
	 * @memberof PreviewProps
	 */
	loadingState?: boolean;
	/**
	 *
	 * 页面链接完后调用
	 * @type {Function}
	 * @memberof PreviewProps
	 */
	completeFn?: Function;
}

function Preview(props: PreviewProps): ReactElement {
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
			if (props.completeFn) {
				props.completeFn();
			}
			if (props.loadingState === undefined) {
				setLoading(false);
			}
		});
	}, [props, props.config]);

	if (isEdit) {
		// 正常情况不会走这
		const state = props.config.getStoreChanger().getOrigin()!.now;
		return (
			<>
				<Container config={props.config} context="preview" state={state}></Container>
			</>
		);
	} else {
		const loadingNode = <div>{props.loadText ? props.loadText : 'loading'}</div>;
		const container = (
			<>
				<Container
					config={props.config}
					context="preview"
					state={props.config.getStore().getData()}
				></Container>
			</>
		);
		if (props.loadingState === undefined) {
			if (loading) {
				return loadingNode;
			} else {
				return container;
			}
		} else {
			if (props.loadingState) {
				return loadingNode;
			} else {
				return container;
			}
		}
	}
}
export default Preview;
