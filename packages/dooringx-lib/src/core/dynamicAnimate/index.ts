// 批量情况

export class DynamicAnimate {
	getStyleSheets() {
		return document.styleSheets;
	}

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

	fromObjInsertKeyFrame(obj: Record<string, string>) {
		// name 唯一
		Object.keys(obj).forEach((v) => {
			this.inserKeyframeAnimate(obj[v], v);
		});
	}
}
