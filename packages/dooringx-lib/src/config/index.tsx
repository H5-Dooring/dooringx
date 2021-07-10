/*
 * @Author: yehuozhili
 * @Date: 2021-02-25 21:16:58
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 18:29:07
 * @FilePath: \dooringx\packages\dooringx-lib\src\config\index.tsx
 */
import { IBlockType, IStoreData } from '../core/store/storetype';
import { store } from '../runtime/store';
import { formRegister, componentRegister, commander, storeChanger } from '../runtime';
import { ComponentClass, FunctionComponent, ReactNode } from 'react';
import { ComponentItemFactory } from '../core/components/abstract';
import { marklineConfig } from '../core/markline/marklineConfig';
import { CommanderItem } from '../core/command/commanderType';
import { contextMenuState } from '../core/contextMenu';
import { formComponentRegisterFn } from '../core/components/formComponentRegister';
import { deepCopy } from '../core/utils';
import { LeftRegistComponentMapItem } from '../core/crossDrag';
import { FunctionCenterType } from '../core/functionCenter';
import { EventCenter } from '../core/eventCenter';
import { DataCenter } from '../core/dataCenter';
import { createModal, unmountMap } from '../components/modalRender';
import { scaleState } from '../core/scale/state';
import { CommanderItemFactory } from '../core/command/abstract';
import MmodalMask from '../core/components/defaultFormComponents/modalMask';

// 组件部分

/**
 *
 * @urlFn 组件异步加载函数
 * @component  组件默认导出
 * @export
 * @interface CacheComponentValueType
 */
export interface CacheComponentValueType {
	urlFn?: () => Promise<any>;
	component?: ComponentItemFactory;
}
export type CacheComponentType = Record<string, CacheComponentValueType> | {};
export type AsyncCacheComponentType = Record<string, () => Promise<any>>;

/**
 *
 *
 * @export 左侧的图标 custom 自定义渲染
 * @interface LeftMapRenderListPropsItemCategory
 */
export interface LeftMapRenderListPropsItemCategory {
	type: string;
	icon: ReactNode;
	custom?: boolean;
	customRender?: ReactNode;
	displayName?: string;
}

/**
 *
 *
 * @export 右侧的图标配置
 * @interface RightMapRenderListPropsItemCategory
 */
export interface RightMapRenderListPropsItemCategory {
	type: string;
	icon: ReactNode;
	custom?: boolean;
	customRender?: (type: string, current: IBlockType) => ReactNode;
}

// 设置部分
export interface InitConfig {
	/**
	 * 初始化store
	 * @type {IStoreData[]}
	 * @memberof InitConfig
	 */
	initStoreData: IStoreData[];

	/**
	 *  左边tab页组件渲染包括异步路径  { type: 'basic', component: 'button', img: 'http://xxxx/1.jpg' ,url:'' },
	 * @memberof InitConfig
	 */
	leftAllRegistMap: LeftRegistComponentMapItem[];
	/**
	 * 左边tab页图标配置
	 * type icon custom customRender
	 * @memberof InitConfig
	 */
	leftRenderListCategory: LeftMapRenderListPropsItemCategory[];
	/**
	 * 右边tab页图标配置
	 * type icon custom customRender
	 * @memberof InitConfig
	 */
	rightRenderListCategory: RightMapRenderListPropsItemCategory[];

	/**
	 *
	 * 右侧全局自定义
	 * @type {ReactNode}
	 * @memberof InitConfig
	 */
	rightGlobalCustom: ReactNode;

	/**
	 * 组件加载缓存判定，用来设置不异步加载的组件
	 * @memberof InitConfig
	 */
	initComponentCache: CacheComponentType;

	/**
	 *
	 * 内置函数配置
	 * @memberof InitConfig
	 */
	initFunctionMap: FunctionCenterType;

	/**
	 *
	 * 内置数据中心配置数据
	 * @memberof InitConfig
	 */
	initDataCenterMap: Record<string, any>;

