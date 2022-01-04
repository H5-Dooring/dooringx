/*
 * @Author: yehuozhili
 * @Date: 2021-07-21 20:51:58
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-27 16:32:30
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\rotateHandler\index.tsx
 */
import React from 'react';
import { RefObject, useMemo } from 'react';
import UserConfig from '../../config';
import { IBlockType, IStoreData } from '../store/storetype';
import styles from '../../index.less';
import { deepCopy } from '../utils';
import { ReloadOutlined, RotateLeftOutlined } from '@ant-design/icons';

interface rotateStateType {
	startX: number;
	startY: number;
	item: null | IBlockType;
	isRotate: boolean;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
}

export const rotateState: rotateStateType = {
	startX: 0,
	startY: 0,
	item: null,
	isRotate: false,
	ref: null,
	current: 0,
};

const onMouseDown = (
	e: React.MouseEvent,
	item: IBlockType,
	ref: RefObject<HTMLDivElement>,
	config: UserConfig
) => {
	e.stopPropagation();
	const store = config.getStore();
	rotateState.isRotate = true;
	rotateState.item = item;
	rotateState.startX = e.clientX;
	rotateState.startY = e.clientY;
	rotateState.ref = ref;
	rotateState.current = store.getIndex();
};

export const rotateMouseMove = (e: React.MouseEvent, config: UserConfig) => {
	const store = config.getStore();
	if (rotateState.isRotate && rotateState.item && rotateState.ref?.current) {
		let { clientX: moveX, clientY: moveY } = e;
		const { startX, startY } = rotateState;
		const rect = rotateState.ref.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);
		const rotateDegreeAfter = Math.atan2(moveY - centerY, moveX - centerX) / (Math.PI / 180);
		const startRotate = rotateState.item.rotate.value;
		const frotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;
		const clonedata = deepCopy(store.getData());
		const id = rotateState.item.id;
		const newblock: IBlockType[] = clonedata.block.map((v: IBlockType) => {
			if (v.id === id) {
				v.rotate.value = frotate;
			}
			return v;
		});
		store.setData({ ...clonedata, block: newblock });
	}
};

export const rotateMouseUp = (config: UserConfig) => {
	rotateState.isRotate = false;
	rotateState.item = null;
	const store = config.getStore();
	if (rotateState.current) {
		const endindex = store.getIndex();
		store.getStoreList().splice(rotateState.current, endindex - rotateState.current);
		store.setIndex(rotateState.current);
	}
	rotateState.current = 0;
};

interface RotateResizerProps {
	data: IBlockType;
	rect: RefObject<HTMLDivElement>;
	config: UserConfig;
}
export function RotateResizer(props: RotateResizerProps) {
	const render = useMemo(() => {
		if (props.data.focus && props.data.rotate.canRotate && props.data.canDrag) {
			return (
				<div
					onMouseDown={(e) => {
						onMouseDown(e, props.data, props.rect, props.config);
					}}
					className={styles.rotate}
					title={'rotate'}
				>
					<ReloadOutlined
						style={{
							color: '#2196f3',
						}}
					/>
				</div>
			);
		} else {
			return null;
		}
	}, [props.config, props.data, props.rect]);

	return <>{render}</>;
}

const resetResolve = (e: React.MouseEvent, item: IBlockType, config: UserConfig) => {
	e.stopPropagation();
	const store = config.getStore();
	const clonedata: IStoreData = deepCopy(store.getData());
	clonedata.block.forEach((v) => {
		if (v.id === item.id) {
			v.rotate.value = 0;
		}
	});
	store.setData(clonedata);
};

export function RotateReset(props: RotateResizerProps) {
	const render = useMemo(() => {
		if (props.data.focus && props.data.rotate.canRotate && props.data.canDrag) {
			return (
				<div
					onMouseDown={(e) => {
						resetResolve(e, props.data, props.config);
					}}
					className={styles.rotatereset}
					title={'rotate reset'}
				>
					<RotateLeftOutlined />
				</div>
			);
		} else {
			return null;
		}
	}, [props.config, props.data]);

	return <>{render}</>;
}
