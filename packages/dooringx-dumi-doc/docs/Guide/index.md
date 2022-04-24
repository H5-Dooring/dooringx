---
title: 介绍
toc: menu
order: 1
nav:
  title: 指南
  order: 1
---



### dooringx-lib 是什么？

dooringx-lib 是 dooringx 的基座，是移除了 dooringx 插件的可视化拖拽框架。

dooringx-lib 提供自己的一套数据流事件机制以及弹窗等解决方案，可以让你更快地自己定制开发可视化拖拽平台。

### dooringx-lib 如何工作？

 
dooringx-lib 在运行时维护一套数据流，主要分为json数据部分，左侧组件部分，右侧配置项部分，快捷键部分，弹窗部分，事件与函数部分，数据源部分。

其除了提供基础的拖拽、移动、缩放、全选、旋转等功能外，还可以使用暴露的组件。如果觉得组件不够定制化，可以调整样式或者自己重新写。


### 快速上手


#### 安装

使用 npm 或者 yarn 安装

```bash
npm i dooringx-lib
```
参考demo:

```js
import {
	RightConfig,
	Container,
	useStoreState,
	innerContainerDragUp,
	LeftConfig,
	ContainerWrapper,
	Control,
} from 'dooringx-lib';
import { useContext } from 'react';
import { configContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';

export const HeaderHeight = '40px';

export default function IndexPage() {
	const config = useContext(configContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);

	return (
		<div {...innerContainerDragUp(config)}>
			<div style={{ height: HeaderHeight }}>
				head
				<button
					onClick={() => {
						window.open('/iframe');
					}}
				>
					go preview
				</button>
				<button
					onClick={() => {
						window.open('/preview');
					}}
				>
					go preview
				</button>
			</div>
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
					<LeftConfig config={config}></LeftConfig>
				</div>

				<ContainerWrapper config={config}>
					<>
						<Control
							config={config}
							style={{ position: 'fixed', bottom: '60px', right: '450px', zIndex: 100 }}
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
```




预览时preview套iframe:

```html
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<iframe style={{ width: '375px', height: '667px' }} src="/preview"></iframe>
		</div>
```
preview路由：

```js
import { PREVIEWSTATE } from '@/constant';
import { Preview, UserConfig } from 'dooringx-lib';
import plugin from '../../plugin';

const config = new UserConfig(plugin);

function PreviewPage() {
	const data = localStorage.getItem(PREVIEWSTATE);
	if (data) {
		try {
			const json = JSON.parse(data);
			config.resetData([json]);
		} catch {
			console.log('err');
		}
	}
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Preview config={config}></Preview>
		</div>
	);
}

export default PreviewPage;
```

有关 api 部分请参考 api

