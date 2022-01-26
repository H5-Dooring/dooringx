/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 05:42:13
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-20 12:21:48
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\rightConfig.tsx
 */
import { CreateOptionsRes } from '../core/components/formTypes';
import { IBlockType, IStoreData } from '../core/store/storetype';
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { Tabs, Input, Row, Col, Checkbox, InputNumber } from 'antd';
import UserConfig from '../config';
import { rgba2Obj } from '../core/utils';
import deepcopy from 'deepcopy';
import { replaceLocale } from '../locale';
import ColorPicker from './colorPicker';

const colStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
};
interface RightConfigProps {
	state: IStoreData;
	config: UserConfig;
}

/**
 *
 * 这里一个需要异步拿取当前注册组件的配置项，另外需要异步加载所需的配置项。
 * @param {*} props
 * @returns
 */
function RightConfig(props: PropsWithChildren<RightConfigProps>) {
	const [menuSelect, setMenuSelect] = useState('0');
	const [current, setCurrent] = useState<IBlockType | null>(null);
	const rightMapRenderListCategory = useMemo(() => {
		return props.config.getConfig().rightRenderListCategory;
	}, [props.config]);
	const store = props.config.getStore();

	useEffect(() => {
		const fn = () => {
			let item: IBlockType | undefined;
			store.getData().block.some((v) => {
				if (v.focus) {
					item = v;
				}
				return v.focus === true;
			});
			if (item) {
				setCurrent({ ...item });
			} else {
				setCurrent(null);
			}
		};
		const unregist = store.subscribe(fn);
		return () => {
			unregist();
		};
	}, [store]);
	const render = useMemo(() => {
		return (type: string, current: IBlockType) => {
			const fn = () => props.config.getComponentRegister().getComp(current.name);
			const data = fn();
			// 这里不可能拿不到组件，因为点击的那个组件已经渲染出来了
			if (data) {
				const renderList = data.props[type];
				if (renderList) {
					return renderList.map((v, i) => {
						const Component = props.config.getFormRegister().formMap[v.type];
						if (!Component) {
							console.error(`you might forgot to regist form component ${v.type}`);
							return null;
						}
						return (
							<Component
								key={i}
								data={v as CreateOptionsRes<any, any>}
								current={current}
								config={props.config}
							></Component>
						);
					});
				} else {
					return <div>{replaceLocale('right.noprops', '还没有配置属性', props.config)}</div>;
				}
			}
			return null;
		};
	}, [props.config]);

	const initColor = useMemo(() => {
		return props.config.getStoreChanger().isEdit()
			? rgba2Obj(props.config.getStoreChanger().getOrigin()?.now.globalState.containerColor)
			: rgba2Obj(props.config.getStore().getData().globalState.containerColor);
	}, [props.config]);
	const initColor2 = useMemo(() => {
		return props.config.getStoreChanger().isEdit()
			? rgba2Obj(props.config.getStoreChanger().getOrigin()?.now.globalState.bodyColor)
			: rgba2Obj(props.config.getStore().getData().globalState.bodyColor);
	}, [props.config]);
	const initTitle = useMemo(() => {
		const title = props.config.getStoreChanger().isEdit()
			? props.config.getStoreChanger().getOrigin()?.now.globalState.title
			: props.config.getStore().getData().globalState.title;
		return title;
	}, [props.config]);
	const [title, setTitle] = useState(initTitle);

	const customGlobal = props.config.getConfig().rightGlobalCustom;
	const isEdit = props.config.getStoreChanger().isEdit();
	const modalName = props.config.getStoreChanger().getState().modalEditName;
	const originData = props.config.getStoreChanger().getOrigin()?.now;
	return (
		<div
			className="ant-menu right-pannel-wrap"
			style={{
				height: '100%',
				width: '400px',
				overflow: 'auto',
				padding: '0 10px',
				lineHeight: 1.5715,
			}}
		>
			{current && (
				<Tabs
					activeKey={menuSelect}
					style={{ width: '100%' }}
					onChange={(e) => {
						setMenuSelect(e);
					}}
				>
					{rightMapRenderListCategory.map((v, i) => {
						return (
							<Tabs.TabPane tab={v.icon} key={i + ''}>
								<div
									className="scrollbar right-pannel-tabdiv"
									style={{
										height: 'calc(100vh - 110px)',
										overflow: 'auto',
										position: 'fixed',
										width: 380,
									}}
								>
									{v.custom && v.customRender && v.customRender(v.type, current)}
									{!v.custom && render(v.type, current)}
								</div>
							</Tabs.TabPane>
						);
					})}
				</Tabs>
			)}
			{!current && !isEdit && !customGlobal && (
				<div style={{ padding: '10px' }}>
					<Row style={{ padding: '10px 0 20px 0', fontWeight: 'bold', userSelect: 'none' }}>
						{replaceLocale('right.global', '全局设置', props.config)}
					</Row>
					<Row style={{ padding: '10px 0' }}>
						<Col span={6} style={{ userSelect: 'none' }}>
							{replaceLocale('title', '标题', props.config)}
						</Col>
						<Col span={18} style={colStyle}>
							<Input
								value={title}
								onChange={(e) => {
									const val = e.target.value;
									setTitle(val);
									const isEdit = props.config.getStoreChanger().isEdit();
									if (isEdit) {
										const originData: IStoreData = deepcopy(
											props.config.getStoreChanger().getOrigin()!.now
										);
										originData.globalState.title = val;
										props.config.getStoreChanger().updateOrigin(originData);
									} else {
										const originData = deepcopy(props.config.getStore().getData());
										originData.globalState.title = val;
										props.config.getStore().setData(originData);
									}
								}}
							/>
						</Col>
					</Row>
					<Row style={{ padding: '10px 0' }}>
						<Col span={6} style={{ userSelect: 'none' }}>
							{replaceLocale('right.containerheight', '容器高度', props.config)}
						</Col>
						<Col span={18} style={colStyle}>
							<InputNumber
								min={0}
								value={props.config.getStore().getData().container.height}
								onChange={(e) => {
									const val = e;
									const isEdit = props.config.getStoreChanger().isEdit();
									if (isEdit) {
										const originData: IStoreData = deepcopy(
											props.config.getStoreChanger().getOrigin()!.now
										);
										originData.container.height = val;
										props.config.getStoreChanger().updateOrigin(originData);
									} else {
										const originData = deepcopy(props.config.getStore().getData());
										originData.container.height = val;
										props.config.getStore().setData(originData);
									}
								}}
							/>
						</Col>
					</Row>
					<Row style={{ padding: '10px 0' }}>
						<Col span={6} style={{ userSelect: 'none' }}>
							{replaceLocale('right.containerColor', '容器底色', props.config)}
						</Col>
						<Col span={18} style={colStyle}>
							<ColorPicker
								initColor={initColor}
								onChange={(newcolor) => {
									const isEdit = props.config.getStoreChanger().isEdit();
									if (isEdit) {
										const originData: IStoreData = deepcopy(
											props.config.getStoreChanger().getOrigin()!.now
										);
										originData.globalState.containerColor = `rgba(${newcolor.r}, ${newcolor.g}, ${newcolor.b}, ${newcolor.a})`;
										props.config.getStoreChanger().updateOrigin(originData);
									} else {
										const originData = deepcopy(props.config.getStore().getData());
										originData.globalState.containerColor = `rgba(${newcolor.r}, ${newcolor.g}, ${newcolor.b}, ${newcolor.a})`;
										props.config.getStore().setData(originData);
									}
								}}
							></ColorPicker>
						</Col>
					</Row>
					<Row style={{ padding: '10px 0' }}>
						<Col span={6} style={{ userSelect: 'none' }}>
							{replaceLocale('right.bodyColor', 'body底色', props.config)}
						</Col>
						<Col span={18} style={colStyle}>
							<ColorPicker
								initColor={initColor2}
								onChange={(newcolor) => {
									const isEdit = props.config.getStoreChanger().isEdit();
									if (isEdit) {
										const originData: IStoreData = deepcopy(
											props.config.getStoreChanger().getOrigin()!.now
										);
										originData.globalState.bodyColor = `rgba(${newcolor.r}, ${newcolor.g}, ${newcolor.b}, ${newcolor.a})`;
										props.config.getStoreChanger().updateOrigin(originData);
									} else {
										const originData = deepcopy(props.config.getStore().getData());
										originData.globalState.bodyColor = `rgba(${newcolor.r}, ${newcolor.g}, ${newcolor.b}, ${newcolor.a})`;
										props.config.getStore().setData(originData);
									}
								}}
							></ColorPicker>
						</Col>
					</Row>
				</div>
			)}
			{!current && !isEdit && customGlobal && customGlobal(props.config)}
			{!current && isEdit && (
				<div style={{ padding: '10px' }} className="yh-tcsz">
					<Row style={{ padding: '10px 0 20px 0', fontWeight: 'bold' }}>
						{replaceLocale('modal.control', '弹窗配置', props.config)}
					</Row>
					<Row style={{ padding: '10px 0' }}>
						<Col span={8}>
							{replaceLocale('modal.control.remove', '取消点击删除弹窗', props.config)}
						</Col>
						<Col span={16} style={{ ...colStyle }}>
							<Checkbox
								checked={originData ? originData.modalConfig[modalName] : false}
								onChange={(e) => {
									const val = e.target.checked;
									const cloneData = deepcopy(originData);
									if (cloneData) {
										cloneData.modalConfig[modalName] = val;
										props.config.getStoreChanger().updateOrigin(cloneData);
										props.config.getStore().forceUpdate();
									}
								}}
							></Checkbox>
						</Col>
					</Row>
				</div>
			)}
		</div>
	);
}
export default RightConfig;
