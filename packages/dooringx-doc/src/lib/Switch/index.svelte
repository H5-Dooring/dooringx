<script lang="ts">
	export let checked = true;
	export let disabled = false;
	export let onChange = () => {
		checked = !checked;
	};
	export let unCheckText = 'EN';
	export let checkText = '中文';
</script>

<label class="yh-switch-label">
	<input
		class="yh-swtich-input"
		type="checkbox"
		{checked}
		{disabled}
		on:change={() => {
			onChange();
		}}
	/>
	<span class={`yh-switch-sp1`}>
		{#if !checked}
			<span class="yh-switch-sp1-uncheck">
				{unCheckText}
			</span>
		{:else}
			<span class="yh-switch-sp1-check">
				{checkText}
			</span>
		{/if}
	</span>

	<span class={`yh-switch-sp2 ${checked ? 'right' : ''}`} />
</label>

<style lang="scss">
	.yh-switch-label {
		height: 22.5px;
		width: 60px;
		position: relative;
		cursor: pointer;
		display: inline-block;
		margin: 0 10px;
	}
	.yh-swtich-input {
		opacity: 0;
	}
	.yh-switch-sp1 {
		background: #fff;
		box-shadow: inset 2px 2px 4px #d9d9d9, inset -2px -2px 4px #fff, 2px 2px 4px #d9d9d9;
		color: #595959;
		height: 100%;
		left: 0;
		padding: 1px;
		position: absolute;
		top: 0;
		width: 100%;
		border-radius: 60px;
		&-uncheck {
			font-size: 10px;
			top: 7px;
			right: 10px;
			position: absolute;
		}
		&-check {
			font-size: 10px;
			left: 10px;
			top: 7px;
			position: absolute;
		}
	}

	.yh-switch-sp2 {
		height: 22.5px;
		width: 22.5px;
		background: #fff;
		border: none;
		box-shadow: 2px 2px 4px #d9d9d9;
		text-shadow: 1px 1px 4px #d9d9d9, -1px -1px 4px #fff;
		border-radius: 50%;
		display: inline-block;
		left: 0;
		position: absolute;
		transition: all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
		&.right {
			left: calc(100% - 22.5px);
		}
	}
</style>
