/*
 * @Author: yehuozhili
 * @Date: 2021-07-04 10:28:57
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-10-07 14:40:30
 * @FilePath: \dooringx\script\publish.js
 */
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;
const root = process.cwd();
execSync('npm run changelog');
execSync('npm run translate');
const rootPath = path.resolve(root, 'packages', 'dooringx-lib');
const templatePath = path.resolve(root, 'packages', 'dooringx-plugin-template');
const templateJsonPath = path.resolve(templatePath, 'template', 'template.json');
const templatePkgPath = path.resolve(templatePath, 'package.json');
const readme = path.resolve(root, 'README.md');
const libreadme = path.resolve(root, 'packages', 'dooringx-lib', 'README.md');
const libPkgPath = path.resolve(root, 'packages', 'dooringx-lib', 'package.json');
fs.removeSync(libreadme);
fs.copyFileSync(readme, libreadme);
const res = execSync('npm view dooringx-lib version');
const version = res.toString().replace('\n', '');
const libpkgVersion = JSON.parse(fs.readFileSync(libPkgPath).toString()).version;
console.log('npm version is' + version);
if (version === libpkgVersion) {
	console.log('you might forget to change version');
	return;
}
//同步template
const templatejson = JSON.parse(fs.readFileSync(templateJsonPath).toString());
templatejson.devDependencies['dooringx-lib'] = '^' + libpkgVersion;
fs.removeSync(templateJsonPath);
fs.writeFileSync(templateJsonPath, JSON.stringify(templatejson, null, 2));
const templatePkgJson = JSON.parse(fs.readFileSync(templatePkgPath).toString());
templatePkgJson.version = libpkgVersion;
fs.removeSync(templatePkgPath);
fs.writeFileSync(templatePkgPath, JSON.stringify(templatePkgJson, null, 2));

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
const tpl = spawn(command, args, {
	stdio: 'inherit',
	env: process.env,
	shell: true,
	cwd: templatePath,
});
tpl.on('close', (i) => {
	if (i !== 0) {
		process.exit(1);
	}
});
