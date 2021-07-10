import React, { useMemo, useState } from 'react';
import { UserConfig, deepCopy } from 'dooringx-lib';
import { Col, Row, Select, InputNumber } from 'antd';
import { FormMap, FormBaseType } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';

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
	animate__slideOutUp: 'slideOutUp',
};

const animateRepeat: Record<string, string> = {
	'': '无',
	'1': '1次',
	'2': '2次',
	'3': '3次',
	'4': '4次',
	infinite: '无限',
};

const animateSpeed: Record<string, string> = {
	'': '普通',
	animate__slow: '特慢',
	animate__slower: '慢速',
	animate__fast: '快速',
	animate__faster: '特快',
};

let lastAnimate = '';
/**
 *
 * 这个控制组件配置项写死，只可能出现或者不出现
 * @return {*}
 */
function AnimateControl(props: AnimateControlProps) {
	const [count, setCount] = useState<number | null>(null);
	const [sign, setSign] = useState(false);
	const v1 = useMemo(() => {
		if (sign) {
			return lastAnimate;
		} else {
			const val = props.current.animate.animate
				? animateCategory[props.current.animate.animate]
				: '';
			lastAnimate = val;
			return val;
		}
	}, [props.current.animate.animate, sign]);

	const v2 = useMemo(() => {
		if (typeof props.current.animate.animationIterationCount === 'number') {
			setCount(props.current.animate.animationIterationCount);
			return '';
		} else {
			setCount(null);
			return props.current.animate.animationIterationCount
				? animateRepeat[props.current.animate.animationIterationCount]
				: '';
		}
	}, [props.current.animate.animationIterationCount]);

	const v3 = useMemo(() => {
		return animateSpeed[props.current.animate.speed ?? ''];
	}, [props.current.animate.speed]);

	const changeAnimation = (
		e: any,
		props: AnimateControlProps,
		type: 'animate' | 'animationIterationCount' | 'speed'
	) => {
		if (type === 'animationIterationCount') {
			setCount(null);
		}

		const clonedata = deepCopy(props.config.getStore().getData());
		const newblock = clonedata.block.map((v: IBlockType) => {
			if (v.id === props.current.id) {
				if (type === 'animationIterationCount') {
					v.animate[type] = Number(e);
				}
				v.animate[type] = e;
			}
			return v;
		});
		const [item] = clonedata.block.filter((item: IBlockType) => item.id === props.current.id);
		if (item?.animate?.animate) {
			const cloneNewBlock = deepCopy(newblock);
			const temporaryBlock = cloneNewBlock.map((item: IBlockType) => {
				if (item.id === props.current.id) {
					delete item.animate.animate;
				}
				return item;
			});
			setSign(true);
			// 若有动画属性则删除动画属性再将动画属性添加
			props.config.getStore().setData({ ...clonedata, block: [...temporaryBlock] });
		}
		setTimeout(() => {
			props.config.getStore().setData({ ...clonedata, block: [...newblock] });
			setSign(false);
		});
	};
	return (
		<>
			<Row style={{ padding: '20px' }}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					动画种类
				</Col>
				<Col span={18}>
					<Select
						value={v1}
						onChange={(e) => changeAnimation(e, props, 'animate')}
						style={{ width: '100%' }}
					>
						{Object.keys(animateCategory).map((v) => {
							return (
								<Select.Option value={v} key={v}>
									{animateCategory[v]}
								</Select.Option>
							);
						})}
					</Select>
				</Col>
			</Row>
			<Row style={{ padding: '20px' }}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					频率
				</Col>
				<Col span={18} style={{ display: 'flex', justifyContent: 'space-between' }}>
					<InputNumber
						min={1}
						value={count as number}
						onChange={(value) => {
							setCount(value);
							const clonedata = deepCopy(props.config.getStore().getData());
							const newblock = clonedata.block.map((v: IBlockType) => {
								if (v.id === props.current.id) {
									v.animate.animationIterationCount = value;
								}
								return v;
							});

							const [item] = clonedata.block.filter(
								(item: IBlockType) => item.id === props.current.id
							);

							if (item?.animate?.animate) {
								const cloneNewBlock = deepCopy(newblock);
								const temporaryBlock = cloneNewBlock.map((item: IBlockType) => {
									if (item.id === props.current.id) {
										delete item.animate.animate;
									}
									return item;
								});
								setSign(true);
								props.config.getStore().setData({ ...clonedata, block: [...temporaryBlock] });
							}
							setTimeout(() => {
								props.config.getStore().setData({ ...clonedata, block: [...newblock] });
								setSign(false);
							});
						}}
					></InputNumber>
					<Select
						value={v2}
						onChange={(e) => changeAnimation(e, props, 'animationIterationCount')}
						style={{ width: '60%' }}
					>
						{Object.keys(animateRepeat).map((v) => {
							return (
								<Select.Option value={v} key={v}>
									{animateRepeat[v]}
								</Select.Option>
							);
						})}
					</Select>
				</Col>
			</Row>
			<Row style={{ padding: '20px' }}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					动画速度
				</Col>
				<Col span={18}>
					<Select
						value={v3}
						onChange={(e: any) => changeAnimation(e, props, 'speed')}
						style={{ width: '100%' }}
					>
						{Object.keys(animateSpeed).map((v) => {
							return (
								<Select.Option value={v} key={v}>
									{animateSpeed[v]}
								</Select.Option>
							);
						})}
					</Select>
				</Col>
			</Row>
		</>
	);
}

export default AnimateControl;
