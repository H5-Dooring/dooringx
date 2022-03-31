import UserConfig from '../../config';
import { CustomAnimateObj, IMainStoreData, IStoreData } from '../store/storetype';
import { deepCopy } from '../utils';

/**
 *
 *  opacity: 100
    percent: 0
    positionX: 0
    positionY: 0
    rotate: 0
    scale: 100
 * @export 转换使用
 * @interface TransformItemObj
 */
export interface TransformItemObj {
	opacity: number;
	percent: number;
	positionX: number | null;
	positionY: number | null;
	rotate: number;
	scale: number;
}

/**
 *
 *
 * @export 用户输入对象
 * @interface TransformItem
 */
export interface TransformItem {
	displayName: string;
	animateName: string;
	keyframes: TransformItemObj[];
}

export class AnimateFactory {
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
	 * @param {string} keyframeName 动画名称
	 * @memberof AnimateFactory
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
	 * @param {Array<CustomAnimateObj>} [customAnimateNameArr=[]]
	 * @memberof AnimateFactory
	 */
	addCustomAnimate(customAnimateNameArr: Array<CustomAnimateObj> = []) {
		this.customAnimateName = [...this.customAnimateName, ...customAnimateNameArr];
	}

	/**
	 *
	 * 删除使用animateName 防止displayName重名 用完需要同步store
	 * @param {string} animateName
	 * @memberof AnimateFactory
	 */
	deleteCustomAnimate(animateName: string) {
		this.customAnimateName = this.customAnimateName.filter((v) => v.animateName !== animateName);
	}

	/**
	 *
	 * 从配置项插入动画 导入设置
	 * @memberof AnimateFactory
	 */
	fromArrInsertKeyFrame(customAnimateName: Array<CustomAnimateObj> = this.customAnimateName) {
		customAnimateName.forEach((v) => {
			this.inserKeyframeAnimate(v.keyframe, v.animateName);
		});
	}

	/**
	 *
	 * 将this.customAnimateName写入store
	 * @memberof AnimateFactory
	 */
	syncToStore(config: UserConfig) {
		// 先判断global的位置
		const store = config.getStore();
		let data: IStoreData;
		const isEdit = config.getStoreChanger().isEdit();
		if (isEdit) {
			const origin = config.getStoreChanger().getOrigin()!;
			data = origin.data[origin.current];
		} else {
			data = store.getData();
		}
		const copy: IMainStoreData = deepCopy(data);
		const originGlobal = copy.globalState as IMainStoreData['globalState'];
		originGlobal.customAnimate = [...this.customAnimateName];
		if (isEdit) {
			config.getStoreChanger().updateOrigin(copy);
		} else {
			store.setData(copy);
		}
	}

	/**
	 *
	 * 将用户输入转换为新的动画
	 * @param {TransformItem} item
	 * @memberof AnimateFactory
	 */
	addUserInputIntoCustom(item: TransformItem, config: UserConfig) {
		// 先转换keyframe
		const keyframeItem = item.keyframes.map((v) => {
			if (v.positionX !== null && v.positionY !== null) {
				// 带入xy 否则不计算xy
				return `${v.percent}% {
            transform:translate(${v.positionX}px, ${v.positionY}px) scale(${(v.scale / 100).toFixed(
					2
				)}) rotate(${v.rotate}deg);
         }`;
			} else {
				return `${v.percent}% {
          transform: scale(${(v.scale / 100).toFixed(2)}) rotate(${v.rotate}deg);
       }`;
			}
		});
		const keyframe = `@keyframes ${item.animateName} {
      ${keyframeItem.join(' ')}
    }`;
		const customAnimateNameArr: CustomAnimateObj[] = [
			{
				displayName: item.displayName,
				keyframe,
				animateName: item.animateName,
			},
		];
		// 添加内置
		this.addCustomAnimate(customAnimateNameArr);
		// 插入动画
		this.inserKeyframeAnimate(keyframe, item.animateName);
		// 写入store
		this.syncToStore(config);
	}
}
