/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:28:00
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 14:28:08
 * @FilePath: \visual-editor\src\plugin\commands\undo.ts
 */
import { CommanderItemFactory } from 'dooringx-lib';

const undo = new CommanderItemFactory(
	'undo',
	'Control+z',
	(store) => {
		store.undo();
	},
	'撤销'
);

export default undo;
