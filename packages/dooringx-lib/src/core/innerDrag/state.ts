/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 12:09:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 12:09:46
 * @FilePath: \dooring-v2\src\core\innerDrag\state.ts
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
}

export const innerDragState: innerDragStateType = {
	startX: 0,
	startY: 0,
	item: null,
	isDrag: false,
	ref: null,
	current: 0,
	lastClick: null,
};
