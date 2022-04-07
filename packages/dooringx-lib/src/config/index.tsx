/*
 * @Author: yehuozhili
 * @Date: 2021-02-25 21:16:58
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-08 01:37:07
 * @FilePath: \dooringx\packages\dooringx-lib\src\config\index.tsx
 */
import React from 'react';
import { IBlockType, IMainStoreData, IStoreData } from '../core/store/storetype';
import { ComponentClass, FunctionComponent, ReactNode } from 'react';
import { ComponentItemFactory } from '../core/components/abstract';
import { marklineConfig } from '../core/markline/marklineConfig';
import { CommanderItem } from '../core/command/commanderType';
import { contextMenuState } from '../core/contextMenu';
import {
	FormComponentRegister,
	formComponentRegisterFn,
} from '../core/components/formComponentRegister';
import { deepCopy } from '../core/utils';
import { LeftRegistComponentMapItem } from '../core/crossDrag';
import { FunctionCenterType } from '../core/functionCenter';
import { EventCenter } from '../core/eventCenter';
import { DataCenter } from '../core/dataCenter';
import { createModal, unmountMap } from '../components/modalRender';
import { scaleState } from '../core/scale/state';
import { CommanderItemFactory } from '../core/command/abstract';
import MmodalMask from '../core/components/defaultFormComponents/modalMask';
import CommanderWrapper from '../core/command';
import { focusState } from '../core/focusHandler/state';
import ComponentRegister from '../core/components';
import { StoreChanger } from '../core/storeChanger';
import Store from '../core/store';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { wrapperMoveState } from '../components/wrapperMove/event';
import { wrapperMoveState as iframeWrapperMoveState } from '../components/IframeWrapperMove/event';
import { TimeLineConfigType, TimeLineNeedleConfigType } from '../components/timeLine/timeline';
import { AnimateFactory } from '../core/AnimateFactory';
// 组件部分

/**
 *
 * @urlFn 组件异步加载函数
 * @component  组件默认导出
 * @export
 * @interface CacheComponentValueType
 */
export interface CacheComponentValueType {
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
	customRender?: (config: UserConfig) => ReactNode;
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
	customRender?: (type: string, current: IBlockType, config: UserConfig) => ReactNode;
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
	 * @memberof InitConfig
	 */
	rightGlobalCustom: ((config: UserConfig) => ReactNode) | null | undefined;

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

	/**
	 *
	 * 容器拉伸图标
	 * @type {ReactNode}
	 * @memberof InitConfig
	 */
	containerIcon: ReactNode;
}

