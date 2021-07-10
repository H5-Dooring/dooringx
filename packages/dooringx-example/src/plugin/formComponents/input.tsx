/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:32:55
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 14:33:06
 * @FilePath: \visual-editor\src\plugin\formComponents\input.tsx
 */
import { deepCopy } from 'dooringx-lib';
import { store } from 'dooringx-lib';
import { Col, Input, Row } from 'antd';
import { memo, useMemo } from 'react';
import React from 'react';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';

interface MInputProps {
	data: CreateOptionsRes<FormMap, 'input'>;
	current: IBlockType;
}

function MInput(props: MInputProps) {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	return (
		<Row style={{ padding: '10px 20px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '文字'}：
			</Col>
			<Col span={18}>
				<Input
					value={props.current.props[(option as any).receive] || ''}
					onChange={(e) => {
						const receive = (option as any).receive;
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v.props[receive] = e.target.value;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}}
				></Input>
			</Col>
		</Row>
	);
}

export default memo(MInput);
