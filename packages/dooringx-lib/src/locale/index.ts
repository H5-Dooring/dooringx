/*
 * @Author: yehuozhili
 * @Date: 2021-08-27 10:20:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-27 14:30:05
 * @FilePath: \dooringx\packages\dooringx-lib\src\locale\index.ts
 */
import { en } from './en';
import { zhCN } from './zh-CN';

export const localeMap = {
	'zh-CN': zhCN,
	en,
};
export type localeKey = keyof typeof localeMap;

export { en } from './en';
export { zhCN } from './zh-CN';
