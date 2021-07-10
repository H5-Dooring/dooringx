import { IStoreData } from '../core/store/storetype';
import React, { useMemo } from 'react';
import Blocks from './blocks';
import UserConfig from '../config';
import * as ReactDOM from 'react-dom';
import { deepCopy } from '../core/utils';

interface ModalRenderProps {
	data: IStoreData;
	name: string; //传递的modal名字
	config: UserConfig; //需要拿到componentRegister
	parentDom: HTMLDivElement;
	rootDom: HTMLDivElement;
}

export const unmountMap: Map<string, Function> = new Map();

export function ModalRender(props: ModalRenderProps) {
	//先获取数据
	const storeData: IStoreData = useMemo(() => {
		const z = props.data.modalMap[props.name];
		if (z) {
			const data = deepCopy(z);
			//需要把第一个mask扔了手动写一个
			data.block.shift();
			return data;
		}
		return { block: [] };
	}, [props.data.modalMap, props.name]);
	const { parentDom, rootDom } = props;

	const modalConfig = props.data.modalConfig[props.name];

	//这里还要添加个关闭函数，
	const unmount = useMemo(() => {
		return () => {
			if (parentDom && rootDom) {
				ReactDOM.unmountComponentAtNode(parentDom);
				rootDom.removeChild(parentDom);
				rootDom.parentElement?.removeChild(rootDom);
			}
		};
	}, [parentDom, rootDom]);

	unmountMap.set(props.name, unmount);

	return (
		<>
			<div
				className="yh-container-modal"
				style={{
					height: `100%`,
					width: `100%`,
					position: 'fixed',
					overflow: 'hidden',
				}}
			>
				{storeData.block.map((v) => {
					return <Blocks key={v.id} config={props.config} data={v} context={'preview'}></Blocks>;
				})}
				<div
					onClick={() => {
						if (!modalConfig) {
							unmount();
						}
					}}
					style={{
						backgroundColor: '#716f6f9e',
						width: '100%',
						height: '100%',
					}}
				></div>
			</div>
		</>
	);
}

let wrap: HTMLDivElement | null;

export const createModal = (name: string, data: IStoreData, config: UserConfig) => {
	if (wrap) {
		wrap = null;
	}

	if (!wrap) {
		wrap = document.createElement('div');
		wrap.style.cssText = `line-height:
        1.5;text-align:
        center;color: #333;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        position: fixed;
        z-index: 100000;
        width: 100%;
        height:100%;
        top:0;
        left: 0;`;
		if (wrap) {
			document.body.appendChild(wrap);
		}
	}
	const divs = document.createElement('div');
	wrap.appendChild(divs);
	ReactDOM.render(
		<ModalRender
			name={name}
			data={data}
			config={config}
			parentDom={divs}
			rootDom={wrap}
		></ModalRender>,
		divs
	);
};
