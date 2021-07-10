<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import Button from '../Button/index.svelte';
	import Switch from '../Switch/index.svelte';
	import logo from './svelte-logo.svg';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	const lang = getContext<Writable<string>>('lang');
	let checked = true;
	lang.subscribe((value) => {
		value === 'cn' ? (checked = true) : (checked = false);
	});
	const home = base + '/';
	const docs = base + '/docs';
	const api = base + '/api';
</script>

<header>
	<div class="corner">
		<img src={logo} alt="SvelteKit" />
	</div>

	<nav style="width: 100%;">
		<div class="nav-item-wrapper">
			<div class:active={$page.path === '/'}>
				<Button href={home} color={$page.path === '/' ? '#4569d4' : '#4d5164'}>首页</Button>
			</div>
			<div class:active={$page.path === '/docs'}>
				<Button href={docs} color={$page.path === '/docs' ? '#4569d4' : '#4d5164'}>文档</Button>
			</div>
			<div class:active={$page.path === '/api'}>
				<Button href={api} color={$page.path === '/api' ? '#4569d4' : '#4d5164'}>API</Button>
			</div>
			<div class:active={$page.path === '/about'}>
				<Button>Github</Button>
			</div>

			<!-- <Switch
				{checked}
				onChange={() => {
					lang.update((pre) => {
						return pre === 'cn' ? 'en' : 'cn';
					});
				}}
			/> -->
		</div>
	</nav>
</header>

<style lang="scss">
	$height: 40px;
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB,
			Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji,
			Segoe UI Emoji, Segoe UI Symbol;
		border-bottom: 1px solid #e2e2e2;
	}
	.active {
		color: #4569d4;
	}
	.corner {
		height: $height;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 20px;
		img {
			width: $height - 5px;
			height: $height - 5px;
		}
	}
	.nav-item-wrapper {
		height: $height;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		:nth-last-child(1) {
			margin-right: 20px;
		}
	}
</style>
