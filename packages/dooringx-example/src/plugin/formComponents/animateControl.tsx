import React, { useMemo, useState } from 'react';
import { UserConfig, deepCopy } from 'dooringx-lib';
import { Col, Row, Select, InputNumber, Button } from 'antd';
import { FormMap, FormBaseType } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { AnimateItem, IBlockType, IStoreData } from 'dooringx-lib/dist/core/store/storetype';

export interface FormAnimateControlType extends FormBaseType {}

interface AnimateControlProps {
	data: CreateOptionsRes<FormMap, 'animateControl'>;
	current: IBlockType;
	config: UserConfig;
}

//类型待修改
const animateCategory: Record<string, string> = {
	'': '无',
	animate__bounce: 'bounce',
	animate__flash: 'flash',
	animate__pulse: 'pulse',
	animate__rubberBand: 'rubberBand',
	animate__shakeX: 'shakeX',
	animate__shakeY: 'shakeY',
	animate__headShake: 'headShake',
	animate__swing: 'swing',
	animate__tada: 'tada',
	animate__wobble: 'wobble',
	animate__jello: 'jello',
	animate__heartBeat: 'heartBeat',
	animate__backInDown: 'backInDown',
	animate__backInLeft: 'backInLeft',
	animate__backInRight: 'backInRight',
	animate__backInUp: 'backInUp',
	animate__backOutDown: 'backOutDown',
	animate__backOutLeft: 'backOutLeft',
	animate__backOutRight: 'backOutRight',
	animate__backOutUp: 'backOutUp',
	animate__bounceIn: 'bounceIn',
	animate__bounceInDown: 'bounceInDown',
	animate__bounceInLeft: 'bounceInLeft',
	animate__bounceInRight: 'bounceInRight',
	animate__bounceInUp: 'bounceInUp',
	animate__bounceOut: 'bounceOut',
	animate__bounceOutDown: 'bounceOutDown',
	animate__bounceOutLeft: 'bounceOutLeft',
	animate__bounceOutRight: 'bounceOutRight',
	animate__bounceOutUp: 'bounceOutUp',
	animate__fadeIn: 'fadeIn',
	animate__fadeInDown: 'fadeInDown',
	animate__fadeInDownBig: 'fadeInDownBig',
	animate__fadeInLeft: 'fadeInLeft',
	animate__fadeInLeftBig: 'fadeInLeftBig',
	animate__fadeInRight: 'fadeInRight',
	animate__fadeInRightBig: 'fadeInRightBig',
	animate__fadeInUp: 'fadeInUp',
	animate__fadeInUpBig: 'fadeInUpBig',
	animate__fadeInTopLeft: 'fadeInTopLeft',
	animate__fadeInTopRight: 'fadeInTopRight',
	animate__fadeInBottomLeft: 'fadeInBottomLeft',
	animate__fadeInBottomRight: 'fadeInBottomRight',
	animate__fadeOut: 'fadeOut',
	animate__fadeOutDown: 'fadeOutDown',
	animate__fadeOutDownBig: 'fadeOutDownBig',
	animate__fadeOutLeft: 'fadeOutLeft',
	animate__fadeOutLeftBig: 'fadeOutLeftBig',
	animate__fadeOutRight: 'fadeOutRight',
	animate__fadeOutRightBig: 'fadeOutRightBig',
	animate__fadeOutUp: 'fadeOutUp',
	animate__fadeOutUpBig: 'fadeOutUpBig',
	animate__fadeOutTopLeft: 'fadeOutTopLeft',
	animate__fadeOutTopRight: 'fadeOutTopRight',
	animate__fadeOutBottomRight: 'fadeOutBottomRight',
	animate__fadeOutBottomLeft: 'fadeOutBottomLeft',
	animate__flip: 'flip',
	animate__flipInX: 'flipInX',
	animate__flipInY: 'flipInY',
	animate__flipOutX: 'flipOutX',
	animate__flipOutY: 'flipOutY',
	animate__lightSpeedInRight: 'lightSpeedInRight',
	animate__lightSpeedInLeft: 'lightSpeedInLeft',
	animate__lightSpeedOutRight: 'lightSpeedOutRight',
	animate__lightSpeedOutLeft: 'lightSpeedOutLeft',
	animate__rotateIn: 'rotateIn',
	animate__rotateInDownLeft: 'rotateInDownLeft',
	animate__rotateInDownRight: 'rotateInDownRight',
	animate__rotateInUpLeft: 'rotateInUpLeft',
	animate__rotateInUpRight: 'rotateInUpRight',
	animate__rotateOut: 'rotateOut',
	animate__rotateOutDownLeft: 'rotateOutDownLeft',
	animate__rotateOutDownRight: 'rotateOutDownRight',
	animate__rotateOutUpLeft: 'rotateOutUpLeft',
	animate__rotateOutUpRight: 'rotateOutUpRight',
	animate__hinge: 'hinge',
	animate__jackInTheBox: 'jackInTheBox',
	animate__rollIn: 'rollIn',
	animate__rollOut: 'rollOut',
	animate__zoomIn: 'zoomIn',
	animate__zoomInDown: 'zoomInDown',
	animate__zoomInLeft: 'zoomInLeft',
	animate__zoomInRight: 'zoomInRight',
	animate__zoomInUp: 'zoomInUp',
	animate__zoomOut: 'zoomOut',
	animate__zoomOutDown: 'zoomOutDown',
	animate__zoomOutLeft: 'zoomOutLeft',
	animate__zoomOutRight: 'zoomOutRight',
	animate__zoomOutUp: 'zoomOutUp',
	animate__slideInDown: 'slideInDown',
	animate__slideInLeft: 'slideInLeft',
	animate__slideInRight: 'slideInRight',
	animate__slideInUp: 'slideInUp',
	animate__slideOutDown: 'slideOutDown',
	animate__slideOutLeft: 'slideOutLeft',
	animate__slideOutRight: 'slideOutRight',
};

