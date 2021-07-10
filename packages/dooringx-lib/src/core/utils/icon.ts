/*
 * @Author: yehuozhili
 * @Date: 2021-07-10 16:52:41
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 18:28:18
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\utils\icon.ts
 */
import { createFromIconfontCN } from '@ant-design/icons';

export const IconFont = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_2607370_zx7pglxj1m.js', // 在 iconfont.cn 上生成
	extraCommonProps: {
		fill: 'currentColor',
		stroke: 'currentColor',
	},
});
