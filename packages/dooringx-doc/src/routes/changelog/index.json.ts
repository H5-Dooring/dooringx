/*
 * @Author: yehuozhili
 * @Date: 2021-07-13 11:11:17
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-13 11:11:42
 * @FilePath: \dooringx\packages\dooringx-doc\src\routes\changelog\index.json.ts
 */

// 必须建立json否则不生成json文件
import type { RequestHandler } from '@sveltejs/kit';
import { api } from '../docs/_api';

export const get: RequestHandler = async (request) => {
	const param = request.query;
	const name = param.get('name');
	const response = await api(name);
	return response;
};
