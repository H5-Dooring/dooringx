import { containerDragResolve } from '../core/crossDrag';
import { containerFocusRemove } from '../core/focusHandler';
import { innerContainerDrag } from '../core/innerDrag';
import { NormalMarkLineRender } from '../core/markline';
import { IStoreData } from '../core/store/storetype';
import { wrapperMoveState } from './wrapperMove/event';
import { CSSProperties, PropsWithChildren, useMemo } from 'react';
import Blocks from './blocks';
import { containerResizer } from '../core/resizeHandler/containerResizer';
import React from 'react';
import UserConfig from '../config';
import styles from '../index.less';
import { getRealHeight } from '../core/transfer';
import { IconFont } from '../core/utils/icon';
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
		const isEdit = props.config.getStoreChanger().isEdit();
		if (isEdit) {
			return 'rgba(255,255,255,1)';
		} else {
			return props.state.globalState.containerColor;
		}
	};
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
									overflow: 'hidden',
									...editContainerStyle,
								}}
								{...(props.context === 'edit' ? containerDragResolve(props.config) : null)}
								{...(props.context === 'edit' ? innerContainerDrag(props.config) : null)}
								{...(props.context === 'edit' ? containerFocusRemove(props.config) : null)}
							>
								{props.context === 'edit' && (
									<NormalMarkLineRender config={props.config}></NormalMarkLineRender>
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
							<IconFont
								type="icon-suofang"
								onMouseDown={(e) => containerResizer.onMousedown(e, props.config)}
								style={{ fontSize: '20px', cursor: 's-resize' }}
							></IconFont>
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
