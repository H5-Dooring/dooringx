/*
 * @Author: yehuozhili
 * @Date: 2021-04-05 14:55:31
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-27 16:50:09
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\storeChanger\index.ts
 */

import { message } from 'antd';
import Store from '../store';
import { IStoreData } from '../store/storetype';
import { createUid, deepCopy } from '../utils';
import { storeChangerState } from './state';

export type StoreChangerMap = Record<
	'ORIGIN',
	{
		data: Array<IStoreData>;
		current: number;
		now: IStoreData;
	} | null
>;

function createDefaultModalBlock(): IStoreData['block'] {
	return [
		{
			id: createUid('modal-mask'),
			name: 'modalMask',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			zIndex: 0,
			props: {},
			resize: true,
			focus: false,
			position: 'absolute',
			display: 'block',
			syncList: [],
			canDrag: false,
			eventMap: {},
			functionList: [],
			animate: {},
			fixed: true,
			rotate: {
				value: 0,
				canRotate: false,
			},
		},
	];
}

// 用来存储主store
const ORIGIN = 'ORIGIN';

const defaultModalStore: () => IStoreData = () => {
	const newblock = createDefaultModalBlock();
	return {
		container: {
			width: 375,
			height: 600,
		},
		block: newblock,
		modalMap: {},
		dataSource: {},
		globalState: {},
		modalConfig: {},
	};
};

export class StoreChanger {
	public map: StoreChangerMap;
	constructor() {
		this.map = { ORIGIN: null };
	}

	getState() {
		return storeChangerState;
	}

	getOrigin() {
		return this.map[ORIGIN];
	}

	isEdit() {
		if (storeChangerState.modalEditName !== '') {
			return true;
		}
		return false;
	}

	isInModalMap(store: Store, name: string) {
		const modalNameList = Object.keys(store.getData().modalMap);
		if (modalNameList.includes(name)) {
			return true;
		}
		return false;
	}

	initStoreChanger() {
		storeChangerState.modalEditName = '';
		this.map = { ORIGIN: null };
	}

	/**
	 *
	 * 更新origin内容，用于编辑模式下更新全局属性
	 * 需要判断是否在编辑模式,否则会报错
	 * @memberof StoreChanger
	 */
	updateOrigin(data: IStoreData) {
		const origin = this.getOrigin();
		if (origin!.data.length === origin!.current + 1) {
			//说明为末尾，
			origin!.data.push(data);
		} else {
			//替换下一个索引
			origin!.data[origin!.current + 1] = data;
		}
		origin!.now = data;
		origin!.current = origin!.current + 1;
	}

	/**
	 *
	 * 保存现阶段store，将store替换为新modal数据
	 * @memberof StoreChanger
	 */
	newModalMap(store: Store, name: string) {
		const sign = this.isEdit();
		if (sign) {
			message.error('请保存弹窗后编辑其他弹窗');
			return;
		}
		//新建modal name不能重名，否则直接报错
		const sign2 = this.isInModalMap(store, name);
		if (sign2) {
			message.error(`已有重名弹窗:${name}`);
			return;
		}
		storeChangerState.modalEditName = name;
		this.map[ORIGIN] = {
			data: store.getStoreList(),
			current: store.getIndex(),
			now: store.getStoreList()[store.getIndex()],
		};
		store.resetToInitData([defaultModalStore()]);
	}

	/**
	 *
	 * 存储modal到主store的map中，切换主store
	 * @param {Store} store
	 * @memberof StoreChanger
	 */
	closeModal(store: Store) {
		const sign = this.isEdit();
		if (!sign) {
			message.error('您并没有正在编辑弹窗');
			return;
		}
		const main = this.map[ORIGIN];
		const tmpModalData = deepCopy(store.getData());
		if (main) {
			store.resetToCustomData(main.data, main.current);
			const cloneData: IStoreData = deepCopy(store.getData());
			cloneData.modalMap[storeChangerState.modalEditName] = tmpModalData;
			store.setData(cloneData);
			storeChangerState.modalEditName = '';
		}
	}

	/**
	 *
	 * 在已经保存的map中获取，如果正在编辑别的弹窗，则报错。
	 * @param {Store} store store必须为主store
	 * @param {string} name
	 * @memberof StoreChanger
	 */
	updateModal(store: Store, name: string) {
		const sign = this.isEdit();
		if (sign) {
			message.error('请保存弹窗后编辑其他弹窗');
			return;
		}
		const sign2 = this.isInModalMap(store, name);
		if (!sign2) {
			message.error(`未找到该弹窗:${name}`);
			return;
		}
		storeChangerState.modalEditName = name;
		const modalData = store.getData().modalMap[name];
		this.map[ORIGIN] = {
			data: store.getStoreList(),
			current: store.getIndex(),
			now: store.getStoreList()[store.getIndex()],
		};
		store.resetToInitData([modalData]);
	}

	/**
	 *
	 * 删除弹窗，不能处于编辑弹窗状态
	 * @param {Store} store
	 * @param {string} name
	 * @returns
	 * @memberof StoreChanger
	 */
	removeModal(store: Store, name: string) {
		const sign = this.isEdit();
		if (sign) {
			message.error('请保存弹窗后删除其他弹窗');
			return;
		}
		const sign2 = this.isInModalMap(store, name);
		if (!sign2) {
			message.error(`未找到该弹窗:${name}`);
			return;
		}
		const cloneData: IStoreData = deepCopy(store.getData());
		delete cloneData.modalMap[name];
		store.setData(cloneData);
	}
}
