/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 11:49:13
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-21 10:44:50
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\marklineConfig.ts
 */
import { IBlockType } from '../store/storetype';

export interface MarklineConfigType {
	indent: number;
	isAbsorb: boolean;
	mode: 'normal' | 'grid';
	gridIndent: number;
	resizeIndent: number;
	marklineUnfocus: null | IBlockType[];
	borderColor: string;
	borderStyle: 'dotted' | 'solid' | 'dashed';
}

// 间隔距离执行吸附
export const marklineConfig: MarklineConfigType = {
	indent: 5,
	isAbsorb: true,
	mode: 'normal',
	gridIndent: 50,
	resizeIndent: 0,
	marklineUnfocus: null,
	borderColor: 'rgba( 33 , 150 , 243, 1 )',
	borderStyle: 'dotted',
};
