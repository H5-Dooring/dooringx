/*
 * @Author: yehuozhili
 * @Date: 2021-02-18 11:52:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 11:49:58
 * @FilePath: \dooring-v2\src\core\markline\resizeMarkline.ts
 */

import { store } from '../../runtime/store';
import { resizeState } from '../resizeHandler';
import { scaleState } from '../scale/state';
import { LinesTypes } from './calcRender';
import { switchMarklineResizeDisplay } from './normalMode';
import { marklineConfig } from './marklineConfig';

export function resizeCurrentCalculate(lines: LinesTypes) {
	const id = resizeState.item?.id;

	if (resizeState.ref?.current && id) {
		const newblock = store.getData().block;
		const unfocus = newblock.filter((v) => v.id !== id);
		const { width, height } = resizeState.ref.current.getBoundingClientRect();
		const focus = store.getData().block.find((v) => v.id === id)!;
		const { left, top } = focus;
		const scale = scaleState.value;
		const wwidth = width / scale;
		const wheight = height / scale;
		unfocus.forEach((v) => {
			const { left: l, top: t } = v;
			// 如果不是由外层容器决定的则没有这2属性
			const w = v.width;
			const h = v.height;
			const ww = w && typeof w === 'number' ? w / scale : w;
			const wh = h && typeof h === 'number' ? h / scale : h;
			// 只有满足要求的才进行push
			if (marklineConfig.mode === 'normal') {
				switchMarklineResizeDisplay(l, t, ww, wh, left, top, wwidth, wheight, lines);
			}
		});
	}
}
