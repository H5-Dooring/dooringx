/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-13 10:49:33
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\wrapperMove\index.tsx
 */
import { AllHTMLAttributes, CSSProperties, PropsWithChildren, useRef } from 'react';
import { wrapperEvent } from './event';
import { onWheelEvent } from '../../core/scale';
import React from 'react';
import Ticker from './ticker';
import UserConfig from '../../config';

export interface ContainerWrapperProps extends AllHTMLAttributes<HTMLDivElement> {
	config: UserConfig;
	classNames?: string;
	style?: CSSProperties;
}

function ContainerWrapper(props: PropsWithChildren<ContainerWrapperProps>) {
	const { children, style, classNames, ...rest } = props;
	const ref = useRef<HTMLDivElement>(null);
	const ticker = props.config.ticker;
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
				position: 'relative',
				overflow: 'hidden',
				...style,
			}}
			{...wrapperEvent(ref, props.config)}
			{...onWheelEvent(props.config)}
			{...rest}
		>
			{children}
			{ticker && <Ticker config={props.config}></Ticker>}
		</div>
	);
}
export default ContainerWrapper;
