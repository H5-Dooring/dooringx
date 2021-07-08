/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:22:18
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-08 20:43:21
 * @FilePath: \DooringV2\packages\dooringx-lib\test\blah.test.tsx
 */

function sleep(delay: number) {
	return new Promise((res) => {
		setTimeout(() => {
			res('');
		}, delay);
	});
}

describe('Thing', () => {
	it('renders without crashing', async () => {
		expect(true).toBe(true);
	});
});
