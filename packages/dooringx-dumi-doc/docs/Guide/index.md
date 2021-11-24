---
title: 指南
toc: menu
nav:
  title: 指南
  order: 1
---


## 介绍

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

dooringx-lib在编辑时提供两种容器，可以根据需要选择使用。

一种是普通容器，一种是iframe容器，这2种容器在某些实现上略有不同。

使用普通容器即在编辑时为普通的div并非iframe，而使用iframe则编辑时看见的为iframe内容。在预览时，使用preview组件，preview可以放到任何容器，包括去使用iframe查看。

建议预览时使用iframe查看preview，如果有弹窗，在非iframe或pc中会显示异常。

iframe容器由于使用postmessage通信，所以在操作上可能会有略微延迟。如果对样式隔离要求不高可以使用普通容器，预览的样式正常即可。

普通容器使用参考demo:

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


iframe容器使用参考demo：


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

container 路由：

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


## dooringx-lib基础

### store

store 类似于 redux 的概念，它内部实现了 redo、undo、发布订阅、置换数据、强制刷新等功能。

store 可以在 config 中获取。

在最开始时，需要通过 useStoreState 与 react 结合，此时可以在任意位置使用 store.forceUpdate 强刷，也可以使用 state 获取 store 中的数据。

store 的最重要功能是保存着每次修改 json  队列。

如果你需要更新数据，在深拷贝后使用 setData 方法进行更新。

如果你需要更新时不记录在 redo 或 undo 上留下记录，那么请操作队列删除其中保存内容即可。

对于改变数据后想即使看见视图更新，那么使用forceUpdate即可。


### 事件

dooringx-lib 的事件是在eventCenter上，它上面会集成functionCenter与一个事件链。

在eventCenter中可以获取组件注册的时机。时机类似于组件生命周期一样，可以注册后在对应的时机进行调用。

而functionCenter中的函数则会与时机结合，再由事件链对用户设定的队列进行统一处理。

每个事件链在执行中会有上下文对象，这个对象会贯穿这个事件链。

### 命令


dooringx-lib 的命令是由commander进行管理。

内部默认提供redo与undo的命令，您可以通过插件方式增加commander。

commander内部集成了快捷键配置，使用键盘事件的key进行注册，如果ctrl、alt、meta键，可加对应的加号进行组合键注册，内部忽略大小写（注意！不是忽略注册的键名大小写，而是A和a的key处理时等价）。

### 弹窗


dooringx-lib内置弹窗系统，弹窗系统是通过storeChanger进行转换而成。

所以在某些情景制作时，可能需要考虑是否在弹窗编辑下的情况。

每个弹窗是只保存block中的数据，而事件等数据只会存在主数据内。

在弹窗保存后，弹窗数据会被置换于主数据内存着，需要编辑时重新置换出来。

可以使用storeChanger上的方法进行判断，或者直接获取数据源数据等，具体见API。


### 数据源


dooringx-lib 的数据源和前面说的store中存储的不是一个东西。

它位于dataCenter中。设计数据源的初衷是为了让不懂代码的人更好理解。

事件的运行完全可以脱离数据源运行，只要使用者知道如何去填写参数。

所以在事件配置时，可以多个选项在数据源中去获得数据转变为参数。


## dooringx-lib插件开发

### 插件导入

dooringx-lib的插件需要一个类型为`Partial<InitConfig>`的对象。

对于多个插件，需要使用dooringx-lib导出的`userConfigMerge`来进行合并。

userConfigMerge不是所有属性都会合并，部分属性会进行覆盖。

```
 * 部分无法合并属性如果b传了会以b为准
 * initstore不合并
 * leftallregistmap合并
 * leftRenderListCategory合并
 * rightRenderListCategory合并
 * rightGlobalCustom 不合并
 * initComponentCache合并
 * initFunctionMap合并
 * initDataCenterMap合并
 * initCommandModule合并
 * initFormComponents合并
```

config支持部分配置异步导入，比如左侧分类等，这个是实验性功能，所以不推荐这么做。


