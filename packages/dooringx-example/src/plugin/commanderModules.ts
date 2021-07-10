/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:27:01
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 14:27:38
 * @FilePath: \visual-editor\src\plugin\commanderModules.ts
 */

import { CommanderItem } from 'dooringx-lib/dist/core/command/commanderType';

const modulesFiles = (require as any).context('./commands', true, /\.(js|ts)$/);
const commandModules: CommanderItem[] = modulesFiles
	.keys()
	.reduce((modules: any, modulePath: any) => {
		const value = modulesFiles(modulePath);
		modules.push(value.default);
		return modules;
	}, []);

export default commandModules;
