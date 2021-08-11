/*
 * @Author: yehuozhili
 * @Date: 2021-08-10 20:26:44
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-11 15:34:46
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\timeLine\timelineItem.tsx
 */
import React from 'react';
import { AnimateItem } from '../../core/store/storetype';

export const itemHeight = 25;
const diff = 6;
// 需要根据animate属性渲染div

export interface TimeLineItemProps {
	animate: AnimateItem[];
}
const bgColor = [
	'#4af',
	'rgb(93, 128, 158)',
	'rgb(158, 130, 93)',
	'rgb(219, 72, 34)',
	'rgb(255, 68, 168)',
	'#4af',
	'rgb(93, 128, 158)',
	'rgb(158, 130, 93)',
	'rgb(219, 72, 34)',
	'rgb(255, 68, 168)',
];

interface MoveStateTypes {
	startX: number;
	isMove: boolean;
	uid: string;
	dom: null | HTMLDivElement;
}

const moveState: MoveStateTypes = {
	startX: 0,
	isMove: false,
	uid: '',
	dom: null,
};

export const interval = 19;
const times = interval + 1;

export const TimeLineItemMouseMove = function (
	e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	animate: AnimateItem[],
	forceUpdate: React.Dispatch<React.SetStateAction<number>>
) {
	if (moveState.isMove) {
		//修改源属性
		const diff = e.screenX - moveState.startX;
		animate.forEach((v) => {
			if (v.uid === moveState.uid) {
				const f = parseFloat((v.animationDelay + diff / times).toFixed(1));
				v.animationDelay = f < 0 ? 0 : f;
				forceUpdate((p) => p + 1);
			}
		});
		moveState.startX = e.screenX;
	}
};
export const TimeLineItemMouseOver = function () {
	moveState.isMove = false;
	moveState.startX = 0;
	moveState.uid = '';
	if (moveState.dom) {
		moveState.dom.style.cursor = 'default';
	}
};

export function TimeLineItem(props: TimeLineItemProps) {
	return (
		<>
			{props.animate.map((v) => {
				const left = v.animationDelay * times + interval;
				const repeat =
					v.animationIterationCount === 'infinite' ? 500 : parseInt(v.animationIterationCount);
				const width = v.animationDuration * times * repeat;
				const index = v.uid.charCodeAt(0) % 10;
				return (
					<div
						key={v.uid}
						onMouseDown={(e) => {
							moveState.startX = e.screenX;
							moveState.uid = v.uid;
							moveState.isMove = true;
							const dom = e.target as HTMLDivElement;
							dom.style.cursor = 'move';
							moveState.dom = dom;
						}}
						style={{
							position: 'absolute',
							top: diff / 2,
							left: left,
							width: width,
							height: itemHeight - diff,
							background: bgColor[index],
						}}
					></div>
				);
			})}
		</>
	);
}
