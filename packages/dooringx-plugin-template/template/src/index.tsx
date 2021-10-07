/*
 * @Author: yehuozhili
 * @Date: 2021-09-30 09:54:13
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-30 09:54:24
 * @FilePath: \dooringx\packages\dooringx-plugin-template\src\index.tsx
 */
import React from "react";
import styles from "./index.less";
import { ComponentItemFactory, createPannelOptions } from "dooringx-lib";
export interface FormBaseType {
	receive?: string;
}
export interface FormInputType extends FormBaseType {
	label: string;
}
export interface FormMap {
	input: FormInputType;
}
const remoteCo = new ComponentItemFactory(
	"remoteCo",
	"远程组件",
	{
		style: [
			createPannelOptions<FormMap, "input">("input", {
				receive: "text",
				label: "文字",
			}),
		],
	},
	{
		width: 200,
		height: 100,
		props: {
			text: "远程组件a",
		},
	},
	(data) => {
		return (
			<div
				className={styles.hello}
				style={{
					zIndex: data.zIndex,
					width: data.width,
					height: data.height,
				}}
			>
				{data.props.text}
			</div>
		);
	},
	true
);
remoteCo.url =
	"https://img.guguzhu.com/d/file/android/ico/2021/09/08/rytzi2w34tm.png";

export default remoteCo;
