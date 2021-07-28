<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { base } from '$app/paths';
	const docs = base + '/docs';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
		<div class="middle" style="background:#282c34">
				<div class="title">
					Dooringx-lib 文档
				</div>
				<div class="subtitle">
					快速高效搭建可视化拖拽平台
				</div>
				<div class="btn" on:click={()=>location.href=docs}>
					快速入门
				</div>
		</div>
		<div class="bottom">
			<div class="card">
				<div class="stitle">上手简单</div>
				<div class="description">
					无需编写拖拽、缩放、参考线等逻辑，只需要开发组件即可。
				</div>
			</div>
			<div class="card">
				<div class="stitle">独特的弹窗与事件机制</div>
				<div class="description">
					弹窗机制解决了很多编辑器无法配置弹窗的问题。独特的事件机制可以让组件间联动，使得组件无限可能。
				</div>
			</div>
			<div class="card">
				<div class="stitle">可定制化</div>
				<div class="description">
					编辑器完全拆分，提供了内置组件可供使用，如果觉得组件不能满足需求，也可以重写部分组件。
				</div>
			</div>
		</div>
		
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
	}
	.middle{
		width: 100%;
		height: 300px;
		display: flex ;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.title{
		color:white;
		font-size: 50px;
		margin-bottom: 20px;
	}
	.subtitle{
		color:white;
		margin-bottom: 30px;
		font-size: 20px;
	}
	.btn{
		color:white;
		padding:10px;
		border:1px solid white;
		&:hover{
			cursor: pointer;
		}
	}
	.bottom{
		width: 100%;
		height: 300px;
		padding:0 100px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 20px;
	}
	.stitle{
		width: 100%;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
	}

</style>