### 左侧面板


左侧面板传入leftRenderListCategory即可。

```js
leftRenderListCategory: [
  {
        type: 'basic',
        icon: <HighlightOutlined />,
        displayName: '基础组件',
  },
  {
        type: 'xxc',
        icon: <ContainerOutlined />,
        custom: true,
        customRender: <div>我是自定义渲染</div>,
  },
],
```

type是分类，左侧组件显示在哪个分类由该字段决定。

icon则是左侧分类小图标。

当custom为true时，可以使用customRender自定义渲染。

### 左侧组件


### 插件导入

左侧组件要至于对象的LeftRegistMap中。

左侧组件支持同步导入或者异步导入。

```js
const LeftRegistMap: LeftRegistComponentMapItem[] = [
  {
      type: 'basic',
      component: 'button',
      img: 'icon-anniu',
      displayName: '按钮',
      urlFn: () => import('./registComponents/button'),
  },
];
```

如果需要异步导入组件，则需要填写urlFn，需要一个返回promise的函数。也可以支持远程载入组件，只要webpack配上就行了。

如果需要同步导入组件，则需要将组件放入配置项的initComponentCache中，这样在载入时便会注册进componentRegister里。

```js
initComponentCache: {
    modalMask: { component: MmodalMask },  
},
```

### 组件编写

组件需要导出一个由ComponentItemFactory生成的对象。

```js
const MButton = new ComponentItemFactory(
	'button',
	'按钮',
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text', 
				label: '文字',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	{
		props: {
			...
			text:'yehuozhili'// input配置项组件接收的初始值
		},
	},
	(data, context, store, config) => {
		return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
	},
	true
);

export default MButton;

```

其中第一个参数为组件注册名，第二个参数用来展示使用。


第三个参数用来配置右侧面板的配置项组件。其中键为右侧面板的分类，值为配置项组件数组。

第四个参数会配置组件的初始值，特别注意的是，制作组件必须要有初始宽度高度（非由内容撑开），否则会在适配时全选时产生问题。

这个初始值里有很多有用的属性，比如fixed代表使用固定定位，可以结合配置项更改该值，使得组件可以fixed定位。

还有canDrag类似于锁定命令，锁定的元素不可拖拽。

初始值里的rotate需要个对象，value代表旋转角度，canRotate 代表是否可以操作旋转。（0.7.0版本开始支持）

第五个参数是个函数，你将获得配置项中的receive属性（暂且都默认该配置为receive）传来的配置，比如上例中receive的是text，则该函数中data里会收到该字段。

context一般只有preview和edit，用来进行环境判断。

config可以拿到所有数据，用来制作事件时使用。

第六个参数resize 是为了判断是否能进行缩放，当为false时，无法进行缩放。

第七个参数needPosition，某些组件移入画布后会默认采取拖拽的落点，该配置项默认为true,就是需要拖拽的位置，为false时将使用组件自身top和left定位来放置。



### 事件注册

#### 时机注册

前面说了事件有时机和函数，所以组件内可以使用hook注册时机：

```js
useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');
```

useDynamicAddEventCenter第一个参数是render的四个参数组成的对象。第二个参数是注册的时机名，必须跟id相关，这是约定，否则多个组件可能会导致名称冲突，并且方便查找该时机。

注册完时机后，你需要将时机放入对应的触发位置上，比如这个button的点击执行时机就放到onclick中：

```js
<Button
    onClick={() => {
        eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
    }}
>
    yehuozhili
</Button> 
```

其中第一个参数则为注册的时机名，第二个为render函数中最后个参数config


####  函数注册

函数由组件抛出，可以加载到事件链上。比如，注册个改变文本函数，那么我可以在任意组件的时机中去调用该函数，从而触发该组件改变文本。

函数注册需要放入useEffect中，在组件卸载时需要卸载函数！否则会导致函数越来越多。

注意id要带上组件id，因为一个组件可以拖出n个组件生成n个函数。

