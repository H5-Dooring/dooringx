/*
 * @Author: yehuozhili
 * @Date: 2021-07-26 10:55:23
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 11:12:23
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\cursor.ts
 */

import { directionArr } from './state';

const initialAngle: Record<string, number> = {
	lt: 0,
	t: 45,
	rt: 90,
	r: 135,
	rb: 180,
	b: 225,
	lb: 270,
	l: 315,
};

const angleToCursor = [
	{ start: 338, end: 23, cursor: 'nw' },
	{ start: 23, end: 68, cursor: 'n' },
	{ start: 68, end: 113, cursor: 'ne' },
	{ start: 113, end: 158, cursor: 'e' },
	{ start: 158, end: 203, cursor: 'se' },
	{ start: 203, end: 248, cursor: 's' },
	{ start: 248, end: 293, cursor: 'sw' },
	{ start: 293, end: 338, cursor: 'w' },
];

function mod360(deg: number) {
	return (deg + 360) % 360;
}

export function getCursor(curRotate: number) {
	const rotate = mod360(curRotate);
	const result: Record<string, string> = {};
	let lastMatchIndex = -1;
	directionArr.forEach((point) => {
		const angle = mod360(initialAngle[point] + rotate);
		const len = angleToCursor.length;
		while (true) {
			lastMatchIndex = (lastMatchIndex + 1) % len;
			const angleLimit = angleToCursor[lastMatchIndex];
			if (angle < 23 || angle >= 338) {
				result[point] = 'nw-resize';
				return;
			}
			if (angleLimit.start <= angle && angle < angleLimit.end) {
				result[point] = angleLimit.cursor + '-resize';
				return;
			}
		}
	});

	return result;
}
