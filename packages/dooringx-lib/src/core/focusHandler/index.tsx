/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 12:10:16
 * @FilePath: \dooring-v2\src\core\focusHandler\index.tsx
 */
import { store } from '../../runtime/store';
import { innerDragState } from '../innerDrag/state';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import { selectRangeMouseDown } from '../selectRange';
import { unmountContextMenu } from '../contextMenu';
import { focusState } from './state';

export function containerFocusRemove() {
	const onMouseDown = (e: React.MouseEvent) => {
		const clonedata = deepCopy(store.getData());
		const newBlock = clonedata.block.map((v: IBlockType) => {
			v.focus = false;
			return v;
		});
		focusState.blocks = [];
		store.setData({ ...clonedata, block: newBlock });
		if (!innerDragState.item) {
			selectRangeMouseDown(e);
		}
		unmountContextMenu();
	};
	return {
		onMouseDown,
	};
}

export function blockFocus(e: React.MouseEvent, item: IBlockType) {
	const clonedata = deepCopy(store.getData());
	if (e.shiftKey) {
		const newBlock = clonedata.block.map((v: IBlockType) => {
			if (v.id === item.id) {
				v.focus = true;
				focusState.blocks.push(item);
			}
			return v;
		});
		store.setData({ ...clonedata, block: newBlock });
	} else {
		let blocks: IBlockType[] = [];
		const newBlock = clonedata.block.map((v: IBlockType) => {
			if (v.id === item.id) {
				blocks.push(item);
				v.focus = true;
			} else {
				v.focus = false;
			}
			return v;
		});
		focusState.blocks = blocks;
		store.setData({ ...clonedata, block: newBlock });
	}
}
