/*
 * @Author: yehuozhili
 * @Date: 2021-02-18 11:52:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-23 20:37:17
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\resizeMarkline.ts
 */

import { resizeState } from '../resizeHandler/state';
import { LinesTypes } from './calcRender';
import { switchMarklineResizeDisplay } from './normalMode';
import { marklineConfig } from './marklineConfig';
import UserConfig from '../../config';

export function resizeCurrentCalculate(lines: LinesTypes, config: UserConfig) {
	const id = resizeState.item?.id;

	if (resizeState.ref?.current && id) {
		const store = config.getStore();
		const scaleState = config.getScaleState();
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
