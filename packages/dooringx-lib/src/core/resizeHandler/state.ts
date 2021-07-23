/*
 * @Author: yehuozhili
 * @Date: 2021-07-23 20:31:30
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-23 20:32:23
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\state.ts
 */

import { RefObject } from 'react';
import { IBlockType } from '../store/storetype';

export interface Point {
	x: number;
	y: number;
}

interface resizeStateType {
	startX: number;
	startY: number;
	item: null | IBlockType;
	isResize: boolean;
	direction: DirectionType;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
	currentTarget: HTMLDivElement | null;
	symmetricPoint: Point;
	curPosition: Point;
}
export type DirectionType =
	| 'top'
	| 'topleft'
	| 'topright'
	| 'left'
	| 'bottomleft'
	| 'bottom'
	| 'bottomright'
	| 'right';
export const resizeState: resizeStateType = {
	startX: 0,
	startY: 0,
	item: null,
	isResize: false,
	direction: 'bottom',
	ref: null,
	current: 0,
	currentTarget: null,
	symmetricPoint: {
		x: 0,
		y: 0,
	},
	curPosition: {
		x: 0,
		y: 0,
	},
};
