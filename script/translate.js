require('dotenv').config();
const https = require('https');
const md5 = require('md5');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const apiUrl = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
const appid = process.env.APPID;
const secret = process.env.SECRET;

const requestTranslate = (q) => {
	const salt = Math.random();
	const sign = md5(appid + q + salt + secret);
	const params = {
		q,
		from: 'zh',
		to: 'en',
		salt,
		appid,
		sign,
	};
	return axios.get(apiUrl, {
		params,
	});
};
// requestTranslate(qs).then((v) => {
// 	console.log(v.data.trans_result);
// });
const concatResult = (result) => {
	let line = 0;
	let navstart = 0;
	if (result[0].src === '---') {
		//查找末尾的---
		const len = result.length;
		for (let i = 1; i < len; i++) {
			//查找nav起始
			let cur = result[i].src;
			if (cur === 'nav:') {
				navstart = i;
			}
			if (cur === '---') {
				line = i;
				break;
			}
		}
	}
	result.forEach((v, i) => {
		if (i === 0) {
			finalResult = i < line ? v.src : v.dst;
		} else {
			//替换Title:
			if (v.src.startsWith('title:') && v.dst.startsWith('Title:')) {
				v.dst = v.dst.replace('Title:', 'title:');
				v.dst = v.dst.replace('change log', 'Change log');
			}
			const fi = v.src.startsWith('##') ? v.src : v.dst;
			if (i > navstart && i < line) {
				finalResult = finalResult + `\r\n  ` + fi;
			} else {
				finalResult = finalResult + '\r\n' + fi;
			}
		}
	});
	return finalResult;
};

// 翻译changelog
const changelogPath = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'ChangeLog',
	'index.md'
);
const changelogEnPath = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'ChangeLog',
	'index.en.md'
);

const changelogTranslate = async () => {
	const changelog = fs.readFileSync(changelogPath).toString();
	const data = await requestTranslate(changelog);
	const result = concatResult(data.data.trans_result);
	fs.removeSync(changelogEnPath);
	fs.writeFileSync(changelogEnPath, result);
};
changelogTranslate();

//----------------文本翻译-----------

const textConcatResult = (result) => {
	let line = 0;
	let navstart = 0;
	const passline = [];
	let code = false;
	const reg = /(#)\1+/g;
	if (result[0].src === '---') {
		const len = result.length;
		for (let i = 1; i < len; i++) {
			//查找nav起始
			let cur = result[i].src;
			if (cur === 'nav:' && line === 0) {
				navstart = i;
			}
			if (cur === '---' && line === 0) {
				line = i;
			}
			//查找代码块
			if (cur.startsWith('```')) {
				if (code === true) {
					code = false;
				} else {
					code = true;
				}
			}
			if (code === true) {
				passline.push(i);
			}
		}
	}
	result.forEach((v, i) => {
		if (i === 0) {
			finalResult = i < line ? v.src : v.dst;
		} else {
			//替换Title:
			if (v.src.startsWith('title:') && v.dst.startsWith('Title:')) {
				v.dst = v.dst.replace('Title:', 'title:');
			}
			//替换#
			if (reg.exec(v.dst)) {
				v.dst = v.dst.replace(reg, '$& ');
			}
			if (i > navstart && i < line) {
				finalResult = finalResult + `\r\n  ` + v.dst;
			} else {
				if (passline.includes(i)) {
					finalResult = finalResult + '\r\n' + v.src;
				} else {
					//替换##
					finalResult = finalResult + '\r\n' + v.dst;
				}
			}
		}
	});
	return finalResult;
};
const faqPath = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'FAQ',
	'index.md'
);

const faqEnPath = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'FAQ',
	'index.en.md'
);
const faqtranslate = async () => {
	await toTranslateText(faqPath, faqEnPath);
};
const guidePath1 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'index.md'
);

const guidePathEnPath1 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'index.en.md'
);
const guidePath2 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'basic.md'
);

const guidePathEnPath2 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'basic.en.md'
);
const guidePath3 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'develop.md'
);

const guidePathEnPath3 = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'Guide',
	'develop.en.md'
);
const guidetranslate = async () => {
	await toTranslateText(guidePath1, guidePathEnPath1);
	await toTranslateText(guidePath2, guidePathEnPath2);
	await toTranslateText(guidePath3, guidePathEnPath3);
};

const toTranslateText = async (originPath, targetPath) => {
	const txt = fs.readFileSync(originPath).toString();
	if (originPath === guidePath3) {
		const k = txt.split('### 命令开发');
		const data1 = await requestTranslate(k[0]);
		const result1 = textConcatResult(data1.data.trans_result);
		const data2 = await requestTranslate(k[1]);
		const result2 = textConcatResult(data2.data.trans_result);
		fs.removeSync(targetPath);
		const final = result1 + '\r\n' + result2;
		fs.writeFileSync(targetPath, final);
	} else {
		try {
			const data = await requestTranslate(txt);
			if (!data.data || !data.data.trans_result) {
				console.log('baidu调用失败：');
				console.log(data.data);
				return;
			}
			const result = textConcatResult(data.data.trans_result);
			fs.removeSync(targetPath);
			fs.writeFileSync(targetPath, result);
		} catch (e) {
			console.log('调用失败，可能文章太长');
		}
	}
};

module.exports = {
	faqtranslate,
	guidetranslate,
};
