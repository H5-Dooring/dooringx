export interface IPluginConfig {
	key: string;
	name: string;
	attr: any;
	render: (props: any) => JSX.Element;
	resize?: boolean;
}
