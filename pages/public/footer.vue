<template>
	
	<view class="bottom">
		<view class="footlogo"><image src="/static/images/logo.png"/></view>
		<view class="ver">{{title}} © 2025<br/>
			<a href="https://www.icepos.cn">www.icepos.cn</a>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: "pageFooter",
		data: function() {
			return {
					title:this.$config['APP_NAME']
			};
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.bottom {
		display: block;
		width: 100%;
		justify-content: center;
		color: #999999;
		margin-top:30rpx;
	}
	.bottom .ver {
		width: 100%;
		font-size: 20rpx;
		text-align: center;
	}
	.bottom a {
			color: #999999;
			margin-left: 10rpx;
			text-decoration: none;
	}
	.footlogo{
		width:100%;
		height: 100rpx;
		align-items: center;
		text-align:center;
		image{
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>