/*
 * @Author: yehuozhili
 * @Date: 2021-04-13 11:20:55
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-10 01:02:03
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\dataCenter\index.ts
 */

import UserConfig from '../../config';
import { IStoreData } from '../store/storetype';
import { StoreChanger } from '../storeChanger';

/**
 *
 * 用来管理页面数据，包括全局数据，做全局设置变量时可以加上
 * 使用Record<string,any>结构，每个组件的数据需要抛出并设定键进行通信。
 * @export
 * @class DataCenter
 */
export class DataCenter {
	public asyncMap: Record<string, Function> = {};
	constructor(public dataMap: Record<string, any> = {}) {}

	/**
	 *
	 * 拿到map
	 * @return {*}
	 * @memberof DataCenter
	 */
	getDataMap() {
		return this.dataMap;
	}

	/**
	 *
	 * 用于设置map数据
	 * 在异步注册时会触发get的回调，动态不需要持久化
	 * @memberof DataCenter
	 */
	setToMap(data: Record<string, any>) {
		this.dataMap = Object.assign(this.dataMap, data);
		Object.keys(data).forEach((v) => {
			if (this.asyncMap[v]) {
				this.asyncMap[v]();
				delete this.asyncMap[v];
			}
		});
	}

	/**
	 *
	 * 静态设置map 和异步无关 静态需要持久化，datacenter存入store
	 * 该更新不放在redo undo处
	 * @param {Record<string, any>} data
	 * @memberof DataCenter
	 */
	staticSetToMap(data: Record<string, any>, config: UserConfig) {
		this.dataMap = data;
		const storeChanger = config.getStoreChanger();
		const store = config.getStore();
		const storeCurrentData = store.getData();
		const sign = storeChanger.isEdit();
		if (sign) {
			const originData = storeChanger.getOrigin();
			if (originData) {
				const currentData = originData.now;
				currentData.dataSource = data;
			}
		} else {
			storeCurrentData.dataSource = data;
		}
	}

	/**
	 *
	 * 初始收集使用  -> to datacenter
	 * @param {IStoreData} data
	 * @memberof DataCenter
	 */
	initAddToDataMap(data: IStoreData, storeChanger: StoreChanger) {
		const sign = storeChanger.isEdit();
		//这里只能初始触发，一般不会走编辑状态，否则逻辑可能会有问题
		if (sign) {
			// 编辑状态收集orgin
			const originData = storeChanger.getOrigin();
			if (originData) {
				const currentData = originData.data[originData.current];
				this.dataMap = currentData.dataSource;
			}
		} else {
			this.dataMap = data.dataSource;
		}
	}

	/**
	 *
	 * 获取值可异步
	 * @param {string} name
	 * @memberof DataCenter
	 */
	getValue(name: string) {
		const value = this.dataMap[name];
		if (value) {
			return Promise.resolve(value);
		}
		return new Promise((resolve) => {
			this.asyncMap[name] = () => {
				resolve(this.getValue(name));
			};
		});
	}

	/**
	 *
	 * 获取值不可异步
	 * @param {string} name
	 * @memberof DataCenter
	 */
	get(name: string) {
		const value = this.dataMap[name];
		return value;
	}
}
