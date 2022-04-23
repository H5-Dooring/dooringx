/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-23 18:53:36
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\store\index.ts
 */
import deepcopy from 'deepcopy';
import { createDefaultModalBlock } from './createModal';
import { IBlockType, IStoreData } from './storetype';

export const initialData: IStoreData = {
	container: {
		width: 375,
		height: 667,
	},
	block: [],
	modalMap: {},
	dataSource: {},
	globalState: {},
	modalConfig: {},
	origin: null,
	modalEditName: '',
};

class Store {
	static instance: Store;
	constructor(
		public storeDataList: IStoreData[] = [initialData],
		public listeners: Array<Function> = [],
		public current: number = 0,
		public forceupdate: Function = () => {}
	) {}

	getData() {
		return this.storeDataList[this.current];
	}
	getStoreList() {
		return this.storeDataList;
	}

	getListeners() {
		return this.listeners;
	}

	getIndex() {
		return this.current;
	}
	getOriginBlock() {
		if (this.isEdit()) {
			return this.getData().origin as IBlockType[];
		} else {
			return this.getData().block;
		}
	}

	/**
	 *
	 * 编辑状态转普通
	 * @param {IStoreData} data
	 * @returns
	 * @memberof Store
	 */
	changeModaltoNormal(data: IStoreData) {
		if (data.modalEditName === '') {
			return;
		}
		const tmp = data.origin || [];
		data.modalMap = { ...data.modalMap, [data.modalEditName]: data.block };
		data.block = tmp;
		data.modalEditName = '';
		data.origin = null;
		return {};
	}
	/**
	 *
	 * 非编辑转编辑且已有弹窗
	 * @param {IStoreData} data
	 * @returns
	 * @memberof Store
	 */
	changeNormalToModal(data: IStoreData, name: string) {
		if (data.modalEditName !== '') {
			return {
				success: false,
				sign: 0,
			};
		}
		const sign2 = this.isInModalMap(name);
		if (!sign2) {
			return {
				success: false,
				sign: 1,
				param: name,
			};
		}
		const tmp = data.block || [];
		const modalBlock = data.modalMap[name];
		data.block = modalBlock;
		data.modalEditName = name;
		data.origin = tmp;
		return { success: true, sign: -1 };
	}
	/**
	 *
	 * 非编辑状态新增
	 * @param {IStoreData} data
	 * @returns
	 * @memberof Store
	 */
	newModaltoNormal(data: IStoreData, name: string) {
		if (data.modalEditName !== '') {
			return;
		}
		const tmp = data.block || [];
		const modalBlock = createDefaultModalBlock();
		data.modalMap = { ...data.modalMap, [name]: modalBlock };
		data.block = modalBlock;
		data.modalEditName = name;
		data.origin = tmp;
	}

	/**
	 *
	 * 判断是否编辑
	 * @returns
	 * @memberof Store
	 */
	isEdit() {
		if (this.getData().modalEditName !== '') {
			return true;
		}
		return false;
	}

	/**
	 *
	 *  判断有没有这个弹窗
	 * @param {Store} store
	 * @param {string} name
	 * @returns
	 * @memberof Store
	 */
	isInModalMap(name: string) {
		const modalNameList = Object.keys(this.getData().modalMap);
		if (modalNameList.includes(name)) {
			return true;
		}
		return false;
	}

	/**
	 *
	 * 保存现阶段store，将store替换为新modal数据
	 */
	newModalMap(name: string) {
		const sign = this.isEdit();
		if (sign) {
			return {
				succeess: false,
				sign: 0,
			};
		}
		//新建modal name不能重名，否则直接报错
		const sign2 = this.isInModalMap(name);
		if (sign2) {
			return {
				succeess: false,
				sign: 1,
				param: name,
			};
		}
		const copyData = deepcopy(this.getData());
		this.newModaltoNormal(copyData, name);
		this.setData(copyData);
		return {
			succeess: true,
			sign: -1,
		};
	}

	/**
	 *
	 * 存储modal到主store的map中，切换主store
	 * @memberof StoreChanger
	 */
	closeModal() {
		const sign = this.isEdit();
		if (!sign) {
			return {
				success: false,
				sign: 0,
			};
		}
		const data = deepcopy(this.getData());
		this.changeModaltoNormal(data);
		this.setData(data);
		return {
			success: true,
			sign: 0,
		};
	}
	/**
	 *
	 * 删除弹窗，不能处于编辑弹窗状态
	 * @param {string} name
	 * @returns
	 */
	removeModal(name: string) {
		const sign = this.isEdit();
		if (sign) {
			return {
				success: false,
				sign: 0,
			};
		}
		const sign2 = this.isInModalMap(name);
		if (!sign2) {
			return {
				success: false,
				sign: 1,
				param: name,
			};
		}
		const cloneData: IStoreData = deepcopy(this.getData());
		delete cloneData.modalMap[name];
		this.setData(cloneData);
		return {
			success: true,
			sign: -1,
		};
	}
	/**
	 *
	 * 重置需要注册事件
	 * @param {IStoreData[]} initData
	 * @param {boolean} [check=false] 清空编辑弹窗状态
	 * @memberof Store
	 */
	resetToInitData(initData: IStoreData[], check = false) {
		this.storeDataList = initData;
		this.current = 0;
		const d = this.getData();
		//如果是编辑模式，需要修改
		if (d.modalEditName !== '' && check) {
			this.changeModaltoNormal(d);
		}
		this.emit();
	}
	/**
	 *
	 * 注意重置需要注册事件
	 * @param {IStoreData[]} initData
	 * @param {number} current
	 * @param {boolean} [check=false]
	 * @memberof Store
	 */
	resetToCustomData(initData: IStoreData[], current: number, check = false) {
		this.storeDataList = initData;
		this.current = current;
		//如果是编辑模式，需要修改
		const d = this.getData();
		if (d.modalEditName !== '' && check) {
			this.changeModaltoNormal(d);
		}
		this.emit();
	}
	resetListeners() {
		this.listeners = [];
	}

	replaceList(list: IStoreData[]) {
		this.storeDataList = list;
	}

	setForceUpdate(fn: Function) {
		this.forceupdate = fn;
	}
	forceUpdate() {
		this.forceupdate();
	}

	setIndex(num: number) {
		this.current = num;
	}

	redo() {
		const maxLength = this.storeDataList.length;
		if (this.current + 1 < maxLength) {
			this.current = this.current + 1;
			this.emit();
		}
	}

	undo() {
		if (this.current > 0) {
			this.current = this.current - 1;
			this.emit();
		}
	}

	cleanRedundant(index: number) {
		this.storeDataList = this.storeDataList.slice(0, index + 1);
	}

	setData(data: IStoreData) {
		// 如果current不是最后那个，说明后面的被undo过的，如果要新增，那么需要清除之前的
		let flag = true;
		if (this.current + 1 !== this.storeDataList.length) {
			this.cleanRedundant(this.current);
			flag = false;
		}
		this.current = this.current + 1;
		this.storeDataList[this.current] = data;
		if (flag && this.current + 1 !== this.storeDataList.length) {
			this.storeDataList.length = this.current + 1;
		}

		this.emit();
	}

	cleanLast() {
		if (this.current <= 1) {
			return;
		}
		const removeIndex = this.current - 1;
		this.storeDataList.splice(removeIndex, 1);
		this.current = this.current - 1;
	}

	emit() {
		this.listeners.forEach((fn) => {
			fn(this.getData());
		});
	}

	subscribe(listener: Function) {
		this.listeners.push(listener);
		return () => (this.listeners = this.listeners.filter((v) => v !== listener));
	}
}

export default Store;
