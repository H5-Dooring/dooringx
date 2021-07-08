/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 04:39:30
 * @FilePath: \dooring-v2\src\core\command\abstract.ts
 */
import { CommanderItem } from './commanderType';

export class CommanderItemFactory implements CommanderItem {
	constructor(
		public name: CommanderItem['name'],
		public keyboard: CommanderItem['keyboard'],
		public excute: CommanderItem['excute'],
		public display: CommanderItem['display'],
		public init: CommanderItem['init'] = () => {},
		public destroy: CommanderItem['destroy'] = () => {}
	) {}
}
