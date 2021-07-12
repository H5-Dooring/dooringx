/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 20:04:17
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\scale\index.ts
 */
import UserConfig from '../../config';
import { scaleCancelFn } from './cancel';

export const onWheelEvent = (config: UserConfig) => {
	const store = config.getStore();
	const scale = config.getScaleState();
	return {
		onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
			const dom = document.querySelector('.ant-modal-mask');
			if (dom) {
				//出现弹窗禁止滚动
				return;
			}
			if (e.deltaY > 0) {
				scaleCancelFn();
				if (scale.value < scale.maxValue) {
					scale.value = scale.value + 0.1;
					store.forceUpdate();
				}
			} else {
				scaleCancelFn();
				//往上滚缩小
				if (scale.value > scale.minValue) {
					scale.value = scale.value - 0.1;
					store.forceUpdate();
				}
			}
		},
	};
};

export const scaleFn = {
	increase(number: number = 0.1, config: UserConfig) {
		const store = config.getStore();
		const scaleState = config.getScaleState();
		if (scaleState.value < scaleState.maxValue) {
			scaleCancelFn();
			scaleState.value = scaleState.value + number;
			store.forceUpdate();
		}
		return scaleState.value;
	},
	decrease(number: number = 0.1, config: UserConfig) {
		const store = config.getStore();
		const scaleState = config.getScaleState();
		scaleCancelFn();
		if (scaleState.value > scaleState.minValue) {
			scaleState.value = scaleState.value - number;
			store.forceUpdate();
		}
		return scaleState.value;
	},
};
