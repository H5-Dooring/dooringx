/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 20:31:47
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\contextMenu\index.tsx
 */
import { Button } from 'antd';
import React, { RefObject, useState } from 'react';
import { ReactElement } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import UserConfig from '../../config';
import { isMac } from '../utils';

const ContextMenu = () => {
	const handleclick = () => {
		unmountContextMenu();
	};
	const forceUpdate = useState(0)[1];
	contextMenuState.forceUpdate = () => {
		forceUpdate((pre) => pre + 1);
	};
	return (
		<div
			style={{
				left: contextMenuState.left,
				top: contextMenuState.top,
				position: 'fixed',
				background: 'rgb(24, 23, 23)',
			}}
		>
			<Button
				onClick={() => {
					handleclick();
				}}
			>
				请参考文档自定义右键菜单
			</Button>
		</div>
	);
};
export interface ContextMenuStateProps {
	left: number;
	top: number;
	menu: HTMLElement | null;
	parent: HTMLDivElement | null;
	contextMenu: ReactElement;
	unmountContextMenu: () => void;
	observer: null | MutationObserver;
	initLeft: number;
	initTop: number;
	forceUpdate: Function;
	state: boolean;
}
export const contextMenuState: ContextMenuStateProps = {
	left: 0,
	top: 0,
	menu: null,
	parent: null,
	contextMenu: <ContextMenu />,
	unmountContextMenu: unmountContextMenu,
	observer: null,
	initLeft: 0,
	initTop: 0,
	forceUpdate: () => {},
	state: false,
};

export function contextMenuEvent(
	e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	ref: RefObject<HTMLDivElement>,
	userConfig: UserConfig
) {
	e.preventDefault();
	const scaleState = userConfig.getScaleState();
	contextMenuState.unmountContextMenu();
	const config: MutationObserverInit = {
		attributes: true,
	};
	const callback: MutationCallback = (mutationsList) => {
		if (isMac()) {
			//mac 有bug
			contextMenuState.unmountContextMenu();
		} else {
			for (let mutation of mutationsList) {
				if (mutation.type === 'attributes') {
					const scale = scaleState.value;
					const curLeft = parseFloat((mutation.target as HTMLDivElement).style.left);
					const curTop = parseFloat((mutation.target as HTMLDivElement).style.top);
					const diffL = (curLeft - contextMenuState.initLeft) * scale;
					const diffT = (curTop - contextMenuState.initTop) * scale;
					contextMenuState.initLeft = curLeft;
					contextMenuState.initTop = curTop;
					contextMenuState.left = contextMenuState.left + diffL;
					contextMenuState.top = contextMenuState.top + diffT;
					contextMenuState.forceUpdate();
				}
			}
		}
	};
	contextMenuState.state = true;
	contextMenuState.observer = new MutationObserver(callback);
	if (ref.current) {
		//记录初始值
		contextMenuState.initTop = parseFloat(ref.current.style.top);
		contextMenuState.initLeft = parseFloat(ref.current.style.left);
		contextMenuState.observer.observe(ref.current, config);
	}
	contextMenuState.left = e.clientX;
	contextMenuState.top = e.clientY;
	if (!contextMenuState.menu) {
		contextMenuState.menu = document.createElement('div');
		document.body && document.body.appendChild(contextMenuState.menu);
	}
	if (!contextMenuState.parent) {
		contextMenuState.parent = document.createElement('div');
	}
	contextMenuState.menu.appendChild(contextMenuState.parent);
	ReactDOM.render(contextMenuState.contextMenu, contextMenuState.parent);
}

export function unmountContextMenu() {
	contextMenuState.state = false;
	if (contextMenuState.observer) {
		contextMenuState.observer.disconnect();
	}
	if (contextMenuState.menu && contextMenuState.parent) {
		unmountComponentAtNode(contextMenuState.parent);
		contextMenuState.menu.removeChild(contextMenuState.parent);
		contextMenuState.parent = null;
	}
}

export default ContextMenu;
