/*
 * @Author: yehuozhili
 * @Date: 2021-07-17 10:12:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-03 14:06:12
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\iframeTest.tsx
 */

import {
	RightConfig,
	useStoreState,
	innerContainerDragUp,
	LeftConfig,
	IframeContainerWrapper,
	Control,
	useIframeHook,
	IframeTarget,
} from 'dooringx-lib';
import { useContext } from 'react';
import { configContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';

export const HeaderHeight = '40px';

export default function IndexPage() {
	const config = useContext(configContext);

	const subscribeFn = useCallback(() => {
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn);
	useIframeHook(`${location.origin}/container`, config);

	return (
		<div {...innerContainerDragUp(config)}>
			<div style={{ height: HeaderHeight }}>
				head
				<button
					onClick={() => {
						window.open('/iframe');
					}}
				>
					go preview
				</button>
				<button
					onClick={() => {
						window.open('/preview');
					}}
				>
					go preview
				</button>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: `calc(100vh - ${HeaderHeight})`,
					width: '100vw',
				}}
			>
				<div style={{ height: '100%' }}>
					<LeftConfig config={config}></LeftConfig>
				</div>

				<IframeContainerWrapper
					config={config}
					extra={
						<Control
							config={config}
							style={{ position: 'fixed', bottom: '60px', right: '450px', zIndex: 100 }}
						></Control>
					}
				>
					<IframeTarget
						config={config}
						iframeProps={{
							src: '/container',
						}}
					></IframeTarget>
				</IframeContainerWrapper>
				<div className="rightrender" style={{ height: '100%' }}>
					<RightConfig state={state} config={config}></RightConfig>
				</div>
			</div>
		</div>
	);
}
