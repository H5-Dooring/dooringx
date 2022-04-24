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
	positionX: number;
	positionY: number;
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
export const styleSheetId = 'dooringx_dynamic_style';
export class AnimateFactory {
	constructor(public customAnimateName: Array<CustomAnimateObj> = []) {}

	getCustomAnimateName() {
		return this.customAnimateName;
	}
	searchSheet(): null | CSSStyleSheet {
		let sheet: null | CSSStyleSheet = null;
		Array.from(document.styleSheets).forEach((v) => {
			const node = v?.ownerNode as Element;
			if (node?.id === styleSheetId) {
				sheet = v;
			}
		});
		return sheet;
	}

	getStyleSheets() {
		let sheet = this.searchSheet();
		if (!sheet) {
			let style = document.createElement('style');
			style.id = styleSheetId;
			style.appendChild(document.createTextNode(''));
			document.head.appendChild(style);
		}
		sheet = this.searchSheet();
		return sheet;
	}

	/**
	 *
	 * 插入动画
	 * @param {string} ruleText
	 * @memberof AnimateFactory
	 */
	inserKeyframeAnimate(ruleText: string) {
		const sheet = this.getStyleSheets();
		if (sheet) sheet.insertRule(ruleText, sheet.cssRules.length);
	}

	/**
	 *
	 * 删除keyframe
	 * @param {string} animateName
	 * @returns
	 * @memberof AnimateFactory
	 */
	deleteKeyFrameAnimate(animateName: string) {
		const sheets = this.getStyleSheets();
		if (!sheets) {
			return;
		}
		const len = sheets.cssRules.length;
		let ss = null;
		for (let i = 0; i < len; i++) {
			const rule = sheets.cssRules[i] as CSSKeyframesRule;
			const name = rule?.name;
			if (name && name === animateName) {
				ss = i;
			}
		}
		if (ss !== null) {
			sheets.deleteRule(ss);
		}
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
			this.inserKeyframeAnimate(v.keyframe);
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
		let data = store.getData();
		const copy = deepCopy(data);
		const originGlobal = copy.globalState as IMainStoreData['globalState'];
		originGlobal.customAnimate = [...this.customAnimateName];
		store.setData(copy);
	}

	/**
	 *
	 * 将store中的配置写入config
	 * 注意！只在导入新store后使用
	 * @memberof AnimateFactory
	 */
	syncStoreToConfig(config: UserConfig) {
		const store = config.getStore();
		let data: IStoreData;
		data = store.getData();
		const dataAnimate = data.globalState?.customAnimate;
		this.customAnimateName = [...dataAnimate];
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
			return `${v.percent}% {
            transform:translate(${v.positionX}px, ${v.positionY}px) scale(${(v.scale / 100).toFixed(
				2
			)}) rotate(${v.rotate}deg);
         }`;
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
		this.inserKeyframeAnimate(keyframe);
		// 写入store
		this.syncToStore(config);
	}
}
