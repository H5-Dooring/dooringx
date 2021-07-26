/*
 * @Author: yehuozhili
 * @Date: 2021-07-22 16:55:10
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 14:01:14
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
	symmetricPoint: Point,
	itemWH: {
		width: number;
		height: number;
	}
) {
	switch (direction) {
		case 'lt':
			calculateTopLeft(item, rotate, curPositon, symmetricPoint);
			break;
		case 'r':
			calculateRight(item, rotate, curPositon, symmetricPoint, itemWH);
			break;
		case 'b':
			calculateBottom(item, rotate, curPositon, symmetricPoint, itemWH);
			break;
		case 'l':
			calculateLeft(item, rotate, curPositon, symmetricPoint, itemWH);
			break;
		case 't':
			calculateTop(item, rotate, curPositon, symmetricPoint, itemWH);
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
	const newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	const newTopLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);
	const newBottomRightPoint = calculateRotatedPointCoordinate(
		symmetricPoint,
		newCenterPoint,
		-rotate
	);
	const newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
	const newHeight = newBottomRightPoint.y - newTopLeftPoint.y;
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
	const newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	const newTopRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);
	const newBottomLeftPoint = calculateRotatedPointCoordinate(
		symmetricPoint,
		newCenterPoint,
		-rotate
	);

	const newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
	const newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

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
	const newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	const newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate);
	const newBottomRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);

	const newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
	const newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

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
	const newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
	const newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate);
	const newBottomLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate);

	const newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
	const newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newBottomLeftPoint.x);
		item.top = Math.round(newTopRightPoint.y);
	}
}

function calculateTop(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point,
	itemWH: {
		width: number;
		height: number;
	}
) {
	const curPoint = resizeState.curPosition;
	const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -rotate);
	const rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
		{
			x: curPoint.x,
			y: rotatedcurPositon.y,
		},
		curPoint,
		rotate
	);

	const newHeight = Math.sqrt(
		(rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2
	);
	if (newHeight > 0) {
		const newCenter = {
			x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
		};
		const width = typeof item.width === 'number' ? item.width : itemWH.width;
		item.width = width;
		item.height = Math.round(newHeight);
		item.top = Math.round(newCenter.y - newHeight / 2);
		item.left = Math.round(newCenter.x - width / 2);
	}
}

function calculateRight(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point,
	itemWH: {
		width: number;
		height: number;
	}
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

	const newWidth = Math.sqrt(
		(rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 +
			(rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2
	);
	if (newWidth > 0) {
		const newCenter = {
			x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
			y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
		};
		const height = typeof item.height === 'number' ? item.height : itemWH.height;
		item.height = height;
		item.width = Math.round(newWidth);
		item.top = Math.round(newCenter.y - height / 2);
		item.left = Math.round(newCenter.x - newWidth / 2);
	}
}

function calculateBottom(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point,
	itemWH: {
		width: number;
		height: number;
	}
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
		const width = typeof item.width === 'number' ? item.width : itemWH.width;
		item.width = width;
		item.height = Math.round(newHeight);
		item.top = Math.round(newCenter.y - newHeight / 2);
		item.left = Math.round(newCenter.x - width / 2);
	}
}

function calculateLeft(
	item: IBlockType,
	rotate: number,
	curPositon: Point,
	symmetricPoint: Point,
	itemWH: {
		width: number;
		height: number;
	}
) {
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
		const height = typeof item.height === 'number' ? item.height : itemWH.height;
		item.height = height;
		item.width = Math.round(newWidth);
		item.top = Math.round(newCenter.y - height / 2);
		item.left = Math.round(newCenter.x - newWidth / 2);
	}
}
