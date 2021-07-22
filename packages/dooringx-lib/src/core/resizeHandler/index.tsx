import { RefObject, useMemo } from 'react';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import React from 'react';
import classnames from 'classnames';
import styles from '../../index.less';
import UserConfig from '../../config';
import { getRect } from './calcWithRotate';
interface BlockResizerProps {
	data: IBlockType;
	rect: RefObject<HTMLDivElement>;
	config: UserConfig;
}
interface resizeStateType {
	startX: number;
	startY: number;
	item: null | IBlockType;
	isResize: boolean;
	direction: DirectionType;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
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
};

const onMouseDown = (
	e: React.MouseEvent,
	direction: DirectionType,
	item: IBlockType,
	ref: RefObject<HTMLDivElement>,
	config: UserConfig
) => {
	e.stopPropagation();
	const store = config.getStore();
	resizeState.isResize = true;
	resizeState.item = item;
	resizeState.startX = e.clientX;
	resizeState.startY = e.clientY;
	resizeState.direction = direction;
	resizeState.ref = ref;
	resizeState.current = store.getIndex();
};

export const resizerMouseUp = (config: UserConfig) => {
	resizeState.isResize = false;
	resizeState.item = null;
	const store = config.getStore();
	if (resizeState.current) {
		const endindex = store.getIndex();
		store.getStoreList().splice(resizeState.current, endindex - resizeState.current);
		store.setIndex(resizeState.current);
	}
	resizeState.current = 0;
};

/**
 *
 * 无旋转时计算函数
 * @param {IBlockType} v
 * @param {number} durX
 * @param {number} durY
 * @param {{
 * 		value: number;
 * 		maxValue: number;
 * 		minValue: number;
 * 	}} scaleState
 */
export const changePosition = (
	v: IBlockType,
	durX: number,
	durY: number,
	scaleState: {
		value: number;
		maxValue: number;
		minValue: number;
	}
) => {
	const direction = resizeState.direction;
	const { width, height } = resizeState.ref!.current!.getBoundingClientRect();
	const scale = scaleState.value;
	let tmpy = height / scale - durY;
	let tmpx = width / scale - durX;
	switch (direction) {
		case 'right':
			v.width = width / scale + durX;
			break;
		case 'bottom':
			v.height = height / scale + durY;
			break;
		case 'left':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 'top':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'bottomright':
			v.width = width / scale + durX;
			v.height = height / scale + durY;
			break;
		case 'topright':
			v.width = width / scale + durX;
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'topleft':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 'bottomleft':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			v.height = height / scale + durY;
			break;
		default:
			break;
	}
};

// export const getRealStart = (rect: DOMRect): { realStartX: number; realStartY: number } => {
// 	const direction = resizeState.direction;
// 	switch (direction) {
// 		case 'left':
// 			return {
// 				realStartX: rect.left,
// 				realStartY: rect.top + rect.height / 2,
// 			};
// 		case 'top':
// 			return {
// 				realStartX: rect.left + rect.width / 2,
// 				realStartY: rect.top,
// 			};
// 		case 'right':
// 			return {
// 				realStartX: rect.left + rect.width,
// 				realStartY: rect.top + rect.height / 2,
// 			};
// 		case 'bottom':
// 			return {
// 				realStartX: rect.left + rect.width / 2,
// 				realStartY: rect.top + rect.height,
// 			};
// 		case 'topleft':
// 			return {
// 				realStartX: rect.left,
// 				realStartY: rect.top,
// 			};
// 		case 'topright':
// 			return {
// 				realStartX: rect.left + rect.width,
// 				realStartY: rect.top,
// 			};
// 		case 'bottomleft':
// 			break;
// 		case 'bottomright':
// 			break;
// 		default:
// 			break;
// 	}
// };

export const resizerMouseMove = (e: React.MouseEvent, config: UserConfig) => {
	//根据direction修改位置
	const scaleState = config.getScaleState();
	const store = config.getStore();
	if (resizeState.isResize && resizeState.item && resizeState.ref?.current) {
		let { clientX: moveX, clientY: moveY } = e;
		const { startX, startY } = resizeState;
		const scale = scaleState.value;
		console.log(scale);
		const rect = resizeState.ref.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		// const durX = (moveX - startX) / scale;
		// const durY = (moveY - startY) / scale;
		// rect经过旋转后
		// const { realStartX, realStartY } = getRealStart(rect);

		const rotate = resizeState.item.rotate.value;
		const curPositon = {
			x: startX,
			y: startY,
		};
		const symmetricPoint = {
			x: centerX - (startX - centerX),
			y: centerY - (startY - centerY),
		};

		console.log(centerX, centerY);
		const clonedata = deepCopy(store.getData());
		const id = resizeState.item.id;
		const newblock: IBlockType[] = clonedata.block.map((v: IBlockType) => {
			if (v.id === id) {
				getRect(resizeState.direction, v, rotate, curPositon, symmetricPoint);
			}
			return v;
		});
		resizeState.startX = moveX;
		resizeState.startY = moveY;
		store.setData({ ...clonedata, block: newblock });
	}
};

const directionArr: DirectionType[] = [
	'top',
	'topleft',
	'left',
	'topright',
	'bottomleft',
	'bottom',
	'right',
	'bottomright',
];

export function BlockResizer(props: BlockResizerProps) {
	const render = useMemo(() => {
		if (props.data.focus && props.data.resize) {
			return (
				<>
					{directionArr.map((v) => {
						return (
							<div
								key={v}
								className={classnames(styles.resizepoint, styles[v])}
								onMouseDown={(e) => {
									onMouseDown(e, v, props.data, props.rect, props.config);
								}}
								onMouseUp={() => {
									resizerMouseUp(props.config);
								}}
							></div>
						);
					})}
				</>
			);
		} else {
			return null;
		}
	}, [props.config, props.data, props.rect]);

	return <>{render}</>;
}
