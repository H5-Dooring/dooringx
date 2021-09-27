/*
 * @Author: yehuozhili
 * @Date: 2021-09-27 20:56:21
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-27 20:57:01
 * @FilePath: \dooringx\packages\dooringx-lib\src\components\control\state.ts
 */

interface MoveStateType {
	startX: number;
	startY: number;
	fn: Function;
	isMove: boolean;
}

export const moveState: MoveStateType = {
	startX: 0,
	startY: 0,
	fn: () => {},
	isMove: false,
};

export const mouseUp = () => {
	if (moveState.isMove) {
		moveState.isMove = false;
	}
};

export const controlMouseMove = (e: React.MouseEvent) => {
	if (moveState.isMove) {
		const diffx = e.clientX - moveState.startX;
		const diffy = e.clientY - moveState.startY;
		const setXy = moveState.fn;
		if (setXy) setXy((pre: { x: number; y: number }) => ({ x: pre.x + diffx, y: pre.y + diffy }));
		moveState.startX = e.clientX;
		moveState.startY = e.clientY;
	}
};
