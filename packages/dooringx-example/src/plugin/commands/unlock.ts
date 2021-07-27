/*
 * @Author: yehuozhili
 * @Date: 2021-07-27 16:20:04
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-27 16:20:20
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\commands\unlock.ts
 */
import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const unlock = new CommanderItemFactory(
	'unlock',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		clonedata.block.forEach((v) => {
			if (v.focus) {
				v.canDrag = true;
			}
		});
		store.setData(clonedata);
	},
	'解锁'
);

export default unlock;