```js
useEffect(() => {
		const functionCenter = eventCenter.getFunctionCenter();
		const unregist = functionCenter.register(
			`${pr.data.id}+改变文本函数`,
			async (ctx, next, config, args, _eventList, iname) => {
				const userSelect = iname.data;
				const ctxVal = changeUserValue(
					userSelect['改变文本数据源'],
					args,
					'_changeval',
					config,
					ctx
				);
				const text = ctxVal[0];
				setText(text);
				next();
			},
			[
				{
					name: '改变文本数据源',
					data: ['ctx', 'input', 'dataSource'],
					options: {
						receive: '_changeval',
						multi: false,
					},
				},
			],
			`${pr.data.id}+改变文本函数`
		);
		return () => {
			unregist();
		};
}, []);
```
 
函数中参数与配置见后面函数开发。

### 右侧面板


右侧面板的配置和左侧面板一样：

```js
export interface RightMapRenderListPropsItemCategory {
    type: string;
    icon: ReactNode;
    custom?: boolean;
    customRender?: (type: string, current: IBlockType) => ReactNode;
}
```

type会影响左侧组件在开发时第三个参数的键名。那个键名中即代表该右侧中展示的type。

icon则是可以放文字或者图标用来进行面板切换的。

如果custom为true，该面板下的显示可以通过customRender自定义。

### 右侧组件


#### 右侧组件导入

导入时,只要将开发的组件配成一个对象放入initFormComponents即可。

```js
initFormComponents: Formmodules,
```

#### 右侧组件开发

首先为了良好的开发体验，需要定义个formMap类型：

```js
export interface FormBaseType {
	receive?: string;
}
export interface FormInputType extends FormBaseType {
	label: string;
}
export interface FormActionButtonType {}
export interface FormAnimateControlType {}
export interface FormMap {
	input: FormInputType;
	actionButton: FormActionButtonType;
	animateControl: FormAnimateControlType;
}
```
formMap的键名就是initFormComponents键名，formMap的值对应组件需要收到的值。

以input组件为例，FormInputType此时有2个属性，label,receive。

那么在其开发该组件时，props会收到：

```js
interface MInputProps {
	data: CreateOptionsRes<FormMap, 'input'>;
	current: IBlockType;
    config: UserConfig;
}
```
也就是其中data是formMap类型，而current是当前点击的组件，config就不用说了。

还记得在左侧组件开发中的第三个参数吗？这样就都关联起来了：

```js

style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',  
				label: '文字',
			}),
		],

```
createPannelOptions 这个函数的泛型里填入对应的组件，将会给收到的配置项良好的提示。

在配置项组件里所要做的就是接收组件传来的配置项，然后去修改current的属性：


```js
function MInput(props: MInputProps) {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	return (
		<Row style={{ padding: '10px 20px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '文字'}：
			</Col>
			<Col span={18}>
				<Input
					value={props.current.props[(option as any).receive] || ''}
					onChange={(e) => {
						const receive = (option as any).receive;
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v.props[receive] = e.target.value;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}}
				></Input>
			</Col>
		</Row>
	);
}
```

由于可以很轻松的拿到store，所以可以在任意地方进行修改数据。

将组件的value关联current的属性，onChange去修改store，这样就完成了个双向绑定。

注意：如果你的右侧组件需要用到block以外的属性，可能需要去判断是否处于弹窗模式。


### 命令开发



#### 命令的导入

命令对象导入到插件的initCommandModule里即可

```js
initCommandModule: commandModules,
```

#### 命令的开发

命令需要导出一个CommanderItemFactory生成的对象。

```js
import { CommanderItemFactory } from 'dooringx-lib';
const undo = new CommanderItemFactory(
	'redo',
	'Control+Shift+z',
	(store) => {
		store.redo();
	},
	'重做'
);

export default undo;
```

第一个参数是注册名。
第二个参数是快捷键名，快捷键映射是键盘事件key值：

