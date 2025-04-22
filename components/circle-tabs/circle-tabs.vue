<template>
	<div :class="mode=='circle'?'tab-list':'tab-list-skew'">
		<div v-for="tab in tabList" :key="tab.id" class="tab-item"
			:class="value === tab.id ? 'tab-selected' : mode=='circle'?'':'not-selected'"
			@click="onTab(tab.id)">
			<image v-if="tab.icon" :src="tab.icon" class="tab-icon" />
			<div>{{ tab.title }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			value:{
				type:[String,Number],
				default:0
			},
			tabList: {
				type: Array,
				default: () => []
			},
			mode: {
				type: String,
				default: 'skew'
			}
		},
		data() {
			return {
			}
		},
		methods: {
			onTab(id) {
				this.$emit('input',id)
			}
		}
	}
</script>

<style lang="scss">
	.tab-list {
		display: flex;
		border-radius: 12px 12px 0 0;
		background-color: #fafafa;
		overflow: hidden;

		.tab-item {
			flex: 1;
			height: 52px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 15px;
			// opacity: 0.65;
			color: #333;
			font-weight: normal;
			position: relative;

		}

		.tab-icon {
			width: 17px;
			height: 17px;
			margin-right: 4px;
		}

		.tab-selected {
			opacity: 1;
			background: #fff;
			border-radius: 12px 12px 0 0;
			box-shadow: 12px 12px 0 0 #ffffff, -12px 12px 0 0 #ffffff;
			color: green;
		}

		.tab-selected::before {
			content: '';
			position: absolute;
			left: -12px;
			bottom: 0;
			width: 12px;
			height: 52px;
			background: #fafafa;
			border-radius: 0 0 12px 0;
		}

		.tab-selected::after {
			content: '';
			position: absolute;
			right: -12px;
			bottom: 0;
			width: 12px;
			height: 52px;
			background: #fafafa;
			border-radius: 0 0 0 12px;
		}

	}

	.tab-list-skew {
		display: flex;
		position: relative;
		z-index: 2;
		border-radius: 12px 12px 0 0;
		background-color: #fafafa;
		overflow: hidden;


		.tab-item{
			flex: 1;
			height: 52px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 15px;
			// opacity: 0.65;
			color: #333;
			font-weight: 600;
			position: relative;
		}
		.tab-icon {
			width: 17px;
			height: 17px;
			margin-right: 4px;
			margin-top: 1px;
		}

		.tab-selected {
			opacity: 1;
			background: #ffffff;
			border-radius: 12px 12px 0 0;
			box-shadow: 24px 40px 0 #ffffff, -24px 40px 0 0 #ffffff; // 重点
		}


		.tab-selected::before {
			content: '';
			position: absolute;
			left: -6px;
			bottom: 0;
			width: 12px;
			height: 52px;
			border-top-left-radius: 12px;
			background-color: #fff;
			transform: skewX(-15deg); // 重点
		}

		.tab-selected::after {
			content: '';
			position: absolute;
			right: -6px;
			bottom: 0;
			width: 12px;
			height: 52px;
			background-color: #fff;
			border-top-right-radius: 12px;
			transform: skewX(15deg); // 重点
			
		}

		.not-selected::before {
			content: '';
			position: absolute;
			left: 6px;
			bottom: 0;
			width: 12px;
			height: 52px;
			background: #fafafa;
			border-bottom-left-radius: 12px;
			transform: skewX(15deg); // 重点
		}

		.not-selected::after {
			content: '';
			position: absolute;
			right: 6px;
			bottom: 0;
			width: 12px;
			height: 52px;
			background: #fafafa;
			border-bottom-right-radius: 12px;
			transform: skewX(-15deg); // 重点
			z-index: 1;
		}
	}
</style>
