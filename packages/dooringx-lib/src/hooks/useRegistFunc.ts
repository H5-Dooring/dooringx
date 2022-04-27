/*
 * @Author: yehuozhili
 * @Date: 2022-04-27 22:15:24
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-27 22:38:59
 * @FilePath: \dooringx\packages\dooringx-lib\src\hooks\useRegistFunc.ts
 */

import { useEffect } from 'react';
/**
 *
 *
 * @export 用于简化注册函数代码
 * @param {boolean} dep 配置的开关
 * @param {('preview' | 'edit')} context 传递的环境变量
 * @param {Function} registFn 注册的函数
 */
export function useRegistFunc(dep: boolean, context: 'preview' | 'edit', registFn: Function) {
	useEffect(() => {
		let unRegist: Function = () => {};
		if (dep) {
			unRegist = registFn;
		}
		return () => {
			if (context === 'preview') {
				unRegist(); // 必须在预览时注销，否则影响二次点击效果，不在预览注销影响编辑时跨弹窗
			}
		};
	}, [context, dep, registFn]);
}
