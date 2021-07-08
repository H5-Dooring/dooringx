/*
 * @Author: yehuozhili
 * @Date: 2021-04-05 19:21:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-05 23:56:07
 * @FilePath: \DooringV2\packages\dooring-v2-lib\src\core\components\defaultFormComponents\modalContainer.tsx
 */
import React from 'react';
import { ComponentItemFactory } from '../abstract';

const MmodalContainer = new ComponentItemFactory(
	'modalContainer',
	'模态框容器',
	{},
	{
		props: {},
		width: 300,
		height: 300,
	},
	(data) => {
		return (
			<div
				style={{
					zIndex: data.zIndex,
					width: data.width,
					height: data.height,
					backgroundColor: 'white',
				}}
			></div>
		);
	}
);

export default MmodalContainer;
