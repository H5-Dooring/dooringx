import React, { useMemo, useState } from 'react';
import { UserConfig, deepCopy, createUid } from 'dooringx-lib';
import {
	Col,
	Row,
	Select,
	InputNumber,
	Button,
	Modal,
	Form,
	Space,
	Input,
	Table,
	Popconfirm,
} from 'antd';
import { FormMap, FormBaseType } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { AnimateItem, IBlockType, IStoreData } from 'dooringx-lib/dist/core/store/storetype';
import { PlusOutlined } from '@ant-design/icons';

export interface FormAnimateControlType extends FormBaseType {}

interface AnimateControlProps {
	data: CreateOptionsRes<FormMap, 'animateControl'>;
	current: IBlockType;
	config: UserConfig;
}

// 左侧实际类名-显示名称
const animateCategory: Record<string, string> = {
	'': '无',
	animate__bounce: 'bounce',
	animate__flash: 'flash',
	animate__pulse: 'pulse',
	animate__rubberBand: 'rubberBand',
	animate__shakeX: 'shakeX',
	animate__shakeY: 'shakeY',
	animate__headShake: 'headShake',
	animate__swing: 'swing',
	animate__tada: 'tada',
	animate__wobble: 'wobble',
	animate__jello: 'jello',
	animate__heartBeat: 'heartBeat',
	animate__backInDown: 'backInDown',
	animate__backInLeft: 'backInLeft',
	animate__backInRight: 'backInRight',
	animate__backInUp: 'backInUp',
	animate__backOutDown: 'backOutDown',
	animate__backOutLeft: 'backOutLeft',
	animate__backOutRight: 'backOutRight',
	animate__backOutUp: 'backOutUp',
	animate__bounceIn: 'bounceIn',
	animate__bounceInDown: 'bounceInDown',
	animate__bounceInLeft: 'bounceInLeft',
	animate__bounceInRight: 'bounceInRight',
	animate__bounceInUp: 'bounceInUp',
	animate__bounceOut: 'bounceOut',
	animate__bounceOutDown: 'bounceOutDown',
	animate__bounceOutLeft: 'bounceOutLeft',
	animate__bounceOutRight: 'bounceOutRight',
	animate__bounceOutUp: 'bounceOutUp',
	animate__fadeIn: 'fadeIn',
	animate__fadeInDown: 'fadeInDown',
	animate__fadeInDownBig: 'fadeInDownBig',
	animate__fadeInLeft: 'fadeInLeft',
	animate__fadeInLeftBig: 'fadeInLeftBig',
	animate__fadeInRight: 'fadeInRight',
	animate__fadeInRightBig: 'fadeInRightBig',
	animate__fadeInUp: 'fadeInUp',
	animate__fadeInUpBig: 'fadeInUpBig',
	animate__fadeInTopLeft: 'fadeInTopLeft',
	animate__fadeInTopRight: 'fadeInTopRight',
	animate__fadeInBottomLeft: 'fadeInBottomLeft',
	animate__fadeInBottomRight: 'fadeInBottomRight',
	animate__fadeOut: 'fadeOut',
	animate__fadeOutDown: 'fadeOutDown',
	animate__fadeOutDownBig: 'fadeOutDownBig',
	animate__fadeOutLeft: 'fadeOutLeft',
	animate__fadeOutLeftBig: 'fadeOutLeftBig',
	animate__fadeOutRight: 'fadeOutRight',
	animate__fadeOutRightBig: 'fadeOutRightBig',
	animate__fadeOutUp: 'fadeOutUp',
	animate__fadeOutUpBig: 'fadeOutUpBig',
	animate__fadeOutTopLeft: 'fadeOutTopLeft',
	animate__fadeOutTopRight: 'fadeOutTopRight',
	animate__fadeOutBottomRight: 'fadeOutBottomRight',
	animate__fadeOutBottomLeft: 'fadeOutBottomLeft',
	animate__flip: 'flip',
	animate__flipInX: 'flipInX',
	animate__flipInY: 'flipInY',
	animate__flipOutX: 'flipOutX',
	animate__flipOutY: 'flipOutY',
	animate__lightSpeedInRight: 'lightSpeedInRight',
	animate__lightSpeedInLeft: 'lightSpeedInLeft',
	animate__lightSpeedOutRight: 'lightSpeedOutRight',
	animate__lightSpeedOutLeft: 'lightSpeedOutLeft',
	animate__rotateIn: 'rotateIn',
	animate__rotateInDownLeft: 'rotateInDownLeft',
	animate__rotateInDownRight: 'rotateInDownRight',
	animate__rotateInUpLeft: 'rotateInUpLeft',
	animate__rotateInUpRight: 'rotateInUpRight',
	animate__rotateOut: 'rotateOut',
	animate__rotateOutDownLeft: 'rotateOutDownLeft',
	animate__rotateOutDownRight: 'rotateOutDownRight',
	animate__rotateOutUpLeft: 'rotateOutUpLeft',
	animate__rotateOutUpRight: 'rotateOutUpRight',
	animate__hinge: 'hinge',
	animate__jackInTheBox: 'jackInTheBox',
	animate__rollIn: 'rollIn',
	animate__rollOut: 'rollOut',
	animate__zoomIn: 'zoomIn',
	animate__zoomInDown: 'zoomInDown',
	animate__zoomInLeft: 'zoomInLeft',
	animate__zoomInRight: 'zoomInRight',
	animate__zoomInUp: 'zoomInUp',
	animate__zoomOut: 'zoomOut',
	animate__zoomOutDown: 'zoomOutDown',
	animate__zoomOutLeft: 'zoomOutLeft',
	animate__zoomOutRight: 'zoomOutRight',
	animate__zoomOutUp: 'zoomOutUp',
	animate__slideInDown: 'slideInDown',
	animate__slideInLeft: 'slideInLeft',
	animate__slideInRight: 'slideInRight',
	animate__slideInUp: 'slideInUp',
	animate__slideOutDown: 'slideOutDown',
	animate__slideOutLeft: 'slideOutLeft',
	animate__slideOutRight: 'slideOutRight',
};

