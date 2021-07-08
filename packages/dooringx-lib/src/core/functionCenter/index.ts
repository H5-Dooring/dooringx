/*
 * @Author: yehuozhili
 * @Date: 2021-04-08 19:59:01
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 01:46:17
 * @FilePath: \dooringv2\packages\dooringx-lib\src\core\functionCenter\index.ts
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

export type FunctionCenterType = Record<
	string,
	{ fn: FunctionCenterFunction; config: FunctionConfigType }
>;

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
	}

	reset() {
		this.funcitonMap = {};
		this.configMap = {};
	}

	getFunctionMap() {
		return this.funcitonMap;
	}

	getConfigMap() {
		return this.configMap;
	}

	/**
	 *
	 * 注册函数，同名覆盖，返回删除函数
	 * @param {string} name
	 * @param {FunctionCenterFunction} fn
	 * @return {*}
	 * @memberof FunctionCenter
	 */
	register(name: string, fn: FunctionCenterFunction, config: FunctionConfigType) {
		// 注册时，需要通知asyncmap已经拿到
		this.funcitonMap[name] = fn;
		if (this.asyncMap[name]) {
			this.asyncMap[name]();
		}
		this.configMap[name] = config;
		return () => {
			delete this.funcitonMap[name];
			delete this.configMap[name];
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
