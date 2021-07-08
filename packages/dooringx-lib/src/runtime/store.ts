/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 11:32:30
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 11:32:48
 * @FilePath: \dooring-v2\src\runtime\store.ts
 */
// 单独提出来为了避免循环引用
import Store from '../core/store';

export const store = new Store();
