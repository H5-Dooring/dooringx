/*
 * @Author: yehuozhili
 * @Date: 2021-07-20 10:36:55
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 16:13:07
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\iframeTarget.tsx
 */
import React from 'react';
import UserConfig from '../config';
import { containerDragResolve } from '../core/crossDrag';
import { containerFocusRemove } from '../core/focusHandler';
import { innerContainerDrag } from '../core/innerDrag';
import { containerResizer } from '../core/resizeHandler/containerResizer';
import Blocks from './blocks';

interface IframeTargetProps {
	config: UserConfig;
	iframeProps?: React.DetailedHTMLProps<
		React.IframeHTMLAttributes<HTMLIFrameElement>,
		HTMLIFrameElement
	>;
}

export function IframeTarget(props: IframeTargetProps) {
	const scaleState = props.config.getScaleState();
	const state = props.config.getStore().getData();
	return (
		<div
			style={{
				width: state.container.width * scaleState.value,
				height: state.container.height * scaleState.value + 1,
				position: 'relative',
			}}
		>
			<div
				{...containerDragResolve(props.config)}
				{...innerContainerDrag(props.config)}
				{...containerFocusRemove(props.config, true)}
				style={{
					width: state.container.width * scaleState.value,
					height: state.container.height * scaleState.value,
					position: 'absolute',
				}}
			>
				<div
					id="yh-container-iframe-mask"
					style={{
						display: 'flex',
						transform: `scale(${scaleState.value})`,
						transformOrigin: 'left top',
						position: 'absolute',
						width: state.container.width,
						height: state.container.height,
					}}
				>
					{state.block.map((v) => {
						return (
							<Blocks
								config={props.config}
								key={v.id}
								data={v}
								context={'edit'}
								iframe={true}
							></Blocks>
						);
					})}
				</div>
			</div>
			<iframe
				title="editor"
				id="yh-container-iframe"
				scrolling="no"
				style={{
					width: state.container.width * scaleState.value,
					height: state.container.height * scaleState.value,
					border: 'none',
					userSelect: 'none',
				}}
				{...props.iframeProps}
			></iframe>
			<div
				style={{
					height: '50px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(${scaleState.value})`,
					width: '100%',
					transformOrigin: 'top',
				}}
			>
				<div
					style={{
						fontSize: '20px',
						cursor: 's-resize',
					}}
					onMouseDown={(e) => containerResizer.onMousedown(e, props.config)}
				>
					{props.config.getConfig().containerIcon}
				</div>
			</div>
		</div>
	);
}
