/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 04:39:43
 * @FilePath: \dooring-v2\src\core\command\commanderType.ts
 */
import Store from '../store';

export interface CommanderItem {
	init: () => void;
	display: string;
	name: string;
	keyboard: string;
	excute: (store: Store, options?: any) => void;
	destroy: () => void;
}
