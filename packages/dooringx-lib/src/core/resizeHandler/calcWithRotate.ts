/*
 * @Author: yehuozhili
 * @Date: 2021-07-22 16:55:10
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-22 20:48:19
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\resizeHandler\calcWithRotate.ts
 */

import { DirectionType } from '.';
import { IBlockType } from '../store/storetype';
import { angleToRadian } from '../utils';

interface Point {
	x: number;
	y: number;
}

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
		case 'topleft':
			calculateTopLeft(item, rotate, curPositon, symmetricPoint);
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
	console.log(curPositon, symmetricPoint);
	console.log(newWidth, newHeight);
	if (newWidth > 0 && newHeight > 0) {
		item.width = Math.round(newWidth);
		item.height = Math.round(newHeight);
		item.left = Math.round(newTopLeftPoint.x);
		item.top = Math.round(newTopLeftPoint.y);
	}
	console.log(item.width, item.height, item.left, item.top);
}

// function calculateRightTop(style, curPositon, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
//     let newTopRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)
//     let newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)

//     let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//     let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

//     if (newWidth > 0 && newHeight > 0) {
//         style.width = Math.round(newWidth)
//         style.height = Math.round(newHeight)
//         style.left = Math.round(newBottomLeftPoint.x)
//         style.top = Math.round(newTopRightPoint.y)
//     }
// }

// function calculateRightBottom(style, curPositon, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
//     let newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
//     let newBottomRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)

//     let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
//     let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

//     if (newWidth > 0 && newHeight > 0) {
//         style.width = Math.round(newWidth)
//         style.height = Math.round(newHeight)
//         style.left = Math.round(newTopLeftPoint.x)
//         style.top = Math.round(newTopLeftPoint.y)
//     }
// }

// function calculateLeftBottom(style, curPositon, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
//     let newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
//     let newBottomLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)

//     let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//     let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

//     if (newWidth > 0 && newHeight > 0) {
//         style.width = Math.round(newWidth)
//         style.height = Math.round(newHeight)
//         style.left = Math.round(newBottomLeftPoint.x)
//         style.top = Math.round(newTopRightPoint.y)
//     }
// }

// function calculateTop(style, curPositon, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     let rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
//     let rotatedTopMiddlePoint = calculateRotatedPointCoordinate({
//         x: curPoint.x,
//         y: rotatedcurPositon.y,
//     }, curPoint, style.rotate)

//     let newHeight = Math.sqrt((rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2)

//     if (newHeight > 0) {
//         const newCenter = {
//             x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
//         }

//         let width = style.width
//         // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
//         style.width = width
//         style.height = Math.round(newHeight)
//         style.top = Math.round(newCenter.y - (newHeight / 2))
//         style.left = Math.round(newCenter.x - (style.width / 2))
//     }
// }

// function calculateRight(style, curPositon, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
//     const rotatedRightMiddlePoint = calculateRotatedPointCoordinate({
//         x: rotatedcurPositon.x,
//         y: curPoint.y,
//     }, curPoint, style.rotate)

//     let newWidth = Math.sqrt((rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newWidth > 0) {
//         const newCenter = {
//             x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
//         }

//         let height = style.height

//         style.height = height
//         style.width = Math.round(newWidth)
//         style.top = Math.round(newCenter.y - (style.height / 2))
//         style.left = Math.round(newCenter.x - (newWidth / 2))
//     }
// }

// function calculateBottom(style, curPositon, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
//     const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate({
//         x: curPoint.x,
//         y: rotatedcurPositon.y,
//     }, curPoint, style.rotate)

//     const newHeight = Math.sqrt((rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newHeight > 0) {
//         const newCenter = {
//             x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
//         }

//         let width = style.width
//         style.width = width
//         style.height = Math.round(newHeight)
//         style.top = Math.round(newCenter.y - (newHeight / 2))
//         style.left = Math.round(newCenter.x - (style.width / 2))
//     }
// }

// function calculateLeft(style, curPositon, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
//     const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate({
//         x: rotatedcurPositon.x,
//         y: curPoint.y,
//     }, curPoint, style.rotate)

//     const newWidth = Math.sqrt((rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newWidth > 0) {
//         const newCenter = {
//             x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
//         }
//         let height = style.height
//         style.height = height
//         style.width = Math.round(newWidth)
//         style.top = Math.round(newCenter.y - (style.height / 2))
//         style.left = Math.round(newCenter.x - (newWidth / 2))
//     }
// }
