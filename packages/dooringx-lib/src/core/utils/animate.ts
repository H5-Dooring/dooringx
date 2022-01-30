import { AnimateItem } from '../store/storetype';
// duration
// 1s ease 1s 1 forwards paused bounce ,
export function mergeAnimate(
	animate: AnimateItem[],
	config = {
		delay: 0,
		isPause: false,
	}
) {
	let configstr = '';
	let str = '';
	animate.forEach((v) => {
		configstr =
			(configstr === '' ? configstr : configstr + ',') +
			`${v.animationDuration}s ${v.animationTimingFunction} ${(
				v.animationDelay - config.delay
			).toFixed(1)}s ${v.animationIterationCount} forwards ${
				config.isPause ? 'paused' : 'running'
			} ${v.animationName}`;
		str =
			(str === '' ? str : str + ',') +
			`${v.animationDuration}s ${v.animationTimingFunction} ${v.animationDelay}s ${
				v.animationIterationCount
			} forwards ${'running'} ${v.animationName}`;
	});
	return [str, configstr];
}
