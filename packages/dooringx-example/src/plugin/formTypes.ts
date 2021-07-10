/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:31:20
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 17:21:04
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\formTypes.ts
 */
export interface FormBaseType {
	receive?: string;
}
export interface FormInputType extends FormBaseType {
	label: string;
	text: string;
}
export interface FormActionButtonType {}
export interface FormAnimateControlType {}
export interface FormMap {
	input: FormInputType;
	actionButton: FormActionButtonType;
	animateControl: FormAnimateControlType;
}
