import { RefObject } from 'react';
import { blockFocus, containerFocusRemove } from '../focusHandler';
import { marklineConfig } from '../markline/marklineConfig';
import { resizerMouseMove, resizerMouseUp } from '../resizeHandler';
import { selectRangeMouseMove, selectData, selectRangeMouseUp } from '../selectRange';
import { IBlockType } from '../store/storetype';
import { deepCopy, isMac } from '../utils';
import { wrapperMoveMouseUp } from '../../components/wrapperMove/event';
import { wrapperMoveMouseUp as iframeWrapperMove } from '../../components/IframeWrapperMove/event';
import { contextMenuState } from '../contextMenu';
import { innerDragState } from './state';
import UserConfig from '../../config';
import { rotateMouseMove, rotateMouseUp } from '../rotateHandler';

export const innerDrag = function (
	item: IBlockType,
	ref: RefObject<HTMLDivElement>,
	config: UserConfig
) {
	const store = config.getStore();
	return {
		onMouseDown: (e: React.MouseEvent) => {
			//e.preventDefault();
			e.stopPropagation();
			if (!item.canDrag) {
				containerFocusRemove(config).onMouseDown(e);
				return;
			}
			blockFocus(e, item, config);
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
			innerDragState.startX = Math.round(e.clientX);
			innerDragState.startY = Math.round(e.clientY);
			innerDragState.item = item;
			innerDragState.itemX = item.left;
			innerDragState.itemY = item.top;
			innerDragState.isDrag = true;
			innerDragState.ref = ref;
			innerDragState.current = store.getIndex();
		},
	};
};

export const innerContainerDrag = function (config: UserConfig) {
	let lastblock: null | IBlockType;
	const store = config.getStore();
	const scaleState = config.getScaleState();
	const onMouseMove = (e: React.MouseEvent) => {
		//e.preventDefault();
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
			let durX = Math.round((moveX - startX) / scale);
			let durY = Math.round((moveY - startY) / scale);
			let newblock: IBlockType[];
			if (lastblock !== innerDragState.item) {
				const cloneblock: IBlockType[] = deepCopy(store.getData().block);
				lastblock = innerDragState.item;
				newblock = cloneblock.map((v) => {
					if (v.focus && v.position !== 'static') {
						v.left = Math.round(innerDragState.itemX + durX);
						v.top = Math.round(innerDragState.itemY + durY);
					}
					return v;
				});
			} else {
				newblock = store.getData().block.map((v) => {
					if (v.focus && v.position !== 'static') {
						v.left = Math.round(innerDragState.itemX + durX);
						v.top = Math.round(innerDragState.itemY + durY);
					}
					return v;
				});
			}
			store.setData({ ...store.getData(), block: newblock });
		}
		resizerMouseMove(e, config);
		rotateMouseMove(e, config);
		if (selectData.selectDiv) {
			selectRangeMouseMove(e);
		}
	};
	return {
		onMouseMove,
	};
};
export const innerContainerDragUp = function (config: UserConfig, iframe = false) {
	const store = config.getStore();
	const onMouseUp = (e: React.MouseEvent) => {
		// e.preventDefault(); 这个会导致无法取消选中
		iframeWrapperMove(config);
		wrapperMoveMouseUp(config);
		selectRangeMouseUp(e, config, iframe);
		if (innerDragState.ref && innerDragState.ref.current) {
			innerDragState.ref.current.style.cursor = 'default';
			innerDragState.ref.current.style.willChange = 'auto';
		}
		resizerMouseUp(config);
		rotateMouseUp(config);
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
