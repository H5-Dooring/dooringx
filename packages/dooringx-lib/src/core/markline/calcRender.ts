/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-12-31 00:25:43
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\calcRender.ts
 */
import { innerDragState } from '../innerDrag/state';
import { newMarklineDisplay } from './normalMode';
import { marklineConfig } from './marklineConfig';
import UserConfig from '../../config';
import { angleToRadian, binarySearchRemain, getContainer } from '../utils';
import { marklineState, RealStyleType } from './state';
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
	top: number
) {
	const style = {
		left,
		width,
		height,
		right: left + width,
		top,
		bottom: top + height,
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

export function marklineCalRender(config: UserConfig, iframe: boolean): LinesTypes {
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
		const realStyle = getComponentRotatedStyle(rotate, width, height, left, top);

		if (typeof left !== 'number' || typeof top !== 'number') {
			return lines; //可能没有这2值
		}
		const unfocus = marklineConfig.marklineUnfocus;
		const len = unfocus.length;

		// 只要cache里有东西，说明有缓存
		if (marklineState.cache) {
			if (!marklineState.sortLeft) {
				marklineState.sortLeft = Object.values(marklineState.cache).sort((a, b) => {
					return a.left - b.left;
				});
			}
			if (!marklineState.sortTop) {
				marklineState.sortTop = Object.values(marklineState.cache).sort((a, b) => {
					return a.top - b.top;
				});
			}
			if (!marklineState.sortBottom) {
				marklineState.sortBottom = Object.values(marklineState.cache).sort((a, b) => {
					return a.bottom - b.bottom;
				});
			}
			if (!marklineState.sortRight) {
				marklineState.sortRight = Object.values(marklineState.cache).sort((a, b) => {
					return a.right - b.right;
				});
			}
			const indexLeft = binarySearchRemain<RealStyleType>(
				realStyle.left,
				marklineState.sortLeft,
				'left',
				marklineConfig.indent
			);
			if (indexLeft) {
				newMarklineDisplay(realStyle, indexLeft, lines, focus);
			}
			const indexTop = binarySearchRemain<RealStyleType>(
				realStyle.top,
				marklineState.sortTop,
				'top',
				marklineConfig.indent
			);
			if (indexTop) {
				newMarklineDisplay(realStyle, indexTop, lines, focus);
			}
			const indexRight = binarySearchRemain<RealStyleType>(
				realStyle.right,
				marklineState.sortRight,
				'right',
				marklineConfig.indent
			);
			if (indexRight) {
				newMarklineDisplay(realStyle, indexRight, lines, focus);
			}
			const indexBottom = binarySearchRemain<RealStyleType>(
				realStyle.bottom,
				marklineState.sortBottom,
				'bottom',
				marklineConfig.indent
			);
			if (indexBottom) {
				newMarklineDisplay(realStyle, indexBottom, lines, focus);
			}
		} else {
			for (let i = 0; i < len; i++) {
				const v = unfocus[i];
				const l = v?.left;
				const t = v?.top;
				const w = v?.width;
				const h = v?.height;
				if (
					typeof l === 'number' &&
					typeof t === 'number' &&
					typeof w === 'number' &&
					typeof h === 'number'
				) {
					const ro = v.rotate.value;
					const rstyle = getComponentRotatedStyle(ro, w, h, l, t);
					if (!marklineState.cache) {
						marklineState.cache = {
							[v.id]: rstyle,
						};
					} else {
						marklineState.cache[v.id] = rstyle;
					}
					newMarklineDisplay(realStyle, rstyle, lines, focus);
					// if (lines.x.length !== 0 || lines.y.length !== 0) {
					// 	break; 这里不能break要算完所有值
					// }
				}
			}
		}

		// 如果是iframe 需要刷给iframe
		if (iframe) {
			config.refreshIframe();
		}
	}

	return lines;
}
