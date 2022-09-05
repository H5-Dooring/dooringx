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

区别于别的搭建平台，其较为适合制作移动端，主要是绝对定位搭建而非静态定位搭建，绝对定位的拖拽较为方便运营人员理解。

### dooringx-lib 如何工作？

 
dooringx-lib 在运行时维护一套数据流，主要分为json数据部分，左侧组件部分，右侧配置项部分，快捷键部分，弹窗部分，事件与函数部分，数据源部分。

其除了提供基础的拖拽、移动、缩放、全选、旋转等功能外，还可以使用暴露的组件。如果觉得组件不够定制化，可以调整样式或者自己重新写。

### 数据流转是怎样的？

1、页面上渲染主要围绕store中json制作，你可以在任何地方通过`config.getStore().getData()`拿到store数据，修改后使用`config.setData()`设置数据。

2、右侧配置项的开发本质也是通过修改json完成。

3、事件流设计：每个组件可以抛出任意个函数，组件中可以设置时机，比如设置点击组件a按钮或b按钮为触发时机，触发后调用事件链。事件链可以设置由多个组件抛出的函数链接而成。


### 快速上手

首先创建个文件夹，例如dooringx-example。

我们推荐使用Umi脚手架快速搭建我们的项目。

在文件夹内使用命令`yarn create @umijs/umi-app `或` npx @umijs/create-umi-app` 

安装dooringx-lib:

```
yarn add dooringx-lib
```
lib中部分组件来源于antd和其icon。需要安装antd和icon。动画部分主要使用了animate.css，也需要安装下。

```
yarn add antd @ant-design/icons animate.css
```

首先新增路由，用于预览显示。编辑根目录下的.umirc.ts:

```js
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index' },
        { path: '/preview', component: '@/pages/preview' },
        { path: '/iframe', component: '@/pages/iframe' },
      ],
    },
  ],
```
src下新增layouts用于嵌套子页面
```js
import { UserConfig } from 'dooringx-lib';
import 'dooringx-lib/dist/dooringx-lib.esm.css';
import { createContext, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import plugin from '../plugin';
import 'antd/dist/antd.css';
import 'animate.css';

export const config = new UserConfig(plugin);
export const configContext = createContext<UserConfig>(config);
config.i18n = false;
export default function Layout({ children }: IRouteComponentProps) {
  return (
    <configContext.Provider value={config}>{children}</configContext.Provider>
  );
}
```
layout依赖个人定制的plugin，我们简单做个测试组件。

src下新增plugin文件夹，index.tsx:
```js
import { InitConfig } from 'dooringx-lib';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { PlayCircleOutlined } from '@ant-design/icons';

const LeftRegistMap: LeftRegistComponentMapItem[] = [
  {
    type: 'basic',
    component: 'button',
    img: 'icon-anniu',
    imgCustom: <PlayCircleOutlined />,
    displayName: '按钮',
    urlFn: () => import('./button'),
  },
];

export const defaultConfig: Partial<InitConfig> = {
  leftAllRegistMap: LeftRegistMap,
  leftRenderListCategory: [
      {
      type: 'basic',
      icon: <HighlightOutlined />,
      displayName: '基础',
    },
  ],
  initComponentCache: {},
  rightRenderListCategory: [],
  initFunctionMap: {},
  initCommandModule: [],
  initFormComponents: {},
};

export default defaultConfig;
```
src/plugin/button/index.tsx
```js
import { ComponentItemFactory } from 'dooringx-lib';
import { Button } from 'antd';

const Dbutton = new ComponentItemFactory(
  'button',
  '按钮',
  {},
  {
    width: 200,
    height: 55,
  },
  () => {
    return <Button>测试</Button>;
  },
  true,
);
export default Dbutton;


```
在src/pages/index.tsx处新增编辑器代码：

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
export const HeaderHeight = '40px';
export default function IndexPage() {
  const config = useContext(configContext);
  const subscribeFn = useCallback(() => {
    localStorage.setItem(
      'PREVIEWSTATE',
      JSON.stringify(config.getStore().getData()),
    );
  }, [config]);
  const [state] = useStoreState(config, subscribeFn)
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
              style={{
                position: 'fixed',
                bottom: '60px',
                right: '450px',
                zIndex: 100,
              }}
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
此时启动项目，可以看见编辑器已经显示出来了。拖动组件时，也能正确置入画布。

src的pages下新增对应的页面：

src/pages/preview/index.tsx
```js
import { configContext } from '@/layouts';
import { Preview } from 'dooringx-lib';
import { useContext } from 'react';

function PreviewPage() {
  const data = localStorage.getItem('PREVIEWSTATE');
  const config = useContext(configContext);
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


src/pages/iframe/index.tsx
```js
function IframePage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <iframe
        style={{ width: '375px', height: '667px' }}
        src="/preview"
      ></iframe>
    </div>
  );
}
export default IframePage;

```

此时拖拽组件进入画布后，点击按钮进入预览则可看见预览状态也被渲染出来了。


