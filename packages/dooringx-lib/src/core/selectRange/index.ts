import { IStoreData } from '../store/storetype';
import { deepCopy } from '../utils';
import style from '../../index.less';
import UserConfig from '../../config';
import { getComponentRotatedStyle } from '../markline/calcRender';
export interface SelectDataProps {
	selectDiv: HTMLDivElement | null;
	posx: number;
	posy: number;
	startX: number;
	startY: number;
}

export const selectData: SelectDataProps = {
	selectDiv: null,
	posx: 0,
	posy: 0,
	startX: 0,
	startY: 0,
};

export function selectRangeMouseDown(e: React.MouseEvent, config: UserConfig) {
	if (!selectData.selectDiv) {
		selectData.selectDiv = document.createElement('div');
	}
	if (selectData.selectDiv) {
		selectData.startX = e.nativeEvent.offsetX;
		selectData.startY = e.nativeEvent.offsetY;
		selectData.posx = e.clientX;
		selectData.posy = e.clientY;
		selectData.selectDiv.className = style.yhTempDiv;
		selectData.selectDiv.style.left = e.clientX + 'px';
		selectData.selectDiv.style.top = e.clientY + 'px';
		selectData.selectDiv.style.position = 'fixed';
		document.body.appendChild(selectData.selectDiv);
		selectData.selectDiv.onmouseup = (e) => selectRangeMouseUp(e, config);
		selectData.selectDiv.onmousemove = (e) => selectRangeMouseMove(e);
	}
}

export function selectRangeMouseMove(ev: React.MouseEvent | MouseEvent) {
	if (selectData.selectDiv) {
		selectData.selectDiv.style.left = Math.min(ev.clientX, selectData.posx) + 'px';
		selectData.selectDiv.style.top = Math.min(ev.clientY, selectData.posy) + 'px';
		selectData.selectDiv.style.width = Math.abs(selectData.posx - ev.clientX) + 'px';
		selectData.selectDiv.style.height = Math.abs(selectData.posy - ev.clientY) + 'px';
	}
}

function typeGuard(e: React.MouseEvent | MouseEvent): e is React.MouseEvent {
	return !(e instanceof Event);
}

function selectFocus(left: number, top: number, width: number, height: number, config: UserConfig) {
	if (width === 0 || height === 0) {
		return;
	}
	const store = config.getStore();
	const clonedata: IStoreData = deepCopy(store.getData());
	const focusState = config.getFocusState();
	const blocks = clonedata.block;
	let change = false;
	const maxleft = left + width;
	const maxtop = top + height;
	blocks.forEach((v) => {
		const l = v.left;
		const t = v.top;
		const w = v.width;
		const h = v.height;
		if (
			typeof l === 'number' &&
			typeof t === 'number' &&
			typeof w === 'number' &&
			typeof h === 'number' &&
			v.canDrag === true
		) {
			const style = getComponentRotatedStyle(v.rotate.value, w, h, l, t);
			if (
				style.left >= left &&
				style.right <= maxleft &&
				style.top >= top &&
				style.bottom <= maxtop
			) {
				change = true;
				v.focus = true;
				focusState.blocks.push(v);
			}
		}
	});
	if (change) {
		store.setData(clonedata);
	}
}

export function selectRangeMouseUp(e: React.MouseEvent | MouseEvent, config: UserConfig) {
	if (selectData.selectDiv) {
		// 这里需要判定区域
		// 如果是react触发 ，left和top就是起始值和终止值的最小值
		// 如果是原生触发，left和top是起始点减去其宽高
		let left = 0;
		let top = 0;
		const scaleState = config.getScaleState();
		const { width, height } = selectData.selectDiv.getBoundingClientRect();
		const scale = scaleState.value;
		const wwidth = width / scale;
		const wheight = height / scale;
		if (typeGuard(e)) {
			left = Math.min(e.nativeEvent.offsetX, selectData.startX);
			top = Math.min(e.nativeEvent.offsetY, selectData.startY);
		} else {
			left = selectData.startX - wwidth;
			top = selectData.startY - wheight;
		}
		selectFocus(left, top, wwidth, wheight, config);
		selectData.selectDiv.parentNode!.removeChild(selectData.selectDiv);
		selectData.selectDiv = null;
	}
}
