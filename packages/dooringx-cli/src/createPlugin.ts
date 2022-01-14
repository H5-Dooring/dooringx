/*
 * @Author: yehuozhili
 * @Date: 2022-01-13 16:16:53
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-14 09:16:58
 * @FilePath: \dooringx-cli\src\createPlugin.ts
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import modifyTemplate from './modifyTemplate';
import { deleteFolder, doAction } from './utils';

export async function createPlugin(name: string, option: string) {
	createApp(name, option);
}
async function createApp(projectName: string, option: string) {
	let root = path.resolve(projectName);

	const isExist = fs.existsSync(root);

	if (isExist) {
		const choices = ['y', 'n'];
		let sign = 'y';
		const result = await inquirer.prompt({
			name: 'sign',
			type: 'list',
			message: `${projectName}  already exists , continue ?`,
			choices,
		});
		sign = result.sign;
		if (sign === 'n') {
			return;
		}
	}

	fs.ensureDirSync(projectName); // 没有则创建文件夹
	console.log(`create a new app in ${chalk.green(root)}`);
	const packageJson = {
		name: projectName,
		version: '0.0.1',
		private: true,
	};
	// 写入package.json
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
	process.chdir(root);
	// 复制项目模板，安装项目依赖等
	await run(root, projectName, option);
}

async function run(root: string, projectName: string, _option: string) {
	const template = 'dooringx-plugin-template';
	const templateName = template;
	const allDependencies = [templateName];
	console.log('Installing packages. This might take a couple of minutes');
	console.log(`Installing ${chalk.cyan(templateName)} ...`);
	try {
		await doAction(root, allDependencies);
	} catch (e) {
		console.log(`Installing ${chalk.red(templateName)} failed ...`, e);
	}
	console.log(`Installing ${chalk.cyan(templateName)} succeed!`);

	const templatePath = path.dirname(
		require.resolve(`${templateName}/package.json`, { paths: [root] })
	);
	// 复制文件到项目目录

	const tempDir = path.join(root, 'temp');
	const templateDir = path.join(templatePath, `template`);

	if (fs.existsSync(templatePath)) {
		await modifyTemplate(templateDir, 'temp', {
			projectName: projectName,
			basicProject: template,
		});

		fs.copySync(tempDir, root);
		deleteFolder(tempDir);
	} else {
		console.error(`Could not locate supplied template: ${chalk.green(templatePath)}`);
		return;
	}
	let tempPkg = fs.readFileSync(root + '/template.json').toString();
	let pkg = fs.readFileSync(root + '/package.json').toString();

	const tempPkgJson = JSON.parse(tempPkg);
	let pkgJson = JSON.parse(pkg);
	pkgJson = { ...pkgJson };
	pkgJson.main = tempPkgJson?.main;
	pkgJson.scripts = tempPkgJson?.scripts;
	pkgJson.dependencies = {
		...tempPkgJson?.dependencies,
	};
	pkgJson.devDependencies = {
		...tempPkgJson?.devDependencies,
	};
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkgJson, null, 2));
	fs.unlinkSync(path.join(root, 'template.json'));
	fs.unlinkSync(path.join(root, 'package-lock.json'));
	console.log(`🎉  Successfully created project ${projectName}.`);
	console.log('👉  Get started with the following commands:');
	console.log(`${chalk.cyan(`cd ${projectName}`)}`);
	console.log(`${chalk.cyan('npm install')}`);
	process.exit(0);
}
