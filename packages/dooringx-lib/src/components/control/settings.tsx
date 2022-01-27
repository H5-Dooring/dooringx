/*
 * @Author: yehuozhili
 * @Date: 2022-01-13 09:58:05
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-21 10:57:39
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\control\settings.tsx
 */

import { Modal, Form, InputNumber, Radio, Select } from 'antd';
import { MessageInstance } from 'antd/lib/message';
import React, { useState } from 'react';
import { memo } from 'react';
import { UserConfig } from '../../config/index';
import { rgba2Obj } from '../../core/utils/index';
import { replaceLocale, zhCN } from '../../locale';
import ColorPicker from '../colorPicker';

export interface SettingsModalPropsType {
	visible: boolean;
	config: UserConfig;
	onOk: Function;
	onCancel: Function;
	message: MessageInstance;
}
const formItemLayout = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
};

function SettingsModal(props: SettingsModalPropsType) {
	const [form] = Form.useForm();
	const [color, setColor] = useState(rgba2Obj(props.config.marklineConfig.borderColor));

	return (
		<Modal
			width={800}
			visible={props.visible}
			okText={replaceLocale('yes', '确定', props.config)}
			cancelText={replaceLocale('no', '取消', props.config)}
			title={replaceLocale('system.setting', '系统设置', props.config)}
			onCancel={() => props.onCancel()}
			onOk={() => {
				const res = form.getFieldsValue();
				const { min, max, borderStyle, containerOverFlow } = res;
				if (max < min) {
					props.message.error(replaceLocale('error.minmax', zhCN['error.minmax'], props.config));
					return;
				}
				// 判断当前scale大小，如果超出范围，取最低值
				const currentScale = props.config.scaleState.value;
				if (currentScale < min || currentScale > max) {
					props.config.scaleState.value = min;
				}
				props.config.marklineConfig.borderColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
				props.config.marklineConfig.borderStyle = borderStyle;
				props.config.containerOverFlow = containerOverFlow;
				props.onOk(res);
				props.config.containerForceUpdate();
				return;
			}}
		>
			<Form
				{...formItemLayout}
				initialValues={{
					absorb: props.config.marklineConfig.isAbsorb,
					indent: props.config.marklineConfig.indent,
					min: props.config.scaleState.minValue,
					max: props.config.scaleState.maxValue,
					autofocus: props.config.timelineConfig.autoFocus,
					borderStyle: props.config.marklineConfig.borderStyle,
					containerOverFlow: props.config.containerOverFlow,
				}}
				form={form}
			>
				<Form.Item
					name="absorb"
					label={replaceLocale('settings.openabsorb', zhCN['settings.openabsorb'], props.config)}
				>
					<Radio.Group>
						<Radio value={true}>{replaceLocale('on', zhCN['on'], props.config)}</Radio>
						<Radio value={false}>{replaceLocale('off', zhCN['off'], props.config)}</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					name="indent"
					label={replaceLocale(
						'settings.absorbindent',
						zhCN['settings.absorbindent'],
						props.config
					)}
				>
					<InputNumber<number> min={0.1}></InputNumber>
				</Form.Item>
				<Form.Item
					label={replaceLocale(
						'settings.marklineColor',
						zhCN['settings.marklineColor'],
						props.config
					)}
				>
					<ColorPicker
						initColor={rgba2Obj(props.config.marklineConfig.borderColor)}
						onChange={(v) => {
							setColor(v);
						}}
					></ColorPicker>
				</Form.Item>
				<Form.Item
					name="borderStyle"
					label={replaceLocale(
						'settings.marklineStyle',
						zhCN['settings.marklineStyle'],
						props.config
					)}
				>
					<Select style={{ width: 88 }}>
						<Select.Option value="dotted">dotted</Select.Option>
						<Select.Option value="solid">solid</Select.Option>
						<Select.Option value="dashed">dashed</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="min"
					// 最小值要大于0.1否则tiker计算有问题
					label={replaceLocale('settings.min', zhCN['settings.min'], props.config)}
				>
					<InputNumber<number> min={0.1} step={0.1}></InputNumber>
				</Form.Item>
				<Form.Item
					name="max"
					label={replaceLocale('settings.max', zhCN['settings.max'], props.config)}
				>
					<InputNumber<number> min={0.1} step={0.1}></InputNumber>
				</Form.Item>
				<Form.Item
					name="autofocus"
					label={replaceLocale('settings.autofocus', zhCN['settings.autofocus'], props.config)}
				>
					<Radio.Group>
						<Radio value={true}>{replaceLocale('on', zhCN['on'], props.config)}</Radio>
						<Radio value={false}>{replaceLocale('off', zhCN['off'], props.config)}</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					name="containerOverFlow"
					label={replaceLocale(
						'settings.containerOverflow',
						zhCN['settings.containerOverflow'],
						props.config
					)}
				>
					<Radio.Group>
						<Radio value={true}>{replaceLocale('on', zhCN['on'], props.config)}</Radio>
						<Radio value={false}>{replaceLocale('off', zhCN['off'], props.config)}</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default memo(SettingsModal);
