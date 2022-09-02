---
title: API
toc: menu
---
## useStoreState

用于将json中的block转换为react中的state，可插入block变更订阅函数。

示例：
```js
	const config = useContext(configContext);
	const locale = useContext(LocaleContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		//需要去预览前判断下弹窗。
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);
```


| 参数                         | 类型                   |  说明 |
| ----------------------------  | ----------------       | ---- |
| config                        | UserConfig         |       总的配置项    |
| extraFn                       | Function = () => {}   |     订阅store变更函数        |
| everyFn                       | Function = () => {}     |   暂时无用，可穿插运行函数   |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| [IStoreData]                  | 转变为state的block ，用于后续渲染   |

## useDynamicAddEventCenter

用于在组件中注册时机。

示例：
```js
	useDynamicAddEventCenter(props, `${props.data.id}-click`, '点击执行时机');
```


| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| props            | ComponentRenderConfigProps   |   传入组件的对象{data,context,store,config}        |
| eventName          | string  |     添加的名称        |
| displayName          | string    |    展示的名称  |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| void                 | 无    |

## Container

画布

示例：
```js
	<Container state={state} config={config} context="edit"></Container>
```



| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| state            | IStoreData  |   传入useStoreState转换的state |
| context          |  'edit' \|  'preview'    |    根据预览或者编辑传  |
| config          | UserConfig    |  总配置项    |
| editContainerStyle          |  CSSProperties   |    可以修改样式  |
| previewContainerStyle          | CSSProperties    |    可以修改样式  |

| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |

## LeftConfig

左侧面板


示例：
```js
		<LeftConfig footerConfig={footerConfig()} config={config}></LeftConfig>
```



| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig | 总配置项  |
| showName            | Boolean? |   是否显示名称 |
| footerConfig            | ReactNode? |  面板footer插槽 |
| mode            |  'horizontal' | 'vertical' |  模式 |




| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |


## Preview

预览组件，包含了preview模式的container，以及一些加载逻辑。

示例：
```js
	<Preview
				//loadingState={loading}
				// completeFn={() => {
				// 	setTimeout(() => {
				// 		setLoading(false);
				// 	}, 10000);
				// }}
				config={config}
	></Preview>
```



| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig | 总配置项  |
| loadText            | ReactNode? |   加载中插槽 |
| loadingState            | boolean? |  手动维护加载状态 |
| completeFn            |  Function? |  页面装载完成调用 |
| previewContainerStyle            |  CSSProperties? |  样式修改 |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |

## RightConfig

右侧面板

示例：
```js
	<RightConfig state={state} config={config}></RightConfig>
```



| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| state            | IStoreData |  传入useStoreState转换的state |
| config            | UserConfig |   总配置项 |
| globalExtra            | ReactNode? |  全局属性部分添加位置插槽 |
| modalExtra            |  ReactNode? |  弹窗属性添加插槽 |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |

## ContainerWrapper

画布外层，主要包含了滚轮放大缩小，刻度等。

示例：
```js
<ContainerWrapper config={config}>
  <>
    <Control
      config={config}
      style={{ position: 'fixed', bottom: '160px', right: '450px', zIndex: 100 }}
    ></Control>
    <Container state={state} config={config} context="edit"></Container>
  </>
</ContainerWrapper>
```

| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig |   总配置项 |
| classNames            | string? |  样式修改 |
| style            |  CSSProperties? |  样式修改 |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |
## Control

全局、弹窗等画布控制器。

示例：
```js
<Control
  config={config}
  style={{ position: 'fixed', bottom: '160px', right: '450px', zIndex: 100 }}
></Control>
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig |   总配置项 |
| style            |  CSSProperties? |  样式修改 |


| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |


## LeftDataPannel

左侧数据源tab，用来装载在左侧面板上。

示例：
```js
leftRenderListCategory: [
  ...,
		{
			type: 'datax',
			icon: <ContainerOutlined />,
			custom: true,
			displayName: '数据源',
			customRender: (config) => <LeftDataPannel config={config}></LeftDataPannel>,
		},
	],
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig |   总配置项 |

| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
| JSX.Element                 | 无    |

## innerContainerDragUp

放到外层容器属性里，主要包含多种up类型事件处理逻辑。

