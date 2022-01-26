/*
 * @Author: yehuozhili
 * @Date: 2021-05-15 12:49:28
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-28 21:58:21
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\index.tsx
 */
import {
	RightConfig,
	Container,
	useStoreState,
	innerContainerDragUp,
	LeftConfig,
	ContainerWrapper,
	Control,
} from 'dooringx-lib';
import { InsertRowBelowOutlined, UploadOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { configContext, LocaleContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';
import { Button, Input, message, Modal, Popover, Upload } from 'antd';
import { localeKey } from '../../../dooringx-lib/dist/locale';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';

export const HeaderHeight = '40px';
const footerConfig = function () {
	return (
		<>
			<Popover content={'快捷键'} title={null} trigger="hover">
				<Button type="text" icon={<InsertRowBelowOutlined />}></Button>
			</Popover>
		</>
	);
};

export default function IndexPage() {
	const config = useContext(configContext);
	const locale = useContext(LocaleContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		//需要去预览前判断下弹窗。
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);

	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);

	const createAndDownloadFile = (fileName: string) => {
		const aTag = document.createElement('a');
		const res = config.getStore().getData();
		const JSONres = JSON.stringify(res);
		const blob = new Blob([JSONres]);
		aTag.download = fileName;
		const url = URL.createObjectURL(blob);
		aTag.href = url;
		aTag.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div {...innerContainerDragUp(config)}>
			<div style={{ height: HeaderHeight }}>
				<Button
					onClick={() => {
						window.open('/iframe');
					}}
				>
					iframe 预览
				</Button>
				<Button
					onClick={() => {
						window.open('/preview');
					}}
				>
					普通预览
				</Button>
				<Button
					onClick={() => {
						locale.change((pre: localeKey) => {
							return pre === 'zh-CN' ? 'en' : 'zh-CN';
						});
					}}
				>
					切换语言
				</Button>
				<Input
					style={{ width: 200 }}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				></Input>
				<Button
					onClick={() => {
						const leftprops: Partial<LeftRegistComponentMapItem> = {
							type: 'basic',
							img: 'https://img.guguzhu.com/d/file/android/ico/2021/09/08/rytzi2w34tm.png',
						};
						config.scriptSingleLoad(value, leftprops);
					}}
				>
					远程组件
				</Button>
				<Button
					onClick={() => {
						createAndDownloadFile('dooring.json');
					}}
				>
					下载json
				</Button>
				<Button
					onClick={() => {
						setOpen(true);
					}}
				>
					上传json
				</Button>
			</div>
			<Modal
				visible={open}
				onCancel={() => setOpen(false)}
				onOk={() => setOpen(false)}
				title={'import json'}
			>
				<Upload
					name="file"
					maxCount={1}
					onChange={(e) => {
						if (e.file.status === 'done') {
							const file = e.file.originFileObj;
							if (file) {
								let reader = new FileReader();
								reader.addEventListener('loadend', function () {
									try {
										let res = JSON.parse(reader.result as string);
										console.log(res, '返回结果数据');
										config.getStore().resetToInitData([res]);
										setOpen(false);
									} catch {
										message.error('json解析格式有误');
									}
								});
								reader.readAsText(file);
							}
						}
					}}
				>
					<Button icon={<UploadOutlined />}>&nbsp; 点击上传</Button>
				</Upload>
			</Modal>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: `calc(100vh - ${HeaderHeight})`,
					width: '100vw',
				}}
			>
				<div style={{ height: '100%' }}>
					<LeftConfig footerConfig={footerConfig()} config={config}></LeftConfig>
				</div>

				<ContainerWrapper config={config}>
					<>
						<Control
							config={config}
							style={{ position: 'fixed', bottom: '160px', right: '450px', zIndex: 100 }}
						></Control>
						<Container state={state} config={config} context="edit"></Container>
					</>
				</ContainerWrapper>
				<div className="rightrender" style={{ height: '100%' }}>
					<RightConfig state={state} config={config}></RightConfig>
				</div>
			</div>
		</div>
	);
}
