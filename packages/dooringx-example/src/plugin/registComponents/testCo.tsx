import { ComponentItemFactory } from 'dooringx-lib';

const TestCo = new ComponentItemFactory(
	'test',
	'测试组件',
	{},
	{
		width: 200,
		height: 55,
	},
	() => {
		return <div>测试</div>;
	},
	true
);

export default TestCo;
