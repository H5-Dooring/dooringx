/*
 * @Author: yehuozhili
 * @Date: 2021-06-30 16:57:15
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-06 14:53:18
 * @FilePath: \my-app\src\routes\docs\index.json.ts
 */
import type { RequestHandler } from '@sveltejs/kit';
import { api } from './_api';

export const get: RequestHandler = async (request) => {
	const param = request.query;
	const name = param.get('name');
	const response = await api(name);
	return response;
};
