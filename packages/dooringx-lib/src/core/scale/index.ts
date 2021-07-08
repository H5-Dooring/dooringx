/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-04-05 22:18:43
 * @FilePath: \dooringv2\src\core\scale\index.ts
 */
import { store } from '../../runtime/store';
import Store from '../store';
import { scaleCancelFn } from './cancel';
import { scaleState } from './state';

export const onWheelEvent = {
	onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
		const dom = document.querySelector('.ant-modal-mask');
		if (dom) {
			//出现弹窗禁止滚动
			return;
		}
		if (e.deltaY > 0) {
			scaleCancelFn();
			if (scaleState.value < scaleState.maxValue) {
				scaleState.value = scaleState.value + 0.1;
				store.forceUpdate();
			}
		} else {
			scaleCancelFn();
			//往上滚缩小
			if (scaleState.value > scaleState.minValue) {
				scaleState.value = scaleState.value - 0.1;
				store.forceUpdate();
			}
		}
	},
};

export const scaleFn = {
	increase(number: number = 0.1, store: Store) {
		if (scaleState.value < scaleState.maxValue) {
			scaleCancelFn();
			scaleState.value = scaleState.value + number;
			store.forceUpdate();
		}
		return scaleState.value;
	},
	decrease(number: number = 0.1, store: Store) {
		scaleCancelFn();
		if (scaleState.value > scaleState.minValue) {
			scaleState.value = scaleState.value - number;
			store.forceUpdate();
		}
		return scaleState.value;
	},
};
