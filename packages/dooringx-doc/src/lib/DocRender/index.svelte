<script lang="ts">
	import type { MarkDownItemProps } from 'src/routes/docs/_api';
	import './prism.css';
	export let sections: Map<string, MarkDownItemProps[]>;
	let arr = [];
	$: arr = Array.from(sections.keys());
	export let active = '';
</script>

<div style="display: flex;">
	<div class="sidebar">
		{#each arr as stitle}
			{#if stitle !== 'default'}
				<div
					class={`stitle ahref fbold ${active === stitle ? 'active' : ''}`}
					style="cursor: pointer;"
					title={stitle}
					on:click={() => {
						location.href = `#${stitle}`;
						active = stitle;
					}}
				>
					{@html stitle}
				</div>
				{#each sections.get(stitle) as section}
					<div class="title-item" style="cursor: pointer;">
						<span
							class={`ahref  ${active === section.metadata.title ? 'active' : ''}`}
							on:click={() => {
								location.href = `#${section.slug}`;
								active = section.metadata.title;
							}}
							title={section.metadata.title}
						>
							{@html section.metadata.title}
						</span>
					</div>
				{/each}
			{/if}
			{#if stitle === 'default'}
				{#each sections.get(stitle) as section}
					<!-- 没有主标题则二级变一级 -->
					<div class="stitle fbold" style="cursor: pointer;">
						<span
							class={`ahref  ${active === section.metadata.title ? 'active' : ''}`}
							on:click={() => {
								location.href = `#${section.slug}`;
								active = section.metadata.title;
							}}
							title={section.metadata.title}
						>
							{@html section.metadata.title}
						</span>
					</div>
				{/each}
			{/if}
		{/each}
	</div>
	<div class="markdown-wrapper">
		{#each arr as stitle}
			{#if stitle !== 'default'}
				<h1 class="stitle-content" id={stitle}>
					{@html stitle}
				</h1>
				<div class="yh-interval-s" />
			{/if}
			{#each sections.get(stitle) as section}
				<section data-id={section.slug}>
					<h2>
						<span class="offset-anchor" id={section.slug} />
						{@html section.metadata.title}
					</h2>

					{@html section.html}
				</section>
				<div class="yh-interval" />
			{/each}
		{/each}
	</div>
</div>

<style lang="scss">
	.yh-interval-s {
		width: 100%;
		padding: 2px;
	}
	.yh-interval {
		width: 100%;
		padding: 10px;
	}
	.markdown-wrapper {
		height: calc(100vh - 40px);
		overflow: auto;
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
	}
	.fbold {
		font-weight: bold;
	}
	.sidebar {
		padding: 20px;
		overflow: auto;
		height: calc(100vh - 40px);
		border-right: 1px solid #eee;
		width: 300px;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB,
			Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji,
			Segoe UI Emoji, Segoe UI Symbol;
		.ahref {
			text-decoration: none;
			color: #717484;
			&:hover {
				color: #4569d4;
			}
			&:visited,
			&:link,
			&:active {
				color: #717484;
			}
		}
		.stitle {
			margin: 20px 0;
		}
		.title-item {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			margin: 20px 0 20px 20px;

			& ::selection {
				cursor: pointer;
			}
		}
		.active {
			color: #4569d4;
		}
	}
	section :global(blockquote) {
		color: hsl(204, 100%, 50%);
		border: 2px solid var(--flash);
	}
	section :global(blockquote) :global(code) {
		background: hsl(204, 100%, 95%) !important;
		color: hsl(204, 100%, 50%);
	}

	::-webkit-scrollbar {
		width: 5px; /*对垂直流动条有效*/
		height: 5px; /*对水平流动条有效*/
	}

	/*定义滚动条的轨道颜色、内阴影及圆角*/
	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
		background-color: #eee;
		border-radius: 3px;
	}

	/*定义滑块颜色、内阴影及圆角*/
	::-webkit-scrollbar-thumb {
		border-radius: 7px;
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		background-color: #444444;
	}

	/*定义两端按钮的样式*/
	::-webkit-scrollbar-button {
		background-color: #b9c6d2;
	}

	/*定义右下角汇合处的样式*/
	::-webkit-scrollbar-corner {
		background: #b9c6d2;
	}
</style>
