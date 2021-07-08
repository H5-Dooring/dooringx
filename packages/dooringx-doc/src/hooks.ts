/*
 * @Author: yehuozhili
 * @Date: 2021-06-29 11:14:15
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-01 10:13:37
 * @FilePath: \my-app\src\hooks.ts
 */
import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.userid = cookies.userid || uuid();
	// TODO https://github.com/sveltejs/kit/issues/1046
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	const response = await resolve(request);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers['set-cookie'] = `userid=${request.locals.userid}; Path=/; HttpOnly`;
	}

	return response;
};
/** @type {import('@sveltejs/kit').ServerFetch} */
export async function serverFetch(request) {
	/*
	if (request.url.startsWith('https://api.yourapp.com/')) {
	  // clone the original request, but change the URL
	  request = new Request(
		request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
		request
	  );
	}
	*/

	return fetch(request);
}
