import { RefObject, useMemo } from 'react';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import React from 'react';
import classnames from 'classnames';
import styles from '../../index.less';
import UserConfig from '../../config';
import { getRect } from './calcWithRotate';
import { directionArr, DirectionType, resizeState } from './state';
import { getCursor } from './cursor';
interface BlockResizerProps {
	data: IBlockType;
	rect: RefObject<HTMLDivElement>;
	config: UserConfig;
}

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
	resizeState.currentTarget = e.nativeEvent.target as HTMLDivElement;
	const curDiv = resizeState.ref.current;
	let container = document.querySelector('#yh-container');
	if (!container) {
		container = document.querySelector('#yh-container-iframe');
	}
	if (!container) {
		return;
	}
	if (curDiv && ref.current) {
		const containerRect = container.getBoundingClientRect();
		const scale = config.getScaleState().value;
		const centerX = curDiv.offsetLeft + curDiv.offsetWidth / 2;
		const centerY = curDiv.offsetTop + curDiv.offsetHeight / 2;
		const poffsetLeft = resizeState.currentTarget.getBoundingClientRect().left - containerRect.left;
		const poffsetTop = resizeState.currentTarget.getBoundingClientRect().top - containerRect.top;
		//点相对于画布位置 未缩放
		const curPosition = {
			x: poffsetLeft / scale,
			y: poffsetTop / scale,
		};

		console.log(
			curPosition,
			'ww',
			centerX,
			centerY,
			resizeState.currentTarget.getBoundingClientRect().top,
			containerRect.top
		);
		resizeState.symmetricPoint = {
			x: centerX - (curPosition.x - centerX),
			y: centerY - (curPosition.y - centerY),
		};
		resizeState.curPosition = curPosition;
	}
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
		case 'r':
			v.width = width / scale + durX;
			break;
		case 'b':
			v.height = height / scale + durY;
			break;
		case 'l':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 't':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'rb':
			v.width = width / scale + durX;
			v.height = height / scale + durY;
			break;
		case 'rt':
			v.width = width / scale + durX;
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'lt':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 'lb':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			v.height = height / scale + durY;
			break;
		default:
			break;
	}
};

export const resizerMouseMove = (e: React.MouseEvent, config: UserConfig) => {
	//根据direction修改位置
	const scaleState = config.getScaleState();
	const store = config.getStore();
	if (
		resizeState.isResize &&
		resizeState.item &&
		resizeState.ref?.current &&
		resizeState.currentTarget
	) {
		let { clientX: moveX, clientY: moveY } = e;
		const scale = scaleState.value;

		let container = document.querySelector('#yh-container');
		if (!container) {
			container = document.querySelector('#yh-container-iframe');
		}
		if (!container) {
			return;
		}
		const containerRect = container.getBoundingClientRect();

		const rotate = resizeState.item.rotate.value;

		const movePoint = {
			x: (moveX - containerRect.left) / scale,
			y: (moveY - containerRect.top) / scale,
		};

		const symmetricPoint = resizeState.symmetricPoint;
		const clonedata = deepCopy(store.getData());
		const id = resizeState.item.id;
		const newblock: IBlockType[] = clonedata.block.map((v: IBlockType) => {
			if (v.id === id) {
				getRect(resizeState.direction, v, rotate, movePoint, symmetricPoint);
			}
			return v;
		});
		resizeState.startX = moveX;
		resizeState.startY = moveY;
		store.setData({ ...clonedata, block: newblock });
	}
};
export function BlockResizer(props: BlockResizerProps) {
	const rotate = props.data.rotate.value;
	const cursorMap = getCursor(rotate);
	const render = useMemo(() => {
		if (props.data.focus && props.data.resize) {
			return (
				<>
					{directionArr.map((v) => {
						return (
							<div
								style={{
									cursor: cursorMap[v],
								}}
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
	}, [cursorMap, props.config, props.data, props.rect]);

	return <>{render}</>;
}