	/**
	 *
	 * commander 指令集合
	 * @type {Array<CommanderItemFactory>}
	 * @memberof InitConfig
	 */
	initCommandModule: Array<CommanderItemFactory>;

	/**
	 *
	 *  右侧配置项
	 * @type {(Record<
	 *   string,
	 *   FunctionComponent<any> | ComponentClass<any, any>
	 * >)}
	 * @memberof InitConfig
	 */
	initFormComponents: Record<string, FunctionComponent<any> | ComponentClass<any, any>>;
}

export const defaultStore: IStoreData = {
	container: {
		width: 375,
		height: 667,
	},
	block: [],
	modalMap: {},
	dataSource: {
		defaultKey: 'defaultValue',
	},
	globalState: {
		containerColor: 'rgba(255,255,255,1)',
		title: 'dooring',
		bodyColor: 'rgba(255,255,255,1)',
	},
	modalConfig: {},
};

export const defaultConfig: InitConfig = {
	initStoreData: [defaultStore],
	leftAllRegistMap: [],
	leftRenderListCategory: [],
	rightGlobalCustom: null,
	rightRenderListCategory: [],
	initComponentCache: {
		modalMask: { component: MmodalMask }, // 这个组件不配置显示
	},
	initFunctionMap: {
		打开弹窗函数: {
			fn: (_ctx, next, config, args) => {
				const modalName = args['_modal'];
				const storeData = config.getStore().getData();
				createModal(modalName, storeData, config);
				next();
			},
			config: [
				{
					name: '弹窗名称',
					data: ['modal'],
					options: {
						receive: '_modal',
						multi: false,
					},
				},
			],
		},
		关闭弹窗函数: {
			fn: (_ctx, next, _config, args) => {
				const modalName = args['_modal'];
				const fn = unmountMap.get(modalName);
				if (fn) {
					fn();
				}
				next();
			},
			config: [
				{
					name: '弹窗名称',
					data: ['modal'],
					options: {
						receive: '_modal',
						multi: false,
					},
				},
			],
		},
	},
	initDataCenterMap: {},
	initCommandModule: [],
	initFormComponents: {},
};

/**
 *
 * 部分无法合并属性如果b传了会以b为准
 * initstore不合并
 * leftallregistmap合并
 * leftRenderListCategory合并
 * rightRenderListCategory合并
 * rightGlobalCustom 不合并
 * initComponentCache合并
 * initFunctionMap合并
 * initDataCenterMap合并
 * initCommandModule合并
 * initFormComponents合并
 *
 * @export InitConfig
 */
