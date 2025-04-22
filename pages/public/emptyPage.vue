<template>
	<view class="empty-box">
		<image src="/static/images/empty.png"></image>
		<view class="txt">{{title || '暂无记录'}}</view>
	</view>
</template>

<script>
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default{
		props: {
			title: {
				type: String,
				default: '',
			},
		},
		data(){
			return{
				imgHost:HTTP_REQUEST_URL
			}
		}
	}
	
</script>

<style lang="scss">
	.empty-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 200rpx;
		image{
			width: 414rpx;
			height: 240rpx;
		}
		.txt{
			font-size: 26rpx;
			color: #999;
		}
	}
</style>
