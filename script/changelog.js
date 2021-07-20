/*
 * @Author: yehuozhili
 * @Date: 2021-07-20 17:38:03
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 19:23:46
 * @FilePath: \dooringx\script\changelog.js
 */

const fs = require('fs-extra');
const path = require('path');
const changelog = path.resolve(process.cwd(), 'CHANGELOG.md');
const doclog = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-doc',
	'src',
	'changelog',
	'1.1.md'
);
const isExist = fs.existsSync(doclog);
if (isExist) {
	fs.removeSync(doclog);
}

const prepend = `
---
title: CHANGELOG
order: 1
---

`;

const data = prepend + fs.readFileSync(changelog).toString();
fs.writeFileSync(doclog, data);