export function userConfigMerge(a: Partial<InitConfig>, b?: Partial<InitConfig>): InitConfig {
	const mergeConfig: InitConfig = {
		initStoreData: [defaultStore],
		leftAllRegistMap: [],
		leftRenderListCategory: [],
		rightRenderListCategory: [],
		initComponentCache: {},
		initFunctionMap: {},
		initDataCenterMap: {},
		initCommandModule: [],
		rightGlobalCustom: null,
		initFormComponents: {},
	};
	if (!b) {
		return userConfigMerge(mergeConfig, a);
	}
	mergeConfig.initStoreData = b.initStoreData
		? [...b.initStoreData]
		: a.initStoreData
		? [...a.initStoreData]
		: [defaultStore];

	mergeConfig.rightGlobalCustom = b.rightGlobalCustom ? b.rightGlobalCustom : a.rightGlobalCustom;

	mergeConfig.leftAllRegistMap = b.leftAllRegistMap
		? a.leftAllRegistMap
			? [...a.leftAllRegistMap, ...b.leftAllRegistMap]
			: [...b.leftAllRegistMap]
		: a.leftAllRegistMap
		? [...a.leftAllRegistMap]
		: [];
	mergeConfig.leftRenderListCategory = b.leftRenderListCategory
		? a.leftRenderListCategory
			? [...a.leftRenderListCategory, ...b.leftRenderListCategory]
			: [...b.leftRenderListCategory]
		: a.leftRenderListCategory
		? [...a.leftRenderListCategory]
		: [...defaultConfig.leftRenderListCategory];
	mergeConfig.rightRenderListCategory = b.rightRenderListCategory
		? a.rightRenderListCategory
			? [...a.rightRenderListCategory, ...b.rightRenderListCategory]
			: [...b.rightRenderListCategory]
		: a.rightRenderListCategory
		? [...a.rightRenderListCategory]
		: [...defaultConfig.rightRenderListCategory];
	mergeConfig.initComponentCache = {
		...a.initComponentCache,
		...b.initComponentCache,
	};
	mergeConfig.initFunctionMap = {
		...a.initFunctionMap,
		...b.initFunctionMap,
	};
	mergeConfig.initFormComponents = {
		...a.initFormComponents,
		...b.initFormComponents,
	};
	mergeConfig.initDataCenterMap = {
		...a.initDataCenterMap,
		...b.initDataCenterMap,
	};
	mergeConfig.initCommandModule = b.initCommandModule
		? a.initCommandModule
			? [...a.initCommandModule, ...b.initCommandModule]
			: [...b.initCommandModule]
		: a.initCommandModule
		? [...a.initCommandModule]
		: [];
	return mergeConfig;
}

/**
 *
 *
 * @export 用户配置项
 * @class UserConfig
 */
export class UserConfig {
	public initConfig: InitConfig;
	public store = store;
	public componentRegister = componentRegister;
	public componentCache = {};
	public asyncComponentUrlMap = {} as AsyncCacheComponentType;
	public marklineConfig = marklineConfig;
	public commanderRegister = commander;
	public contextMenuState = contextMenuState;
	public formRegister = formRegister;
	public storeChanger = storeChanger;
	public eventCenter: EventCenter;
	public dataCenter: DataCenter;
	public scaleState = scaleState;
	constructor(initConfig?: Partial<InitConfig>) {
		const mergeConfig = userConfigMerge(defaultConfig, initConfig);
		this.initConfig = mergeConfig;
		this.eventCenter = new EventCenter({}, mergeConfig.initFunctionMap);
		this.dataCenter = new DataCenter(mergeConfig.initDataCenterMap);
		this.init();
		// 右侧配置项注册 初始注册组件暂时固定
	}

	toRegist() {
		const modules = this.initConfig.initFormComponents;
		formComponentRegisterFn(formRegister, modules);

		const cache = this.initConfig.initComponentCache;
		this.componentCache = cache;
		// 拿到组件缓存后，先同步加载map上组件
		Object.values(cache).forEach((v) => {
			if ((v as CacheComponentValueType).component) {
				this.registComponent((v as CacheComponentValueType).component!);
			}
		});
		// 异步组件注册地址
		this.initConfig.leftAllRegistMap.forEach((v) => {
			if (v.urlFn) {
				//@ts-ignore
				this.asyncComponentUrlMap[v.component] = v.urlFn;
			}
		});
		// 注册画布上组件
		this.store.getData().block.forEach((v) => {
			this.asyncRegistComponent(v.name);
		});

		// 注册data
		this.dataCenter = new DataCenter(this.initConfig.initDataCenterMap);
		//数据需要加上store上的
		this.dataCenter.initAddToDataMap(this.store.getData(), this.storeChanger);
		// 修改事件与数据初始
		this.eventCenter = new EventCenter({}, this.initConfig.initFunctionMap);
		// 注册画布事件
		this.eventCenter.syncEventMap(this.store.getData(), this.storeChanger);
	}

	init() {
		this.store.resetToInitData(deepCopy(this.initConfig.initStoreData), true);
		this.toRegist();
	}

	getStoreJSON() {
		return JSON.stringify(this.store.getData());
	}

