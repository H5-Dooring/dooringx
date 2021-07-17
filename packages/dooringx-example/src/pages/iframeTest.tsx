/*
 * @Author: yehuozhili
 * @Date: 2021-07-17 10:12:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-17 22:13:20
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\iframeTest.tsx
 */

import {
	RightConfig,
	Container,
	useStoreState,
	innerContainerDragUp,
	LeftConfig,
	IframeContainerWrapper,
	Control,
	postMessage,
	useIframePostMessage,
} from 'dooringx-lib';
import { useContext, useState } from 'react';
import { configContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';
import { useEffect } from 'react';

export const HeaderHeight = '40px';

export default function IndexPage() {
	const config = useContext(configContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);

	const [iframeReady, setIframeReady] = useState(false);
	const [fnx] = useIframePostMessage(`${location.origin}/container`, config, iframeReady);
	useEffect(() => {
		const fn = (e: MessageEvent<any>) => {
			console.log(e, '收到');
			if (e.data === 'ready') {
				setIframeReady(true);
				fnx();
			}
			if (typeof e.data === 'object') {
				if (e.data.type === 'update') {
					if (e.data.column === 'scale') {
						config.scaleState = e.data.data;
						config.getStore().forceUpdate();
						config.refreshIframe();
					}
				}
			}
		};
		window.addEventListener('message', fn);
		return () => {
			window.removeEventListener('message', fn);
		};
	}, []);

	const scaleState = config.getScaleState();
	return (
		<div {...innerContainerDragUp(config, 'iframe')}>
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
					<>
						<iframe
							id="yh-container-iframe"
							style={{
								width: state.container.width * scaleState.value,
								height: state.container.height * scaleState.value + 1,
								border: 'none',
								userSelect: 'none',
							}}
							src="/container"
						></iframe>
					</>
				</IframeContainerWrapper>
				<div className="rightrender" style={{ height: '100%' }}>
					<RightConfig state={state} config={config}></RightConfig>
				</div>
			</div>
		</div>
	);
}