export const defaultStore: IMainStoreData = {
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
		title: 'Dooringx',
		bodyColor: 'rgba(255,255,255,1)',
		script: [],
		customAnimate: [],
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
			name: '打开弹窗函数',
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
			name: '关闭弹窗函数',
		},
	},
	initDataCenterMap: {},
	initCommandModule: [],
	initFormComponents: {},
	containerIcon: <VerticalAlignMiddleOutlined />,
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
 * containerIcon不合并
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
		containerIcon: null,
	};
	if (!b) {
		return userConfigMerge(mergeConfig, a);
	}
	mergeConfig.initStoreData = b.initStoreData
		? [...b.initStoreData]
		: a.initStoreData
		? [...a.initStoreData]
		: [defaultStore];

	mergeConfig.containerIcon = b.containerIcon ? b.containerIcon : a.containerIcon;

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
	public store = new Store();
	public componentRegister = new ComponentRegister();
	public formRegister = new FormComponentRegister();
	public storeChanger = new StoreChanger();
	public animateFactory = new AnimateFactory();
	public componentCache = {};
	public asyncComponentUrlMap = {} as AsyncCacheComponentType;
	public marklineConfig = marklineConfig;
	public commanderRegister: CommanderWrapper;
	public contextMenuState = contextMenuState;
	public eventCenter: EventCenter;
	public dataCenter: DataCenter;
	public scaleState = scaleState;
	public focusState = focusState;
	public collapsed = false;
	public ticker = true;
	public containerOverFlow = true;
	public containerForceUpdate = () => {};
	public timeline = false;
	public timelineConfig: TimeLineConfigType = {
		autoFocus: true,
		scrollDom: null,
	};
	public timelineNeedleConfig: TimeLineNeedleConfigType = {
		status: 'start',
		runFunc: () => {},
		resetFunc: () => {},
		pauseFunc: () => {},
		setNeedle: () => {},
		current: 0,
		isRefresh: true,
	};
	public createdFn: Function[] = [];
	public created: Function = () => {};
	public beforeOnMountedFn: Function[] = [];
	public beforeOnMounted: Function = () => {};
	public onMountedFn: Function[] = [];
	public onMounted: Function = () => {};
	public destroyedFn: Function[] = [];
	public destroyed: Function = () => {};
	public blockForceUpdate: Array<Function> = [];
	public waitAnimate = false;
	public wrapperMoveState = wrapperMoveState;
	public iframeWrapperMoveState = iframeWrapperMoveState;
	public refreshIframe = () => {};
	public sendParent = (message: any) => {
		window.parent.postMessage(message, '*');
	};
	public iframeOrigin = '';
	public iframeId = 'yh-container-iframe';
	public i18n = true;
	public SCRIPTGLOBALNAME = 'DOORINGXPLUGIN';
	public scriptLoading = false;
	public leftForceUpdate = () => {};
	public customMap: Record<string, any> = {};
	constructor(initConfig?: Partial<InitConfig>) {
		const mergeConfig = userConfigMerge(defaultConfig, initConfig);
		this.initConfig = mergeConfig;
		this.commanderRegister = new CommanderWrapper(this.store, {}, this);
		this.eventCenter = new EventCenter({}, mergeConfig.initFunctionMap);
		this.dataCenter = new DataCenter(mergeConfig.initDataCenterMap);
		this.init();
		// 右侧配置项注册 初始注册组件暂时固定
	}

	toRegist() {
		const modules = this.initConfig.initFormComponents;
		formComponentRegisterFn(this.formRegister, modules);

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

	getCollapse() {
		return this.collapsed;
	}

	getStoreJSON() {
		return JSON.stringify(this.store.getData());
	}

	parseStoreJson(json: string) {
		return JSON.parse(json);
	}

	/**
	 *
	 * 重设store并根据store重设
	 * @param {IStoreData[]} data
	 * @memberof UserConfig
	 */
	resetData(data: IStoreData[]) {
		this.store.resetToInitData(data, true);
		this.toRegist();
		this.animateFactory.syncStoreToConfig(this);
	}

	getWrapperMove() {
		return {
			data: this.wrapperMoveState,
			iframe: this.iframeWrapperMoveState,
		};
	}

	getFocusState() {
		return this.focusState;
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
	getAnimateFactory() {
		return this.animateFactory;
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
	 * 用于获取当前store数据，已判断弹窗编辑 不会储存正在编辑的内容
	 * @returns
	 * @memberof UserConfig
	 */
	getCurrentData() {
		let data: IStoreData;
		const isEdit = this.storeChanger.isEdit();
		if (isEdit) {
			data = this.storeChanger.getOrigin()!.now;
		} else {
			data = this.store.getData();
		}
		return data;
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
		this.leftForceUpdate();
		this.store.forceUpdate();
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
		this.leftForceUpdate();
		this.store.forceUpdate();
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
		this.leftForceUpdate();
		this.store.forceUpdate();
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
		this.leftForceUpdate();
		this.store.forceUpdate();
	}

	/**
	 *会重置配置，请修改配置后增加
	 * 异步修改config 重置store
	 * @memberof UserConfig
	 */
	setConfig(v: Partial<InitConfig>) {
		this.initConfig = userConfigMerge(this.initConfig, v);
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
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

	scriptRegistComponentSingle(item: ComponentItemFactory, leftProps: LeftRegistComponentMapItem) {
		this.registComponent(item);
		this.addCoRegistMap(leftProps);
	}

	// foreach可能导致问题
	// scriptRegistComponentMulti(
	// 	items: ComponentItemFactory[],
	// 	leftProps: LeftRegistComponentMapItem[]
	// ) {
	// 	items.forEach((item) => {
	// 		this.registComponent(item);
	// 	});
	// 	const obj = {} as InitConfig;
	// 	obj.leftAllRegistMap = leftProps;
	// 	this.initConfig = userConfigMerge(this.initConfig, obj);
	// 	this.init();
	// 	this.store.forceUpdate();
	// }

	/**
	 *
	 * 分类信息需要单独存储后加载
	 * @param {string} src  url地址
	 * @param {Partial<LeftRegistComponentMapItem>} leftProps 分类
	 * @param {Function} [callback] 回调
	 * @return {*}
	 * @memberof UserConfig
	 */
	scriptSingleLoad(
		src: string,
		leftProps: Partial<LeftRegistComponentMapItem>,
		callback?: Function
	) {
		let isEdit = this.storeChanger.isEdit();
		let storeData = this.store.getData();
		let globalState = storeData.globalState;
		if (isEdit) {
			storeData = this.storeChanger.getOrigin()!.now;
			globalState = storeData.globalState;
		}
		if (globalState['script'].includes(src)) {
			console.error(src + 'scripts have been loaded');
			return;
		}
		if (!this.scriptLoading) {
			this.scriptLoading = true;
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				const item = window[this.SCRIPTGLOBALNAME as any] as unknown as ComponentItemFactory;
				try {
					const left = leftProps;
					left.component = item.name;
					left.displayName = item.display;
					this.scriptRegistComponentSingle(item, left as LeftRegistComponentMapItem);
				} catch (e) {
					console.error(e);
				}
				// 前面加载会重置store 新增组件需要事件初始化
				setTimeout(() => {
					window[this.SCRIPTGLOBALNAME as any] = undefined as any;
					isEdit = this.storeChanger.isEdit();
					globalState = this.store.getData().globalState;
					if (isEdit) {
						globalState = this.storeChanger.getOrigin()!.now.globalState;
					}
					globalState['script'].push(src);
					storeData.globalState = globalState;
					this.store.resetToInitData([storeData], true);
					this.store.forceUpdate();
					this.scriptLoading = false;
					if (callback) {
						callback();
					}
				});
			};
			document.body.appendChild(script);
		}
	}
}

export default UserConfig;
