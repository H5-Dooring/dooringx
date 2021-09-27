/*
 * @Author: yehuozhili
 * @Date: 2021-08-27 10:20:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-27 18:08:49
 * @FilePath: \dooringx\packages\dooringx-lib\src\locale\index.tsx
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { UserConfig } from '..';
import { en } from './en';
import { zhCN } from './zh-CN';

export const localeMap = {
	'zh-CN': zhCN,
	en,
};
export type localeKey = keyof typeof localeMap;

export { en } from './en';
export { zhCN } from './zh-CN';

export const replaceLocale = (
	id: string,
	msg: string,
	config: UserConfig,
	param?: any,
	paramString?: string
) => {
	if (config.i18n) {
		if (paramString) {
			return (
				<FormattedMessage id={id} defaultMessage={paramString} values={param}></FormattedMessage>
			);
		}
		return <FormattedMessage id={id} defaultMessage={msg}></FormattedMessage>;
	}
	return msg;
};
