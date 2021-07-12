/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 20:56:19
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\gridMode.ts
 */
import UserConfig from '../../config';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import { LinesTypes } from './calcRender';
import { marklineConfig } from './marklineConfig';
export function gridModeDisplay(left: number, top: number, focus: IBlockType, config: UserConfig) {
	// 有吸附走吸附，只吸top和left，宽高不需要
	// 无吸附拖拽时显示所有网格。
	const store = config.getStore();
	const container = store.getData().container;
	const containerWidth = container.width;
	const containerHeight = container.height;
	const indent = marklineConfig.gridIndent;
	const diff = marklineConfig.indent;
	// 网格按照宽高除以下，每间隔一定距离给个线
	// 横线
	for (let i = 0; i < containerHeight; i++) {
		const tmp = i * indent;
		if (Math.abs(top - tmp) < diff) {
			focus.top = tmp;
			break;
		} else if (tmp + diff > top) {
			break;
		}
	}
	// 竖线
	for (let i = 0; i < containerWidth; i++) {
		const tmp = i * indent;
		if (Math.abs(left - tmp) < diff) {
			focus.left = tmp;
			break;
		} else if (tmp + diff > left) {
			break;
		}
	}
}

export interface lastGridStatusProps {
	lastWidth: number;
	lastHeight: number;
	lastIndent: number;
	lastLine: LinesTypes;
}

export const lastGridStatus: lastGridStatusProps = {
	lastWidth: 0,
	lastHeight: 0,
	lastIndent: 0,
	lastLine: { x: [], y: [] },
};

export function grideModeRender(lines: LinesTypes, config: UserConfig) {
	const store = config.getStore();
	const container = store.getData().container;
	const containerWidth = container.width;
	const containerHeight = container.height;
	const indent = marklineConfig.gridIndent;
	if (
		lastGridStatus.lastWidth === containerWidth &&
		lastGridStatus.lastHeight === containerHeight &&
		lastGridStatus.lastIndent === indent
	) {
		lines.x = lastGridStatus.lastLine.x;
		lines.y = lastGridStatus.lastLine.y;
	} else {
		for (let i = 0; i < containerWidth; i++) {
			lines.x.push(i * indent);
		}
		for (let i = 0; i < containerHeight; i++) {
			lines.y.push(i * indent);
		}
		lastGridStatus.lastLine = deepCopy(lines);
		lastGridStatus.lastWidth = containerWidth;
		lastGridStatus.lastHeight = containerHeight;
		lastGridStatus.lastIndent = indent;
	}
}
