/*
 * @Author: yehuozhili
 * @Date: 2021-06-10 20:45:06
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-13 17:07:39
 * @FilePath: \dooringx-cli\src\index.ts
 */
import { Command } from 'commander';
import { createPlugin } from './createPlugin';
const packageJson = require('../package.json');
let program = new Command();

program
	.command('create <project-name>')
	.description('create project')
	.alias('c')
	.action(() => {
		console.log('in progress');
	});
program
	.command('plugin <project-name>')
	.description('create plugin project')
	.alias('p')
	.action((name, options) => {
		createPlugin(name, options);
	});

program.version(packageJson.version).parse(process.argv);
