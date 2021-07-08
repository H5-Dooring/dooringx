/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-04-04 23:14:00
 * @FilePath: \dooringv2\src\core\components\abstract.ts
 */
import { ComponentItem } from './componentItem';

export class ComponentItemFactory implements ComponentItem {
	constructor(
		public name: ComponentItem['name'],
		public display: ComponentItem['display'],
		public props: ComponentItem['props'],
		public initData: ComponentItem['initData'],
		public render: ComponentItem['render'],
		public resize: ComponentItem['resize'] = true,
		public needPosition: ComponentItem['needPosition'] = true,
		public init: ComponentItem['init'] = () => {},
		public destroy: ComponentItem['destroy'] = () => {}
	) {}
}
