/*
 * @Author: yehuozhili
 * @Date: 2021-08-10 20:26:44
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-16 20:29:58
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\timeLine\timelineItem.tsx
 */
import React, { CSSProperties } from 'react';
import { AnimateItem } from '../../core/store/storetype';
import { randomColor } from '../../core/utils';

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
let currentMoveItemId = '';

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
	resizeState.startX = e.clientX;
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
		const diff = e.clientX - moveState.startX;
		animate.forEach((v) => {
			if (v.uid === moveState.uid) {
				const f = parseFloat((v.animationDelay + diff / times).toFixed(1));
				v.animationDelay = f < 0 ? 0 : f;
				forceUpdate((p) => p + 1);
			}
		});
		moveState.startX = e.clientX;
	} else if (resizeState.isMove) {
		const diff = e.clientX - resizeState.startX;
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
		resizeState.startX = e.clientX;
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
export const resetCurrentMoveItemId = () => {
	currentMoveItemId = '';
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

const bgColorCache: Record<string, string> = {};

export function TimeLineItem(props: TimeLineItemProps) {
	return (
		<>
			{props.animate.map((v) => {
				const left = v.animationDelay * times + interval;
				const repeat =
					v.animationIterationCount === 'infinite' ? iter : parseInt(v.animationIterationCount);
				const width = v.animationDuration * times * repeat;

				if (!bgColorCache[v.uid]) {
					bgColorCache[v.uid] = randomColor();
				}
				return (
					<div
						key={v.uid}
						onMouseDown={(e) => {
							moveState.startX = e.clientX;
							moveState.uid = v.uid;
							moveState.isMove = true;
							currentMoveItemId = v.uid;
						}}
						className="yh-timeline-item-mainblock"
						style={{
							position: 'absolute',
							top: diff / 2,
							left: left,
							width: width,
							height: itemHeight - diff,
							background: bgColorCache[v.uid],
							zIndex: 1,
							cursor: 'move',
							borderRadius: '4px',
							opacity: v.uid === currentMoveItemId ? 1 : 0.7,
						}}
					>
						{v.uid === currentMoveItemId && (
							<>
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
							</>
						)}
					</div>
				);
			})}
		</>
	);
}
