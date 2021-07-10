/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:51:17
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 19:07:10
 * @FilePath: \dooringx\packages\dooringx-example\src\layouts\index.tsx
 */
import { Button } from 'antd';
import { UserConfig } from 'dooringx-lib/dist';
import 'dooringx-lib/dist/dooringx-lib.esm.css';
import { createContext } from 'react';
import { IRouteComponentProps } from 'umi';
import plugin from '../plugin';
import 'antd/dist/antd.css';
import 'dooringx-lib/dist/dooringx-lib.esm';
import '../global.less';
import 'animate.css';

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

export default function Layout({ children }: IRouteComponentProps) {
	return <configContext.Provider value={config}>{children}</configContext.Provider>;
}
