/*
 * @Author: yehuozhili
 * @Date: 2021-02-21 22:17:29
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-04-05 18:24:27
 * @FilePath: \dooringv2\src\components\wrapperMove\event.ts
 */
import { store } from '../../runtime/store';
import { RefObject } from 'react';
import { containerResizer } from '../../core/resizeHandler/containerResizer';
import { contextMenuState } from '../../core/contextMenu';

export interface WrapperMoveStateProps {
	isDrag: boolean;
	startX: number;
	startY: number;
	needX: number;
	needY: number;
	ref: null | RefObject<HTMLDivElement>;
}

export const wrapperMoveState: WrapperMoveStateProps = {
	isDrag: false,
	startX: 0,
	startY: 0,
	needX: 0,
	needY: 0,
	ref: null,
};

export const wrapperEvent = (ref: RefObject<HTMLDivElement>) => {
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
					wrapperMoveState.ref = ref;
				}
			}
		},
		onMouseMove: (e: React.MouseEvent) => {
			e.preventDefault();
			if (wrapperMoveState.isDrag) {
				const diffX = e.clientX - wrapperMoveState.startX;
				const diffY = e.clientY - wrapperMoveState.startY;
				wrapperMoveState.needX = wrapperMoveState.needX + diffX;
				wrapperMoveState.needY = wrapperMoveState.needY + diffY;
				wrapperMoveState.startX = e.clientX;
				wrapperMoveState.startY = e.clientY;
				store.forceUpdate();
			}
			containerResizer.onMouseMove(e);
		},
	};
};
export const wrapperMoveMouseUp = () => {
	if (wrapperMoveState.ref && wrapperMoveState.ref.current) {
		wrapperMoveState.ref.current.style.cursor = 'default';
	}
	containerResizer.onMouseUp();
	wrapperMoveState.isDrag = false;
};
