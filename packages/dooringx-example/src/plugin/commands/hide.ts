import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const hide = new CommanderItemFactory(
	'hide',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		clonedata.block.forEach((v) => {
			if (v.focus) {
				v.canSee = false;
			}
		});
		store.setData(clonedata);
	},
	'隐藏'
);

export default hide;
