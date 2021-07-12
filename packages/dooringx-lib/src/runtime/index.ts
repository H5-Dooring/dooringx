/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:33:52
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 14:43:03
 * @FilePath: \dooringx\packages\dooringx-lib\src\runtime\index.ts
 */
import ComponentRegister from '../core/components';
import { FormComponentRegister } from '../core/components/formComponentRegister';
import { StoreChanger } from '../core/storeChanger';
export const componentRegister = new ComponentRegister();
export const formRegister = new FormComponentRegister();
export const storeChanger = new StoreChanger();
