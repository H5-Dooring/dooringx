import { defineConfig } from 'dumi';
export default defineConfig({
	title: 'Dooringx',
	favicon: 'https://yehuozhili-1259443377.cos.ap-nanjing.myqcloud.com/dooringxlogo.png',
	logo: 'https://img-blog.csdnimg.cn/img_convert/520863a38a93d960862f92c805bc97cc.png#pic_center',
	outputPath: 'docs-dist',
	mode: 'site',
	locales: [
		['zh', '中文'],
		['en', 'English'],
	],
	styles: [
		`
  .__dumi-default-navbar-logo{
    padding-left: 200px !important;
    text-indent: -10000px;
  }
  `,
	],
	navs: {
		// 多语言 key 值需与 locales 配置中的 key 一致
		en: [
			null, // null 值代表保留约定式生成的导航，只做增量配置
			{
				title: 'GitHub',
				path: 'https://github.com/H5-Dooring/dooringx',
			},
		],
		zh: [
			null, // null 值代表保留约定式生成的导航，只做增量配置
			{
				title: 'GitHub',
				path: 'https://github.com/H5-Dooring/dooringx',
			},
		],
	},
	base: process.env.NODE_ENV === 'production' ? '/dooringx' : '/',
	publicPath: process.env.NODE_ENV === 'production' ? '/dooringx/' : '/',
	// more config: https://d.umijs.org/config
});
