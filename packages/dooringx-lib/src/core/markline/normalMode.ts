import { IBlockType } from '../store/storetype';
import { LinesTypes } from './calcRender';
import { marklineConfig } from './marklineConfig';
export function switchMarklineDisplay(
	l: number,
	t: number,
	w: number | string | undefined,
	h: number | string | undefined,
	left: number,
	top: number,
	width: number,
	height: number,
	lines: LinesTypes,
	focus: IBlockType
) {
	// 做吸附只能选择一个接近的吸，所以只匹配一个即可。
	// 头对头
	if (marklineConfig.isAbsorb) {
		if (Math.abs(top - t) < marklineConfig.indent) {
			lines.x.push(t);
			focus.top = t;
		}
		// 中对头
		else if (Math.abs(top + height / 2 - t) < marklineConfig.indent) {
			lines.x.push(t);
			focus.top = t - height / 2;
		}
		// 尾对头
		else if (Math.abs(top + height - t) < marklineConfig.indent) {
			lines.x.push(t);
			focus.top = t - height;
		} else if (h && typeof h === 'number') {
			// 头对中
			if (Math.abs(t + h / 2 - top) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
				focus.top = t + h / 2;
			}
			// 中对中
			else if (Math.abs(t + h / 2 - top - height / 2) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
				focus.top = t + h / 2 - height / 2;
			}
			// 尾对中
			else if (Math.abs(t + h / 2 - top - height) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
				focus.top = t + h / 2 - height;
			}
			// 头对尾
			else if (Math.abs((t + h - top) / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
				focus.top = t + h;
			}
			// 中对尾
			else if (Math.abs(t + h - top - height / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
				focus.top = t + h - height / 2;
			}
			// 尾对尾
			else if (Math.abs((t + h - top - height) / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
				focus.top = t + h - height;
			}
		}
		// x轴方向
		// 头对头
		if (Math.abs(left - l) < marklineConfig.indent) {
			lines.y.push(l);
			focus.left = l;
		}
		// 中对头
		else if (Math.abs(left + width / 2 - l) < marklineConfig.indent) {
			lines.y.push(l);
			focus.left = l - width / 2;
		}
		// 尾对头
		else if (Math.abs(left + width - l) < marklineConfig.indent) {
			lines.y.push(l);
			focus.left = l - width;
		} else if (w && typeof w === 'number') {
			// 头对中
			if (Math.abs(l + w / 2 - left) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
				focus.left = l + w / 2;
			}
			// 中对中
			else if (Math.abs(l + w / 2 - left - width / 2) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
				focus.left = l + w / 2 - width / 2;
			}
			// 尾对中
			else if (Math.abs(l + w / 2 - left - width) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
				focus.left = l + w / 2 - width;
			}
			// 头对尾
			else if (Math.abs((l + w - left) / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
				focus.left = l + w;
			}
			// 中对尾
			else if (Math.abs(l + w - left - width / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
				focus.left = l + w - width / 2;
			}
			// 尾对尾
			else if (Math.abs((l + w - left - width) / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
				focus.left = l + w - width;
			}
		}
	} else {
		if (Math.abs(top - t) < marklineConfig.indent) {
			lines.x.push(t);
		}
		// 中对头
		if (Math.abs(top + height / 2 - t) < marklineConfig.indent) {
			lines.x.push(t);
		}
		// 尾对头
		if (Math.abs(top + height - t) < marklineConfig.indent) {
			lines.x.push(t);
		}
		if (h && typeof h === 'number') {
			// 头对中
			if (Math.abs(t + h / 2 - top) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
			}
			// 中对中
			if (Math.abs(t + h / 2 - top - height / 2) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
			}
			// 尾对中
			if (Math.abs(t + h / 2 - top - height) < marklineConfig.indent) {
				lines.x.push(t + h / 2);
			}
			// 头对尾
			if (Math.abs((t + h - top) / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
			}
			// 中对尾
			if (Math.abs(t + h - top - height / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
			}
			// 尾对尾
			if (Math.abs((t + h - top - height) / 2) < marklineConfig.indent) {
				lines.x.push(t + h);
			}
		}
		// x轴方向
		// 头对头
		if (Math.abs(left - l) < marklineConfig.indent) {
			lines.y.push(l);
		}
		// 中对头
		if (Math.abs(left + width / 2 - l) < marklineConfig.indent) {
			lines.y.push(l);
		}
		// 尾对头
		if (Math.abs(left + width - l) < marklineConfig.indent) {
			lines.y.push(l);
		}
		if (w && typeof w === 'number') {
			// 头对中
			if (Math.abs(l + w / 2 - left) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
			}
			// 中对中
			if (Math.abs(l + w / 2 - left - width / 2) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
			}
			// 尾对中
			if (Math.abs(l + w / 2 - left - width) < marklineConfig.indent) {
				lines.y.push(l + w / 2);
			}
			// 头对尾
			if (Math.abs((l + w - left) / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
			}
			// 中对尾
			if (Math.abs(l + w - left - width / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
			}
			// 尾对尾
			if (Math.abs((l + w - left - width) / 2) < marklineConfig.indent) {
				lines.y.push(l + w);
			}
		}
	}
}

export function switchMarklineResizeDisplay(
	l: number,
	t: number,
	w: number | string | undefined,
	h: number | string | undefined,
	left: number,
	top: number,
	width: number,
	height: number,
	lines: LinesTypes
) {
	// 头对头
	if (Math.abs(top - t) <= marklineConfig.resizeIndent) {
		lines.x.push(t);
	}
	// 中对头
	if (Math.abs(top + height / 2 - t) <= marklineConfig.resizeIndent) {
		lines.x.push(t);
	}
	// 尾对头
	if (Math.abs(top + height - t) <= marklineConfig.resizeIndent) {
		lines.x.push(t);
	}
	if (h && typeof h === 'number') {
		// 头对中
		if (Math.abs(t + h / 2 - top) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h / 2);
		}
		// 中对中
		if (Math.abs(t + h / 2 - top - height / 2) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h / 2);
		}
		// 尾对中
		if (Math.abs(t + h / 2 - top - height) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h / 2);
		}
		// 头对尾
		if (Math.abs((t + h - top) / 2) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h);
		}
		// 中对尾
		if (Math.abs(t + h - top - height / 2) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h);
		}
		// 尾对尾
		if (Math.abs((t + h - top - height) / 2) <= marklineConfig.resizeIndent) {
			lines.x.push(t + h);
		}
	}
	// x轴方向
	// 头对头
	if (Math.abs(left - l) <= marklineConfig.resizeIndent) {
		lines.y.push(l);
	}
	// 中对头
	if (Math.abs(left + width / 2 - l) <= marklineConfig.resizeIndent) {
		lines.y.push(l);
	}
	// 尾对头
	if (Math.abs(left + width - l) <= marklineConfig.resizeIndent) {
		lines.y.push(l);
	}
	if (w && typeof w === 'number') {
		// 头对中
		if (Math.abs(l + w / 2 - left) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w / 2);
		}
		// 中对中
		if (Math.abs(l + w / 2 - left - width / 2) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w / 2);
		}
		// 尾对中
		if (Math.abs(l + w / 2 - left - width) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w / 2);
		}
		// 头对尾
		if (Math.abs((l + w - left) / 2) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w);
		}
		// 中对尾
		if (Math.abs(l + w - left - width / 2) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w);
		}
		// 尾对尾
		if (Math.abs((l + w - left - width) / 2) <= marklineConfig.resizeIndent) {
			lines.y.push(l + w);
		}
	}
}
