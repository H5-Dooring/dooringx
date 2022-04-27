---
title: 介绍
toc: menu
order: 1
nav:
  title: 指南
  order: 1
---



### What is dooringx lib？

Dooringx lib is the base of dooringx and a visual drag and drop framework with dooringx plug-ins removed。

Dooringx lib provides its own set of data flow event mechanism, pop-up window and other solutions, which allows you to customize and develop your own visual drag and drop platform faster.

### dooringx-lib 如何工作？

 Dooringx lib maintains a set of data flow at runtime, which is mainly divided into JSON data part, left component part, right configuration item part, shortcut key part, pop-up window part, event and function part and data source part.

In addition to providing basic drag, move, zoom, select all, rotate and other functions, it can also use exposed components. If you feel that the components are not customized enough, you can adjust the style or rewrite it yourself.

### 快速上手

First create a folder, such as dooringx example.

We recommend using UMI scaffold to quickly build our project.

Use commands within folders`yarn create @umijs/umi-app `或` npx @umijs/create-umi-app`

install dooringx-lib:

```
yarn add dooringx-lib
```
Some components in lib come from antd and its icon. Antd and icon need to be installed. The animation part mainly uses animate CSS also needs to be installed.

```
yarn add antd @ant-design/icons animate.css
```

First, add a new route for preview display. Edit the in the root directory umirc. ts:

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
New layouts are added under SRC to embed sub pages
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
Layout depends on a customized plugin. Let's simply make a test component.

Add a plugin folder under SRC, index tsx:
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
In Src / pages / index New editor code at TSX:

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
At this point, start the project and you can see that the editor has been displayed. The canvas can also be placed correctly when dragging components.

Add a corresponding page under pages of SRC:

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

At this time, after dragging the component into the canvas, click the button to enter the preview, and you can see that the preview state is also rendered.
