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
import { Button, Divider, Form, Input, List, Modal, Popconfirm, Popover } from 'antd';
import React, { CSSProperties, PropsWithChildren, useState } from 'react';
import { UserConfig } from '..';
import { IBlockType, IStoreData } from '../core/store/storetype';
import { deepCopy, arrayMove, changeItem, changeLayer, focusEle } from '../core/utils';
import { SortEnd, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { wrapperMoveState } from './wrapperMove/event';
export interface ControlProps {
	config: UserConfig;
	style?: CSSProperties;
}

const DragHandle = SortableHandle(() => <MenuOutlined />);
const SortableItem = SortableElement(
	({ value }: { value: { value: IBlockType; config: UserConfig } }) => (
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
					title="确认变更为绝对定位吗？"
					onConfirm={() => {
						changeItem(value.config.getStore(), value.value.id, 'position', 'absolute');
					}}
				>
					<Button type="link" title="切换绝对定位" icon={<FullscreenOutlined />}></Button>
				</Popconfirm>
				<Popconfirm
					title="确认变更为静态定位吗？"
					onConfirm={() => {
						changeItem(value.config.getStore(), value.value.id, 'position', 'static');
					}}
				>
					<Button type="link" title="切换静态定位" icon={<FullscreenExitOutlined />}></Button>
				</Popconfirm>
				<Button
					type="link"
					title="选中聚焦"
					icon={<CompressOutlined />}
					onClick={() => {
						focusEle(value.config.getStore(), value.value.id);
					}}
				></Button>
				<Popconfirm
					title="确认删除操作吗？"
					onConfirm={() => {
						changeLayer(value.config.getStore(), value.value.id, 'delete');
					}}
				>
					<Button icon={<DeleteOutlined />} title="删除" type="link"></Button>
				</Popconfirm>
			</div>
		</div>
	)
);
const SortableList = SortableContainer(
	({ items }: { items: { data: IBlockType[]; config: UserConfig } }) => {
		return (
			<div>
				{items.data.map((value, index: number) => (
					<SortableItem key={value.id} index={index} value={{ value, config: items.config }} />
				))}
			</div>
		);
	}
);

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

	const content =
		data.length === 0 ? (
			<div>暂时没有组件</div>
		) : (
			<div style={{ maxHeight: 300, overflow: 'auto' }}>
				<SortableList
					distance={2}
					useDragHandle
					items={{
						data,
						config: props.config,
					}}
					onSortEnd={onSortEnd}
					axis="y"
				></SortableList>
			</div>
		);

	return (
		<>
			<div
				className="ant-menu"
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
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
							>
								新建弹窗
							</Button>
							<Button
								onClick={() => {
									setConfigVisible(true);
								}}
							>
								弹窗配置
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
				title="弹窗配置"
				visible={configVisible}
				onOk={() => setConfigVisible(false)}
				onCancel={() => setConfigVisible(false)}
				footer={null}
			>
				<List>
					{props.config.getStoreChanger().getState().modalEditName !== '' && (
						<div>请退出编辑弹窗后再打开该配置</div>
					)}
					{props.config.getStoreChanger().getState().modalEditName === '' &&
						Object.keys(props.config.getStore().getData().modalMap).map((v) => {
							return (
								<List.Item
									key={v}
									actions={[
										<Popconfirm
											title="是否切换至该弹窗并进行编辑?"
											onConfirm={() => {
												props.config.getStoreChanger().updateModal(props.config.getStore(), v);
												setConfigVisible(false);
											}}
											okText={'是'}
											cancelText={'否'}
										>
											<Button type="link">修改</Button>
										</Popconfirm>,

										<Popconfirm
											title="您确定要删除这个弹窗吗?"
											onConfirm={() => {
												props.config.getStoreChanger().removeModal(props.config.getStore(), v);
												setConfigVisible(false);
											}}
											okText={'是'}
											cancelText={'否'}
										>
											<Button type="link">删除</Button>
										</Popconfirm>,
									]}
								>
									{v}
								</List.Item>
							);
						})}
					{props.config.getStoreChanger().getState().modalEditName === '' &&
						Object.keys(props.config.getStore().getData().modalMap).length === 0 && (
							<div style={{ textAlign: 'center' }}>暂时没有弹窗</div>
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
							props.config.getStoreChanger().newModalMap(props.config.getStore(), modalName);
							setVisible(false);
						})
						.catch((info) => {
							console.log('Validate Failed:', info);
						});
				}}
				title="新增弹窗"
				onCancel={() => setVisible(false)}
				visible={visible}
			>
				<Form layout="vertical" name="basic" form={form}>
					<Form.Item
						label="弹窗名称"
						name="modalName"
						rules={[{ required: true, message: '请输入弹窗名称!' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default Control;
