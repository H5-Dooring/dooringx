/*
 * @Author: yehuozhili
 * @Date: 2021-04-08 19:59:01
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-09 16:23:02
 * @FilePath: \DooringV2\packages\dooringx-lib\src\core\functionCenter\index.ts
 */

import UserConfig from '../../config';
import { EventCenterMapItem, EventCenterUserSelect } from '../eventCenter';
import { FunctionConfigType } from './config';

/**
 *
 * ctx可在事件链中传递，函数完成后调用next执行下一个函数
 * @export
 */
export type FunctionCenterFunction = (
	ctx: Record<string, any>,
	next: Function,
	config: UserConfig,
	args: Record<string, any>,
	eventList: {
		arr: Array<EventCenterMapItem>;
		displayName: string;
		userSelect: Array<EventCenterUserSelect>;
	},
	iname: EventCenterMapItem
) => void;

export type FunctionCenterValue = {
	fn: FunctionCenterFunction;
	config: FunctionConfigType;
	name: string;
};

export type FunctionCenterType = Record<string, FunctionCenterValue>;

/**
 *
 * 初始化时可以加载初始已配好的函数
 * @export
 * @class FunctionCenter
 */
export class FunctionCenter {
	/**
	 *
	 * 该map 用于获取函数未获取到时，异步拉取
	 * @memberof FunctionCenter
	 */
	public asyncMap: Record<string, Function> = {};
	public configMap: Record<string, FunctionConfigType> = {};
	public funcitonMap: Record<string, FunctionCenterFunction> = {};
	public nameMap: Record<string, string> = {}; // id对名字
	constructor(public initConfig: FunctionCenterType = {}) {
		this.init(initConfig);
	}

	init(initConfig: FunctionCenterType) {
		this.reset();
		this.funcitonMap = Object.keys(initConfig).reduce<Record<string, FunctionCenterFunction>>(
			(prev, next) => {
				prev[next] = initConfig[next].fn;
				return prev;
			},
			{}
		);
		this.configMap = Object.keys(initConfig).reduce<Record<string, FunctionConfigType>>(
			(prev, next) => {
				prev[next] = initConfig[next].config;
				return prev;
			},
			{}
		);
		this.nameMap = Object.keys(initConfig).reduce<Record<string, string>>((prev, next) => {
			prev[next] = initConfig[next].name;
			return prev;
		}, {});
	}

	reset() {
		this.funcitonMap = {};
		this.configMap = {};
		this.nameMap = {};
	}

	getFunctionMap() {
		return this.funcitonMap;
	}
	getConfigMap() {
		return this.configMap;
	}
	getNameMap() {
		return this.nameMap;
	}

	/**
	 *
	 * 通过name查id
	 * @param {string} name
	 * @return {*}  {(string | undefined)}
	 * @memberof FunctionCenter
	 */
	nameToKey(name: string): string | undefined {
		const keys = Object.keys(this.nameMap);
		const keylen = keys.length;
		let result: string | undefined;
		for (let i = 0; i < keylen; i++) {
			const key = keys[i];
			if (this.nameMap[key] === name) {
				result = key;
				break;
			}
		}
		return result;
	}

	/**
	 *
	 * 删除的组件需要删除动态注册的函数
	 * @param {string} name
	 * @memberof FunctionCenter
	 */
	deleteFunc(name: string) {
		delete this.funcitonMap[name];
		delete this.configMap[name];
		delete this.nameMap[name];
	}

	/**
	 *
	 *注册函数，同id覆盖，返回删除函数
	 * @param {string} id 唯一值 注意！每个组件都要不一样，所以需要带着每个组件的id，这样也方便区分是哪个组件抛出的函数!!
	 * @param {FunctionCenterFunction} fn 函数体
	 * @param {FunctionConfigType} config 配置项
	 * @param {string} name 显示名
	 * @return {*}
	 * @memberof FunctionCenter
	 */
	register(id: string, fn: FunctionCenterFunction, config: FunctionConfigType, name: string) {
		// 注册时，需要通知asyncmap已经拿到
		this.funcitonMap[id] = fn;
		this.configMap[id] = config;
		this.nameMap[id] = name;
		if (this.asyncMap[id]) {
			this.asyncMap[id]();
		}
		return () => {
			delete this.funcitonMap[id];
			delete this.configMap[id];
			delete this.nameMap[id];
		};
	}

	/**
	 *
	 * 获取函数，包含异步获取函数
	 * @param {string} name
	 * @return {*}  {Promise<FunctionCenterFunction>}
	 * @memberof FunctionCenter
	 */
	getFunction(name: string): Promise<FunctionCenterFunction> {
		//如果拿不到，可能是异步，进行监听回调
		const fn = this.funcitonMap[name];
		if (fn) {
			return Promise.resolve(fn);
		}
		return new Promise((resolve) => {
			console.warn(`waiting the function now ${name} `);
			this.asyncMap[name] = () => {
				delete this.asyncMap[name];
				resolve(this.getFunction(name));
			};
		});
	}
}