```js
	Cancel: 3,
	Help: 6,
	Backspace: 8,
	Tab: 9,
	Clear: 12,
	Enter: 13,
	Shift: 16,
	Control: 17,
	Alt: 18,
	Pause: 19,
	CapsLock: 20,
	Escape: 27,
	Convert: 28,
	NonConvert: 29,
	Accept: 30,
	ModeChange: 31,
	' ': 32,
	PageUp: 33,
	PageDown: 34,
	End: 35,
	Home: 36,
	ArrowLeft: 37,
	ArrowUp: 38,
	ArrowRight: 39,
	ArrowDown: 40,
	Select: 41,
	Print: 42,
	Execute: 43,
	PrintScreen: 44,
	Insert: 45,
	Delete: 46,
	0: 48,
	')': 48,
	1: 49,
	'!': 49,
	2: 50,
	'@': 50,
	3: 51,
	'#': 51,
	4: 52,
	$: 52,
	5: 53,
	'%': 53,
	6: 54,
	'^': 54,
	7: 55,
	'&': 55,
	8: 56,
	'*': 56,
	9: 57,
	'(': 57,
	a: 65,
	A: 65,
	b: 66,
	B: 66,
	c: 67,
	C: 67,
	d: 68,
	D: 68,
	e: 69,
	E: 69,
	f: 70,
	F: 70,
	g: 71,
	G: 71,
	h: 72,
	H: 72,
	i: 73,
	I: 73,
	j: 74,
	J: 74,
	k: 75,
	K: 75,
	l: 76,
	L: 76,
	m: 77,
	M: 77,
	n: 78,
	N: 78,
	o: 79,
	O: 79,
	p: 80,
	P: 80,
	q: 81,
	Q: 81,
	r: 82,
	R: 82,
	s: 83,
	S: 83,
	t: 84,
	T: 84,
	u: 85,
	U: 85,
	v: 86,
	V: 86,
	w: 87,
	W: 87,
	x: 88,
	X: 88,
	y: 89,
	Y: 89,
	z: 90,
	Z: 90,
	OS: 91,
	ContextMenu: 93,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	F13: 124,
	F14: 125,
	F15: 126,
	F16: 127,
	F17: 128,
	F18: 129,
	F19: 130,
	F20: 131,
	F21: 132,
	F22: 133,
	F23: 134,
	F24: 135,
	NumLock: 144,
	ScrollLock: 145,
	VolumeMute: 181,
	VolumeDown: 182,
	VolumeUp: 183,
	';': 186,
	':': 186,
	'=': 187,
	'+': 187,
	',': 188,
	'<': 188,
	'-': 189,
	_: 189,
	'.': 190,
	'>': 190,
	'/': 191,
	'?': 191,
	'`': 192,
	'~': 192,
	'[': 219,
	'{': 219,
	'\\': 220,
	'|': 220,
	']': 221,
	'}': 221,
	"'": 222,
	'"': 222,
	Meta: 224,
	AltGraph: 225,
	Attn: 246,
	CrSel: 247,
	ExSel: 248,
	EraseEof: 249,
	Play: 250,
	ZoomOut: 251,
