/*
 * @Author: yehuozhili
 * @Date: 2021-07-06 20:19:21
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-06 20:20:07
 * @FilePath: \my-app\src\routes\api\index.json.ts
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
