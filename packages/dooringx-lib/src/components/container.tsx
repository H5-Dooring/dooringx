import { containerDragResolve } from '../core/crossDrag';
import { containerFocusRemove } from '../core/focusHandler';
import { innerContainerDrag } from '../core/innerDrag';
import { NormalMarkLineRender } from '../core/markline';
import { IStoreData } from '../core/store/storetype';
import { wrapperMoveState } from './wrapperMove/event';
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Blocks from './blocks';
import { containerResizer } from '../core/resizeHandler/containerResizer';
import React from 'react';
import UserConfig from '../config';
import styles from '../index.less';
import { getRealHeight } from '../core/transfer';
interface ContainerProps {
	state: IStoreData;
	context: 'edit' | 'preview';
	config: UserConfig;
	editContainerStyle?: CSSProperties;
	previewContainerStyle?: CSSProperties;
}
function Container(props: PropsWithChildren<ContainerProps>) {
	const { editContainerStyle, previewContainerStyle } = props;
	const scaleState = props.config.getScaleState();
	const transform = useMemo(() => {
		if (props.context === 'edit') {
			return `scale(${scaleState.value}) translate(${wrapperMoveState.needX}px, ${wrapperMoveState.needY}px)`;
		} else {
			return undefined;
		}
	}, [props.context, scaleState]);

	const bgColor = () => {
		const isEdit = props.config.getStore().isEdit();
		if (isEdit) {
			return 'rgba(255,255,255,1)';
		} else {
			return props.state.globalState.containerColor;
		}
	};
	const forceUpdate = useState(0)[1];
	props.config.containerForceUpdate = () => {
		forceUpdate((p) => p + 1);
	};

	useEffect(() => {
		if (props.context === 'preview') {
			props.config.onMounted();
			props.config.onMountedFn.forEach((v) => v());
		}
		return () => {
			if (props.context === 'preview') {
				props.config.destroyed();
				props.config.destroyedFn.forEach((v) => v());
			}
		};
	}, [props.config, props.context]);

	return (
		<>
			{props.context === 'edit' && (
				<>
					<div
						style={{
							position: 'absolute',
							height: `${props.state.container.height + 60}px`,
							width: `${props.state.container.width}px`,
							transform: `scale(${scaleState.value}) translate(${wrapperMoveState.needX}px, ${wrapperMoveState.needY}px)`,
						}}
					>
						<div style={{ display: 'flex' }}>
							<div
								id="yh-container"
								className={styles.yh_container}
								style={{
									height: `${props.state.container.height}px`,
									width: `${props.state.container.width}px`,
									backgroundColor: bgColor(),
									position: 'relative',
									overflow: props.config.containerOverFlow ? 'hidden' : 'visible',
									cursor: 'default',
									...editContainerStyle,
								}}
								{...(props.context === 'edit' ? containerDragResolve(props.config) : null)}
								{...(props.context === 'edit' ? innerContainerDrag(props.config) : null)}
								{...(props.context === 'edit' ? containerFocusRemove(props.config) : null)}
							>
								{props.context === 'edit' && (
									<NormalMarkLineRender config={props.config} iframe={false}></NormalMarkLineRender>
								)}
								{props.state.block.map((v) => {
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
						<div
							style={{
								height: '50px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: `${props.state.container.width}px`,
							}}
						>
							<div
								style={{ fontSize: '20px', cursor: 's-resize' }}
								onMouseDown={(e) => containerResizer.onMousedown(e, props.config)}
							>
								{props.config.getConfig().containerIcon}
							</div>
						</div>
					</div>
				</>
			)}
			{props.context === 'preview' && (
				<div
					id="yh-container-preview"
					className={styles.yh_container_preview}
					style={{
						height: `${getRealHeight(props.state.container.height)}px`,
						width: `100%`,
						position: 'relative' as 'absolute' | 'relative',
						overflow: 'hidden',
						backgroundColor: bgColor(),
						transform: transform,
						...previewContainerStyle,
					}}
				>
					{props.state.block.map((v) => {
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
