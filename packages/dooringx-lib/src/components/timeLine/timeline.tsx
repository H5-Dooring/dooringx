/*
 * @Author: yehuozhili
 * @Date: 2021-08-09 15:15:25
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-27 14:16:07
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\timeLine\timeline.tsx
 */
import deepcopy from 'deepcopy';
import React, { CSSProperties, useMemo, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle, SortEnd } from 'react-sortable-hoc';
import UserConfig from '../../config';
import { IBlockType, IStoreData } from '../../core/store/storetype';
import { arrayMove } from '../../core/utils';
import { MenuOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
	TimeLineItem,
	itemHeight,
	TimeLineItemMouseMove,
	TimeLineItemMouseOver,
	interval,
	iter,
} from './timelineItem';
import { specialCoList } from '../../core/utils/special';
import { FormattedMessage } from 'react-intl';

export interface TimeLineProps {
	style?: CSSProperties;
	classes?: string;
	config: UserConfig;
}

const animateTicker = new Array(iter).fill(1).map((_, y) => y);

const DragHandle = SortableHandle(() => <MenuOutlined />);

const leftWidth = 200;
let WAIT = false;

const widthInterval = interval * 10 + 9;
const ruleWidth = (widthInterval * iter) / 10 + 10;
const borderColor = '1px solid rgb(204, 204, 204)';

const SortableItem = SortableElement(
	({ value }: { value: { value: IBlockType; config: UserConfig } }) => (
		<div
			style={{
				userSelect: 'none',
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				zIndex: 101,
			}}
		>
			<div
				onClick={() => {
					const store = value.config.getStore();
					const clone = deepcopy(store.getData());
					clone.block.forEach((v) => {
						if (v.id === value.value.id && !specialCoList.includes(value.value.name)) {
							v.focus = true;
						} else {
							v.focus = false;
						}
					});
					store.setData(clone);
				}}
				style={{
					display: 'flex',
					alignItems: 'center',
					width: leftWidth,
					overflow: 'auto',
					minWidth: leftWidth,
					borderRight: borderColor,
					borderBottom: borderColor,
					backgroundColor: value.value.focus ? '#eeeeee' : 'initial',
					cursor: 'pointer',
				}}
			>
				<div style={{ width: 30, cursor: 'move' }}>
					<DragHandle></DragHandle>
				</div>
				<div>{value.config.getComponentRegister().getMap()[value.value.name].display}</div>
				<div>{value.value.id.slice(-6)}</div>
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

let cacheBlock: IBlockType[] = [];

export function TimeLine(props: TimeLineProps) {
	const store = props.config.getStore();
	const data = store.getData().block;
	const forceUpdate = useState(0)[1];
	const onSortEnd = (sort: SortEnd) => {
		const { oldIndex, newIndex } = sort;
		const newblocks: IBlockType[] = arrayMove(data, oldIndex, newIndex);
		const isEdit = props.config.getStoreChanger().isEdit();
		if (isEdit) {
			const firstType = newblocks[0].name;
			if (firstType !== 'modalMask') {
				return;
			}
		}
		const store = props.config.getStore();
		const cloneData: IStoreData = deepcopy(store.getData());
		cloneData.block = newblocks;
		store.setData(cloneData);
	};

	const [state, setState] = useState(0);
	const [scrollx, setScrollx] = useState(0);

	const content = (
		<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
			<div style={{ transform: `translate(0, -${state}px)` }}>
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
		</div>
	);

	const renderData = useMemo(() => {
		if (props.config.waitAnimate) {
			return cacheBlock;
		}
		cacheBlock = data;
		return cacheBlock;
	}, [data, props.config.waitAnimate]);

	return (
		<div
			className={props.classes}
			style={{
				backgroundColor: 'white',
				width: '100%',
				position: 'absolute',
				height: '150px',
				bottom: '0',
				zIndex: 100,
				display: 'flex',
				flexDirection: 'column',
				...props.style,
			}}
		>
			<>
				<div
					style={{
						display: 'flex',
						lineHeight: '24px',
						paddingLeft: 10,
						height: '100%',
					}}
				>
					<div>
						<div
							style={{
								width: leftWidth,
								borderRight: '1px solid #dadada',
								minWidth: leftWidth,
								borderBottom: '1px solid #dadada',
								height: itemHeight,
							}}
						>
							<FormattedMessage id="timeline.name" defaultMessage="组件名称"></FormattedMessage>
							<span
								title="play"
								style={{
									display: 'inline-block',
									marginLeft: '20px',
									cursor: 'pointer',
								}}
								onClick={() => {
									//缓存所有animate后执行
									if (!WAIT) {
										WAIT = true;
										props.config.waitAnimate = true;
										const cache = data.map((v) => {
											return v.animate;
										});
										const cloneData: IStoreData = deepcopy(store.getData());
										cloneData.block.forEach((v) => {
											v.animate = [];
										});
										store.setData(cloneData);
										setTimeout(() => {
											const cloneData: IStoreData = deepcopy(store.getData());
											cloneData.block.forEach((v, i) => {
												v.animate = cache[i];
											});
											WAIT = false;
											props.config.waitAnimate = false;
											store.setData(cloneData);
										});
									}
								}}
							>
								<PlayCircleOutlined />
							</span>
						</div>
						{content}
					</div>

					<div
						style={{
							width: `calc(100% -  ${leftWidth}px)`,
							borderBottom: '1px solid #dadada',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								display: 'flex',
								height: itemHeight,
								alignItems: 'flex-end',
								borderBottom: borderColor,
								width: ruleWidth,
								overflow: 'hidden',
								transform: `translate(-${scrollx}px, 0px)`,
							}}
						>
							{animateTicker.map((v) => {
								if (v % 10 === 0) {
									return (
										<div
											key={v}
											style={{
												marginLeft: interval,
												height: '8px',
												borderLeft: borderColor,
												position: 'relative',
											}}
										>
											<div
												style={{
													position: 'absolute',
													top: '-20px',
													transform: 'translate(-50%, 0px)',
												}}
											>
												{v}
											</div>
										</div>
									);
								} else {
									return (
										<div
											key={v}
											style={{
												marginLeft: interval,
												height: '6px',
												borderLeft: borderColor,
											}}
										></div>
									);
								}
							})}
						</div>
						<div
							onScroll={(e) => {
								const target = e.target as HTMLDivElement;
								setState(target.scrollTop);
								setScrollx(target.scrollLeft);
							}}
							style={{ overflow: 'auto', height: `calc(100% - ${itemHeight}px)` }}
						>
							{renderData.map((v) => {
								return (
									<div
										key={v.id}
										style={{
											display: 'flex',
											alignItems: 'center',
											paddingLeft: interval,
											borderBottom: borderColor,
											width: ruleWidth,
											position: 'relative',
											overflow: 'hidden',
										}}
										onMouseMove={(e) => {
											TimeLineItemMouseMove(e, v.animate, forceUpdate);
										}}
										onMouseLeave={() => TimeLineItemMouseOver()}
										onMouseUp={() => TimeLineItemMouseOver()}
									>
										<TimeLineItem animate={v.animate}></TimeLineItem>
										{animateTicker.map((v) => {
											if (v % 10 === 0) {
												return (
													<div
														key={v}
														style={{
															marginRight: widthInterval, // 左右2根线
															borderLeft: borderColor,
															position: 'relative',
															height: itemHeight - 1,
														}}
													></div>
												);
											} else {
												return null;
											}
										})}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</>
		</div>
	);
}

export default TimeLine;
