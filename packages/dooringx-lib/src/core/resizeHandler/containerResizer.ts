/*
 * @Author: yehuozhili
 * @Date: 2021-03-09 15:19:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 19:25:09
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\containerResizer.ts
 */

import { store } from '../../runtime/store';
import { scaleState } from '../scale/state';
import { IStoreData } from '../store/storetype';
import { deepCopy } from '../utils';

export const containerState = {
	isDrag: false,
	startY: 0,
	startIndex: 0,
	minHeight: 667,
};

export const containerResizer = {
	onMousedown: (e: React.MouseEvent) => {
		containerState.isDrag = true;
		containerState.startY = e.clientY;
		containerState.startIndex = store.getIndex();
	},
	onMouseMove: (e: React.MouseEvent) => {
		if (containerState.isDrag) {
			const scale = scaleState.value;
			const diff = ((e.clientY - containerState.startY) / scale) * 2;
			const clonedata: IStoreData = deepCopy(store.getData());
			const height = clonedata.container.height;
			let tmpHeight =
				height + diff < containerState.minHeight ? containerState.minHeight : height + diff;
			clonedata.container.height = tmpHeight;
			store.setData(clonedata);
			containerState.startY = e.clientY;
		}
	},
	onMouseUp: () => {
		if (containerState.isDrag) {
			containerState.isDrag = false;
			const endIndex = store.getIndex();
			store.getStoreList().splice(containerState.startIndex, endIndex - containerState.startIndex);
			store.setIndex(containerState.startIndex);
		}
	},
};
