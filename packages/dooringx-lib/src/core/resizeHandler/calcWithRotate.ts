/*
 * @Author: yehuozhili
 * @Date: 2021-07-22 16:55:10
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 11:10:48
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\calcWithRotate.ts
 */

import { DirectionType, Point, resizeState } from './state';
import { IBlockType } from '../store/storetype';
import { angleToRadian } from '../utils';

function getCenterPoint(p1: Point, p2: Point) {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2,
	};
}
function calculateRotatedPointCoordinate(point: Point, center: Point, rotate: number) {
	return {
		x:
			(point.x - center.x) * Math.cos(angleToRadian(rotate)) -
			(point.y - center.y) * Math.sin(angleToRadian(rotate)) +
			center.x,
		y:
			(point.x - center.x) * Math.sin(angleToRadian(rotate)) +
			(point.y - center.y) * Math.cos(angleToRadian(rotate)) +
			center.y,
	};
}

export function getRect(
	direction: DirectionType,
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	switch (direction) {
		case 'lt':
			calculateTopLeft(item, rotate, curPositon, symmetricPoint);
			break;
		case 'r':
			calculateRight(item, rotate, curPositon, symmetricPoint);
			break;
		case 'b':
			calculateBottom(item, rotate, curPositon, symmetricPoint);
			break;
		case 'l':
			calculateLeft(item, rotate, curPositon, symmetricPoint);
			break;
		case 't':
			calculateTop(item, rotate, curPositon, symmetricPoint);
			break;
		case 'rb':
			calculateBottomRight(item, rotate, curPositon, symmetricPoint);
			break;
		case 'rt':
			calculateTopRight(item, rotate, curPositon, symmetricPoint);
			break;
		case 'lb':
			calculateBottomLeft(item, rotate, curPositon, symmetricPoint);
			break;
		default:
			break;
	}
}

function calculateTopLeft(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	let newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	let newTopLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);
	let newBottomRightPoint = calculateRotatedPointCoordinate(
		symmetricPoint,
		newCenterPoint,
		-rotate
	);
	let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
	let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;
	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newTopLeftPoint.x);
		item.top = Math.round(newTopLeftPoint.y);
	}
}

function calculateTopRight(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	let newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	let newTopRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);
	let newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate);

	let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
	let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newBottomLeftPoint.x);
		item.top = Math.round(newTopRightPoint.y);
	}
}

function calculateBottomRight(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	let newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	let newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate);
	let newBottomRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);

	let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
	let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newTopLeftPoint.x);
		item.top = Math.round(newTopLeftPoint.y);
	}
}

function calculateBottomLeft(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	let newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	let newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate);
	let newBottomLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);

	let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
	let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newBottomLeftPoint.x);
		item.top = Math.round(newTopRightPoint.y);
	}
}

function calculateTop(item: IBlockType, rotate: number, curPositon: Point, symmetricPoint: Point) {
	const curPoint = resizeState.curPosition;
	let rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -rotate);
	let rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
		{
			x: curPoint.x,
			y: rotatedcurPositon.y,
		},
		curPoint,
		rotate
	);

	let newHeight = Math.sqrt(
		(rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2
	);

	if (newHeight > 0) {
		const newCenter = {
			x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
		};
		if (typeof item.width === 'number') {
			let width = item.width;
			item.width = width;
			item.height = Math.round(newHeight);
			item.top = Math.round(newCenter.y - newHeight / 2);
			item.left = Math.round(newCenter.x - item.width / 2);
		}
	}
}

function calculateRight(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	const curPoint = resizeState.curPosition;
	const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -rotate);
	const rotatedRightMiddlePoint = calculateRotatedPointCoordinate(
		{
			x: rotatedcurPositon.x,
			y: curPoint.y,
		},
		curPoint,
		rotate
	);

	let newWidth = Math.sqrt(
		(rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2
	);
	if (newWidth > 0) {
		const newCenter = {
			x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
		};
		if (typeof item.height === 'number') {
			let height = item.height;
			item.height = height;
			item.width = Math.round(newWidth);
			item.top = Math.round(newCenter.y - item.height / 2);
			item.left = Math.round(newCenter.x - newWidth / 2);
		}
	}
}

function calculateBottom(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point
) {
	const curPoint = resizeState.curPosition;
	const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -rotate);
	const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate(
		{
			x: curPoint.x,
			y: rotatedcurPositon.y,
		},
		curPoint,
		rotate
	);

	const newHeight = Math.sqrt(
		(rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2
	);
	if (newHeight > 0) {
		const newCenter = {
			x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
		};
		if (typeof item.width === 'number') {
			let width = item.width;
			item.width = width;
			item.height = Math.round(newHeight);
			item.top = Math.round(newCenter.y - newHeight / 2);
			item.left = Math.round(newCenter.x - item.width / 2);
		}
	}
}

function calculateLeft(item: IBlockType, rotate: number, curPositon: Point, symmetricPoint: Point) {
	const curPoint = resizeState.curPosition;
	const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -rotate);
	const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
		{
			x: rotatedcurPositon.x,
			y: curPoint.y,
		},
		curPoint,
		rotate
	);

	const newWidth = Math.sqrt(
		(rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2
	);
	if (newWidth > 0) {
		const newCenter = {
			x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
		};
		if (typeof item.height === 'number') {
			let height = item.height;
			item.height = height;
			item.width = Math.round(newWidth);
			item.top = Math.round(newCenter.y - item.height / 2);
			item.left = Math.round(newCenter.x - newWidth / 2);
		}
	}
}