const duration = ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s'];

const delay = ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s'];

const repeat = ['1', '2', '3', '4', '5', 'infinite'];

const timeFunction = {
	平滑: 'linear',
	缓入: 'ease in',
};

function AnimateControl(props: AnimateControlProps) {
	const animate = props.current.animate;
	const store = props.config.getStore();
	return (
		<>
			{animate.map((v, i) => {
				return (
					<div key={props.current.id + i}>
						<Row style={{ padding: '20px', alignItems: 'center' }}>
							<Col span={3}>动画:</Col>
							<Col span={8}>
								<Select style={{ width: '80%' }}>
									{Object.keys(animateCategory).map((v, i) => {
										return (
											<Select.Option key={i} value={animateCategory[v]}>
												{animateCategory[v]}
											</Select.Option>
										);
									})}
								</Select>
							</Col>
							<Col span={5}>持续时间:</Col>
							<Col span={8}>
								<Select style={{ width: '100%' }}>
									{duration.map((v, i) => {
										return (
											<Select.Option key={i} value={v}>
												{v}
											</Select.Option>
										);
									})}
								</Select>
							</Col>
						</Row>
						<Row style={{ padding: '20px', alignItems: 'center' }}>
							<Col span={3}>延迟:</Col>
							<Col span={8}>
								<Select style={{ width: '80%' }}>
									{delay.map((v, i) => {
										return (
											<Select.Option key={i} value={v}>
												{v}
											</Select.Option>
										);
									})}
								</Select>
							</Col>
							<Col span={5}>重复次数:</Col>
							<Col span={8}>
								<Select style={{ width: '100%' }}>
									{repeat.map((v, i) => {
										return (
											<Select.Option key={i} value={v}>
												{v}
											</Select.Option>
										);
									})}
								</Select>
							</Col>
						</Row>
						<Row style={{ padding: '20px' }}>
							<Col span={3}>延迟:</Col>
							<Col span={8}>
								<Select style={{ width: '80%' }}>
									{delay.map((v, i) => {
										return (
											<Select.Option key={i} value={v}>
												{v}
											</Select.Option>
										);
									})}
								</Select>
							</Col>
							<Col span={8} style={{ justifyContent: 'flex-end' }}>
								<Button
									danger
									onClick={() => {
										const cloneData: IStoreData = deepCopy(store.getData());
										cloneData.block.map((v) => {
											if (v.id === props.current.id) {
												v.animate.splice(i, 1);
											}
										});
										store.setData(cloneData);
									}}
								>
									删除
								</Button>
							</Col>
						</Row>
					</div>
				);
			})}

			<Row style={{ padding: '20px', justifyContent: 'center' }}>
				<Button
					onClick={() => {
						const cloneData: IStoreData = deepCopy(store.getData());
						const newItem: AnimateItem = {
							animationName: '',
							animationDelay: '0s',
							animationDuration: '1s',
							animationTimingFunction: 'linear',
							animationIterationCount: 1,
						};
						cloneData.block.map((v) => {
							if (v.id === props.current.id) {
								v.animate.push(newItem);
							}
						});
						store.setData(cloneData);
					}}
				>
					添加动画
				</Button>
			</Row>
		</>
	);
}

export default AnimateControl;
