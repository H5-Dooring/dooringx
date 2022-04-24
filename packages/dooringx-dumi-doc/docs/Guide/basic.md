---
title: dooringx-lib基础
toc: menu
order: 2
---


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


dooringx-lib内置弹窗系统，弹窗系统是通过store进行转换而成。

所以在某些情景制作时，可能需要考虑是否在弹窗编辑下的情况。

每个弹窗是只保存block中的数据，而事件等数据只会存在主数据内。

在弹窗保存后，弹窗数据会被置换于主数据内存着，需要编辑时重新置换出来。

可以使用store上的方法进行判断，或者直接获取数据源数据等，具体见API。


### 数据源


dooringx-lib 的数据源和前面说的store中存储的不是一个东西。

它位于dataCenter中。设计数据源的初衷是为了让不懂代码的人更好理解。

事件的运行完全可以脱离数据源运行，只要使用者知道如何去填写参数。

所以在事件配置时，可以多个选项在数据源中去获得数据转变为参数。


