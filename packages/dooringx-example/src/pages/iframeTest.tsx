/*
 * @Author: yehuozhili
 * @Date: 2021-07-17 10:12:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-19 21:36:27
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
	useIframeHook,
} from 'dooringx-lib';
import { useContext, useState } from 'react';
import { configContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';
import { useEffect } from 'react';
import { useRef } from 'react';

export const HeaderHeight = '40px';

export default function IndexPage() {
	const config = useContext(configContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);
	useIframeHook(`${location.origin}/container`, config);
	const scaleState = config.getScaleState();

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener('mousedown', (e) => {
				console.log('mousedown');
			});
			ref.current.addEventListener('mouseup', (e) => {
				console.log('mouseup,ss');
			});
		}
	}, []);
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
					<div
						style={{
							width: state.container.width * scaleState.value,
							height: state.container.height * scaleState.value + 1,
							position: 'relative',
						}}
					>
						<div ref={ref} style={{ width: '100%', height: '100%', position: 'absolute' }}></div>
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
					</div>
				</IframeContainerWrapper>
				<div className="rightrender" style={{ height: '100%' }}>
					<RightConfig state={state} config={config}></RightConfig>
				</div>
			</div>
		</div>
	);
}
