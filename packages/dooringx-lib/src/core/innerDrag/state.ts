/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 12:09:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-28 16:57:05
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\innerDrag\state.ts
 */
import { RefObject } from 'react';

import { IBlockType } from '../store/storetype';

export interface innerDragStateType {
	startX: number;
	startY: number;
	item: null | IBlockType;
	isDrag: boolean;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
	lastClick: null | IBlockType;
	itemX: number;
	itemY: number;
}

export const innerDragState: innerDragStateType = {
	startX: 0,
	startY: 0,
	item: null,
	isDrag: false,
	ref: null,
	current: 0,
	lastClick: null,
	itemX: 0,
	itemY: 0,
};
