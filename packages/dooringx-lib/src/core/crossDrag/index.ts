/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-10-07 12:45:30
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\crossDrag\index.ts
 */
import React, { DragEvent, ReactNode } from 'react';
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

function resolveDrop(
	config: UserConfig,
	item: LeftRegistComponentMapItem,
	e: DragEvent<HTMLDivElement> | React.MouseEvent,
	x: number,
	y: number,
	dbclick: boolean = false
) {
	const componentRegister = config.getComponentRegister();
	const store = config.getStore();
	const origin = componentRegister.getComp(item.component);
	if (!origin) {
		console.log(item.component, 'wait the chunk pull compeletely and retry');
		return;
	}
	const target = e.target as HTMLElement;
	let newblock: IBlockType;
	//如果有宽高，那么让其在中间
	let fixX = x;
	let fixY = y;
	if (origin.initData.width && typeof origin.initData.width === 'number') {
		fixX = x - origin.initData.width / 2;
	}
	if (origin.initData.height && typeof origin.initData.height === 'number') {
		fixY = y - origin.initData.height / 2;
	}

	if (!origin.needPosition) {
		newblock = createBlock(
			origin.initData.top ?? fixY,
			origin.initData.left ?? fixX,
			origin,
			config
		);
	} else {
		if (dbclick) {
			newblock = createBlock(fixY, fixX, origin, config);
		} else {
			if (target.id !== 'yh-container') {
				newblock = createBlock(fixY + target.offsetTop, fixX + target.offsetLeft, origin, config);
			} else {
				newblock = createBlock(fixY, fixX, origin, config);
			}
		}
	}
	const data = deepCopy(store.getData());
	data.block.push(newblock);
	store.setData({ ...data });
}

export const dragEventResolve = function (item: LeftRegistComponentMapItem, config: UserConfig) {
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
		onDoubleClick: (e: React.MouseEvent) => {
			const container = config.getStore().getData().container;
			const x = container.width / 2;
			const y = container.height / 2;
			resolveDrop(config, item, e, x, y, true);
		},
	};
};

export const containerDragResolve = (config: UserConfig) => {
	return {
		onDragStart: () => {},
		onDragOver: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
		},
		onDrop: (e: DragEvent<HTMLDivElement>) => {
			const offsetX = Math.round(e.nativeEvent.offsetX);
			const offestY = Math.round(e.nativeEvent.offsetY);
			//drop后修改store，
			if (currentDrag) {
				resolveDrop(config, currentDrag, e, offsetX, offestY);
			}
			currentDrag = null;
		},
		onDragEnd: () => {},
	};
};
