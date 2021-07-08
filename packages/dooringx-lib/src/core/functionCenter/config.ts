/*
 * @Author: yehuozhili
 * @Date: 2021-06-25 10:03:21
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-06-28 19:29:21
 * @FilePath: \DooringV2\packages\dooring-v2-lib\src\core\functionCenter\config.ts
 */
// 设定函数配置项格式，

export type FunctionDataType = keyof FunctionDataMap;
export type FunctionNameType = string;
export type FuncitonOptionConfigType = {
	receive: string;
	multi: boolean;
};
export interface FunctionDataMap {
	dataSource: FuncitonOptionConfigType;
	modal: FuncitonOptionConfigType;
	input: FuncitonOptionConfigType;
	ctx: FuncitonOptionConfigType;
}
// data 如果是''则在datasource,input,ctx选择
export type FunctionConfigType = {
	name: FunctionNameType; // 会放到左侧展示 唯一！
	data: FunctionDataType[];
	options: FuncitonOptionConfigType;
}[];
