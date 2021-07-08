/*
 * @Author: yehuozhili
 * @Date: 2021-07-04 14:18:18
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-04 14:21:33
 * @FilePath: \DooringV2\packages\dooring-v2-lib\src\core\command\runtime.ts
 */
import CommanderWrapper from '.';
import { CommanderItemFactory } from './abstract';

export const registCommandFn = (module: CommanderItemFactory[], commander: CommanderWrapper) => {
	module.forEach((v) => {
		commander.register(v);
	});
};
export const unRegistCommandFn = (module: CommanderItemFactory[], commander: CommanderWrapper) => {
	module.forEach((v) => {
		commander.unRegister(v.name);
	});
};
