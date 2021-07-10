/*
 * @Author: yehuozhili
 * @Date: 2021-02-04 10:32:45
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 15:47:34
 * @FilePath: \DooringV2\packages\dooringx-lib\src\components\leftConfig.tsx
 */
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Input, Menu } from 'antd';
import { dragEventResolve, LeftRegistComponentMapItem } from '../core/crossDrag';
import UserConfig from '../config';
import { DoubleLeftOutlined, DoubleRightOutlined, SearchOutlined } from '@ant-design/icons';

import styles from '../index.less';

interface LeftConfigProps {
	config: UserConfig;
}

/**
 *
 * 注册加载左侧组件方法，由于异步拉取，所以要异步加载
 * 不同tab页可以使用不同type区分
 * @param {*} props
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
								<div className={styles.coitem} key={index} {...dragEventResolve(v)}>
									<div className={styles.redbox}>
										{v.imgCustom ? v.imgCustom : <img src={v.img}></img>}
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
							<div className={styles.coitem} key={index} {...dragEventResolve(v)}>
								<div className={styles.redbox}>
									{v.imgCustom ? v.imgCustom : <img src={v.img}></img>}
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

	const [isCollapse, setCollapse] = useState(false);
	const [renderCollapse, setRenderCollaspe] = useState(false);

	return (
		<div style={{ display: 'flex', height: '100%' }}>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Menu style={{ flex: 1 }} defaultSelectedKeys={[menuSelect]} mode="vertical">
					{leftMapRenderListCategory.map((v, i) => {
						return (
							<Menu.Item key={i} onClick={() => setMenuSelect(i + '')} icon={v.icon}></Menu.Item>
						);
					})}
				</Menu>
				<Menu selectedKeys={[]}>
					<Menu.Item
						key="1"
						onClick={() =>
							setCollapse((pre) => {
								if (pre) {
									setTimeout(() => {
										setRenderCollaspe(false);
									}, 300);
									return !pre;
								} else {
									setRenderCollaspe(true);
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
