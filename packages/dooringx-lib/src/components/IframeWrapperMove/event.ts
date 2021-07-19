/*
 * @Author: yehuozhili
 * @Date: 2021-02-21 22:17:29
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-19 10:11:14
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\IframeWrapperMove\event.ts
 */
import { RefObject } from 'react';
import { containerResizer } from '../../core/resizeHandler/containerResizer';
import { contextMenuState } from '../../core/contextMenu';
import UserConfig from '../../config';

export interface WrapperMoveStateProps {
	isDrag: boolean;
	startX: number;
	startY: number;
	needX: number;
	needY: number;
}

export interface WrapperMoveRef {
	ref: null | RefObject<HTMLDivElement>;
}

export const wrapperMoveState: WrapperMoveStateProps = {
	isDrag: false,
	startX: 0,
	startY: 0,
	needX: 0,
	needY: 0,
};

export const wrapperRefState: WrapperMoveRef = {
	ref: null,
};

export const wrapperEvent = (ref: RefObject<HTMLDivElement>, config: UserConfig) => {
	const scale = config.getScaleState().value;
	const store = config.getStore();
	return {
		onMouseDown: (e: React.MouseEvent) => {
			// e.preventDefault();// 不能使用preventDefault 否则弹窗输入框焦点无法触发
			contextMenuState.unmountContextMenu();
			if (e.target !== ref.current) {
			} else {
				wrapperMoveState.isDrag = true;
				wrapperMoveState.startX = e.clientX;
				wrapperMoveState.startY = e.clientY;
				if (ref.current) {
					ref.current.style.cursor = 'grab';
					wrapperRefState.ref = ref;
				}
			}
		},
		onMouseMove: (e: React.MouseEvent) => {
			//e.preventDefault();
			if (wrapperMoveState.isDrag) {
				const diffX = e.clientX - wrapperMoveState.startX;
				const diffY = e.clientY - wrapperMoveState.startY;
				wrapperMoveState.needX = wrapperMoveState.needX + diffX / scale;
				wrapperMoveState.needY = wrapperMoveState.needY + diffY / scale;
				wrapperMoveState.startX = e.clientX;
				wrapperMoveState.startY = e.clientY;

				store.forceUpdate();
			}
			containerResizer.onMouseMove(e, config);
		},
	};
};
export const wrapperMoveMouseUp = (config: UserConfig) => {
	if (wrapperRefState.ref && wrapperRefState.ref.current) {
		wrapperRefState.ref.current.style.cursor = 'default';
	}
	containerResizer.onMouseUp(config);
	wrapperMoveState.isDrag = false;
};
