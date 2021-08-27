/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:51:17
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-27 14:45:47
 * @FilePath: \dooringx\packages\dooringx-example\src\layouts\index.tsx
 */
import { Button } from 'antd';
import { UserConfig } from 'dooringx-lib';
import 'dooringx-lib/dist/dooringx-lib.esm.css';
import { createContext, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import plugin from '../plugin';
import 'antd/dist/antd.css';
import '../global.less';
import 'animate.css';
import { IntlProvider } from 'react-intl';
import { locale } from 'dooringx-lib';
import { localeKey } from '../../../dooringx-lib/dist/locale';
export const config = new UserConfig(plugin);
export const configContext = createContext<UserConfig>(config);

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
			<div
				style={{ width: '100%' }}
				onClick={() => {
					commander.exec('lock');
					handleclick();
				}}
			>
				<Button style={{ width: '100%' }}>锁定</Button>
			</div>
			<div
				style={{ width: '100%' }}
				onClick={() => {
					commander.exec('unlock');
					handleclick();
				}}
			>
				<Button style={{ width: '100%' }}>解锁</Button>
			</div>
		</div>
	);
};
contextMenuState.contextMenu = <ContextMenu></ContextMenu>;

interface LocaleContextType {
	change: Function;
	current: localeKey;
}
export const LocaleContext = createContext<LocaleContextType>({
	change: () => {},
	current: 'zh-CN',
});

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
