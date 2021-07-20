/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 15:39:47
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\focusHandler\index.tsx
 */
import { innerDragState } from '../innerDrag/state';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import { selectRangeMouseDown } from '../selectRange';
import { unmountContextMenu } from '../contextMenu';
import UserConfig from '../../config';

export function containerFocusRemove(config: UserConfig, iframe = false) {
	const store = config.getStore();

	const onMouseDown = (e: React.MouseEvent) => {
		const focusState = config.getFocusState();
		const clonedata = deepCopy(store.getData());
		const newBlock = clonedata.block.map((v: IBlockType) => {
			v.focus = false;
			return v;
		});
		focusState.blocks = [];
		store.setData({ ...clonedata, block: newBlock });
		if (!innerDragState.item) {
			selectRangeMouseDown(e, config, iframe);
		}
		unmountContextMenu();
	};
	return {
		onMouseDown,
	};
}

export function blockFocus(e: React.MouseEvent, item: IBlockType, config: UserConfig) {
	const store = config.getStore();
	const clonedata = deepCopy(store.getData());
	const focusState = config.getFocusState();
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
