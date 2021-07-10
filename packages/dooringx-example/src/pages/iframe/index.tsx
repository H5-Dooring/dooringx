/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 20:16:00
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 22:18:55
 * @FilePath: \visual-editor\src\pages\iframe\index.tsx
 */

function IframePage() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<iframe style={{ width: '375px', height: '667px' }} src="/preview"></iframe>
		</div>
	);
}
export default IframePage;
