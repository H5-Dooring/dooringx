/*
 * @Author: yehuozhili
 * @Date: 2021-08-10 20:26:44
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-16 20:29:58
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\timeLine\timelineItem.tsx
 */
import React, { CSSProperties } from 'react';
import { AnimateItem } from '../../core/store/storetype';

export const iter = 500;
export const itemHeight = 25;
export const interval = 19;
const diff = 6;
const square = 2.5;
const times = interval + 1;

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
}

const moveState: MoveStateTypes = {
	startX: 0,
	isMove: false,
	uid: '',
};
interface resizeStateTypes extends MoveStateTypes {
	left: boolean;
}

const resizeState: resizeStateTypes = {
	startX: 0,
	isMove: false,
	uid: '',
	left: true,
};
const resizeMouseDown = (
	e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	v: AnimateItem,
	left: boolean
) => {
	e.stopPropagation();
	resizeState.startX = e.screenX;
	resizeState.uid = v.uid;
	resizeState.isMove = true;
	resizeState.left = left;
};

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
	} else if (resizeState.isMove) {
		const diff = e.screenX - resizeState.startX;
		if (resizeState.left) {
			animate.forEach((v) => {
				if (v.uid === resizeState.uid) {
					const count =
						v.animationIterationCount === 'infinite' ? 500 : parseInt(v.animationIterationCount);
					const f2 = parseFloat((v.animationDelay + diff / times).toFixed(1));
					const f = parseFloat((v.animationDuration - (f2 - v.animationDelay) / count).toFixed(1));
					v.animationDuration = f2 < 0 ? v.animationDuration : f < 0 ? 0 : f;
					v.animationDelay = f2 < 0 ? 0 : f2;
					forceUpdate((p) => p + 1);
				}
			});
		} else {
			animate.forEach((v) => {
				if (v.uid === resizeState.uid) {
					const count =
						v.animationIterationCount === 'infinite' ? 500 : parseInt(v.animationIterationCount);
					const f = parseFloat((v.animationDuration + diff / count / times).toFixed(1));
					v.animationDuration = f < 0 ? 0 : f;
					forceUpdate((p) => p + 1);
				}
			});
		}
		resizeState.startX = e.screenX;
	}
};
export const TimeLineItemMouseOver = function () {
	moveState.isMove = false;
	moveState.startX = 0;
	moveState.uid = '';
	resizeState.isMove = false;
	resizeState.startX = 0;
	resizeState.uid = '';
};

const commonCss: CSSProperties = {
	transform: `rotate(45deg)`,
	height: square * 2,
	width: square * 2,
	position: 'absolute',
	background: 'rgba(0, 0, 0, 0.85)',
	top: (itemHeight - diff) / 2 - square,
	cursor: 'e-resize',
};

export function TimeLineItem(props: TimeLineItemProps) {
	return (
		<>
			{props.animate.map((v) => {
				const left = v.animationDelay * times + interval;
				const repeat =
					v.animationIterationCount === 'infinite' ? iter : parseInt(v.animationIterationCount);
				const width = v.animationDuration * times * repeat;
				const index = v.uid.charCodeAt(0) % 10;
				return (
					<div
						key={v.uid}
						onMouseDown={(e) => {
							moveState.startX = e.screenX;
							moveState.uid = v.uid;
							moveState.isMove = true;
						}}
						style={{
							position: 'absolute',
							top: diff / 2,
							left: left,
							width: width,
							height: itemHeight - diff,
							background: bgColor[index],
							zIndex: 1,
							cursor: 'move',
						}}
					>
						<div
							className="yh-timeline-item-left"
							style={{ ...commonCss, left: -square }}
							onMouseDown={(e) => {
								resizeMouseDown(e, v, true);
							}}
						></div>
						<div
							className="yh-timeline-item-right"
							style={{ ...commonCss, right: -square }}
							onMouseDown={(e) => {
								resizeMouseDown(e, v, false);
							}}
						></div>
					</div>
				);
			})}
		</>
	);
}
