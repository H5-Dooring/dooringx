/*
 * @Author: yehuozhili
 * @Date: 2021-03-09 15:19:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 11:31:44
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\containerResizer.ts
 */

import UserConfig from '../../config';
import { IStoreData } from '../store/storetype';
import { deepCopy } from '../utils';

export const containerState = {
	isDrag: false,
	startY: 0,
	startIndex: 0,
	minHeight: 667,
};

export const containerResizer = {
	onMousedown: (e: React.MouseEvent, config: UserConfig) => {
		const store = config.getStore();
		containerState.isDrag = true;
		containerState.startY = e.clientY;
		containerState.startIndex = store.getIndex();
	},
	onMouseMove: (e: React.MouseEvent, config: UserConfig) => {
		if (containerState.isDrag) {
			const scaleState = config.getScaleState();
			const store = config.getStore();
			const scale = scaleState.value;
			const diff = ((e.clientY - containerState.startY) / scale) * 2; //可以直接使用movementy
			const clonedata: IStoreData = deepCopy(store.getData());
			const height = clonedata.container.height;
			let tmpHeight =
				height + diff < containerState.minHeight ? containerState.minHeight : height + diff;
			clonedata.container.height = tmpHeight;
			store.setData(clonedata);
			containerState.startY = e.clientY;
		}
	},
	onMouseUp: (config: UserConfig) => {
		if (containerState.isDrag) {
			const store = config.getStore();
			containerState.isDrag = false;
			const endIndex = store.getIndex();
			store.getStoreList().splice(containerState.startIndex, endIndex - containerState.startIndex);
			store.setIndex(containerState.startIndex);
		}
	},
};
