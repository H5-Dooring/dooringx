import { store } from '../../runtime/store';
import { RefObject } from 'react';
import { blockFocus, containerFocusRemove } from '../focusHandler';
import { marklineConfig } from '../markline/marklineConfig';
import { resizerMouseMove, resizerMouseUp } from '../resizeHandler';
import { scaleState } from '../scale/state';
import { selectRangeMouseMove, selectData, selectRangeMouseUp } from '../selectRange';
import { IBlockType } from '../store/storetype';
import { deepCopy, isMac } from '../utils';
import { wrapperMoveMouseUp } from '../../components/wrapperMove/event';
import { contextMenuState } from '../contextMenu';
import { innerDragState } from './state';

export const innerDrag = function (item: IBlockType, ref: RefObject<HTMLDivElement>) {
	return {
		onMouseDown: (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (!item.canDrag) {
				containerFocusRemove().onMouseDown(e);
				return;
			}
			blockFocus(e, item);
			if (item.id && innerDragState.lastClick && item.id !== innerDragState.lastClick.id) {
				contextMenuState.unmountContextMenu();
			}
			innerDragState.lastClick = item;

			if (item.position === 'static') {
				return;
			}
			if (ref.current) {
				ref.current.style.cursor = 'move';
				ref.current.style.willChange = 'left,right,width,height';
			}
			innerDragState.startX = e.clientX;
			innerDragState.startY = e.clientY;
			innerDragState.item = item;
			innerDragState.isDrag = true;
			innerDragState.ref = ref;
			innerDragState.current = store.getIndex();
		},
	};
};

export const innerContainerDrag = function () {
	let lastblock: null | IBlockType;
	const onMouseMove = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isMac() && contextMenuState.state) {
			//mac有bug
			return;
		}

		const id = innerDragState.item?.id;
		if (id && innerDragState.isDrag) {
			const current = store.getData().block.find((v) => v.id === id);
			if (current?.position === 'static') {
				return;
			}
			let { clientX: moveX, clientY: moveY } = e;
			const { startX, startY } = innerDragState;
			const scale = scaleState.value;
			let durX = (moveX - startX) / scale;
			let durY = (moveY - startY) / scale;
			let newblock: IBlockType[];
			if (lastblock !== innerDragState.item) {
				const cloneblock: IBlockType[] = deepCopy(store.getData().block);
				lastblock = innerDragState.item;
				newblock = cloneblock.map((v) => {
					if (v.focus && v.position !== 'static') {
						v.left = v.left + durX;
						v.top = v.top + durY;
					}
					return v;
				});
			} else {
				newblock = store.getData().block.map((v) => {
					if (v.focus && v.position !== 'static') {
						v.left = v.left + durX;
						v.top = v.top + durY;
					}
					return v;
				});
			}
			innerDragState.startX = moveX;
			innerDragState.startY = moveY;
			store.setData({ ...store.getData(), block: newblock });
		}
		resizerMouseMove(e);
		if (selectData.selectDiv) {
			selectRangeMouseMove(e);
		}
	};
	return {
		onMouseMove,
	};
};
export const innerContainerDragUp = function () {
	const onMouseUp = (e: React.MouseEvent) => {
		e.preventDefault();
		wrapperMoveMouseUp();
		selectRangeMouseUp(e);
		if (innerDragState.ref && innerDragState.ref.current) {
			innerDragState.ref.current.style.cursor = 'default';
			innerDragState.ref.current.style.willChange = 'auto';
		}
		resizerMouseUp();
		if (innerDragState.current) {
			const endindex = store.getIndex();
			store.getStoreList().splice(innerDragState.current, endindex - innerDragState.current);
			store.setIndex(innerDragState.current);
		}
		innerDragState.ref = null;
		innerDragState.isDrag = false;
		innerDragState.item = null;
		innerDragState.current = 0;
		marklineConfig.marklineUnfocus = null;
		store.forceupdate();
	};
	return {
		onMouseUp,
	};
};
