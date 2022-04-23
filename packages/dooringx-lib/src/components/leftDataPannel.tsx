/*
 * @Author: yehuozhili
 * @Date: 2022-04-09 21:44:55
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-24 00:34:55
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\leftDataPannel.tsx
 */
import {
	Button,
	Form,
	Modal,
	Row,
	Space,
	Table,
	Input,
	Typography,
	message,
	Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import UserConfig from '../config';
import { replaceLocale } from '../locale';

interface LeftDataPannelProps {
	config: UserConfig;
}
const formItemLayout = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 20,
	},
};

const { Text } = Typography;
const reg = /[`~!@#-_$%^&*()+=|{}':;',\[\]<>/?~！@#￥%……&*（）——+|{}【】《》 ‘；：”“’。，、？]/g;

/**
 *
 * 左侧tab页插件
 * @param {LeftDataPannelProps} props
 * @returns
 */
function LeftDataPannel(props: LeftDataPannelProps) {
	const config = props.config;
	const dataCenter = config.getDataCenter();
	const dataMap = dataCenter.getDataMap();
	const keys = Object.keys(dataMap);
	const dataSource = keys.map((v) => ({ key: v, value: dataMap[v] }));
	const forceUpdate = useState(0)[1];
	const [addVisible, setAddVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [current, setCurrent] = useState<Record<string, any>>({});

	const column: ColumnsType<any> = [
		{
			title: 'Key',
			dataIndex: 'key',
			key: 'key',
		},
		{
			title: '操作',
			align: 'center',
			render: (_v, record: any) => {
				return (
					<Space size="middle">
						<Button
							type="link"
							onClick={() => {
								const value =
									typeof record.value === 'object' ? JSON.stringify(record.value) : record.value;
								const obj = { value, key: record.key };
								editForm.setFieldsValue(obj);
								setCurrent(record);
								setEditVisible(true);
							}}
						>
							编辑
						</Button>
						<Popconfirm
							title={replaceLocale('control.popup.delete', '确认删除么', config)}
							onConfirm={() => {
								const newObj = { ...dataMap };
								delete newObj[record.key];
								dataCenter.staticSetToMap({ ...newObj }, props.config);
								forceUpdate((v) => v + 1);
							}}
							okText={replaceLocale('yes', '确定', config)}
							cancelText={replaceLocale('no', '取消', config)}
						>
							<Button type="link">删除</Button>
						</Popconfirm>
					</Space>
				);
			},
		},
	];
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();

	const formSubmit = (res: any) => {
		let value: string = res.value;
		value = value.replace('/s', '').replace('↵', '');
		if (value.startsWith('{')) {
			try {
				const json = JSON.parse(value);
				const newObj = { [res.key]: json };
				dataCenter.staticSetToMap({ ...dataMap, ...newObj }, props.config);
				setAddVisible(false);
				form.resetFields();
			} catch (error) {
				message.error('json格式转换失败');
			}
		} else {
			const newObj = { [res.key]: value };
			dataCenter.staticSetToMap({ ...dataMap, ...newObj }, props.config);
			setAddVisible(false);
			form.resetFields();
		}
	};

	return (
		<div style={{ width: '100%' }}>
			<Row style={{ marginBottom: '10px' }}>
				<Button
					type="primary"
					onClick={() => {
						setAddVisible(true);
					}}
				>
					添加数据源
				</Button>
			</Row>
			<Row>
				<Table
					pagination={false}
					style={{ width: '100%' }}
					dataSource={dataSource}
					columns={column}
				></Table>
			</Row>
			{addVisible && (
				<Modal
					visible={addVisible}
					title={'添加数据源'}
					onCancel={() => {
						setAddVisible(false);
						form.resetFields();
					}}
					onOk={() => {
						form.validateFields().then((res) => {
							formSubmit(res);
						});
					}}
					okText={replaceLocale('yes', '确定', config)}
					cancelText={replaceLocale('no', '取消', config)}
				>
					<div>
						<Form form={form} {...formItemLayout}>
							<Form.Item
								label="key"
								name={'key'}
								rules={[
									{ required: true, message: 'Please input your key' },
									() => ({
										validator(_, value) {
											if (!keys.includes(value)) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Duplicate  keys!'));
										},
									}),
									() => ({
										validator(_, value) {
											if (!reg.exec(value)) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('invalid key'));
										},
									}),
								]}
							>
								<Input></Input>
							</Form.Item>
							<Form.Item
								label="value"
								name={'value'}
								extra={<Text type="warning">支持字符串、数字、JSON对象格式，直接输入内容即可</Text>}
								rules={[{ required: true, message: 'Please input your value' }]}
							>
								<Input.TextArea></Input.TextArea>
							</Form.Item>
						</Form>
					</div>
				</Modal>
			)}
			{editVisible && (
				<Modal
					visible={editVisible}
					title={'修改数据源'}
					onCancel={() => {
						setEditVisible(false);
						editForm.resetFields();
					}}
					onOk={() => {
						editForm.validateFields().then((res) => {
							let value: string = res.value;
							value = value.replace('/s', '').replace('↵', '');
							if (value.startsWith('{')) {
								try {
									const json = JSON.parse(value);
									const newObj = { [current.key]: json };
									dataCenter.staticSetToMap({ ...dataMap, ...newObj }, props.config);
									setEditVisible(false);
									editForm.resetFields();
								} catch (error) {
									message.error('json格式转换失败');
								}
							} else {
								const newObj = { [current.key]: value };
								dataCenter.staticSetToMap({ ...dataMap, ...newObj }, props.config);
								setEditVisible(false);
								editForm.resetFields();
							}
						});
					}}
					okText={replaceLocale('yes', '确定', config)}
					cancelText={replaceLocale('no', '取消', config)}
				>
					<Form form={editForm}>
						<Form.Item
							label="value"
							name={'value'}
							extra={<Text type="warning">支持字符串、数字、JSON对象格式，直接输入内容即可</Text>}
							rules={[{ required: true, message: 'Please input your value' }]}
						>
							<Input.TextArea></Input.TextArea>
						</Form.Item>
					</Form>
				</Modal>
			)}
		</div>
	);
}

export default LeftDataPannel;
