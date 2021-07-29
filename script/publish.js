/*
 * @Author: yehuozhili
 * @Date: 2021-07-04 10:28:57
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-29 10:59:24
 * @FilePath: \dooringx\script\publish.js
 */
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const root = process.cwd();
const rootPath = path.resolve(root, 'packages', 'dooringx-lib');
const readme = path.resolve(root, 'README.md');
const libreadme = path.resolve(root, 'packages', 'dooringx-lib', 'README.md');
fs.removeSync(libreadme);
fs.copyFileSync(readme, libreadme);

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
