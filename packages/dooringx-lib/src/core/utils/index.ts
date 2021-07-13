import { message } from 'antd';
import { RGBColor } from 'react-color';
import { nanoid } from 'nanoid';
import Store from '../store';
import { IBlockType, IStoreData } from '../store/storetype';
import { specialCoList } from './special';
import deepCopys from 'deepcopy';
import { FunctionDataMap } from '../functionCenter/config';
import UserConfig from '../../config';

export function deepCopy(obj: any) {
	return deepCopys(obj);
}

export function swap(indexa: number, indexb: number, arr: Array<any>) {
	arr[indexa] = arr.splice(indexb, 1, arr[indexa])[0];
	return arr;
}

// 将rgba字符串对象转化为rgba对象
export function rgba2Obj(rgba = '') {
	let reg = /rgba\(\s*?(\d+)\s*?,\s*?(\d+)\s*?,\s*?(\d+)\s*?,\s*?(\d+)\s*?\)/g;
	let rgbaObj: RGBColor = { r: 0, g: 0, b: 0, a: 0 };

	rgba.replace(reg, (_m, r, g, b, a) => {
		rgbaObj = { r, g, b, a };
		return rgba;
	});
	return rgbaObj;
}

export function createUid(name?: string) {
	if (name) {
		return name + '-' + nanoid();
	} else {
		return nanoid();
	}
}

export const isMac = () => {
	const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
	if (isMac) {
		return true;
	}
	return false;
};

export const changeItem = (
	store: Store,
	id: string,
	property: keyof IBlockType,
	value: IBlockType[keyof IBlockType]
) => {
	const clonedata: IStoreData = deepCopy(store.getData());
	let canchange = true;
	clonedata.block.forEach((v) => {
		if (v.id === id) {
			if (specialCoList.includes(v.name)) {
				message.error('该组件不可调整');
				canchange = false;
			}
			v[property] = value as never;
		}
	});
	if (canchange) {
		store.setData(clonedata);
	}
};

/**
 *
 * 清除所有聚焦，选中某个元素
 * @param {Store} store
 * @param {string} id
 */
export const focusEle = (store: Store, id: string) => {
	const clonedata: IStoreData = deepCopy(store.getData());
	clonedata.block.forEach((v) => {
		if (v.id === id) {
			v.focus = true;
		} else {
			v.focus = false;
		}
	});
	store.setData(clonedata);
};

export const changeLayer = (store: Store, id: string, action: 'up' | 'down' | 'delete') => {
	const clonedata: IStoreData = deepCopy(store.getData());
	let index = -1;
	switch (action) {
		case 'up':
			clonedata.block.forEach((v, i) => {
				if (v.id === id) {
					if (specialCoList.includes(v.name)) {
						message.error('该组件不可调整');
						return;
					} else {
						index = i;
					}
				}
			});
			if (index > 0) {
				// 查看上一个元素
				const item = clonedata.block[index - 1];
				if (specialCoList.includes(item.name)) {
					return;
				}
				swap(index, index - 1, clonedata.block);
				store.setData(clonedata);
			}
			return;
		case 'down':
			clonedata.block.forEach((v, i) => {
				if (v.id === id) {
					if (specialCoList.includes(v.name)) {
						message.error('该组件不可调整');
						return;
					} else {
						index = i;
					}
				}
			});
			if (index > -1 && index + 1 < clonedata.block.length) {
				const item = clonedata.block[index + 1];
				if (specialCoList.includes(item.name)) {
					return;
				}
				swap(index, index + 1, clonedata.block);
				store.setData(clonedata);
			}
			return;
		case 'delete':
			let candelete = true;
			clonedata.block = clonedata.block.filter((v) => {
				if (v.id === id) {
					if (specialCoList.includes(v.name)) {
						candelete = false;
					}
					return false;
				}
				return true;
			});
			if (candelete) {
				store.setData(clonedata);
			} else {
				message.error('该组件无法删除');
			}
			return;
	}
};

