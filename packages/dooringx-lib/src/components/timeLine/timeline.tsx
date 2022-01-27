/*
 * @Author: yehuozhili
 * @Date: 2021-08-09 15:15:25
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-12 17:44:22
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\timeLine\timeline.tsx
 */
import deepcopy from 'deepcopy';
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle, SortEnd } from 'react-sortable-hoc';
import UserConfig from '../../config';
import { IBlockType, IStoreData } from '../../core/store/storetype';
import { arrayMove } from '../../core/utils';
import {
	DeleteOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	MenuOutlined,
	PlayCircleOutlined,
} from '@ant-design/icons';
import {
	TimeLineItem,
	itemHeight,
	TimeLineItemMouseMove,
	TimeLineItemMouseOver,
	interval,
	iter,
} from './timelineItem';
import { specialCoList } from '../../core/utils/special';
import { replaceLocale } from '../../locale';
import { Popconfirm } from 'antd';

export interface TimeLineProps {
	style?: CSSProperties;
	classes?: string;
	config: UserConfig;
}
export interface TimeLineConfigType {
	autoFocus: boolean;
	scrollDom: null | HTMLDivElement;
}
export interface TimeLineNeedleConfigType {
	status: 'stop' | 'start' | 'pause';
	runFunc: Function;
	resetFunc: Function;
	current: number;
}

const animateTicker = new Array(iter).fill(1).map((_, y) => y);

const DragHandle = SortableHandle(() => <MenuOutlined />);

const leftWidth = 200;
let WAIT = false;
const widthInterval = interval * 10 + 9;
const ruleWidth = (widthInterval * iter) / 10 + 10;
const borderColor = '1px solid rgb(204, 204, 204)';

const SortableItem = SortableElement(
	({
		value,
	}: {
		value: {
			value: IBlockType;
			config: UserConfig;
		};
	}) => (
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
				className="yh-timeline-item"
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
					backgroundColor: value.value.focus ? '#76767680' : 'initial',
					cursor: 'pointer',
				}}
			>
				<div style={{ width: 30, cursor: 'move' }}>
					<DragHandle></DragHandle>
				</div>
				<div>{value.config.getComponentRegister().getMap()[value.value.name].display}</div>
				<div>{value.value.id.slice(-6)}</div>
				<div style={{ marginLeft: 5, flex: 1, textAlign: 'right', paddingRight: 5 }}>
					<span
						style={{ marginRight: 5 }}
						onClick={() => {
							const store = value.config.getStore();
							const clone = deepcopy(store.getData());
							clone.block = clone.block.map((v) => {
								if (v.id === value.value.id && !specialCoList.includes(value.value.name)) {
									v.canSee = !v.canSee;
									return v;
								}
								return v;
							});
							store.setData(clone);
						}}
					>
						{value.value.canSee ? <EyeOutlined /> : <EyeInvisibleOutlined />}
					</span>
					<Popconfirm
						title={replaceLocale('control.popup.delete', '确认删除么', value.config)}
						onConfirm={() => {
							const store = value.config.getStore();
							const clone = deepcopy(store.getData());
							clone.block = clone.block.filter((v) => {
								return !(v.id === value.value.id && !specialCoList.includes(value.value.name));
							});
							store.setData(clone);
						}}
						okText={replaceLocale('yes', '确定', value.config)}
						cancelText={replaceLocale('no', '取消', value.config)}
					>
						<DeleteOutlined />
					</Popconfirm>
				</div>
			</div>
		</div>
	)
);

const SortableList = SortableContainer(
	({
		items,
	}: {
		items: {
			data: IBlockType[];
			config: UserConfig;
		};
	}) => {
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

// const needleWidth = 2;
// const initialLeft = 20 - needleWidth / 2;
// let timer: number | null = null;
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

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) {
			props.config.timelineConfig.scrollDom = ref.current;
		}
	}, [props.config]);

	// const [needle, setNeedle] = useState(initialLeft);

	//const needleStart = () => {
	// props.config.timelineNeedleConfig.current = 0;
	// setNeedle(initialLeft);
	// //每过0.1秒移动2
	// if (timer) {
	// 	window.clearInterval(timer);
	// }
	// props.config.timelineNeedleConfig.status = 'start';
	// const cloneData: IStoreData = deepcopy(store.getData());
	// store.setData(cloneData);
	// store.cleanLast();
	// timer = window.setInterval(() => {
	// 	if (needle < ruleWidth) {
	// 		setNeedle((pre) => {
	// 			props.config.timelineNeedleConfig.current = (pre - initialLeft) / 20;
	// 			console.log(props.config.timelineNeedleConfig.current);
	// 			return pre + 2;
	// 		});
	// 	}
	// }, 100);
	//	};

	// const needlePlay = async () => {
	// 	if (timer) {
	// 		window.clearInterval(timer);
	// 	}
	// 	await resetAnimate();
	// 	setTimeout(() => {
	// 		props.config.timelineNeedleConfig.status = 'pause';
	// 		timer = window.setInterval(() => {
	// 			if (needle < ruleWidth) {
	// 				setNeedle((pre) => {
	// 					props.config.timelineNeedleConfig.current = (pre - initialLeft) / 20;
	// 					return pre + 2;
	// 				});
	// 			}
	// 		}, 100);
	// 	});
	// };

	// const needleReset = () => {
	// 	if (timer) {
	// 		window.clearInterval(timer);
	// 	}
	// 	props.config.timelineNeedleConfig.status = 'pause';
	// 	props.config.timelineNeedleConfig.current = 0;
	// 	resetAnimate();
	// 	setNeedle(initialLeft);
	// 	store.cleanLast();
	// };

	// const needlePause = () => {
	// 	props.config.timelineNeedleConfig.status = 'pause';
	// 	if (timer) {
	// 		window.clearInterval(timer);
	// 	}
	// 	const cloneData: IStoreData = deepcopy(store.getData());
	// 	store.setData(cloneData);
	// 	store.cleanLast();
	// };

	// props.config.timelineNeedleConfig.resetFunc = needleReset;
	// props.config.timelineNeedleConfig.runFunc = needleStart;

	return (
		<div
			className={`${props.classes} ant-menu yh-timeline-wrap`}
			style={{
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
								display: 'flex',
							}}
						>
							{replaceLocale('timeline.name', '组件名称', props.config)}
							<div
								style={{
									flex: 1,
									textAlign: 'right',
								}}
							>
								{/* <span
									style={{
										display: 'inline-block',
										cursor: 'pointer',
										marginRight: '10px',
									}}
								>
									<ReloadOutlined onClick={() => needleReset()} />
								</span>
								<span
									style={{
										display: 'inline-block',
										cursor: 'pointer',
										marginRight: '10px',
									}}
								>
									<PauseCircleOutlined onClick={() => needlePause()} />
								</span> */}
								<span
									title="play"
									style={{
										display: 'inline-block',
										marginRight: '20px',
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
												store.cleanLast();
											});
										}
									}}
								>
									<PlayCircleOutlined />
								</span>
							</div>
						</div>
						{content}
					</div>

					<div
						style={{
							width: `calc(100% -  ${leftWidth}px)`,
							borderBottom: '1px solid #dadada',
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{/* <div
							style={{
								position: 'absolute',
								transform: `translate(-${scrollx}px, 0px)`,
								width: needleWidth,
								height: '100%',
								backgroundColor: 'red',
								zIndex: 2,
								left: needle,
								transition: 'left linear',
								willChange: 'left',
							}}
						></div> */}
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
							ref={ref}
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
