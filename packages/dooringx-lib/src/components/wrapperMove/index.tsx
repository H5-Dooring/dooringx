/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-03-14 04:58:51
 * @FilePath: \dooring-v2\src\core\wrapperMove\index.tsx
 */
import { AllHTMLAttributes, CSSProperties, PropsWithChildren, useRef } from 'react';
import { wrapperEvent } from './event';
import { onWheelEvent } from '../../core/scale';
import React from 'react';

export interface ContainerWrapperProps extends AllHTMLAttributes<HTMLDivElement> {
	classNames?: string;
	style?: CSSProperties;
}

function ContainerWrapper(props: PropsWithChildren<ContainerWrapperProps>) {
	const { children, style, classNames, ...rest } = props;
	const ref = useRef<HTMLDivElement>(null);
	return (
		<div
			className={`ant-menu ${classNames}`}
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
			{...wrapperEvent(ref)}
			{...onWheelEvent}
			{...rest}
		>
			{children}
		</div>
	);
}
export default ContainerWrapper;