	parseStoreJson(json: string) {
		return JSON.parse(json);
	}

	resetData(data: IStoreData[]) {
		this.store.resetToInitData(data, true);
		this.toRegist();
	}

	getScaleState() {
		return this.scaleState;
	}
	getDataCenter() {
		return this.dataCenter;
	}
	getEventCenter() {
		return this.eventCenter;
	}
	getStoreChanger() {
		return this.storeChanger;
	}
	getConfig() {
		return this.initConfig;
	}
	getStore() {
		return this.store;
	}
	getComponentRegister() {
		return this.componentRegister;
	}
	getContextMenuState() {
		return this.contextMenuState;
	}
	getFormRegister() {
		return this.formRegister;
	}
	getCommanderRegister() {
		return this.commanderRegister;
	}

	/**
	 *
	 * 以默认设置重置配置项
	 * @param {Partial<InitConfig>} v
	 * @memberof UserConfig
	 */
	resetConfig(v: Partial<InitConfig>) {
		const mergeConfig = userConfigMerge(defaultConfig, v);
		this.initConfig = mergeConfig;
		this.init();
		store.forceUpdate();
	}
	/**
	 *  会重置配置，请修改配置后增加
	 * 异步增加左侧tab页
	 * @memberof UserConfig
	 */
	addLeftCategory(v: LeftMapRenderListPropsItemCategory[]) {
		const obj = {} as InitConfig;
		obj.leftRenderListCategory = v;
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		store.forceUpdate();
	}

	/**
	 *  会重置配置，请修改配置后增加
	 * 异步增加右侧tab页
	 * @memberof UserConfig
	 */
	addRightCategory(v: RightMapRenderListPropsItemCategory[]) {
		const obj = {} as InitConfig;
		obj.rightRenderListCategory = v;
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		store.forceUpdate();
	}

	/**
	 * 会重置配置，请修改配置后增加
	 * 异步增加组件map
	 * @memberof UserConfig
	 */
	addCoRegistMap(v: LeftRegistComponentMapItem) {
		const obj = {} as InitConfig;
		obj.leftAllRegistMap = [v];
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		store.forceUpdate();
	}

	/**
	 *会重置配置，请修改配置后增加
	 * 异步修改config 重置store
	 * @memberof UserConfig
	 */
	setConfig(v: Partial<InitConfig>) {
		this.initConfig = userConfigMerge(this.initConfig, v);
		this.init();
		store.forceUpdate();
	}

	/**
	 *
	 * 同步注册指令
	 * @param {CommanderItem} command
	 * @memberof UserConfig
	 */
	registCommander(command: CommanderItem) {
		this.commanderRegister.register(command);
	}

	/**
	 *
	 * 用于修改markline配置
	 * @returns
	 * @memberof UserConfig
	 */
	getMarklineConfig() {
		return this.marklineConfig;
	}

	getComponentCache() {
		return this.componentCache;
	}
	/**
	 *
	 * 同步注册组件，不会检测缓存是否存在
	 * @param {ComponentItemFactory} item
	 * @memberof UserConfig
	 */
	registComponent(item: ComponentItemFactory) {
		this.componentRegister.register(item);
	}
	/**
	 *
	 * 异步注册组件，会判定缓存是否存在
	 * @param {string} name
	 * @memberof UserConfig
	 */
	async asyncRegistComponent(name: string) {
		//判定缓存
		if (
			!(this.componentCache as Record<string, CacheComponentValueType>)[name] &&
			this.asyncComponentUrlMap[name]
		) {
			const chunk = await this.asyncComponentUrlMap[name]();
			const chunkDefault = chunk.default;
			this.componentRegister.register(chunkDefault);
			(this.componentCache as Record<string, CacheComponentValueType>)[name] = {
				component: chunkDefault,
			};
			this.componentRegister.emitEvent(name);
		}
	}
}

export default UserConfig;
