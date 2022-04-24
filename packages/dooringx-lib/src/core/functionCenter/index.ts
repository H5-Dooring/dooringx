/*
 * @Author: yehuozhili
 * @Date: 2021-04-08 19:59:01
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-24 00:14:25
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\functionCenter\index.ts
 */

import UserConfig from '../../config';
import { EventCenterMapItem, EventCenterUserSelect } from '../eventCenter';
import Store from '../store';
import { specialFnList } from '../utils/special';
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
	componentId: string;
};

export type FunctionCenterType = Record<string, FunctionCenterValue>;

/**
 *
 * 初始化时可以加载初始已配好的函数
 * {}
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
	public componentIdMap: Record<string, Set<string>> = {}; // 组件id对函数id
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
		this.componentIdMap = Object.keys(initConfig).reduce<Record<string, Set<string>>>(
			(prev, next) => {
				const cid = initConfig[next].componentId;
				if (prev[cid]) {
					prev[cid].add(next);
				} else {
					prev[cid] = new Set([next]);
				}
				return prev;
			},
			{}
		);
	}

	reset() {
		this.funcitonMap = {};
		this.configMap = {};
		this.nameMap = {};
		this.componentIdMap = {};
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
	 *
	 * @param {{
	 * 		id: string;唯一值 注意！每个组件都要不一样，所以需要带着每个组件的id，这样也方便区分是哪个组件抛出的函数!!
	 * 		fn: FunctionCenterFunction;函数体
	 * 		config: FunctionConfigType;配置项
	 * 		name: string;显示名
	 * 		componentId: string;所属组件id名用于卸载函数
	 * 	}} obj
	 * @returns
	 * @memberof FunctionCenter
	 */
	register(obj: {
		id: string;
		fn: FunctionCenterFunction;
		config: FunctionConfigType;
		name: string;
		componentId: string;
	}) {
		const { id, fn, config, name, componentId } = obj;
		// 注册时，需要通知asyncmap已经拿到
		this.funcitonMap[id] = fn;
		this.configMap[id] = config;
		this.nameMap[id] = name;
		if (this.componentIdMap[componentId]) {
			this.componentIdMap[componentId].add(id);
		} else {
			this.componentIdMap[componentId] = new Set([id]);
		}
		if (this.asyncMap[id]) {
			this.asyncMap[id]();
		}
		return () => {
			delete this.funcitonMap[id];
			delete this.configMap[id];
			delete this.nameMap[id];
			this.componentIdMap[componentId].delete(id);
		};
	}

	/**
	 *
	 * 画布更新时检查所有组件，不存在的组件和其挂载函数则删除，剔除_inner下的
	 * @memberof FunctionCenter
	 */
	syncFunction(store: Store) {
		const special = specialFnList;
		const allId: string[] = [];
		const data = store.getData();
		// modalmap上
		const map = data.modalMap;
		Object.keys(map).forEach((v) => {
			map[v].forEach((k) => {
				allId.push(k.id);
			});
		});
		// block上
		data.block.forEach((v) => {
			allId.push(v.id);
		});
		if (store.isEdit()) {
			// 额外origin上
			if (data.origin)
				data.origin?.forEach((v) => {
					allId.push(v.id);
				});
		}
		const needDelete: string[] = [];
		Object.keys(this.componentIdMap).forEach((v) => {
			if (!special.includes(v)) {
				if (!allId.includes(v)) {
					needDelete.push(v);
				}
			}
		});

		needDelete.forEach((v) => {
			const ids = this.componentIdMap[v];
			ids.forEach((id) => {
				delete this.funcitonMap[id];
				delete this.configMap[id];
				delete this.nameMap[id];
			});
			delete this.componentIdMap[v];
		});
	}

	/**
	 *
	 * 获取函数，包含异步获取函数 注意某些情况执行顺序
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
