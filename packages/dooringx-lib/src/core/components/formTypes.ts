/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-06 23:45:02
 * @FilePath: \dooringv2\packages\dooring-v2-lib\src\core\components\formTypes.ts
 */

export interface CreateOptionsResAll {
	type: string;
	option: any;
}

export interface CreateOptionsRes<T, K extends keyof T> {
	type: keyof T;
	option: T[K];
}

export function createPannelOptions<T, K extends keyof T>(
	type: K,
	option: T[K]
): CreateOptionsRes<T, K> {
	return {
		type,
		option,
	};
}
