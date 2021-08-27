import {
	CompressOutlined,
	DeleteOutlined,
	FullscreenExitOutlined,
	FullscreenOutlined,
	GatewayOutlined,
	LayoutOutlined,
	MenuOutlined,
	SyncOutlined,
	UnorderedListOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, List, message, Modal, Popconfirm, Popover } from 'antd';
import React, { CSSProperties, PropsWithChildren, useState } from 'react';
import { UserConfig } from '..';
import { IBlockType, IStoreData } from '../core/store/storetype';
import { deepCopy, arrayMove, changeItem, changeLayer, focusEle } from '../core/utils';
import { SortEnd, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { wrapperMoveState } from './wrapperMove/event';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
export interface ControlProps {
	config: UserConfig;
	style?: CSSProperties;
}

const DragHandle = SortableHandle(() => <MenuOutlined />);
const SortableItem = SortableElement(
	({ value }: { value: { value: IBlockType; config: UserConfig; intl: IntlShape } }) => (
		<div
			style={{
				userSelect: 'none',
				display: 'flex',
				alignItems: 'center',
				width: 430,
			}}
		>
			<div style={{ width: 30, textAlign: 'center', cursor: 'move' }}>
				<DragHandle></DragHandle>
			</div>
			<Divider type="vertical"></Divider>
			<div style={{ width: 100, textAlign: 'center' }}>
				{value.config.getComponentRegister().getMap()[value.value.name].display}
			</div>
			<Divider type="vertical"></Divider>
			<div style={{ width: 80, textAlign: 'center' }}>{value.value.id.slice(-6)}</div>
			<Divider type="vertical"></Divider>
			<div style={{ width: 50, textAlign: 'center' }}>{value.value.position}</div>
			<Divider type="vertical"></Divider>
			<div style={{ width: 200 }}>
				<Popconfirm
					title={value.intl.formatMessage({
						id: 'contorl.popup.absolute',
						defaultMessage: '确认变更为绝对定位吗',
					})}
					onConfirm={() => {
						changeItem(value.config.getStore(), value.value.id, 'position', 'absolute');
					}}
					okText={value.intl.formatMessage({ id: 'yes' })}
					cancelText={value.intl.formatMessage({ id: 'no' })}
				>
					<Button
						type="link"
						title={value.intl.formatMessage({
							id: 'contorl.absolute',
							defaultMessage: '切换绝对定位',
						})}
						icon={<FullscreenOutlined />}
					></Button>
				</Popconfirm>
				<Popconfirm
					title={value.intl.formatMessage({
						id: 'contorl.popup.static',
						defaultMessage: '确认变更为静态定位吗',
					})}
					onConfirm={() => {
						changeItem(value.config.getStore(), value.value.id, 'position', 'static');
					}}
					okText={value.intl.formatMessage({ id: 'yes' })}
					cancelText={value.intl.formatMessage({ id: 'no' })}
				>
					<Button
						type="link"
						title={value.intl.formatMessage({
							id: 'contorl.static',
							defaultMessage: '切换静态定位',
						})}
						icon={<FullscreenExitOutlined />}
					></Button>
				</Popconfirm>
				<Button
					type="link"
					title={value.intl.formatMessage({ id: 'control.focus', defaultMessage: '选中聚焦' })}
					icon={<CompressOutlined />}
					onClick={() => {
						focusEle(value.config.getStore(), value.value.id);
					}}
				></Button>
				<Popconfirm
					title={value.intl.formatMessage({
						id: 'control.popup.delete',
						defaultMessage: '确认删除吗',
					})}
					onConfirm={() => {
						changeLayer(value.config.getStore(), value.value.id, 'delete');
					}}
					okText={value.intl.formatMessage({ id: 'yes' })}
					cancelText={value.intl.formatMessage({ id: 'no' })}
				>
					<Button
						icon={<DeleteOutlined />}
						title={value.intl.formatMessage({ id: 'control.delete', defaultMessage: '删除' })}
						type="link"
					></Button>
				</Popconfirm>
			</div>
		</div>
	)
);
const SortableList = SortableContainer(
	({ items }: { items: { data: IBlockType[]; config: UserConfig; intl: IntlShape } }) => {
		return (
			<div>
				{items.data.map((value, index: number) => (
					<SortableItem
						key={value.id}
						index={index}
						value={{ value, config: items.config, intl: items.intl }}
					/>
				))}
			</div>
		);
	}
);

const moveState = {
	startX: 0,
	startY: 0,
	isMove: false,
};

const mouseUp = () => {
	if (moveState.isMove) {
		moveState.isMove = false;
	}
};

export function Control(props: PropsWithChildren<ControlProps>) {
	const { style } = props;
	const [visible, setVisible] = useState(false);
	const [configVisible, setConfigVisible] = useState(false);
	const [form] = Form.useForm();

	const data = props.config.getStore().getData().block;

	const onSortEnd = (sort: SortEnd) => {
		const { oldIndex, newIndex } = sort;
		const newblocks: IBlockType[] = arrayMove(data, oldIndex, newIndex);
		// 这里要判断是否edit ,如果edit时，只要看第一个是不是container，不是则不移动
		const isEdit = props.config.getStoreChanger().isEdit();
		if (isEdit) {
			const firstType = newblocks[0].name;
			if (firstType !== 'modalMask') {
				return;
			}
		}
		const store = props.config.getStore();
		const cloneData: IStoreData = deepCopy(store.getData());
		cloneData.block = newblocks;
		store.setData(cloneData);
	};

	const intl = useIntl();

	const content =
		data.length === 0 ? (
			<div>
				<FormattedMessage id="control.no-component" defaultMessage="暂无组件"></FormattedMessage>
			</div>
		) : (
			<div style={{ maxHeight: 300, overflow: 'auto' }}>
				<SortableList
					distance={2}
					useDragHandle
					items={{
						data,
						config: props.config,
						intl: intl,
					}}
					onSortEnd={onSortEnd}
					axis="y"
				></SortableList>
			</div>
		);
	const [xy, setXy] = useState({ x: 0, y: 0 });
	return (
		<>
			<div
				className="ant-menu"
				onMouseDown={(e) => {
					moveState.startX = e.clientX;
					moveState.startY = e.clientY;
					moveState.isMove = true;
				}}
				onMouseMove={(e) => {
					if (moveState.isMove) {
						const diffx = e.clientX - moveState.startX;
						const diffy = e.clientY - moveState.startY;
						setXy((pre) => ({ x: pre.x + diffx, y: pre.y + diffy }));
						moveState.startX = e.clientX;
						moveState.startY = e.clientY;
					}
				}}
				onMouseUp={mouseUp}
				onMouseLeave={mouseUp}
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `translate(${xy.x}px,${xy.y}px)`,
					...style,
				}}
			>
				<Popover style={{ minWidth: '208px' }} content={content} trigger="click">
					<Button icon={<UnorderedListOutlined />}></Button>
				</Popover>
				<Button
					icon={<LayoutOutlined />}
					onClick={() => {
						props.config.ticker = !props.config.ticker;
						props.config.getStore().forceUpdate();
					}}
				></Button>
				<Popover
					placement="left"
					content={
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
							}}
						>
							<Button
								onClick={() => {
									setVisible(true);
								}}
								style={{ width: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}
							>
								<FormattedMessage id="modal.new" defaultMessage="新建弹窗"></FormattedMessage>
							</Button>
							<Button
								onClick={() => {
									setConfigVisible(true);
								}}
								style={{ width: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}
							>
								<FormattedMessage id="modal.control" defaultMessage="弹窗配置"></FormattedMessage>
							</Button>
						</div>
					}
				>
					<Button icon={<GatewayOutlined />}></Button>
				</Popover>

				<Button
					icon={<VideoCameraOutlined />}
					onClick={() => {
						props.config.timeline = !props.config.timeline;
						props.config.getStore().forceUpdate();
					}}
				></Button>
				<Button
					icon={<SyncOutlined />}
					onClick={() => {
						wrapperMoveState.needX = 0;
						wrapperMoveState.needY = 0;
						props.config.getStore().forceUpdate();
					}}
				></Button>
			</div>

			<Modal
				title={intl.formatMessage({ id: 'modal.control', defaultMessage: '弹窗配置' })}
				visible={configVisible}
				onOk={() => setConfigVisible(false)}
				onCancel={() => setConfigVisible(false)}
				footer={null}
			>
				<List>
					{props.config.getStoreChanger().getState().modalEditName !== '' && (
						<div>
							<FormattedMessage
								id="modal.popup.exit"
								defaultMessage="请退出编辑弹窗后再打开该配置"
							></FormattedMessage>
						</div>
					)}
					{props.config.getStoreChanger().getState().modalEditName === '' &&
						Object.keys(props.config.getStore().getData().modalMap).map((v) => {
							return (
								<List.Item
									key={v}
									actions={[
										<Popconfirm
											title={intl.formatMessage({
												id: 'modal.popup.edit',
												defaultMessage: '是否切换至该弹窗并进行编辑?',
											})}
											onConfirm={() => {
												const sign = props.config
													.getStoreChanger()
													.updateModal(props.config.getStore(), v);
												if (!sign.success && sign.sign === 0) {
													message.error(
														intl.formatMessage({
															id: 'modal.popup.save',
															defaultMessage: '请保存弹窗后编辑其他弹窗',
														})
													);
												}
												if (!sign.success && sign.sign === 1) {
													message.error(
														intl.formatMessage(
															{
																id: 'modal.popup.notfond',
																defaultMessage: '未找到该弹窗 {name}',
															},
															{
																name: sign.param,
															}
														)
													);
												}
												setConfigVisible(false);
											}}
											okText={intl.formatMessage({ id: 'yes' })}
											cancelText={intl.formatMessage({ id: 'no' })}
										>
											<Button type="link">修改</Button>
										</Popconfirm>,

										<Popconfirm
											title="您确定要删除这个弹窗吗?"
											onConfirm={() => {
												const sign = props.config
													.getStoreChanger()
													.removeModal(props.config.getStore(), v);
												if (!sign.success && sign.sign === 0) {
													message.error(
														intl.formatMessage({
															id: 'modal.popup.save',
															defaultMessage: '请保存弹窗后编辑其他弹窗',
														})
													);
												}
												if (!sign.success && sign.sign === 1) {
													message.error(
														intl.formatMessage(
															{
																id: 'modal.popup.notfond',
																defaultMessage: '未找到该弹窗 {name}',
															},
															{
																name: sign.param,
															}
														)
													);
												}

												setConfigVisible(false);
											}}
											okText={intl.formatMessage({ id: 'yes' })}
											cancelText={intl.formatMessage({ id: 'no' })}
										>
											<Button type="link">
												<FormattedMessage
													id="control.delete"
													defaultMessage="删除"
												></FormattedMessage>
											</Button>
										</Popconfirm>,
									]}
								>
									{v}
								</List.Item>
							);
						})}
					{props.config.getStoreChanger().getState().modalEditName === '' &&
						Object.keys(props.config.getStore().getData().modalMap).length === 0 && (
							<div style={{ textAlign: 'center' }}>
								<FormattedMessage id="modal.popup.nomodal"></FormattedMessage>
							</div>
						)}
				</List>
			</Modal>
			<Modal
				onOk={() => {
					form
						.validateFields()
						.then((values) => {
							form.resetFields();
							const modalName = values.modalName;
							const sign = props.config
								.getStoreChanger()
								.newModalMap(props.config.getStore(), modalName);
							if (sign.succeess && sign.sign === 0) {
								message.error(
									intl.formatMessage({
										id: 'modal.popup.save',
										defaultMessage: '请保存弹窗后编辑其他弹窗',
									})
								);
							}
							if (sign.succeess && sign.sign === 1) {
								message.error(
									intl.formatMessage(
										{
											id: 'modal.popup.repeat',
											defaultMessage: '已有重名弹窗 {name}',
										},
										{
											name: sign.param,
										}
									)
								);
							}
							setVisible(false);
						})
						.catch((info) => {
							console.log('Validate Failed:', info);
						});
				}}
				title={intl.formatMessage({ id: 'modal.new', defaultMessage: '新增弹窗' })}
				onCancel={() => setVisible(false)}
				visible={visible}
			>
				<Form layout="vertical" name="basic" form={form}>
					<Form.Item
						label={intl.formatMessage({ id: 'modal.name', defaultMessage: '弹窗名称' })}
						name="modalName"
						rules={[
							{
								required: true,
								message: intl.formatMessage({
									id: 'modal.popup.name',
									defaultMessage: '请输入弹窗名称!',
								}),
							},
						]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default Control;
