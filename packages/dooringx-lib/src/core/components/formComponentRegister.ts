/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: chentianshang
 * @LastEditTime: 2021-07-06 09:53:29
 * @FilePath: /DooringV2/packages/dooring-v2-lib/src/core/components/formComponentRegister.ts
 */

import { ComponentClass, FunctionComponent } from 'react';
import { CreateOptionsRes } from './formTypes';
export interface ContainerConfigItem {
	type: string;
	option: CreateOptionsRes<any, any>;
}
export const formComponentRegisterFn = (
	formComponent: FormComponentRegister,
	modules: Record<string, FunctionComponent<any> | ComponentClass<any, any>>
) => {
	Object.keys(modules).forEach((v) => {
		formComponent.register(v, modules[v]);
	});
};

/**
 *
 * 拿到form组件地址和状态
 * 获取配置container配置项和普通组件配置项
 * @export
 * @class FormComponentRegister
 */
export class FormComponentRegister {
	constructor(
		public formMap: Record<string, FunctionComponent<any> | ComponentClass<any, any>> = {},
		public listener: Function[] = [],
		public eventMap: Record<string, Function[]> = {},
		public containerConfig: Array<ContainerConfigItem> = []
	) {}
	getMap() {
		return this.formMap;
	}
	getComp(name: string) {
		return this.formMap[name];
	}
	getConfig() {
		return this.containerConfig;
	}
	setConfig(config: Array<ContainerConfigItem>) {
		this.containerConfig = config;
	}
	/**
	 *
	 *  同步注册方法
	 * @memberof FormComponentRegister
	 */
	register(name: string, ele: FunctionComponent<any> | ComponentClass<any, any>) {
		this.formMap[name] = ele;
	}

	emit() {
		this.listener.forEach((v) => v());
	}

	on(event: string, fn: Function) {
		if (!this.eventMap[event]) {
			this.eventMap[event] = [];
		}
		this.eventMap[event].push(fn);
		return () => this.eventMap[event].filter((v) => v !== fn);
	}
}
