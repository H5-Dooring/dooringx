/*
 * @Author: yehuozhili
 * @Date: 2021-04-08 20:22:43
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-06-28 16:08:56
 * @FilePath: \DooringV2\packages\dooring-v2-lib\src\core\eventCenter\eventQuene.ts
 */
import { EventCenterMapItem, EventCenterUserSelect } from '.';
import UserConfig from '../../config';
import { FunctionCenterFunction } from '../functionCenter';

export class EventQuene {
	available: number;
	waiters: Array<{
		fn: FunctionCenterFunction;
		args: any;
		eventList: {
			arr: Array<EventCenterMapItem>;
			displayName: string;
			userSelect: Array<EventCenterUserSelect>;
		};
		iname: EventCenterMapItem;
	}>;
	context: Record<string, any>;
	config: UserConfig;
	constructor(available: number = 1, config: UserConfig, context = {}) {
		this.available = available;
		this.waiters = [];
		this._continue = this._continue.bind(this);
		this.context = context;
		this.config = config;
	}
	take(
		task: FunctionCenterFunction,
		args: Record<string, any>,
		eventList: {
			arr: Array<EventCenterMapItem>;
			displayName: string;
			userSelect: Array<EventCenterUserSelect>;
		},
		iname: EventCenterMapItem
	) {
		if (this.available > 0) {
			this.available--;
			task(this.context, this.leave.bind(this), this.config, args, eventList, iname);
		} else {
			this.waiters.push({ fn: task, args: args, eventList, iname });
		}
	}
	leave() {
		this.available++;
		if (this.waiters.length > 0) {
			this._continue();
		}
	}
	_continue() {
		if (this.available > 0) {
			this.available--;
			let task = this.waiters.shift();
			if (task?.fn) {
				task.fn(
					this.context,
					this.leave.bind(this),
					this.config,
					task.args,
					task.eventList,
					task.iname
				);
			}
		}
	}
}
