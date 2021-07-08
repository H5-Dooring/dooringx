<script context="module">
	import { browser, dev } from '$app/env';
	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	const lang = writable('cn');

	setContext('lang', lang);
</script>

<Header />
<main>
	<slot />
</main>

<style lang="scss">
	main {
		position: relative;
		height: calc(100vh - 41px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
