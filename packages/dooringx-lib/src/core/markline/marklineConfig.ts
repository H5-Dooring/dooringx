/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 11:49:13
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 11:49:31
 * @FilePath: \dooring-v2\src\core\markline\marklineConfig.ts
 */
import { IBlockType } from '../store/storetype';

export interface MarklineConfigType {
	indent: number;
	isAbsorb: boolean;
	mode: 'normal' | 'grid';
	gridIndent: number;
	resizeIndent: number;
	marklineUnfocus: null | IBlockType[];
}

// 间隔距离执行吸附
export const marklineConfig: MarklineConfigType = {
	indent: 2,
	isAbsorb: true,
	mode: 'normal',
	gridIndent: 50,
	resizeIndent: 0,
	marklineUnfocus: null,
};