示例：
```js
<div {...innerContainerDragUp(config)}>
...
</div>
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig |   总配置项 |

| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
|  mouseUp moseMove等      | 无    |

## unmountContextMenu

卸载右键dom，用于关闭右键菜单，也可以在contextMenuState.unmountContextMenu中取到

示例：
```js
const ContextMenu = () => {
	const handleclick = () => {
		unmountContextMenu();
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
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
| config            | UserConfig |   总配置项 |

| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
|  mouseUp moseMove等      | 无    |


## UserConfig

总设置项，包括可以获取store commander等，也需传递给组件。

### Store

存放json数据源并提供redo undo以及弹窗状态转换

| 方法                            |  说明 |
| -----------------      | ---- |
| getData             |   获取当前json |
| getStoreList             |    获取操作列表json |
| isEdit             |    判断是否在弹窗编辑 |
| isInModalMap             |    判断有没有该弹窗 |
| newModalMap             |   新增弹窗 |
| closeModal             |   关闭弹窗 |
| removeModal             |   删除弹窗 |
| resetToInitData             |   重置json数据 |
| redo             |   重做 |
| undo             |   撤销 |
| setData             |   设置值 |
| cleanLast             |   清除前一个json |
| emit             |   让监听函数执行 |
| subscribe             |   监听 |
| forceUpdate             |   强刷监听函数 |
| setIndex             |   设置索引 |


### dataCenter

### eventCenter


### commanderRegister

## userConfigMerge

合并配置项,用于合并他人的配置项。

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
 * containerIcon不合并

示例：

```js
const merge = userConfigMerge(a: Partial<InitConfig>, b?: Partial<InitConfig>):
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  InitConfig: initStoreData      |  IStoreData[] |   store初始值 |
|  InitConfig: leftAllRegistMap      |  leftAllRegistMap[] |   左边tab页组件渲染包括异步路径 { type: 'basic', component: 'button', img: 'http://xxxx/1.jpg' ,url:'' } |
|  InitConfig: leftRenderListCategory      |  leftRenderListCategory[] |   左边tab页图标配置 |
|  InitConfig: rightRenderListCategory      |  RightMapRenderListPropsItemCategory[] | 右边tab页图标配置 |
|  InitConfig: initComponentCache      | CacheComponentType |   组件加载缓存判定，用来设置不异步加载的组件 |
|  InitConfig: initFunctionMap      |  FunctionCenterType |  内置函数配置 |
|  InitConfig: initDataCenterMap      |  Record\<string, any\> |   内置数据中心配置数据 |
|  InitConfig: initCommandModule      |  CommanderItemFactory[] |   commander 指令集合 |
|  InitConfig: rightGlobalCustom      |   ((config: UserConfig) => React.ReactNode) \| null \| undefined |   右侧全局自定义 |
|  InitConfig: initFormComponents      |   Record\<string, React.FunctionComponent\<any\> \| React.ComponentClass\<any, any\>\>|   右侧配置项 |
|  InitConfig: containerIcon      |  React.ReactNode |   容器拉伸图标 |

| 返回值                         | 说明             |    
| ----------------------------  | ---------------- |
|  InitConfig    | 无    |

## scaleFn

制作放大缩小的函数

示例：

```js
scaleFn.increase(0.1,config)
scaleFn.decrease(0.1,config)
```

 
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  number     |  number  |    放大缩小比例 |
| config            | UserConfig |   总配置项 |

## ComponentItemFactory

制作组件函数，如果想传递对象请使用createComponent。

示例：
```js
new ComponentItemFactory(
	'button',
	'按钮',
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
			}),
		],
		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	{
		props: {
			text: 'yehuozhili',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
			op1: false,
			borderData: {
				borderWidth: 0,
				borderColor: 'rgba(0,0,0,1)',
				borderStyle: 'solid',
			},
			fontData: {
				fontSize: 14,
				textDecoration: 'none',
				fontStyle: 'normal',
				color: 'rgba(255,255,255,1)',
				fontWeight: 'normal',
			},
		},
		width: 100, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		height: 30, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		rotate: {
			canRotate: true,
			value: 0,
		},
		canDrag: true, // false就不能拖
	},
	(data, context, store, config) => {
		return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
	},
	true
);
```

| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  name     |  string  | map上key名唯一    |
| display| string | 展示的名称 |
| props| Record\<string, CreateOptionsResAll[]\>|  配置项属性 |
| initData| Partial\<IBlockType\>| 初始值  |
| render|(data: IBlockType, context: any, store: Store, config: UserConfig) => JSX.Element|  渲染函数  |
| resize| boolean = true | 是否拉伸 |
| needPosition| boolean = true| 是否用拖拽点位定初始位置   |
| init| () => void| 加载时函数   |
| destroy| () => void| 销毁时函数  |
| remoteConfig|  Record\<string, any\>|  远程组件配置项   |

## createComponent

制作组件函数，对象形式new ComponentItemFactory,属性同上。

示例：

```js
createComponent({
	name: 'testco',
	display: '测试按钮',
	props: {
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
			}),
		],
		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	initData: {
		props: {
			text: 'yehuozhili',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
			op1: false,
			borderData: {
				borderWidth: 0,
				borderColor: 'rgba(0,0,0,1)',
				borderStyle: 'solid',
			},
			fontData: {
				fontSize: 14,
				textDecoration: 'none',
				fontStyle: 'normal',
				color: 'rgba(255,255,255,1)',
				fontWeight: 'normal',
			},
		},
		width: 100, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		height: 30, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		rotate: {
			canRotate: true,
			value: 0,
		},
		canDrag: true, // false就不能拖
	},
	render: (data, context, store, config) => {
		return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
	},
	resize: true,
});
```


## createPannelOptions

用制作组件配置项函数

示例：
```js
	createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
	})
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  type   |  string  |  右侧配置组件对应的name    |
| option| any | 发给该右侧配置组件的属性（自行根据右侧组件定义） |


