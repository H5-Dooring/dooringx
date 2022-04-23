/*
 * @Author: yehuozhili
 * @Date: 2021-04-04 20:35:11
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-23 18:36:23
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\components\defaultFormComponents\modalMask.tsx
 */
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { ComponentItemFactory } from '../abstract';

const MmodalMask = new ComponentItemFactory(
	'modalMask',
	'模态框遮罩',
	{},
	{
		props: {},
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: 999,
		width: '100%',
		height: '100%',
		canDrag: false,
	},
	(_, context, store, config) => {
		const container = store.getData().container;
		return (
			<div
				style={{
					width: context === 'preview' ? '100%' : container.width,
					height: context === 'preview' ? '100%' : container.height,
					backgroundColor: '#716f6f9e',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{context === 'edit' && (
					<Button
						type="primary"
						shape="circle"
						title="save"
						style={{ position: 'absolute', right: '10px', top: '10px' }}
						icon={<SaveOutlined></SaveOutlined>}
						onClick={() => {
							config.getStore().closeModal();
						}}
					></Button>
				)}
			</div>
		);
	},
	true,
	false
);

export default MmodalMask;
