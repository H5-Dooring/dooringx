/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 20:59:27
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\index.tsx
 */
import React from 'react';
import { useMemo } from 'react';
import UserConfig from '../../config';
import { IBlockType } from '../store/storetype';
import { marklineCalRender } from './calcRender';

// 主要逻辑需要注入组件内拖拽

export interface MarklineConfigType {
	indent: number;
	isAbsorb: boolean;
	mode: 'normal' | 'grid';
	gridIndent: number;
	resizeIndent: number;
	marklineUnfocus: null | IBlockType[];
}

// 间隔距离执行吸附
export const marklineConfig: MarklineConfigType = {
	indent: 2,
	isAbsorb: true,
	mode: 'normal',
	gridIndent: 50,
	resizeIndent: 0,
	marklineUnfocus: null,
};

export function MarklineX(props: any) {
	return (
		<div
			className="yh-markline"
			style={{
				borderTop: '1px dashed black',
				position: 'absolute',
				width: '100%',
				top: props.top,
				display: props.display,
				zIndex: 9999,
			}}
		></div>
	);
}
export function MarklineY(props: any) {
	return (
		<div
			className="yh-markline"
			style={{
				borderLeft: '1px dashed black',
				position: 'absolute',
				height: '100%',
				left: props.left,
				display: props.display,
				zIndex: 9999,
			}}
		></div>
	);
}

export function NormalMarkLineRender(props: { config: UserConfig }) {
	const lines = marklineCalRender(props.config);
	const render = useMemo(() => {
		return (
			<>
				{lines.x.map((v, i) => {
					return <MarklineX key={i} top={v}></MarklineX>;
				})}
				{lines.y.map((v, i) => {
					return <MarklineY key={i} left={v}></MarklineY>;
				})}
			</>
		);
	}, [lines]);
	return <>{render}</>;
}
