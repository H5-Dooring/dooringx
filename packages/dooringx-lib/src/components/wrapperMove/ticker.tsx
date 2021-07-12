/*
 * @Author: yehuozhili
 * @Date: 2021-07-12 15:54:35
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 19:21:35
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\wrapperMove\ticker.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import UserConfig from '../../config';

const width = '20px';
const indent = 50;

function Ticker(props: { config: UserConfig }) {
	const topRef = useRef<HTMLDivElement>(null);
	const leftRef = useRef<HTMLDivElement>(null);
	const [topRender, setTopRender] = useState(0);
	const [leftRender, setLeftRender] = useState(0);

	const scale = props.config.getScaleState().value;

	useEffect(() => {
		const timer = setTimeout(() => {
			if (topRef.current) {
				const width = topRef.current.getBoundingClientRect().width;
				const renderWidth = Math.ceil(width / 10 / scale);
				setTopRender(renderWidth);
			}
			// left可以不用放，但为了更新统一
			if (leftRef.current) {
				const height = leftRef.current.getBoundingClientRect().height;
				const renderHeight = Math.ceil(height / 10 / scale);
				setLeftRender(renderHeight);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [props.config, props.config.collapsed, scale]);

	return (
		<>
			<div
				ref={topRef}
				style={{
					position: 'absolute',
					top: 0,
					left: indent,
					width: '100%',
					height: width,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				{Array(topRender)
					.fill(1)
					.map((_, i) => {
						if (i % 10 === 0) {
							return (
								<div
									key={i}
									style={{
										background: 'rgb(204, 204, 204)',
										width: '1px',
										height: '12px',
										position: 'relative',
									}}
								>
									<div
										style={{
											position: 'absolute',
											top: '20px',
											fontSize: '10px',
											left: '-2px',
											userSelect: 'none',
										}}
									>
										{i}
									</div>
								</div>
							);
						} else {
							return (
								<div
									key={i}
									style={{ background: 'rgb(204, 204, 204)', width: '1px', height: '6px' }}
								></div>
							);
						}
					})}
			</div>
			<div
				ref={leftRef}
				style={{
					position: 'absolute',
					top: indent,
					left: 0,
					width: width,
					height: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: 'column',
				}}
			>
				{Array(leftRender)
					.fill(1)
					.map((_, i) => {
						if (i % 10 === 0) {
							return (
								<div
									key={i}
									style={{
										background: 'rgb(204, 204, 204)',
										width: '12px',
										height: '1px',
										position: 'relative',
									}}
								>
									<div
										style={{
											position: 'absolute',
											left: '20px',
											fontSize: '10px',
											top: '-2px',
											userSelect: 'none',
										}}
									>
										{i}
									</div>
								</div>
							);
						} else {
							return (
								<div
									key={i}
									style={{ background: 'rgb(204, 204, 204)', width: '6px', height: '1px' }}
								></div>
							);
						}
					})}
			</div>
		</>
	);
}

export default Ticker;
