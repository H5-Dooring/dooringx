/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:46:01
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 18:33:35
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\formComponents\actionButton.tsx
 */

import { Button, Col, Input, message, Modal, Row, Select } from 'antd';
import { memo, useMemo, useState } from 'react';
import React from 'react';
import { UserConfig, createUid, deepCopy } from 'dooringx-lib';
import { unstable_batchedUpdates } from 'react-dom';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType, IStoreData } from 'dooringx-lib/dist/core/store/storetype';
import { FunctionConfigType } from 'dooringx-lib/dist/core/functionCenter/config';
import { EventCenterUserSelect } from 'dooringx-lib/dist/core/eventCenter';

const { Option } = Select;

interface ActionButtonProps {
	data: CreateOptionsRes<FormMap, 'actionButton'>;
	current: IBlockType;
	config: UserConfig;
}

function ActionButton(props: ActionButtonProps) {
	const [visible, setVisible] = useState(false);
	const [cur, setCur] = useState('');

	const eventMap = props.config.getEventCenter().getEventMap();
	const currentOption = useMemo(() => {
		return Object.keys(eventMap).filter((v) => v.indexOf(props.current.id) >= 0);
	}, [eventMap, props.current.id]);

	const [search, setSearch] = useState<EventCenterUserSelect[]>([]);
	const functionCenter = props.config.getEventCenter().getFunctionCenter();
	const functionConfig = functionCenter.getConfigMap();
	const functionMap = functionCenter.getFunctionMap();
	const isEdit = props.config.getStoreChanger().isEdit();
	const dataMap = props.config.getDataCenter().getDataMap();
	let modalMap: Record<string, IStoreData>;
	if (isEdit) {
		modalMap = props.config.getStoreChanger().getOrigin()?.now.modalMap || {};
	} else {
		modalMap = props.config.getStore().getData().modalMap;
	}

	const handleInputDataSource = (
		w: {
			uid: string;
			value: string;
			detail: Record<string, any>;
		},
		c: any,
		name = 'dataSource'
	) => {
		return (
			<div>
				<div
					style={{
						textAlign: 'right',
						margin: '10px 0',
					}}
				>
					<Button
						type="primary"
						onClick={() => {
							setSearch((pre) => {
								pre.forEach((v) => {
									if (v.uid === w.uid) {
										let sign = true;
										if (!v.detail[name][c.name]) {
											v.detail[name][c.name] = [];
										}
										if (!c.options.multi) {
											if (v.detail[name][c.name].length >= 1) {
												sign = false;
												message.error('该函数最多只能添加1个');
											}
										}
										if (sign) {
											v.detail[name][c.name].push('');
										}
									}
								});
								return [...pre];
							});
						}}
					>
						添加
					</Button>
				</div>
				<div>
					{w.detail[name] &&
						w.detail[name][c.name] &&
						w.detail[name][c.name].map((vvv: string, x: number) => {
							return (
								<Row key={x}>
									<Col span={19}>
										<Select
											style={{ width: '100%' }}
											value={vvv}
											onChange={(e) => {
												const value = e;
												setSearch((pre) => {
													pre.forEach((v) => {
														v.uid === w.uid ? (v.detail[name][c.name][x] = value || '') : '';
													});
													return [...pre];
												});
											}}
										>
											{Object.keys(dataMap).map((n) => {
												return (
													<Option key={n} value={n}>
														{n}
													</Option>
												);
											})}
										</Select>
									</Col>
									<Col span={5} style={{ textAlign: 'right' }}>
										<Button
											danger
											onClick={() => {
												setSearch((pre) => {
													pre.forEach((v) => {
														v.uid === w.uid ? v.detail[name][c.name].splice(x, 1) : '';
													});
													return [...pre];
												});
											}}
										>
											删除
										</Button>
									</Col>
								</Row>
							);
						})}
				</div>
			</div>
		);
	};

	const handleInput = (
		w: {
			uid: string;
			value: string;
			detail: Record<string, any>;
		},
		c: any,
		name = 'ctx'
	) => {
		return (
			<div>
				<div
					style={{
						textAlign: 'right',
						margin: '10px 0',
					}}
				>
					<Button
						type="primary"
						onClick={() => {
							setSearch((pre) => {
								pre.forEach((v) => {
									if (v.uid === w.uid) {
										if (!v.detail[name][c.name]) {
											v.detail[name][c.name] = [];
										}
										let sign = true;
										if (!c.options.multi) {
											if (v.detail[name][c.name].length >= 1) {
												sign = false;
												message.error('该函数最多只能添加1个');
											}
										}
										if (sign) {
											v.detail[name][c.name].push('');
										}
									}
								});
								return [...pre];
							});
						}}
					>
						添加输入框
					</Button>
				</div>
				<div>
					{w.detail[name] &&
						w.detail[name][c.name] &&
						w.detail[name][c.name].map((vvv: string, x: number) => {
							return (
								<Row key={x}>
									<Col span={19}>
										<Input
											value={vvv}
											onChange={(e) => {
												const value = e.target.value;
												setSearch((pre) => {
													pre.forEach((v) => {
														v.uid === w.uid ? (v.detail[name][c.name][x] = value || '') : '';
													});
													return [...pre];
												});
											}}
										></Input>
									</Col>
									<Col span={5} style={{ textAlign: 'right' }}>
										<Button
											danger
											onClick={() => {
												setSearch((pre) => {
													pre.forEach((v) => {
														v.uid === w.uid ? v.detail[name][c.name].splice(x, 1) : '';
													});
													return [...pre];
												});
											}}
										>
											删除
										</Button>
									</Col>
								</Row>
							);
						})}
				</div>
			</div>
		);
	};

	return (
		<div style={{ padding: '10px 20px' }}>
			<Row
				style={{
					padding: 20,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Col span={8}>标识ID</Col>
				<Col span={16}>{props.current.id}</Col>
			</Row>
			{currentOption.map((j, i) => {
				return (
					<Row
						key={i}
						style={{
							padding: 20,
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>{eventMap[j].displayName}</div>
						<Button
							onClick={() => {
								unstable_batchedUpdates(() => {
									setVisible(true);
									setCur((pre) => {
										if (pre !== j) {
											//查找该cur的选项
											const store = props.config.getStore().getData();
											let init: EventCenterUserSelect[] = [];
											store.block.forEach((v) => {
												if (v.id === props.current.id) {
													init = v.eventMap[j]?.userSelect || [];
												}
											});
											setSearch(init);
										}
										return j;
									});
								});
							}}
						>
							配置
						</Button>
					</Row>
				);
			})}
			<Modal
				width={800}
				title={'事件编辑' + `-${(eventMap[cur] && eventMap[cur].displayName) || ''}`}
				forceRender
				onOk={() => {
					// 更新store中的eventMap
					const store = props.config.getStore();
					const cloneData: IStoreData = deepCopy(store.getData());
					const arr = search.map((v) => {
						//   name: string; // 函数名
						// args: Record<string, any>; // 输入参数都会变成对象传来，
						//  data: Record<string, FunctionDataType>; // 用户选的种类 键是每个配置项名
						const name = v.value; //函数名
						const options: FunctionConfigType = functionConfig[name];
						const dataMap = v.detail['data'];
						const combine = options.map((jkk) => {
							const select: string = dataMap[jkk.name]; // datasource / input / modal
							let val = {};
							if (select) {
								const value = v.detail[select]; //{name:array<>}
								const receive = jkk.options.receive;
								val = { [receive]: value[jkk.name] }; //这里不能换算，否则修改data后值不会更新
							}

							const choose = { [jkk.name]: select };
							return {
								...v,
								choose,
								val,
							};
						});
						const combineVal = combine.reduce((prev, next) => {
							return Object.assign(prev, next.val);
						}, {});
						const combineChoose = combine.reduce((prev, next) => {
							return Object.assign(prev, next.choose);
						}, {});

						return {
							name: name,
							data: combineChoose,
							args: combineVal,
						};
					});
					let displayName = '';
					cloneData.block.forEach((v) => {
						if (v.id === props.current.id) {
							v.eventMap[cur].userSelect = search;
							v.eventMap[cur].arr = arr;
							displayName = v.eventMap[cur].displayName;
						}
					});
					const eventCenter = props.config.getEventCenter();
					eventCenter.manualUpdateMap(cur, displayName, arr);
					store.setData(cloneData);
					setVisible(false);
				}}
				onCancel={() => {
					setVisible(false);
				}}
				visible={visible}
			>
				<div>
					<Row align="middle">
						<Col span={6}>触发事件ID：</Col>
						<Col span={18}>{cur}</Col>
					</Row>
					<Row justify="space-between" style={{ justifyContent: 'flex-end', margin: '20px 0' }}>
						<Button
							type="primary"
							onClick={() => {
								setSearch((pre) => {
									pre.push({
										uid: createUid(),
										value: '',
										detail: {
											input: {},
											ctx: {},
											dataSource: {},
											data: {},
											modal: {},
										},
									});
									return [...pre];
								});
							}}
						>
							添加事件
						</Button>
					</Row>
					<div>
						{search.map((w, i) => {
							const current = search.find((v) => v.uid === w.uid);
							const options: FunctionConfigType | undefined = functionConfig[current?.value || ''];
							return (
								<div key={w.uid}>
									<Row align="middle">
										<Col span={6}>选择函数：</Col>
										<Col span={14}>
											<Select
												value={current?.value || ''}
												style={{ width: '100%' }}
												optionFilterProp="children"
												filterOption={(input, option) =>
													option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
												onChange={(e) => {
													setSearch((pre) => {
														pre.forEach((v) => {
															// 切换选择要把下一级制空
															if (v.uid === w.uid) {
																v.value = e as string;
																v.detail['data'] = {};
															}
														});
														return [...pre];
													});
												}}
											>
												{Object.keys(functionMap).map((v) => {
													return (
														<Option key={v} value={v}>
															{v}
														</Option>
													);
												})}
											</Select>
										</Col>
										<Col span={4} style={{ textAlign: 'right' }}>
											<Button
												danger
												onClick={() => {
													setSearch((pre) => {
														pre.splice(i, 1);
														return [...pre];
													});
												}}
											>
												删除
											</Button>
										</Col>
									</Row>
									<div
									//[{data: ""
									///   name: "改变文本数据源"
									//options: {receive: "_changeval"}}]
									>
										{options &&
											options.map((c) => {
												return (
													<Row key={c.name} style={{ margin: '10px 0' }}>
														<Col span={6}>{c.name}:</Col>
														<Col span={18}>
															{
																<Select
																	value={current?.detail?.data?.[c.name] || ''}
																	style={{ width: '100%' }}
																	onChange={(e) => {
																		setSearch((pre) => {
																			pre.forEach((v) => {
																				v.uid === w.uid
																					? (v.detail['data'][c.name] = (e as string) || '')
																					: '';
																			});
																			return [...pre];
																		});
																	}}
																>
																	{c.data.includes('dataSource') && (
																		<Option value="dataSource">数据源</Option>
																	)}
																	{c.data.includes('ctx') && <Option value="ctx">上下文</Option>}
																	{c.data.includes('input') && (
																		<Option value="input">输入框</Option>
																	)}
																	{c.data.includes('modal') && (
																		<Option value="modal">弹窗选择</Option>
																	)}
																</Select>
															}

															{w.detail['data'] && w.detail['data'][c.name] === 'dataSource' && (
																<div>{handleInputDataSource(w, c)}</div>
															)}
															{w.detail['data'] && w.detail['data'][c.name] === 'ctx' && (
																<div>{handleInput(w, c, 'ctx')}</div>
															)}
															{w.detail['data'] && w.detail['data'][c.name] === 'input' && (
																<div>{handleInput(w, c, 'input')}</div>
															)}
															{w.detail['data'] && w.detail['data'][c.name] === 'modal' && (
																<div>
																	<Select
																		value={w.detail['modal'][c.name] || ''}
																		onChange={(e) => {
																			setSearch((pre) => {
																				pre.forEach((v) => {
																					v.uid === w.uid
																						? (v.detail['modal'][c.name] = (e as string) || '')
																						: '';
																				});
																				return [...pre];
																			});
																		}}
																		style={{ width: '100%' }}
																	>
																		{Object.keys(modalMap).map((v) => {
																			return (
																				<Option key={v} value={v}>
																					{v}
																				</Option>
																			);
																		})}
																	</Select>
																</div>
															)}
														</Col>
													</Row>
												);
											})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default memo(ActionButton);
