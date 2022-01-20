/*
 * @Author: yehuozhili
 * @Date: 2022-01-20 11:04:15
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-20 12:18:54
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\colorPicker\index.tsx
 */
import React, { memo, useState } from 'react';
import { RGBColor, SketchPicker } from 'react-color';

export interface ColorPickerProps {
	initColor: RGBColor;
	onChange: (v: RGBColor) => void;
}

function ColorPicker(props: ColorPickerProps) {
	const [color, setColor] = useState<RGBColor>(props.initColor);
	const [colorPickerVisible, setColorPickerVisible] = useState(false);
	return (
		<>
			<div style={{ position: 'relative' }}>
				<div
					onClick={() => {
						setColorPickerVisible((pre) => !pre);
					}}
					style={{
						background: '#fff',
						borderRadius: '1px',
						boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
						cursor: 'pointer',
						display: 'inline-block',
					}}
				>
					<div
						style={{
							width: '20px',
							height: '20px',
							borderRadius: '2px',
							background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
						}}
					/>
				</div>
				{colorPickerVisible && (
					<>
						<div
							style={{
								position: 'absolute',
								zIndex: 2000,
								transform: `translate(-100%, 0px)`,
							}}
						>
							<SketchPicker
								color={color}
								onChange={(c) => {
									const newcolor = c.rgb;
									setColor(newcolor);
									props.onChange(newcolor);
								}}
							></SketchPicker>
						</div>
						<div
							style={{
								position: 'fixed',
								top: '0px',
								right: '0px',
								bottom: '0px',
								left: '0px',
								zIndex: 1000,
							}}
							onClick={() => setColorPickerVisible(false)}
						></div>
					</>
				)}
			</div>
		</>
	);
}

export default memo(ColorPicker);
