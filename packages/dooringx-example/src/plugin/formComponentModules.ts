/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:29:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-09 13:51:32
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\registFormComponents.ts
 *
 */

import { ComponentClass } from 'react';
import { FunctionComponent } from 'react';

const modulesFiles = (require as any).context('./formComponents', true, /\.(js|tsx)$/);
export const Formmodules: Record<string, FunctionComponent<any> | ComponentClass<any, any>> =
	modulesFiles.keys().reduce((modules: any, modulePath: any) => {
		const tmp = modulePath.split('.');
		const name = tmp[tmp.length - 2].slice(1);
		const value = modulesFiles(modulePath);
		modules[name] = value.default;
		return modules;
	}, []);
