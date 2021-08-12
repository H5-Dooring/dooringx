/*
 * @Author: yehuozhili
 * @Date: 2021-02-04 10:32:45
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 17:12:35
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\leftConfig.tsx
 */
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Input, Menu } from 'antd';
import { dragEventResolve, LeftRegistComponentMapItem } from '../core/crossDrag';
import UserConfig from '../config';
import { DoubleLeftOutlined, DoubleRightOutlined, SearchOutlined } from '@ant-design/icons';

import styles from '../index.less';

declare type modeType = 'horizontal' | 'vertical';
interface LeftConfigProps {
	config: UserConfig;
	showName?: Boolean;
	footerConfig?: ReactNode;
	mode?: modeType | undefined;
}

/**
 *
 * 注册加载左侧组件方法，由于异步拉取，所以要异步加载
 * 不同tab页可以使用不同type区分
 * @param {*} props -LeftConfigProps options可选项：showName:是否显示displayName; mode:'horizontal' | 'vertical' icon与文案展示方向 ;footerConfig:底部功能配置ReactNode类型；
 * @returns
 */
function LeftConfig(props: LeftConfigProps) {
	const [menuSelect, setMenuSelect] = useState('0');
	const [leftRender, setLeftRender] = useState<ReactNode | null>(null);
	const leftMapRenderListCategory = useMemo(() => {
		return props.config.getConfig().leftRenderListCategory;
	}, [props.config]);

	const [search, setSearch] = useState('');

	useEffect(() => {
		let cache: LeftRegistComponentMapItem[] = [];
		const type = leftMapRenderListCategory[parseInt(menuSelect, 10)]?.type;
		const isCustom = leftMapRenderListCategory[parseInt(menuSelect, 10)]?.custom;
		if (!isCustom) {
			const config = props.config.getConfig();
			cache = config.leftAllRegistMap.filter((k) => k.type === type);
			cache.forEach((v) => props.config.asyncRegistComponent(v.component));
			setLeftRender(
				<div className={`${styles.leftco} yh-leftcomp`}>
					<div
						className="yh-left-top-wrapper"
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
						}}
					>
						<div
							style={{
								width: 120,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								height: 32,
								lineHeight: '32px',
								marginRight: '10px',
								fontSize: '14px',
								fontFamily: 'PingFangSC-Medium, PingFang SC',
								fontWeight: 600,
								userSelect: 'none',
							}}
						>
							{leftMapRenderListCategory[parseInt(menuSelect, 10)].displayName}
						</div>
						<Input
							className="yh-left-top-input"
							style={{
								borderRadius: '40px',
							}}
							allowClear
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							prefix={<SearchOutlined />}
						/>
					</div>
					{search &&
						search !== '' &&
						cache
							.reduce<LeftRegistComponentMapItem[]>((prev, next) => {
								//筛选搜索条件，name或者displayName存在即显示
								if (next.displayName.includes(search) || next.component.includes(search)) {
									prev.push(next);
								}
								return prev;
							}, [])
							.map((v, index) => (
								<div
									className={`${styles.coitem} yh-left-item-wrap`}
									key={index}
									{...dragEventResolve(v)}
								>
									<div className={`${styles.redbox} yh-left-item-img-wrap`}>
										{v.imgCustom ? v.imgCustom : <img src={v.img} alt="component"></img>}
									</div>

									<div
										style={{
											textAlign: 'center',
											lineHeight: '20px',
											height: '20px',
											overflow: 'hidden',
										}}
									>
										{v.displayName}
									</div>
								</div>
							))}
					{(!search || search === '') &&
						cache.map((v, index) => (
							<div
								className={`${styles.coitem} yh-left-item-wrap`}
								key={index}
								{...dragEventResolve(v)}
							>
								<div className={`${styles.redbox} yh-left-item-img-wrap`}>
									{v.imgCustom ? v.imgCustom : <img src={v.img} alt="component"></img>}
								</div>
								<div
									style={{
										textAlign: 'center',
										lineHeight: '20px',
										height: '20px',
										overflow: 'hidden',
									}}
								>
									{v.displayName}
								</div>
							</div>
						))}
				</div>
			);
		} else {
			const render = leftMapRenderListCategory[parseInt(menuSelect, 10)]?.customRender;
			setLeftRender(<div className={styles.leftco}>{render}</div>);
		}
	}, [menuSelect, props.config, leftMapRenderListCategory, search]);

	const [isCollapse, setCollapse] = useState(props.config.getCollapse());
	const [renderCollapse, setRenderCollaspe] = useState(props.config.getCollapse());

	return (
		<div style={{ display: 'flex', height: '100%' }}>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Menu style={{ flex: 1 }} defaultSelectedKeys={[menuSelect]} mode="vertical">
					{leftMapRenderListCategory.map((v, i) => {
						return (
							<Menu.Item
								key={i}
								onClick={() => setMenuSelect(i + '')}
								icon={v.icon}
								className={props.mode === 'vertical' ? `${styles.menuStyle}` : ''}
							>
								{props.showName && v.displayName}
							</Menu.Item>
						);
					})}
				</Menu>
				<div className={`${styles.menu_footer}`}>{props.footerConfig}</div>
				<Menu selectedKeys={[]}>
					<Menu.Item
						key="1"
						onClick={() =>
							setCollapse((pre) => {
								if (pre) {
									setTimeout(() => {
										props.config.collapsed = false;
										setRenderCollaspe(false);
										props.config.getStore().forceUpdate();
									}, 300);
									return !pre;
								} else {
									props.config.collapsed = true;
									setRenderCollaspe(true);
									props.config.getStore().forceUpdate();
									return !pre;
								}
							})
						}
						className={styles.menu_footer}
						icon={isCollapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
					></Menu.Item>
				</Menu>
			</div>
			<div
				className={`${styles.yhLeftrender} ant-menu scrollbar`}
				style={{
					width: isCollapse ? 0 : 270,
					paddingRight: isCollapse ? 0 : 7, // 这个是滚动条宽度
					overflowX: 'hidden',
				}}
			>
				{!renderCollapse && leftRender}
			</div>
		</div>
	);
}

export default LeftConfig;
