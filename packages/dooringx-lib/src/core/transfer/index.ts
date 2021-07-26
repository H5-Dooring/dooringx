/*
 * @Author: yehuozhili
 * @Date: 2021-04-21 22:59:57
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-26 11:47:19
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\transfer\index.ts
 */

/**
 *
 *
 * @export
 * @param {number} top
 * @param {number} left
 * @param {(string | number | undefined)} height
 * @param {(string | number | undefined)} width
 * @param {boolean} isFixed
 * @returns
 */
export function transfer(
	top: number,
	left: number,
	height: string | number | undefined,
	width: string | number | undefined,
	isFixed: boolean
) {
	if (isFixed) {
		// 由于是375x667基准，所以top大于667的，那么top为底部高度
		let newtop = 0;

		const newleft = getRealWidth(left);
		let newheight: string | number | undefined;
		let newwidth: string | number | undefined;
		if (typeof height === 'string' || typeof height === 'undefined') {
			newheight = height;
		} else {
			newheight = getRealHeight(height);
		}
		if (typeof width === 'string' || typeof width === 'undefined') {
			newwidth = width;
		} else {
			newwidth = getRealWidth(width);
		}

		if (top >= 667) {
			if (typeof newheight === 'number') {
				newtop = getRealHeight() - newheight;
			} else {
				// 如果没有高度或者高度是百分比，则定位会有问题
				newtop = getRealHeight();
			}
		} else {
			if (typeof height === 'number' && top >= 667 - height && typeof newheight === 'number') {
				// 这种是距离底部比高多 按底部计算
				newtop = getRealHeight() - newheight;
			} else {
				newtop = getRealHeight(top);
			}
		}
		return {
			top: newtop,
			left: newleft,
			height: newheight,
			width: newwidth,
		};
	} else {
		const newtop = getRealHeight(top);
		const newleft = getRealWidth(left);
		let newheight: string | number | undefined;
		let newwidth: string | number | undefined;
		if (typeof height === 'string' || typeof height === 'undefined') {
			newheight = height;
		} else {
			newheight = getRealHeight(height);
		}
		if (typeof width === 'string' || typeof width === 'undefined') {
			newwidth = width;
		} else {
			newwidth = getRealWidth(width);
		}

		return {
			top: newtop,
			left: newleft,
			height: newheight,
			width: newwidth,
		};
	}
}

export function getCurrentMobileInfo() {
	let userAgentMatched = window.navigator.userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
	const width = userAgentMatched
		? window.innerWidth
		: window.innerWidth < 500
		? window.innerWidth
		: 375;

	const height = userAgentMatched
		? window.screen.availHeight
		: window.screen.availHeight < 667
		? window.screen.availHeight
		: 667;
	return [width, height];
}

export function getRealWidth(w: number | string = 375) {
	const width = typeof w === 'string' ? parseFloat(w) : w;
	return (getCurrentMobileInfo()[0] / 375) * width;
}

export function getRealHeight(H: number | string = 667) {
	const height = typeof H === 'string' ? parseFloat(H) : H;
	return (getCurrentMobileInfo()[0] / 375) * height;
}
