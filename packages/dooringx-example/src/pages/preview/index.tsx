/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 20:05:48
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 18:01:15
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\preview\index.tsx
 */

import { PREVIEWSTATE } from '@/constant';
import { Preview, UserConfig } from 'dooringx-lib';
import plugin from '../../plugin';

const config = new UserConfig(plugin);

function PreviewPage() {
	const data = localStorage.getItem(PREVIEWSTATE);
	if (data) {
		try {
			const json = JSON.parse(data);
			config.resetData([json]);
		} catch {
			console.log('err');
		}
	}
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Preview config={config}></Preview>
		</div>
	);
}

export default PreviewPage;
