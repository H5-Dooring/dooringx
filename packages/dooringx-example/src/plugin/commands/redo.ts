/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:28:20
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 14:28:28
 * @FilePath: \visual-editor\src\plugin\commands\redo.ts
 */
import { CommanderItemFactory } from 'dooringx-lib';
const undo = new CommanderItemFactory(
	'redo',
	'Control+Shift+z',
	(store) => {
		store.redo();
	},
	'重做'
);

export default undo;
