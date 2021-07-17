/*
 * @Author: yehuozhili
 * @Date: 2021-07-16 20:55:50
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-17 14:02:12
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\container\index.tsx
 */

import { configContext } from '@/layouts';
import { useContext } from 'react';
import { IframeContainer } from '../../../../dooringx-lib/dist';

function ContainerPage() {
	const config = useContext(configContext);
	return (
		<div>
			<IframeContainer config={config} context="edit"></IframeContainer>
		</div>
	);
}

export default ContainerPage;
