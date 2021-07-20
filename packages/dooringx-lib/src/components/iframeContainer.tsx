/*
 * @Author: yehuozhili
 * @Date: 2021-07-17 10:08:08
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-20 16:26:24
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\iframeContainer.tsx
 */
import { containerDragResolve } from '../core/crossDrag';
import { containerFocusRemove } from '../core/focusHandler';
import { innerContainerDrag } from '../core/innerDrag';
import { NormalMarkLineRender } from '../core/markline';
import { IStoreData } from '../core/store/storetype';
import { wrapperMoveState } from './IframeWrapperMove/event';
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Blocks from './blocks';
import React from 'react';
import UserConfig, { defaultStore } from '../config';
import styles from '../index.less';
import { getRealHeight } from '../core/transfer';
import { WrapperMoveStateProps } from './IframeWrapperMove/event';
import { onWheelEventIframe } from '../core/scale';
interface ContainerProps {
	context: 'edit' | 'preview';
	config: UserConfig;
	editContainerStyle?: CSSProperties;
	previewContainerStyle?: CSSProperties;
}
interface IframeInnerState {
	store: IStoreData;
	scaleState: {
		value: number;
		maxValue: number;
		minValue: number;
	};
	isEdit: boolean;
	origin: null | IStoreData[];
	wrapperState: {
		data: any;
		iframe: WrapperMoveStateProps;
	};
}

function Container(props: PropsWithChildren<ContainerProps>) {
	const { editContainerStyle, previewContainerStyle } = props;

	const [message, setMessage] = useState<IframeInnerState>({
		store: defaultStore,
		scaleState: {
			value: 0,
			maxValue: 0,
			minValue: 0,
		},
		isEdit: false,
		wrapperState: props.config.getWrapperMove(),
		origin: null,
	});

	const state = message.store;
	const scaleState = message.scaleState;
	const isEdit = message.isEdit;

	const bgColor = () => {
		if (isEdit) {
			return 'rgba(255,255,255,1)';
		} else {
			return state.globalState.containerColor;
		}
	};

	const transform = useMemo(() => {
		if (props.context === 'edit') {
			return `scale(${scaleState.value}) translate(${wrapperMoveState.needX}px, ${wrapperMoveState.needY}px)`;
		} else {
			return undefined;
		}
	}, [props.context, scaleState.value]);

	useEffect(() => {
		const fn = (e: any) => {
			if (typeof e.data !== 'object') {
				return;
			}
			if (!e.data.store) {
				// 后续通信待定
				return;
			}

			const data: IframeInnerState = e.data;

			setMessage(data);
			props.config.resetData([data.store]);
			props.config.scaleState = data.scaleState;
		};
		window.addEventListener('message', fn);
		window.parent.postMessage('ready', '*');
		return () => {
			window.removeEventListener('message', fn);
		};
	}, [props.config]);

	return (
		<>
			{props.context === 'edit' && (
				<>
					<div
						style={{
							display: 'flex',
							transform: `scale(${scaleState.value})`,
							transformOrigin: 'left top',
							position: 'absolute',
						}}
						{...onWheelEventIframe(props.config, scaleState)}
					>
						<div
							id="yh-container"
							className={styles.yh_container}
							style={{
								height: `${state.container.height}px`,
								width: `${state.container.width}px`,
								backgroundColor: bgColor(),
								position: 'relative',
								overflow: 'hidden',

								...editContainerStyle,
							}}
							{...(props.context === 'edit' ? containerDragResolve(props.config) : null)}
							{...(props.context === 'edit' ? innerContainerDrag(props.config) : null)}
							{...(props.context === 'edit' ? containerFocusRemove(props.config, true) : null)}
						>
							{props.context === 'edit' && (
								<NormalMarkLineRender config={props.config}></NormalMarkLineRender>
							)}
							{state.block.map((v) => {
								return (
									<Blocks
										config={props.config}
										key={v.id}
										data={v}
										context={props.context}
									></Blocks>
								);
							})}
						</div>
					</div>
				</>
			)}
			{props.context === 'preview' && (
				<div
					id="yh-container-preview"
					className={styles.yh_container_preview}
					style={{
						height: `${getRealHeight(state.container.height)}px`,
						width: `100%`,
						position: 'relative' as 'absolute' | 'relative',
						overflow: 'hidden',
						backgroundColor: bgColor(),
						transform: transform,
						...previewContainerStyle,
					}}
				>
					{state.block.map((v) => {
						return (
							<Blocks key={v.id} config={props.config} data={v} context={props.context}></Blocks>
						);
					})}
				</div>
			)}
		</>
	);
}
export default Container;
