/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 16:12:55
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\crossDrag\index.ts
 */
import { DragEvent, ReactNode } from 'react';
import { createBlock } from '../components/createBlock';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import UserConfig from '../../config';

/**
 *
 * @export
 * @interface LeftRegistComponentMapItem
 * @img 图片地址
 * @urlFn 组件异步加载函数
 */
export interface LeftRegistComponentMapItem {
	type: string;
	component: string;
	img: string;
	imgCustom?: ReactNode;
	displayName: string;
	urlFn?: () => Promise<any>;
}

let currentDrag: LeftRegistComponentMapItem | null = null;
export const dragEventResolve = function (item: LeftRegistComponentMapItem) {
	return {
		draggable: true,
		onDragStart: () => {
			currentDrag = item;
		},
		onDragOver: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
		},
		onDrop: () => {},
		onDragEnd: () => {},
	};
};

export const containerDragResolve = (config: UserConfig) => {
	const store = config.getStore();
	const componentRegister = config.getComponentRegister();
	return {
		onDragStart: () => {},
		onDragOver: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
		},
		onDrop: (e: DragEvent<HTMLDivElement>) => {
			const offsetX = e.nativeEvent.offsetX;
			const offestY = e.nativeEvent.offsetY;
			//drop后修改store，
			if (currentDrag) {
				// 还需要拿到注册的组件状态
				const origin = componentRegister.getComp(currentDrag.component);
				if (!origin) {
					console.log(currentDrag.component, 'wait the chunk pull compeletely and retry');
					return;
				}
				const target = e.target as HTMLElement;
				let newblock: IBlockType;
				if (!origin.needPosition) {
					newblock = createBlock(
						origin.initData.top ?? offestY,
						origin.initData.left ?? offsetX,
						origin
					);
				} else {
					if (target.id !== 'yh-container') {
						newblock = createBlock(offestY + target.offsetTop, offsetX + target.offsetLeft, origin);
					} else {
						newblock = createBlock(offestY, offsetX, origin);
					}
				}
				const data = deepCopy(store.getData());
				data.block.push(newblock);
				store.setData({ ...data });
			}
			currentDrag = null;
		},
		onDragEnd: () => {},
	};
};
