/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-17 17:05:13
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
				//往下滚缩小
				if (scale.value > scale.minValue) {
					scale.value = scale.value - 0.1;
					store.forceUpdate();
					config.refreshIframe();
				}
			} else {
				scaleCancelFn();
				//往上滚放大
				if (scale.value < scale.maxValue) {
					scale.value = scale.value + 0.1;
					store.forceUpdate();
					config.refreshIframe();
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
			config.refreshIframe();
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
			config.refreshIframe();
		}
		return scaleState.value;
	},
};

export const onWheelEventIframe = (
	config: UserConfig,
	scale: {
		value: number;
		maxValue: number;
		minValue: number;
	}
) => {
	return {
		onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
			const dom = document.querySelector('.ant-modal-mask');
			if (dom) {
				//出现弹窗禁止滚动
				return;
			}
			if (e.deltaY > 0) {
				scaleCancelFn();
				//往下滚缩小
				if (scale.value > scale.minValue) {
					scale.value = scale.value - 0.1;
					config.sendParent({
						type: 'update',
						column: 'scale',
						data: scale,
					});
				}
			} else {
				scaleCancelFn();
				//往上滚放大
				if (scale.value < scale.maxValue) {
					scale.value = scale.value + 0.1;
					config.sendParent({
						type: 'update',
						column: 'scale',
						data: scale,
					});
				}
			}
		},
	};
};
