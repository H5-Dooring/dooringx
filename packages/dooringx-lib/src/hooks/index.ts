/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:35:15
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-17 20:59:26
 * @FilePath: \dooringx\packages\dooringx-lib\src\hooks\index.ts
 */
import { useEffect, useMemo, useState } from 'react';
import UserConfig from '../config';
import { ComponentRenderConfigProps } from '../core/components/componentItem';
import { registCommandFn, unRegistCommandFn } from '../core/command/runtime';
import { postMessage } from '../core/utils';

export function useStoreState(
	config: UserConfig,
	extraFn: Function = () => {},
	everyFn: Function = () => {}
) {
	const store = config.getStore();
	const [state, setState] = useState(store.getData());
	const forceUpdate = useState(0)[1];
	useEffect(() => {
		const unRegister = store.subscribe(() => {
			const data = store.getData();
			setState(data);
			config.getEventCenter().syncEventMap(store.getData(), config.getStoreChanger());
			extraFn();
		});
		store.setForceUpdate(() => forceUpdate((v) => v + 1));
		const commandModules = config.getConfig().initCommandModule;
		const commander = config.getCommanderRegister();
		registCommandFn(commandModules, commander);
		return () => {
			unRegister();
			unRegistCommandFn(commandModules, commander);
		};
	}, [config, extraFn, forceUpdate, store]);
	useEffect(() => {
		everyFn();
	}, [everyFn]);

	// 去除默认滚动
	useEffect(() => {
		const fn1 = function (event: Event) {
			if ((event as MouseEvent).ctrlKey === true || (event as MouseEvent).metaKey) {
				event.preventDefault();
			}
		};
		const fn2 = function (event: Event) {
			if ((event as MouseEvent).ctrlKey === true || (event as MouseEvent).metaKey) {
				event.preventDefault();
			}
		};
		window.addEventListener('mousewheel', fn1, { passive: false });
		//firefox
		window.addEventListener('DOMMouseScroll', fn2, { passive: false });
		return () => {
			window.removeEventListener('mousewheel', fn1);
			window.removeEventListener('mousewheel', fn2);
		};
	}, []);

	return [state];
}

/**
 *
 * 组件动态注册eventMap与eventCenter
 * @export
 * @param {ComponentRenderConfigProps} props render参数传来的
 * @param {string} eventName 同一个组件名称不能重复
 * @returns
 */
export function useDynamicAddEventCenter(
	props: ComponentRenderConfigProps,
	eventName: string,
	displayName: string
) {
	const eventCenter = useMemo(() => {
		return props.config.getEventCenter();
	}, [props.config]);

	useEffect(() => {
		const data = props.store.getData();
		const map = props.data.eventMap;
		const storeItem = data.block.find((v) => v.id === props.data.id);
		if (storeItem) {
			if (!map[eventName]) {
				//动态store加属性需要通过hook
				storeItem.eventMap[eventName] = {
					arr: [],
					displayName,
					userSelect: [],
				};
				eventCenter.manualUpdateMap(eventName, displayName);
			}
		}
	}, [displayName, eventCenter, eventName, props.data.eventMap, props.data.id, props.store]);
	return;
}

/**
 *
 *
 * @export
 * @param {string} origin iframe地址
 * @param {UserConfig} config
 * @param {boolean} sign iframe onload
 * @param {string} [target]  iframeid 默认是yh-container-iframe
 * @return {*}
 */
export function useIframePostMessage(
	origin: string,
	config: UserConfig,
	sign: boolean,
	target?: string
) {
	const store = config.getStore();

	const fn = useMemo(() => {
		config.iframeId = target || config.iframeId;
		config.iframeOrigin = origin;
		return () => {
			const data = {
				store: store.getData(),
				scaleState: config.getScaleState(),
				origin: config.getStoreChanger().getOrigin(),
				isEdit: config.getStoreChanger().isEdit(),
				wrapperState: config.getWrapperMove().iframe,
			};

			postMessage(data, origin, target);
		};
	}, [config, origin, store, target]);

	useEffect(() => {
		let unRegister = () => {};
		if (sign) {
			config.refreshIframe = fn;
			unRegister = store.subscribe(() => {
				// dom等无法传递
				// config由context带去，传递store和必要state
				fn();
			});
		}
		return () => {
			unRegister();
		};
	}, [config.refreshIframe, fn, sign, store]);

	return [fn];
}
