/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:40:37
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-06 22:07:33
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\preview.tsx
 */
import Container from './container';
import React, { ReactElement, ReactNode, useEffect, useState, CSSProperties } from 'react';
import UserConfig from '../config';
import { ComponentItemFactory } from '..';

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
	/**
	 *
	 * 预览样式
	 * @type {CSSProperties}
	 * @memberof PreviewProps
	 */
	previewContainerStyle?: CSSProperties;
}

function Preview(props: PreviewProps): ReactElement {
	const isEdit = props.config.getStoreChanger().isEdit();
	/// 这里需要在渲染组件之前必须把所有config加载完成，否则会导致先运行的函数无法运行
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const finalFn = () => {
			props.config.created();
			props.config.createdFn.forEach((v) => v());
			setTimeout(() => {
				// 链接数据
				props.config
					.getDataCenter()
					.initAddToDataMap(props.config.getStore().getData(), props.config.getStoreChanger());
				// 链接事件
				props.config
					.getEventCenter()
					.syncEventMap(props.config.getStore().getData(), props.config.getStoreChanger());

				// 设置全局
				const global = props.config.getStore().getData().globalState;
				const bodyColor = global?.bodyColor;
				const title = global?.title;
				if (title) {
					document.title = title;
				}
				if (bodyColor) {
					document.body.style.backgroundColor = bodyColor;
				}
				const customAnimate = global?.customAnimate;
				if (customAnimate && Array.isArray(customAnimate)) {
					// 插入自定义动画
					props.config.animateFactory.fromArrInsertKeyFrame(customAnimate);
				}

				if (props.completeFn) {
					props.completeFn();
				}
				props.config.beforeOnMounted();
				props.config.beforeOnMountedFn.forEach((v) => v());
				if (props.loadingState === undefined) {
					setLoading(false);
				}
			});
		};
		// 加载 script
		const scripts = props.config.getStore().getData().globalState['script'];
		if (scripts && Array.isArray(scripts) && scripts.length > 0) {
			const fn = async () => {
				const allp = scripts.map((v) => {
					return () =>
						new Promise<number>((res) => {
							const s = document.createElement('script');
							s.src = v;
							document.body.appendChild(s);
							s.onload = () => {
								const item = window[
									props.config.SCRIPTGLOBALNAME as any
								] as unknown as ComponentItemFactory;
								try {
									props.config.registComponent(item);
								} catch {
									console.error('read item fail:', v);
								}
								document.body.removeChild(s);
								res(0);
							};
						});
				});
				const allplen = allp.length;
				for (let i = 0; i < allplen; i++) {
					try {
						await allp[i]();
					} catch {
						console.error('script load fail:', scripts[i]);
					}
				}
				finalFn();
			};
			fn();
		} else {
			finalFn();
		}
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
					previewContainerStyle={props.previewContainerStyle}
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
