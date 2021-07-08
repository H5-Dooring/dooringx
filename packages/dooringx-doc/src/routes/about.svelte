<script lang="ts">
	import Icon from '$lib/Icon/index.svelte';
	import Icons from '$lib/Icons/index.svelte';
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Icons />

<div class="content">
	<h1>About this app</h1>
	<Icon name="arrow-left" />
	<Icon name="arrow-right" />

	<Icon name="arrow-up" />
	<Icon name="arrow-down" />
	<Icon name="check" />
	<Icon name="close" />
	<Icon name="download" />
	<Icon name="edit" />
	<Icon name="github" />
	<Icon name="git-branch" />
	<Icon name="log-in" />
	<Icon name="maximize" />
	<Icon name="maximize-2" />
	<Icon name="menu" />
	<Icon name="message-square" />
	<Icon name="minus" />
	<Icon name="plus" />
	<Icon name="save" />
	<Icon name="link" />
	<Icon name="chevron" />
	<Icon name="404" />
	<Icon name="user" />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
