/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 20:51:41
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\calcRender.ts
 */
import { innerDragState } from '../innerDrag/state';
import { newMarklineDisplay } from './normalMode';
import { marklineConfig } from './marklineConfig';
import UserConfig from '../../config';
import { angleToRadian, getContainer } from '../utils';
export interface LinesTypes {
	x: number[];
	y: number[];
}

export function cos(rotate: number) {
	return Math.abs(Math.cos(angleToRadian(rotate)));
}
export function sin(rotate: number) {
	return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function getComponentRotatedStyle(
	rotate: number,
	width: number,
	height: number,
	left: number,
	right: number,
	top: number,
	bottom: number
) {
	const style = {
		left,
		width,
		height,
		right,
		top,
		bottom,
	};
	if (rotate !== 0) {
		const newWidth = style.width * cos(rotate) + style.height * sin(rotate);
		const diffX = (style.width - newWidth) / 2; // 旋转后范围变小是正值，变大是负值
		style.left += diffX;
		style.right = style.left + newWidth;
		const newHeight = style.height * cos(rotate) + style.width * sin(rotate);
		const diffY = (newHeight - style.height) / 2; // 始终是正
		style.top -= diffY;
		style.bottom = style.top + newHeight;
		style.width = newWidth;
		style.height = newHeight;
	} else {
		style.bottom = style.top + style.height;
		style.right = style.left + style.width;
	}

	return style;
}

export function marklineCalRender(config: UserConfig): LinesTypes {
	const store = config.getStore();
	//focus可能好几个，做对比的是拖拽那个
	const lines: LinesTypes = { x: [], y: [] };
	if (innerDragState.item?.position === 'static' || innerDragState.item?.position === 'relative') {
		return lines;
	}

	const item = innerDragState.item;
	const ref = innerDragState.ref;

	if (item && ref && ref.current && innerDragState.isDrag) {
		// 这个被拷贝过，所以必须重新获取
		const focus = store.getData().block.find((v) => v.id === item.id)!;
		if (!focus) {
			return lines;
		}
		const container = getContainer();
		if (!container) {
			return lines;
		}
		if (typeof focus.width !== 'number' || typeof focus.height !== 'number') {
			return lines;
		}

		if (!marklineConfig.marklineUnfocus) {
			marklineConfig.marklineUnfocus = store
				.getData()
				.block.filter(
					(v) => v.focus === false && v.position !== 'static' && v.position !== 'relative'
				);
		}

		const left = focus.left;
		const top = focus.top;
		const rotate = focus.rotate.value;
		const width = focus.width;
		const height = focus.height;
		const realStyle = getComponentRotatedStyle(
			rotate,
			width,
			height,
			left,
			left + width,
			top,
			top + height
		);

		if (typeof left !== 'number' || typeof top !== 'number') {
			return lines; //可能没有这2值
		}

		marklineConfig.marklineUnfocus.forEach((v) => {
			let l = v?.left;
			let t = v?.top;
			if (typeof l !== 'number' || typeof t !== 'number') {
				console.warn(`${v} component miss top or left`);
			} else {
				// 如果拿实例可能有性能问题，暂直接计算。
				const w = v.width;
				const h = v.height;
				if (typeof w === 'number' && typeof h === 'number') {
					const ro = v.rotate.value;
					const r = l + w;
					const b = t + h;
					const rstyle = getComponentRotatedStyle(ro, w, h, l, r, t, b);
					newMarklineDisplay(realStyle, rstyle, lines, focus);
				}
			}
		});
	}

	return lines;
}