## useRegistFunc 

用于注册组件所抛出的函数，供事件链中给别的组件调用。

示例：
```js
	useRegistFunc(op1, pr.context, fn);
```
| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  dep   |  boolean  |  配置的开关 （开启时抛出该函数，关闭时不抛出函数，一般做到右侧配置项中）  |
| context | 'preview' \| 'edit' |  预览环境还是编辑环境 |
| registFn | Function |  所注册的函数 |

## CommanderItemFactory

用于制作快捷键

示例：

```js
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

| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  name   |  string  |   命令执行的id  |
| keyboard | string |  键位设置。如果ctrl、alt、meta键，可加对应的加号进行组合键注册，内部忽略大小写（注意！不是忽略注册的键名大小写，而是A和a的key处理时等价） |
| excute |  (store: Store, config: UserConfig, options?: Record\<string, any\> \| undefined) => void |  所注册的函数 |
| display | string |  显示名称 |
| init |  () => void |  加载时函数 |
| destroy |  () => void | 销毁时函数 |


## dragEventResolve

用于菜单拖拽函数(通常不需要)

示例：

```js
	<div
    className={`${styles.coitem} yh-left-item-wrap`}
    key={index}
    {...dragEventResolve(v, props.config)}
  >
  ...
  </div>
```


| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  item   |  LeftRegistComponentMapItem  |  左侧对象 |
| config | UserConfig |  用户设置 |



## defaultStore

默认store对象

```js
export const defaultStore: IMainStoreData = {
	container: {
		width: 375,
		height: 667,
	},
	block: [],
	modalMap: {},
	dataSource: {
		defaultKey: 'defaultValue',
	},
	globalState: {
		containerColor: 'rgba(255,255,255,1)',
		title: 'Dooringx',
		bodyColor: 'rgba(255,255,255,1)',
		script: [],
		customAnimate: [],
		lineHeight: 1.575,
		fontSize: 14,
	},
	modalConfig: {},
	modalEditName: '',
	origin: null,
};
```

## deepCopy

用于深拷贝

## specialCoList

需要特殊处理的组件，用于弹窗mask和timeline的禁止移动，一般不做处理

```js
export const specialCoList = ['modalMask'];
```

## specialFnList

需要特殊处理的函数，通过includes判断，函数不会像组件函数一样卸载。

```js
export const specialFnList = ['_inner'];
```

## locale

国际化设置

示例：

```js
import { IntlProvider } from 'react-intl';
import { locale } from 'dooringx-lib';
import { localeKey } from '../../../dooringx-lib/dist/locale';

export default function Layout({ children }: IRouteComponentProps) {
	const [l, setLocale] = useState<localeKey>('zh-CN');
	return (
		<LocaleContext.Provider value={{ change: setLocale, current: l }}>
			<IntlProvider messages={locale.localeMap[l]} locale={l} defaultLocale={l}>
				<configContext.Provider value={config}>{children}</configContext.Provider>
			</IntlProvider>
		</LocaleContext.Provider>
	);
}
```

### replaceLocale

用于替换文字函数

示例：

```js
	replaceLocale(
  'modal.popup.notfond',
  `未找到该弹窗 ${sign.param}`,
  props.config,
  { name: sign.param },
  '未找到该弹窗 {name}'
)
```


| 参数                 | 类型                   |  说明 |
| -----------------  | ----------------       | ---- |
|  id   |  LeftRegistComponentMapItem  |  消息id |
| msg | string |  消息名称 |
| config | UserConfig |  用户设置 |
| param | object |  序列化字符串参数 |
| paramString | string |  序列化字符串，需要跟param参数结合使用 |

### localeMap 

用于制作语言包

```js
import { en } from './en';
import { zhCN } from './zh-CN';

export const localeMap = {
	'zh-CN': zhCN,
	en,
};
```
