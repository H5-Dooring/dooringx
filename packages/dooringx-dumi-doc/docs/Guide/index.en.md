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
Dooringx lib provides its own set of data flow event mechanism, pop-up window and other solutions, which allows you to customize and develop your own visual drag and drop platform faster.
### How does dooringx lib work?
Dooringx lib maintains a set of data flow at runtime, which is mainly divided into JSON data part, left component part, right configuration item part, shortcut key part, pop-up window part, event and function part and data source part.
In addition to providing basic drag, move, zoom, select all, rotate and other functions, it can also use exposed components. If you feel that the components are not customized enough, you can adjust the style or rewrite it yourself.
### Get started quickly
#### Installation
Install using NPM or yarn
```bash
npm i dooringx-lib
```
Reference Demo:
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