---
title: dooringx-lib插件开发
toc: menu
order: 3
---

### 插件导入

dooringx-lib的插件需要一个类型为`Partial<InitConfig>`的对象。

对于多个插件，需要使用dooringx-lib导出的`userConfigMerge`来进行合并。

userConfigMerge不是所有属性都会合并，部分属性会进行覆盖。




### 左侧面板


左侧面板传入leftRenderListCategory即可。

type是分类，左侧组件显示在哪个分类由该字段决定。

icon则是左侧分类小图标。

当custom为true时，可以使用customRender自定义渲染。


### 插件导入

左侧组件要至于对象的LeftRegistMap中。

左侧组件支持同步导入或者异步导入。

如果需要异步导入组件，则需要填写urlFn，需要一个返回promise的函数。也可以支持远程载入组件，只要webpack配上就行了。

如果需要同步导入组件，则需要将组件放入配置项的initComponentCache中，这样在载入时便会注册进componentRegister里。


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

也可以使用对象形式传参,见`createComponent`函数


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

函数注册需要放入useEffect中。目前不需要主动卸载，但在和弹窗上函数通信时，可能需要在预览环境卸载，否则可能第二次执行不生效。

注意id要带上组件id，因为一个组件可以拖出n个组件生成n个函数。

 
函数中参数与配置见后面函数开发。

### 右侧面板


右侧面板的配置和左侧面板一样：


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
第二个参数是快捷键名，快捷键映射是键盘事件key值 

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

该部分等待更新

#### 时机与函数装载

如果有需要，一般使用：

 ```js
 	eventCenter.manualUpdateMap(cur, displayName, arr);
 ```

 manualUpdateMap第一个是时机名，第二个是展示名，第三个是用户选择。

 更新事件中心后还需要更新store，结果以store为准。