/**
 *
 * @param {*} array
 * @param {*} from
 * @param {*} to
 */
export const arrayMove = (array: Array<any>, from: number, to: number) => {
	array = [...array];
	arrayMoveMutate(array, from, to);
	return array;
};

/**
 *
 * @param {*} length
 * @param {*} index
 */
const indexSub = (arrLength: number, toIndex: number) => {
	return toIndex < 0 ? arrLength + toIndex : toIndex;
	// return resIndex;
};

/**
 * 数组换位
 * @param {Array} array The array with the item to move. / [1,2,3]
 * @param {Number} from Index of item to move. If negative, it will begin that many elements from the end / 0 / -1 / 2
 * @param {Number} to Index of where to move the item. If negative, it will begin that many elements from the end / 0 / -1 / 2
 * returns A new array with the item moved to the new position [1,2,3] -> [1,3,2]
 */
const arrayMoveMutate = (array: Array<any>, from: number, to: number) => {
	const arrLength = array.length;
	const startIndex = indexSub(arrLength, from);
	if (startIndex >= 0 && startIndex < arrLength) {
		const endIndex = indexSub(arrLength, to);
		const [item] = array.splice(from, 1);
		array.splice(endIndex, 0, item);
	}
};

/**
 *
 * 这个函数将返回值全部统一成数组// modal的不走此方法
 * @param {keyof FunctionDataMap} v
 * @param {Record<string, any>} args
 * @param {string} name
 * @param {UserConfig} config
 * @param {Record<string, any>} ctx
 * @return {Array<string, any>}
 */
export const changeUserValue = (
	v: keyof FunctionDataMap,
	args: Record<string, any>,
	name: string,
	config: UserConfig,
	ctx: Record<string, any>
) => {
	const userChoose = args[name];
	switch (v) {
		case 'ctx':
			if (Array.isArray(userChoose)) {
				return userChoose.reduce((pr: Array<string>, ne: string) => {
					const val = ctx[ne];
					pr.push(val);
					return pr;
				}, []);
			}
			return [];
		case 'dataSource':
			const dataCenter = config.getDataCenter().getDataMap();
			if (Array.isArray(userChoose)) {
				return userChoose.reduce((pr: Array<string>, ne: string) => {
					const val = dataCenter[ne];
					pr.push(val);
					return pr;
				}, []);
			}
			return [];
		default:
			if (Array.isArray(userChoose)) {
				return userChoose;
			}
			return [];
	}
};
/**
 *
 * 这个函数将返回值全部统一成对象 modal的不走此方法
 * @param {keyof FunctionDataMap} v
 * @param {Record<string, any>} args
 * @param {string} name
 * @param {UserConfig} config
 * @param {Record<string, any>} ctx
 * @return {Record<string, any>}
 */
export const changeUserValueRecord = (
	v: keyof FunctionDataMap,
	args: Record<string, any>,
	name: string,
	config: UserConfig,
	ctx: Record<string, any>
) => {
	const userChoose = args[name];
	switch (v) {
		case 'ctx':
			if (Array.isArray(userChoose)) {
				return userChoose.reduce((pr: Record<string, any>, ne: string) => {
					const val = ctx[ne];
					return Object.assign(pr, { [ne]: val });
				}, {});
			}
			return {};
		case 'dataSource':
			const dataCenter = config.getDataCenter().getDataMap();
			if (Array.isArray(userChoose)) {
				return userChoose.reduce((pr: Record<string, any>, ne: string) => {
					const val = dataCenter[ne];
					return Object.assign(pr, { [ne]: val });
				}, {});
			}
			return {};
		default:
			if (Array.isArray(userChoose)) {
				return userChoose.reduce((pr: Record<string, any>, ne: string) => {
					return Object.assign(pr, { [ne]: ne });
				}, {});
			}
			return {};
	}
};
