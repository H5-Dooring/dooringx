export interface CustomAnimateObj {
	displayName: string;
	animateName: string;
	keyframe: string;
}

export class DynamicAnimate {
	constructor(public customAnimateName: Array<CustomAnimateObj> = []) {}

	getCustomAnimateName() {
		return this.customAnimateName;
	}
	getStyleSheets() {
		return document.styleSheets;
	}

	/**
	 *
	 * 插入动画
	 * @param {string} ruleText
	 * @param {string} keyframeName
	 * @memberof DynamicAnimate
	 */
	inserKeyframeAnimate(ruleText: string, keyframeName: string) {
		const sheets = this.getStyleSheets();
		if (sheets.length === 0) {
			let style = document.createElement('style');
			style.appendChild(document.createTextNode(''));
			document.head.appendChild(style);
		}
		const len = sheets.length;
		let ss: number | null = null;
		let st: number | null = null;
		for (let i = 0; i < len; i++) {
			for (let k = 0; k < sheets[i].cssRules.length; k++) {
				const rule = sheets[i].cssRules[k] as CSSKeyframesRule;
				const name = rule?.name;
				if (name && name === keyframeName) {
					// 删除该keyframe
					ss = i;
					st = k;
				}
			}
		}
		if (ss !== null && st !== null) {
			sheets[ss].deleteRule(st);
		}
		let sheet = sheets[ss ? ss : sheets.length - 1] as CSSStyleSheet;
		sheet.insertRule(ruleText, sheet.rules ? sheet.rules.length : sheet.cssRules.length);
	}

	/**
	 *
	 * 配置时使用
	 * @param {Array<CustomAnimateObj>} [customAnimateName=[]]
	 * @memberof DynamicAnimate
	 */
	addCustomAnimate(customAnimateName: Array<CustomAnimateObj> = []) {
		this.customAnimateName = [...this.customAnimateName, ...customAnimateName];
	}

	/**
	 *
	 * 删除使用animateName 防止displayName重名
	 * @param {string} animateName
	 * @memberof DynamicAnimate
	 */
	deleteCustomAnimate(animateName: string) {
		this.customAnimateName = this.customAnimateName.filter((v) => v.animateName !== animateName);
	}

	/**
	 *
	 * 从配置项插入动画 导入设置
	 * @memberof DynamicAnimate
	 */
	fromArrInsertKeyFrame(customAnimateName: Array<CustomAnimateObj> = this.customAnimateName) {
		customAnimateName.forEach((v) => {
			this.inserKeyframeAnimate(v.keyframe, v.animateName);
		});
	}
}
