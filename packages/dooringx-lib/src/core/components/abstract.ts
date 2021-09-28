/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-28 20:48:17
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\components\abstract.ts
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
		public destroy: ComponentItem['destroy'] = () => {},
		public url: ComponentItem['url'] = ''
	) {}
}
