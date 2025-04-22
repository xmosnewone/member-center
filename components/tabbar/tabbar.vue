<template>
	<view class="ice-TabBar-Block">
		<!-- 自定义TabBar -->
		<view class="ice-TabBar-Item" v-for="tab,index in TabBar" :key="index" @tap="tabbarItemClick(tab,index)">
			<view class="ice-TabBar-Image">
				<image :src="TabActive == index ? tab.selectedIconPath : tab.iconPath" :class="index == 1 ? 'ice-TabBar-Radius' : ''"></image>
			</view>
			<text :class="TabActive == index ? 'ice-TabBarText-Active' : ''">{{tab.text}}</text>
		</view>
		
	</view>
</template>

<script>
	let TabBar_Cont = [
		{
			"pagePath": "/pages/index/index",
			"iconPath": "/static/tabbar/home.png",
			"selectedIconPath": "/static/tabbar/home-active.png",
			"text": "首页"
		},
		{
			"pagePath": "/pages/member/index",
			"iconPath": "/static/tabbar/user.png",
			"selectedIconPath": "/static/tabbar/user.png",
			"text": "我的"
		},
		{
			"pagePath": "/pages/order/index",
			"iconPath": "/static/tabbar/order.png",
			"selectedIconPath": "/static/tabbar/order-active.png",
			"text": "订单"
		}
		
		
	]
	export default {
		props:["index"],
		data() {
			return {
				TabBar:TabBar_Cont,
				TabBar_Len : TabBar_Cont.length,
				TabActive:0
			}
		},
		mounted() {  //隐藏原生tabbar
			//uni.hideTabBar();
			this.TabActive = this.index  //加载键值
		},
		methods: {
			tabbarItemClick(tab,index){
				uni.switchTab({
					url: tab.pagePath,
					fail:function(e){
					}
				});
				
			}
		}
		
	}
</script>

<style lang="scss">
	.ice-TabBar-Block{
		height: auto;
		position: fixed;
		bottom:0px;
		width: 100%;
		background: #fff;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		flex:1;
		z-index:9999;
		border-top:1px solid #f2f2f2;
		padding-top:10rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.ice-TabBar-Item{
		width: 100%;
		text-align: center;
		.ice-TabBar-Image{
			width:100%;
			height: 26px;
			position: relative;
			image{
				width: 26px;
				height: 26px;
			}
		}
		
		text{
			text-align: center;
			font-size:14px;
			color: #000000;
			display: block;
		}
		.ice-TabBarText-Active{
			color: #07c160 !important;
		}
	}
	.ice-TabBar-Radius{
		background: #2bae67;
		position: absolute;
		width: 36px !important;
		height: 36px !important;
		padding:8px;
		border-radius:100%;
		left:50%;
		top:50%;
		box-shadow: 0px 0px 8px rgba(97, 52, 175, .8);
		transform: translate(-50%,-80%);
	}
</style>