const repeat = ['1', '2', '3', '4', '5', 'infinite'];

const timeFunction: Record<string, string> = {
	平滑: 'linear',
	缓入: 'ease-in',
};

let lastAnimate: AnimateItem[] = [];
let isOmit = false;
const padding = 10;

function AnimateControl(props: AnimateControlProps) {
	const store = props.config.getStore();
	const animate = useMemo(() => {
		if (isOmit || props.config.waitAnimate) {
			return lastAnimate;
		}
		lastAnimate = props.current.animate;
		return props.current.animate;
	}, [props.current.animate]);

	const [customModal, setCustomModal] = useState(false);
	const [form] = Form.useForm();

	const [deletModal, setDeletModal] = useState(false);
	const customAnimate = props.config.animateFactory.getCustomAnimateName();

	const columns = [
		{
			title: '动画名称',
			dataIndex: 'animateName',
			width: 150,
		},
		{
			title: '显示名称',
			dataIndex: 'displayName',
			width: 150,
		},
		{
			title: '动画详情',
			dataIndex: 'keyframe',
		},
		{
			title: '操作',
			width: 120,
			render: (_: any, record: any) => (
				<Space size="middle">
					<Popconfirm
						onConfirm={() => {
							const name = record.animateName;
							props.config.animateFactory.deleteCustomAnimate(name);
							props.config.animateFactory.deleteKeyFrameAnimate(name);
							props.config.animateFactory.syncToStore(props.config);
						}}
						title="确定删除吗？"
					>
						<a>删除</a>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Space
				style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-around' }}
				align="baseline"
			>
				<Button
					onClick={() => {
						setCustomModal(true);
					}}
				>
					添加自定义动画
				</Button>
				<Button
					onClick={() => {
						setDeletModal(true);
					}}
				>
					删除自定义动画
				</Button>
			</Space>
			{animate.map((v, i) => {
				return (
					<div key={v.uid} style={{ borderBottom: '1px dotted #9e9e9e' }}>
						{
							<>
								<Row style={{ padding: padding, alignItems: 'center' }}>
									<Col span={5}>动画名称:</Col>
									<Col span={7}>
										<Select
											value={animate[i].animationName}
											style={{ width: '100%' }}
											onChange={(d) => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.forEach((w) => {
													if (w.id === props.current.id) {
														w.animate.forEach((f) => {
															if (f.uid === v.uid) {
																f.animationName = d;
															}
														});
													}
												});
												store.setData(cloneData);
											}}
										>
											{Object.keys(animateCategory).map((v, i) => {
												return (
													<Select.Option key={i} value={animateCategory[v]}>
														{animateCategory[v]}
													</Select.Option>
												);
											})}
											{customAnimate.map((v) => {
												return (
													<Select.Option key={v.animateName} value={v.animateName}>
														{v.displayName}
													</Select.Option>
												);
											})}
										</Select>
									</Col>
									<Col span={5} style={{ paddingLeft: '10px' }}>
										持续时间:
									</Col>
									<Col span={7}>
										<InputNumber
											style={{ width: '100%' }}
											step="0.1"
											value={animate[i].animationDuration}
											formatter={(value) => `${value}s`}
											min={0}
											onChange={(d) => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.forEach((w) => {
													if (w.id === props.current.id) {
														w.animate.forEach((f) => {
															if (f.uid === v.uid) {
																f.animationDuration = d;
															}
														});
													}
												});
												store.setData(cloneData);
											}}
										/>
									</Col>
								</Row>
								<Row style={{ padding: padding, alignItems: 'center' }}>
									<Col span={5}>延迟时间:</Col>
									<Col span={7}>
										<InputNumber
											style={{ width: '100%' }}
											value={animate[i].animationDelay}
											formatter={(value) => `${value}s`}
											min={0}
											step="0.1"
											onChange={(d) => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.forEach((w) => {
													if (w.id === props.current.id) {
														w.animate.forEach((f) => {
															if (f.uid === v.uid) {
																f.animationDelay = d;
															}
														});
													}
												});
												store.setData(cloneData);
											}}
										/>
									</Col>
									<Col span={5} style={{ paddingLeft: '10px' }}>
										重复次数:
									</Col>
									<Col span={7}>
										<Select
											value={animate[i].animationIterationCount}
											style={{ width: '100%' }}
											onChange={(d) => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.forEach((w) => {
													if (w.id === props.current.id) {
														w.animate.forEach((f) => {
															if (f.uid === v.uid) {
																f.animationIterationCount = d;
															}
														});
													}
												});
												store.setData(cloneData);
											}}
										>
											{repeat.map((v, i) => {
												return (
													<Select.Option key={i} value={v}>
														{v}
													</Select.Option>
												);
											})}
										</Select>
									</Col>
								</Row>
								<Row style={{ padding: padding, alignItems: 'center' }}>
									<Col span={5}>运动函数:</Col>
									<Col span={7}>
										<Select
											value={animate[i].animationTimingFunction}
											style={{ width: '100%' }}
											onChange={(d) => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.forEach((w) => {
													if (w.id === props.current.id) {
														w.animate.forEach((f) => {
															if (f.uid === v.uid) {
																f.animationTimingFunction = d;
															}
														});
													}
												});
												store.setData(cloneData);
											}}
										>
											{Object.keys(timeFunction).map((v, i) => {
												return (
													<Select.Option key={i} value={timeFunction[v]}>
														{v}
													</Select.Option>
												);
											})}
										</Select>
									</Col>
									<Col style={{ justifyContent: 'flex-end', flex: 1, textAlign: 'end' }}>
										<Button
											danger
											onClick={() => {
												const cloneData: IStoreData = deepCopy(store.getData());
												cloneData.block.map((v) => {
													if (v.id === props.current.id) {
														v.animate.splice(i, 1);
													}
												});
												store.setData(cloneData);
											}}
										>
											删除
										</Button>
									</Col>
								</Row>
							</>
						}
					</div>
				);
			})}

			<Row style={{ padding: padding, justifyContent: 'space-around' }}>
				{animate.length > 0 && (
					<Button
						onClick={async () => {
							if (!isOmit) {
								isOmit = true;
								const cacheProps = animate;
								await props.config.timelineNeedleConfig.resetFunc(false);
								const data: IStoreData = deepCopy(store.getData());
								props.config.waitAnimate = true;
								data.block.forEach((v) => {
									if (v.id === props.current.id) {
										v.animate = [];
									}
								});
								props.config.timelineNeedleConfig.status = 'pause';
								store.setData(data);
								setTimeout(() => {
									const clone: IStoreData = deepCopy(store.getData());
									clone.block.forEach((v) => {
										if (v.id === props.current.id) {
											v.animate = cacheProps;
										}
									});
									isOmit = false;
									props.config.waitAnimate = false;
									props.config.timelineNeedleConfig.status = 'start';
									store.setData(clone);
									store.cleanLast();
								});
							}
						}}
					>
						运行动画
					</Button>
				)}
				<Button
					onClick={() => {
						const cloneData: IStoreData = deepCopy(store.getData());
						const newItem: AnimateItem = {
							uid: createUid(),
							animationName: 'bounce',
							animationDelay: 0,
							animationDuration: 1,
							animationTimingFunction: 'linear',
							animationIterationCount: '1',
						};
						cloneData.block.forEach((v) => {
							if (v.id === props.current.id) {
								v.animate.push(newItem);
							}
						});
						store.setData(cloneData);
					}}
				>
					添加动画
				</Button>
			</Row>
			<Modal
				width={800}
				title={'设置自定义动画'}
				forceRender
				visible={customModal}
				onOk={() => {
					form.validateFields().then((res) => {
						const values = { ...res };
						props.config.animateFactory.addUserInputIntoCustom(values, props.config);
						setCustomModal(false);
						form.resetFields();
					});
				}}
				onCancel={() => {
					setCustomModal(false);
					form.resetFields();
				}}
			>
				<Form labelCol={{ span: 11 }} form={form}>
					<Form.Item
						required
						rules={[{ required: true, message: '请输入名称!' }]}
						labelCol={{ span: 6 }}
						name="displayName"
						label="自定义动画显示名称"
					>
						<Input></Input>
					</Form.Item>
					<Form.Item
						initialValue={`dooringx_${Math.random().toString(36).slice(2)}`}
						labelCol={{ span: 6 }}
						name="animateName"
						label="自定义动画名称"
					>
						<Input disabled></Input>
					</Form.Item>
					<Form.List name="keyframes">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space
										key={key}
										style={{ display: 'flex', marginBottom: 8, flexWrap: 'wrap' }}
										align="baseline"
									>
										<Form.Item
											style={{ width: 180 }}
											label="时间百分比"
											{...restField}
											name={[name, 'percent']}
											initialValue={0}
										>
											<InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
										</Form.Item>
										<>
											<Form.Item
												style={{ width: 180 }}
												label="坐标偏移X"
												{...restField}
												name={[name, 'positionX']}
												initialValue={0}
											>
												<InputNumber />
											</Form.Item>
											<Form.Item
												style={{ width: 180 }}
												label="坐标偏移Y"
												{...restField}
												name={[name, 'positionY']}
												initialValue={0}
											>
												<InputNumber />
											</Form.Item>
										</>

										<Form.Item
											style={{ width: 180 }}
											label="旋转"
											{...restField}
											name={[name, 'rotate']}
											initialValue={0}
										>
											<InputNumber formatter={(value) => `${value}°`} />
										</Form.Item>
										<Form.Item
											style={{ width: 180 }}
											label="缩放"
											{...restField}
											name={[name, 'scale']}
											initialValue={100}
										>
											<InputNumber formatter={(value) => `${value}%`} />
										</Form.Item>
										<Form.Item
											style={{ width: 180 }}
											label="透明度"
											{...restField}
											name={[name, 'opacity']}
											initialValue={100}
										>
											<InputNumber formatter={(value) => `${value}%`} />
										</Form.Item>
										<Button
											danger
											onClick={() => {
												remove(name);
											}}
										>
											删除
										</Button>
									</Space>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => {
											add();
										}}
										block
										icon={<PlusOutlined />}
									>
										添加
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
			<Modal
				width={800}
				title={'删除自定义动画'}
				forceRender
				visible={deletModal}
				footer={null}
				onOk={() => {
					setDeletModal(false);
				}}
				onCancel={() => {
					setDeletModal(false);
				}}
			>
				<Table columns={columns} dataSource={customAnimate}></Table>
			</Modal>
		</>
	);
}

export default AnimateControl;
