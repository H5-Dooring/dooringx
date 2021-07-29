/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 11:24:39
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\IframeWrapperMove\index.tsx
 */
import { AllHTMLAttributes, CSSProperties, PropsWithChildren, ReactNode, useRef } from 'react';
import { wrapperEvent } from './event';
import { onWheelEventIframe } from '../../core/scale';
import React from 'react';
import Ticker from './ticker';
import UserConfig from '../../config';

export interface ContainerWrapperProps extends AllHTMLAttributes<HTMLDivElement> {
	config: UserConfig;
	classNames?: string;
	style?: CSSProperties;
	extra?: ReactNode;
}

function ContainerWrapper(props: PropsWithChildren<ContainerWrapperProps>) {
	const { children, style, classNames, config, extra, ...rest } = props;
	const ref = useRef<HTMLDivElement>(null);
	const ticker = props.config.ticker;
	const wrapperMoveState = config.getWrapperMove().iframe;
	const scaleState = config.getScaleState();
	const state = props.config.getStore().getData();

	return (
		<div
			className={`ant-menu ${classNames ? classNames : ''}`}
			ref={ref}
			style={{
				backgroundColor: '#f0f0f0',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flex: 1,
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden',
				userSelect: 'none',
				...style,
			}}
			{...wrapperEvent(ref, props.config)}
			{...onWheelEventIframe(props.config, scaleState)}
			{...rest}
		>
			<div
				style={{
					position: 'absolute',
					transform: `translate(${wrapperMoveState.needX}px, ${wrapperMoveState.needY}px)`,
					width: state.container.width * scaleState.value,
					height: state.container.height * scaleState.value,
				}}
			>
				{children}
			</div>
			{extra && extra}
			{ticker && <Ticker config={props.config}></Ticker>}
		</div>
	);
}
export default ContainerWrapper;
