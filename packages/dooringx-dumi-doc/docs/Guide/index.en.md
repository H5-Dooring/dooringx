---
title: Introduction
toc: menu
order: 1
nav:
  title: Guide
  order: 1
---
### What is dooringx lib?
Dooringx lib is the base of dooringx and a visual drag and drop framework with dooringx plug-ins removed.
Dooring x lib provides its own set of data flow event mechanism, pop-up window and other solutions, which can enable you to customize and develop your own visual drag and drop platform faster.
### How does dooringx lib work?
Dooringx lib maintains a set of data flow at runtime, which is mainly divided into JSON data part, left component part, right configuration item part, shortcut key part, pop-up window part, event and function part and data source part.
In addition to providing basic drag, move, zoom, select all, rotate and other functions, it can also use exposed components. If you feel that the components are not customized enough, you can adjust the style or rewrite it yourself.
### Get started quickly
#### Installation
Install using NPM or yarn
```bash
npm i dooringx-lib
```
Dooring x lib provides two containers for editing, which can be used as needed.
One is an ordinary container and the other is an iframe container. These two containers are slightly different in some implementations.
If you use a normal container, that is, the div that is normal when editing is not iframe, while if you use iframe, you will see the iframe content when editing. When previewing, use the preview component, and the preview can be placed in any container, including iframe.
It is recommended to use iframe to view the preview during preview. If there is a pop-up window, exceptions will be displayed in non iframe or PC.
The iframe container may have a slight delay in operation because it uses PostMessage communication. If the style isolation requirements are not high, you can use ordinary containers, and the preview style can be normal.
Common container usage reference Demo:
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
Iframe container use reference Demo:
index.tsx
```js
import {
RightConfig,
useStoreState,
innerContainerDragUp,
LeftConfig,
IframeContainerWrapper,
Control,
useIframeHook,
IframeTarget,
} from 'dooringx-lib';
import { useContext } from 'react';
import { configContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';
export const HeaderHeight = '40px';
export default function IndexPage() {
const config = useContext(configContext);
const subscribeFn = useCallback(() => {
localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
}, [config]);
const [state] = useStoreState(config, subscribeFn);
useIframeHook(`${location.origin}/container`, config);
return (
<div {...innerContainerDragUp(config, true)}>
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
<IframeContainerWrapper
config={config}
extra={
<Control
config={config}
style={{ position: 'fixed', bottom: '60px', right: '450px', zIndex: 100 }}
></Control>
}
>
<IframeTarget
config={config}
iframeProps={{
src: '/container',
}}
></IframeTarget>
</IframeContainerWrapper>
<div className="rightrender" style={{ height: '100%' }}>
<RightConfig state={state} config={config}></RightConfig>
</div>
</div>
</div>
);
}
```
Container Routing:
```js
import { configContext } from '@/layouts';
import { useContext } from 'react';
import { IframeContainer } from 'dooringx-lib';
function ContainerPage() {
const config = useContext(configContext);
return (
<div>
<IframeContainer config={config} context="edit"></IframeContainer>
</div>
);
}
export default ContainerPage;
```
Preview iframe:
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
Preview route:
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
For the API section, refer to API