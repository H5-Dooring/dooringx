/*
 * @Author: yehuozhili
 * @Date: 2021-06-10 20:45:06
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-14 09:15:23
 * @FilePath: \dooringx-cli\src\utils.ts
 */
import spawn from 'cross-spawn';
import * as fs from 'fs-extra';

/**
 * 使用npm安装或卸载项目依赖
 * @param {*} root 项目路径
 * @param {*} allDependencies 项目依赖
 * @param {*} action npm install 或 npm uninstall
 */
export async function doAction(
	root: string,
	allDependencies: string | string[],
	action = 'install'
) {
	typeof allDependencies === 'string' ? (allDependencies = [allDependencies]) : null;
	return new Promise((resolve) => {
		const command = 'npm';
		const args = [
			action,
			'--save',
			'--save-exact',
			'--loglevel',
			'error',
			...allDependencies,
			'--cwd',
			root,
		];
		const child = spawn(command, args, { stdio: 'inherit' });
		child.on('close', resolve);
	});
}

export async function buildAction(
	root: string,
	script: string,
	cwd: string,
	isLerna: boolean,
	name: string
) {
	return new Promise((resolve) => {
		if (isLerna) {
			const command = `lerna exec npm run `;
			const args = [script, `--scope=${name}`, '--loglevel', 'error'];
			const child = spawn(command, args, { stdio: 'inherit', cwd: cwd });
			child.on('close', resolve);
		} else {
			const command = 'npm run ';
			const args = [script, '--loglevel', 'error'];
			const child = spawn(command, args, { stdio: 'inherit', cwd: root });
			child.on('close', resolve);
		}
	});
}

export async function copyFolder(workPath: string, targetPath: string) {
	return fs.copy(workPath, targetPath);
}

/**
 * 删除文件、文件夹
 * @param {*} path 要删除资源的路径
 */
export function deleteFolder(path: string) {
	let files = [];
	if (fs.existsSync(path)) {
		if (!fs.statSync(path).isDirectory()) {
			fs.unlinkSync(path);
		} else {
			files = fs.readdirSync(path);
			files.forEach(function (file) {
				let curPath = path + '/' + file;
				deleteFolder(curPath);
			});
			fs.rmdirSync(path);
		}
	}
}
