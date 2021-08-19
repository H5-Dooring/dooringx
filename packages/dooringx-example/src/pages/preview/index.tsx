/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 20:05:48
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-19 17:09:24
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\preview\index.tsx
 */

import { PREVIEWSTATE } from '@/constant';
import { Preview, UserConfig } from 'dooringx-lib';
import { useState } from 'react';
import plugin from '../../plugin';

const config = new UserConfig(plugin);

function PreviewPage() {
	const data = localStorage.getItem(PREVIEWSTATE);
	//const [loading, setLoading] = useState(true);
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
			<Preview
				//loadingState={loading}
				// completeFn={() => {
				// 	setTimeout(() => {
				// 		setLoading(false);
				// 	}, 10000);
				// }}
				config={config}
			></Preview>
		</div>
	);
}

export default PreviewPage;
