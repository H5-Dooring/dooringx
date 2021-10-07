/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-10-07 12:45:49
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\components\createBlock.ts
 */
import { UserConfig } from '../..';
import { innerRemoveFocus } from '../focusHandler';
import { IBlockType } from '../store/storetype';
import { createUid } from '../utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentItem } from './componentItem';

export function createBlock(
	top: number,
	left: number,
	ComponentItem: ComponentItem,
	config: UserConfig
): IBlockType {
	innerRemoveFocus(config);
	return {
		id: createUid(ComponentItem.name),
		name: ComponentItem.name,
		top,
		left,
		zIndex: ComponentItem.initData.zIndex || 0,
		props: ComponentItem.initData.props || {},
		resize: ComponentItem.initData.resize || ComponentItem.resize,
		focus: ComponentItem.initData.focus ?? true,
		position: ComponentItem.initData.position || 'absolute',
		display: ComponentItem.initData.display || 'block',
		width: ComponentItem.initData.width,
		height: ComponentItem.initData.height,
		syncList: ComponentItem.initData.syncList || [],
		canDrag: ComponentItem.initData.canDrag ?? true,
		eventMap: ComponentItem.initData.eventMap || {},
		functionList: ComponentItem.initData.functionList || [],
		animate: ComponentItem.initData.animate || [],
		fixed: ComponentItem.initData.fixed || false,
		rotate: ComponentItem.initData.rotate || {
			value: 0,
			canRotate: true,
		},
	};
}
