/*
 * @Author: yehuozhili
 * @Date: 2022-04-30 23:25:05
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-05-01 19:31:14
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\selectRange\sat.ts
 */

import { angleToRadian } from '../utils';

interface BlockItem {
	width: number;
	left: number;
	top: number;
	height: number;
	rotate: number;
}
function getCenter(item: BlockItem) {
	return { x: item.left + item.width / 2, y: item.top + item.height / 2 };
}
function revert({ x, y }: { x: number; y: number }) {
	return { x: y, y: -x };
}
function substract(a: { x: number; y: number }, b: { x: number; y: number }) {
	return { x: a.x - b.x, y: a.y - b.y };
}
function getSides(list: { x: number; y: number }[]) {
	let len = list.length;
	let res = [];
	for (let j = 1, pre = list[0]; j < len; j++) {
		let p = list[j];
		res.push(substract(p, pre));
		pre = p;
	}
	res.push(substract(list[0], list[len - 1]));
	return res;
}
function len(axis: { x: number; y: number }) {
	return Math.sqrt(axis.x * axis.x + axis.y * axis.y);
}
function dot(a: { x: number; y: number }, b: { x: number; y: number }) {
	return a.x * b.x + a.y * b.y;
}
function getProjection(axis: { x: number; y: number }, list: { x: number; y: number }[]) {
	let min = null;
	let max = null;
	for (let i = 0, l = list.length; i < l; i++) {
		let p = list[i];
		let pro = dot(p, axis) / len(axis);
		if (min === null || pro < min) {
			min = pro;
		}
		if (max === null || pro > max) {
			max = pro;
		}
	}
	return { min: min, max: max };
}

function getOriginPoint(item: BlockItem) {
	const center = getCenter(item);
	let a = center.x;
	let b = center.y;
	const transfer = [
		{ x: item.left, y: item.top },
		{ x: item.left + item.width, y: item.top },
		{ x: item.left + item.width, y: item.top + item.height },
		{ x: item.left, y: item.top + item.height },
	];
	const relativePoint: { x: number; y: number }[] = [];
	const rootPoint = transfer.map((v) => {
		const x0 = v.x;
		const y0 = v.y;
		const rx =
			a +
			(x0 - a) * Math.cos(angleToRadian(item.rotate)) -
			(y0 - b) * Math.sin(angleToRadian(item.rotate));
		const ry =
			b +
			(x0 - a) * Math.sin(angleToRadian(item.rotate)) +
			(y0 - b) * Math.cos(angleToRadian(item.rotate));
		relativePoint.push({ x: a - rx, y: b - ry });
		return { x: rx, y: ry };
	});

	return { rootPoint, relativePoint };
}

function polygonsCollisionTest(A: BlockItem, B: BlockItem) {
	const resa = getOriginPoint(A);
	const resb = getOriginPoint(B);
	const sidesa = getSides(resa.relativePoint);
	const sidesb = getSides(resb.relativePoint);
	const sides = sidesa.concat(sidesb);
	for (let j = 0, l = sides.length; j < l; j++) {
		let axis = revert(sides[j]);
		let proA = getProjection(axis, resa.rootPoint),
			proB = getProjection(axis, resb.rootPoint);
		if (isOverlay(proA, proB)) {
			return false;
		}
	}

	return true;
}
function isOverlay(proA: any, proB: any) {
	let min, max;
	if (proA.min < proB.min) {
		min = proA.min;
	} else {
		min = proB.min;
	}
	if (proA.max > proB.max) {
		max = proA.max;
	} else {
		max = proB.max;
	}
	return proA.max - proA.min + (proB.max - proB.min) < max - min;
}

export function Sat(v: BlockItem, select: BlockItem) {
	return polygonsCollisionTest(v, select);
}