```

26个英文字母是忽略大小写的，一个命令目前只能注册一个快捷键。不需要注册快捷键则填空字符串即可。

metakey与Controlkey相同，写Control即可。

目前第三个参数只能获得store，后续需要修改下。 0.2.0 版本第二个参数可以获得config，同时commander不从index中导出，需要使用时从config中获取。

最后个参数是展示名。


### 右键菜单

右键菜单可以进行自定义：

```js
// 自定义右键
const contextMenuState = config.getContextMenuState();
const unmountContextMenu = contextMenuState.unmountContextMenu;
const commander = config.getCommanderRegister();
const ContextMenu = () => {
	const handleclick = () => {
		unmountContextMenu();
	};
	const forceUpdate = useState(0)[1];
	contextMenuState.forceUpdate = () => {
		forceUpdate((pre) => pre + 1);
	};
	return (
		<div
			style={{
				left: contextMenuState.left,
				top: contextMenuState.top,
				position: 'fixed',
				background: 'rgb(24, 23, 23)',
			}}
		>
			<div
				style={{ width: '100%' }}
				onClick={() => {
					commander.exec('redo');
					handleclick();
				}}
			>
				<Button>自定义</Button>
			</div>
		</div>
	);
};
contextMenuState.contextMenu = <ContextMenu></ContextMenu>;
```
先拿到contextMenuState，contextMenuState上有个unmountContextMenu是关闭右键菜单方法。

所以在点击后需要调用关闭。

同时上面的left和top是右键的位置。

另外，你还需要在组件内增加个强刷赋值给forceUpdate，用于在组件移动时进行跟随。


### 函数开发



#### 函数导入

函数导入做成对象置入initFunctionMap即可

```js
initFunctionMap: functionMap,
```

#### 函数开发


键名会显示出来所以键名是唯一的。

它的值是2个对象，一个是函数内容fn，一个是配置项config (0.10.0以上还需要传入函数名称，用于显示)。

config中的数组里每个配置会显示出来让用户去配置，name则是展示名字，data代表数据去哪里获取，可以选择从输入框（input），数据源（dataSource）,上下文（ctx）中获取，另外还有个特殊的弹窗（modal）。

options中的receive表示会从args哪个键上获取该值。

multi代表是否允许多个选项配置。

dooringx-lib中写好了2个函数changeUserValue与changeUserValueRecord，第一个函数会将得到的结果做成数组，如果非multi则取第一个结果就行。而第二个函数会将结果做成对象，比如用户在数据源中选了keya，那么就会把数据源的键值对作为个对象返回。


fn中，第一个ctx参数代表上下文，如果有转换函数之类，可能需要使用（比如要把第一个函数的结果导给后面的函数）

第二个参数next是需要运行完毕后执行的，否则事件链会一直在该函数中不退出。

第三个参数config就可以拿到整个config对象。

第四个参数args是用户填写的参数，会根据options里填写的字段进行返回。

第五个是eventList，可以获取整个事件链的参数。

第六个参数iname可以拿到用户的选择项。


```js
 通用GET请求函数: {
    fn: (ctx, next, config, args, _eventList, iname) => {
      console.log(args, '参数x');
      const userSelect = iname.data;
      const urlVal = changeUserValue(
        userSelect['请求url'],
        args,
        '_url',
        config,
        ctx
      ); // input datasource ctx //datasource会去取值 ，ctx取ctx上字段
      const paramSource = changeUserValueRecord(
        // 设定只能从datasource或者ctx里取
        userSelect['请求参数'],
        args,
        '_origin',
        config,
        ctx
      );
      const ctxVal = changeUserValue(
        userSelect['返回上下文字段'],
        args,
        '_ctx',
        config,
        ctx
      );
      // 检查参数是否存在
      // 都是数组，非multi则取第一个。
      const url = urlVal[0];
      if (!url) {
        return next();
      }
      const ctxKey = ctxVal[0];

      axios
        .get(url, {
          params: {
            ...paramSource,
          },
        })
        .then((res) => {
          const data = res.data;
          ctx[ctxKey] = data;
          next();
        })
        .catch((e) => {
          console.log(e);
          next();
        });
    },
    config: [
      {
        name: '请求url',
        data: ['dataSource', 'ctx', 'input'],
        options: {
          receive: '_url',
          multi: false,
        },
      },
      {
        name: '请求参数',
        data: ['dataSource', 'ctx'],
        options: {
          receive: '_origin',
          multi: true,
        },
      },
      {
        name: '返回上下文字段',
        data: ['input'],
        options: {
          receive: '_ctx',
          multi: false,
        },
      },
    ],
    name: '通用GET请求函数'
  },
```

#### 时机与函数装载

如果有需要，一般使用：

 ```js
 	eventCenter.manualUpdateMap(cur, displayName, arr);
 ```

 manualUpdateMap第一个是时机名，第二个是展示名，第三个是用户选择。

 更新事件中心后还需要更新store，结果以store为准。