/*
 * @Author: yehuozhili
 * @Date: 2021-04-06 19:33:17
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-09 16:33:22
 * @FilePath: \DooringV2\packages\dooringx-lib\src\core\eventCenter\index.ts
 */
import UserConfig from '../../config';
import { FunctionCenter, FunctionCenterType } from '../functionCenter';
import { FunctionDataType } from '../functionCenter/config';
import { IStoreData } from '../store/storetype';
import { StoreChanger } from '../storeChanger';
import { EventQuene } from './eventQuene';

// 每个组件制作时可以抛出多个事件，事件名为id+自定义name，
// 每个组件可以抛出多个函数，存在函数中心

export interface EventCenterMapItem {
	name: string; // 函数名
	args: Record<string, any>; // 输入参数都会变成对象传来，
	data: Record<string, FunctionDataType>; // 用户选的种类 键是每个配置项名
}
export interface EventCenterUserSelect {
	uid: string;
	value: string;
	detail: Record<string, any>;
}

export type EventCenterMapType = Record<
	string,
	{
		arr: Array<EventCenterMapItem>;
		displayName: string;
		userSelect: Array<EventCenterUserSelect>;
	}
>;

export class EventCenter {
	/**
	 * 该map需要存入store,值为函数的key的数组
	 * @param {Record<string, Array<string>>} [eventMap={}]
	 * @memberof EventCenter
	 */
	public functionCenter: FunctionCenter;
	constructor(public eventMap: EventCenterMapType = {}, configFunction?: FunctionCenterType) {
		this.functionCenter = new FunctionCenter(configFunction);
	}

	getFunctionCenter() {
		return this.functionCenter;
	}

	getEventMap() {
		return this.eventMap;
	}
	resetEventMap() {
		this.eventMap = {};
	}

	/**
	 *
	 * 重置map进行收集事件 主要就是收集eventMap字段
	 * 这个应该优化在换store情况下。
	 * @param {IStoreData} data
	 * @memberof EventCenter
	 */
	syncEventMap(data: IStoreData, storeChanger: StoreChanger) {
		// 需要判断是否在弹窗状态。如果在弹窗状态，数据以storeChanger为准，否则就以store为准
		const sign = storeChanger.isEdit();
		this.eventMap = {};
		if (sign) {
			const originData = storeChanger.getOrigin();
			if (originData) {
				const currentData = originData.data[originData.current];
				// 收集源block数据
				currentData.block.forEach((v) => {
					this.eventMap = Object.assign(this.eventMap, v.eventMap);
				});
				//收集源modal数据
				Object.keys(currentData.modalMap).forEach((v) => {
					currentData.modalMap[v].block.forEach((k) => {
						this.eventMap = Object.assign(this.eventMap, k.eventMap);
					});
				});
				//收集当前modal数据
				data.block.forEach((v) => {
					this.eventMap = Object.assign(this.eventMap, v.eventMap);
				});
			}
		} else {
			data.block.forEach((v) => {
				this.eventMap = Object.assign(this.eventMap, v.eventMap);
			});
			Object.keys(data.modalMap).forEach((v) => {
				data.modalMap[v].block.forEach((k) => {
					this.eventMap = Object.assign(this.eventMap, k.eventMap);
				});
			});
		}
	}

	/**
	 *
	 * 手动更新状态eventMap
	 * @param {string} name
	 * @memberof EventCenter
	 */
	manualUpdateMap(name: string, displayName: string, arr?: Array<EventCenterMapItem>) {
		if (!this.eventMap[name]) {
			this.eventMap[name] = {
				arr: [],
				displayName: displayName,
				userSelect: [],
			};
		}
		if (arr && this.eventMap[name].displayName) {
			this.eventMap[name].arr = arr;
		} else if (arr && this.eventMap[name]) {
			this.eventMap[name] = {
				displayName,
				arr,
				userSelect: [],
			};
		}
	}

	/**
	 *
	 * 执行事件链
	 * @param {string} name
	 * @memberof EventCenter
	 */
	async runEventQueue(name: string, config: UserConfig) {
		const eventList = this.eventMap[name];
		if (!eventList) {
			console.error(`未查询到该事件${name}`);
			return;
		}
		const arr = new EventQuene(1, config);
		//如果组件异步加载，那么函数会过段时间载入，等同于异步函数
		// 函数中心需要处理未找到时的异步处理情况
		if (Array.isArray(eventList.arr)) {
			for (let i of eventList.arr) {
				const fn = await this.functionCenter.getFunction(i.name);
				arr.take(fn, i.args, eventList, i);
			}
		}
	}
}
