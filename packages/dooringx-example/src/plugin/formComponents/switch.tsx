/*
 * @Author: yehuozhili
 * @Date: 2021-08-03 10:45:06
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-05 14:35:49
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\formComponents\switch.tsx
 */
import React, { useMemo, memo } from 'react';
import { Switch, Row, Col } from 'antd';
import { deepCopy, UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';

interface MSwitchProps {
	data: CreateOptionsRes<FormMap, 'switch'>;
	current: IBlockType;
	config: UserConfig;
}

const MSwitch = (props: MSwitchProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	const store = props.config.getStore();
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={8} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '文字'}：
			</Col>
			<Col span={16} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
				<Switch
					checked={props.current.props[(option as any).receive] || ''}
					onChange={(checked) => {
						const receive = (option as any).receive;
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v.props[receive] = checked;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}}
				></Switch>
			</Col>
		</Row>
	);
};

export default memo(MSwitch);
