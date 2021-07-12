/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 14:52:12
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\command\commanderType.ts
 */
import UserConfig from '../../config';
import Store from '../store';

export interface CommanderItem {
	init: () => void;
	display: string;
	name: string;
	keyboard: string;
	excute: (store: Store, config: UserConfig, options?: Record<string, any>) => void;
	destroy: () => void;
}
