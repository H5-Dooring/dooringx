/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 11:38:11
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\calcRender.ts
 */
import { innerDragState } from '../innerDrag/state';
import { switchMarklineDisplay } from './normalMode';
import { resizeCurrentCalculate } from './resizeMarkline';
import { marklineConfig } from './marklineConfig';
import UserConfig from '../../config';
export interface LinesTypes {
	x: number[];
	y: number[];
}

export function marklineCalRender(config: UserConfig) {
	const store = config.getStore();
	const scaleState = config.getScaleState();
	//focus可能好几个，做对比的是拖拽那个
	const lines: LinesTypes = { x: [], y: [] };
	if (innerDragState.item?.position === 'static' || innerDragState.item?.position === 'relative') {
		return lines;
	}

	const item = innerDragState.item;
	const ref = innerDragState.ref;

	if (item && ref && ref.current && innerDragState.isDrag) {
		const focus = store.getData().block.find((v) => v.id === item.id)!;
		if (!marklineConfig.marklineUnfocus) {
			marklineConfig.marklineUnfocus = store
				.getData()
				.block.filter(
					(v) => v.focus === false && v.position !== 'static' && v.position !== 'relative'
				);
		}
		const { width, height } = ref.current.getBoundingClientRect();

		// left 和top 被深拷贝过，最新的值需要即时获取
		const left = focus?.left;
		const top = focus?.top;
		if (typeof left !== 'number' || typeof top !== 'number') {
			return lines; //莫名可能没有这2值
		}
		const scale = scaleState.value;
		const wwidth = width / scale;
		const wheight = height / scale;

		marklineConfig.marklineUnfocus.forEach((v) => {
			let l = v?.left;
			let t = v?.top;
			if (typeof l !== 'number' || typeof t !== 'number') {
				console.warn(`${v} component miss top or left`);
			} else {
				// 如果不是由外层容器决定的则没有这2属性
				const w = v.width;
				const h = v.height;

				// 只有满足要求的才进行push
				if (marklineConfig.mode === 'normal') {
					switchMarklineDisplay(l, t, w, h, left, top, wwidth, wheight, lines, focus);
				}
			}
		});
		// if (marklineConfig.mode === 'grid' && marklineConfig.isAbsorb) {
		// 	gridModeDisplay(left, top, focus, config);该模式暂废弃
		// }
	}

	// if (marklineConfig.mode === 'grid') {
	// 	grideModeRender(lines, config);该模式暂废弃
	// }

	resizeCurrentCalculate(lines, config);

	return lines;
}
