<script lang="ts">
	export let href = '';
	export let color = '#4d5164';
	let backgroundColor = 'white';
	export let style = '';
	export let onClick = () => {};
</script>

<button
	class="yh-btn"
	style={`color: ${color} ; background-color:${backgroundColor};${style} `}
	on:click={() => {
		if (href !== '') {
			location.href = href;
		}
		onClick();
	}}
>
	<slot />
</button>

<style lang="scss">
	.yh-btn {
		border: none;
		transition: all 0.3s linear;
		padding: 5px 20px;
		&:active,
		&:hover,
		&:focus {
			border: none;
			outline-width: 0;
		}
		&:hover {
			cursor: pointer;
		}
	}
</style>
