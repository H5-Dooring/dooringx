/*
 * @Author: yehuozhili
 * @Date: 2021-07-04 10:28:57
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-09 00:07:26
 * @FilePath: \dooringx\script\publish.js
 */
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const root = process.cwd();
const rootPath = path.resolve(root, 'packages', 'dooringx-lib');
const command = `npm`;
const args = [`publish`];
const child = spawn(command, args, {
	stdio: 'inherit',
	env: process.env,
	shell: true,
	cwd: rootPath,
});
child.on('close', (i) => {
	if (i !== 0) {
		process.exit(1);
	}
});
