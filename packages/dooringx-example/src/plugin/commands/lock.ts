/*
 * @Author: yehuozhili
 * @Date: 2021-07-27 16:19:58
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-27 16:19:59
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\commands\lock.ts
 */
import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const lock = new CommanderItemFactory(
	'lock',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		clonedata.block.forEach((v) => {
			if (v.focus) {
				v.canDrag = false;
			}
		});
		store.setData(clonedata);
	},
	'锁定'
);

export default lock;
