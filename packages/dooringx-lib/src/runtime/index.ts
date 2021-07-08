/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:33:52
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-05-30 15:51:50
 * @FilePath: \dooringv2\packages\dooring-v2-lib\src\runtime\index.ts
 */
import CommanderWrapper from '../core/command';
import ComponentRegister from '../core/components';
import { FormComponentRegister } from '../core/components/formComponentRegister';
import { StoreChanger } from '../core/storeChanger';
import { store } from './store';

export const commander = new CommanderWrapper(store);
export const componentRegister = new ComponentRegister();
export const formRegister = new FormComponentRegister();
export const storeChanger = new StoreChanger();
