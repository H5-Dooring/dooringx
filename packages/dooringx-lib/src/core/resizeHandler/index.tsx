import { RefObject, useMemo } from 'react';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import React from 'react';
import classnames from 'classnames';
import styles from '../../index.less';
import UserConfig from '../../config';
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
	direction: directionType;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
}
type directionType =
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
	direction: directionType,
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
const changePosition = (
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

export const resizerMouseMove = (e: React.MouseEvent, config: UserConfig) => {
	//根据direction修改位置
	const scaleState = config.getScaleState();
	const store = config.getStore();
	if (resizeState.isResize && resizeState.item) {
		let { clientX: moveX, clientY: moveY } = e;
		const { startX, startY } = resizeState;
		const scale = scaleState.value;
		let durX = (moveX - startX) / scale;
		let durY = (moveY - startY) / scale;
		const clonedata = deepCopy(store.getData());
		const newblock: IBlockType[] = clonedata.block.map((v: IBlockType) => {
			if (v.id === resizeState.item!.id) {
				changePosition(v, durX, durY, scaleState);
			}
			return v;
		});
		resizeState.startX = moveX;
		resizeState.startY = moveY;
		store.setData({ ...clonedata, block: newblock });
	}
};

const directionArr: directionType[] = [
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
