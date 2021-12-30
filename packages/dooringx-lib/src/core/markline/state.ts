/*
 * @Author: yehuozhili
 * @Date: 2021-12-30 23:02:30
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-12-31 00:13:09
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\state.ts
 */
export interface RealStyleType {
	[x: string]: number;
	left: number;
	width: number;
	height: number;
	right: number;
	top: number;
	bottom: number;
}

interface MarklineStateType {
	cache: null | Record<string, RealStyleType>;
	sortLeft: null | Array<RealStyleType>;
	sortTop: null | Array<RealStyleType>;
	sortRight: null | Array<RealStyleType>;
	sortBottom: null | Array<RealStyleType>;
}
export const marklineState: MarklineStateType = {
	cache: null,
	sortLeft: null,
	sortTop: null,
	sortRight: null,
	sortBottom: null,
};
