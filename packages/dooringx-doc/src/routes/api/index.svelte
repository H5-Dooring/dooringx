<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { MarkDownItemProps } from '../docs/_api';
	import { base } from '$app/paths';
	export const load: Load = async ({ fetch }) => {
		const path = `${base}/api.json?name=api`;
		const res = await fetch(path);
		if (res.ok) {
			const files: MarkDownItemProps[] = await res.json();
			return {
				props: { files: files }
			};
		}
		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	import DocRender from '$lib/DocRender/index.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let files: MarkDownItemProps[];
	const lang = getContext<Writable<string>>('lang');
	let sections = new Map<string, MarkDownItemProps[]>();
	lang.subscribe((la) => {
		sections = new Map<string, MarkDownItemProps[]>();
		let tmp = files.filter((v) => {
			const name = v.file;
			const sp = name.split('.');
			if (Array.isArray(sp) && sp.length > 1 && sp[sp.length - 2] === 'EN') {
				return la === 'en';
			} else {
				return la === 'cn';
			}
		});
		tmp.forEach((v) => {
			const stitle = v.sTitle || 'default';
			const value = sections.get(stitle);
			if (value) {
				value.push(v);
			} else {
				sections.set(stitle, [v]);
			}
		});
	});

	let active = '';
</script>

<svelte:head>
	<title>API Docs • Svelte</title>
	<meta name="twitter:title" content="Svelte API docs" />
	<meta name="twitter:description" content="Cybernetically enhanced web apps" />
	<meta name="Description" content="Cybernetically enhanced web apps" />
</svelte:head>

<DocRender {active} {sections} />

<style lang="scss">
</style>
