<template>
	<view class="container my-order">
		
		<view class="mine_bg">
			<view class="mine_info">
				<image class="mine__bg--avatar" @click="memberLogin" style="background: #a5e5ee" :src="userInfo.headimg ? userInfo.headimg : '/static/default-avatar.png'"></image>
				<view class="mine__info--cell" v-if="!isLogin">
							<view class="mine__info--name">
				            <text @click="memberLogin">立即登录</text>
				            <text class="level_name">普通会员</text>
				          </view>
					<view class="mine__info--desc">登录体验完整功能</view>
				</view>
			  <view class="mine__info--cell" v-if="isLogin">
				  <view class="mine__info--name">
					  <text>{{userInfo.nickname}}</text>
				    <text class="level_name">{{userInfo.levelname}}</text>
				  </view>
			  </view>
			</view>
		</view>
		
		<view class="mine__cell-wrap">
			  <!-- 订单信息 -->
				<view class="mine__order mine__cell border-radius">
						<view class="flex justify-between align-center pl-30 pr-30 pt-20 pb-20 border-b">
							<view class="flex">
								<view class="text-df ml-10 text-bold">我的资产</view>
							</view>
				  
						</view>

						<view class="flex justify-around pt-30 pb-30">
							<view class="flex flex-direction align-center" @tap="myaccount()">
								<view class="text-xl mb-5">{{isLogin?userInfo.account:'0'}}</view>
								<view class="text-sm text-gray">余额（元）</view>
							</view>

						<view class="flex flex-direction align-center">
								<view class="text-xl mb-5" >{{isLogin?userInfo.credit:'0'}}</view>
								<view class="text-sm text-gray">积分</view>
						</view>
						<view class="flex flex-direction align-center">
								<view class="text-xl mb-5" >{{isLogin?userInfo.order_count:'0'}}</view>
								<view class="text-sm text-gray">我的订单</view>
							</view>
							
						</view>
					</view>
	    </view>
		
		<view class="orderNav">
			<view class="orderTab">
				<view class="navTitle">
					<text class="title">我的订单</text>
					<text class="hyperlink" @click="orderPage">全部订单 &gt;</text>
				</view>
				<view class="items" @click="orderStatus(1)">
					<image src="/static/images/member/unpay.png" />
					<text>未支付</text>
				</view>
				<view class="items" @click="orderStatus(2)">
					<image src="/static/images/member/refund.png" />
					<text>已退款</text>
				</view>
				<view class="items" @click="orderStatus(3)">
					<image src="/static/images/member/complete.png" style="width:60rpx;height: 60rpx;;"/>
					<text>已完成</text>
				</view>
			</view>
		</view>
		
		<view class="myservice">
			<view class="serviceTab">
				<view class="navTitle">
					<text class="title">我的服务</text>
				</view>
				<view class="items" @click="myService(1)">
					<image src="/static/images/member/account.png" />
					<text>账户余额</text>
				</view>
				<view class="items" @click="myService(2)">
					<image src="/static/images/member/credit.png" />
					<text>积分记录</text>
				</view>
				<view class="items" @click="myService(3)">
					<image src="/static/images/member/report.png" />
					<text>年度账单</text>
				</view>
			</view>
		</view>
		
		<view class="advs">
			<view class="adv" v-for="(dataItem, index) in banner" :key="index">
				<image mode="widthFix" :src="dataItem.image" @click="onLink(dataItem.url)">
			</view>
		</view>
		
		<tabbar index="1"></tabbar>
	</view>
</template>

<script>
	import {advIndex} from "@/api/index.js";
	import {memberInfo} from "@/api/user.js";
	import {checkLogin} from "@/libs/login.js";
	import Cache from '../../utils/cache';
	export default {
		data() {
			return {
				// 是否已登录
				isLogin: false,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '' },
				banner:[],
			}
		},
		onLoad() {
				
		},
		onShow() {
			//判断用户登录
			this.userLogin();
			
			//加载广告
			this.getAdv();
		},
		methods: {
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
					this.getUserInfo();
				}else{
					uni.navigateTo({
						url:"/pages/login/mplogin"
					})
				}
			},
			//获取登录用户信息
			getUserInfo:function(){
				var uid=this.$store.getters.uid;
				var mem_no=this.$store.getters.mem_no;
				let that=this;
				memberInfo({
					'uid':uid,
					'mem_no':mem_no
				}).then(res=>{
					let data=res.data;
					if(data!=-10&&data!=-2&&data!=-3){
						//获取成功	
						that.userInfo=data;
						that.uid=data.uid;
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//跳转到登录页面
			memberLogin:function(){
				if(!this.isLogin){
					uni.navigateTo({
						url:"/pages/login/mplogin"
					})
				}else{
					uni.navigateTo({
						url:"/pages/member/userinfo"
					})
				}
			},
			//获取主广告
			getAdv:function(){
				let that=this;
				advIndex({
					'branch_no':'',
					'space_id': 5//后台预设值广告位置id
				}).then(res => {
					let list=res.data;
					let banList=[];
					if(list.length>0){
						for(var i in list){
							banList.push(list[i]);
						}
						that.banner=banList;
					}
				});
			},
			//查看我的账户
			myaccount:function(){
				uni.navigateTo({
					url:'/pages/member/account'
				})
			},
			//跳转到订单页面
			orderPage:function(){
				Cache.set("orderstatus", 0);
				uni.switchTab({
					url:"/pages/order/index"
				})
			},
			//跳转到订单不同状态
			orderStatus:function(status){
				Cache.set("orderstatus", status);
				uni.switchTab({
					url:"/pages/order/index"
				})
			},
			//我的优惠券、积分等
			myService:function(page){
				if(page==1){
					uni.navigateTo({
						url:"/pages/member/account"
					})
				}else if(page==2){
					uni.navigateTo({
						url:"/pages/member/credit"
					})
				}else if(page==3){
					uni.navigateTo({
						url:"/pages/member/report"
					})
				}
			},
			onLink:function(advUrl){
				if(advUrl.includes("http")){
					this.$Cache.set("webviewUrl",advUrl);
					uni.navigateTo({
						url:"/pages/public/webview"
					})
				}else{
					if(advUrl!=''){
						uni.navigateTo({
							url:advUrl
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
	  background: #f5f5f5;
	}
	.container{
		padding-bottom: 120rpx;
	}
	.p-20,
	.padding-20 {
		padding: 20rpx !important;
	}
	
	.padding-top-20,
	.pt-20 {
		padding-top: 20rpx !important;
	}
	
	.padding-right-20,
	.pr-20 {
		padding-right: 20rpx !important;
	}
	
	.padding-bottom-20,
	.pb-20 {
		padding-bottom: 20rpx !important;
	}
	.padding-bottom-30, .pb-30 {
	    padding-bottom: 30rpx !important;
	}
	.padding-left-20,
	.pl-20 {
		padding-left: 20rpx !important;
	}
	.padding-left-30, .pl-30 {
	    padding-left: 30rpx !important;
	}
	.padding-right-30,
	.pr-30 {
		padding-right: 30rpx !important;
	}
	.text-gray {
	    color: #888888;
	}
	.text-sm {
	    font-size: 24rpx;
	}
	.align-center {
	    align-items: center;
	}
	.justify-between {
		justify-content: space-between;
	}
	.justify-around {
		justify-content: space-around;
	}
	.flex {
		display: flex;
	}
	.flex-direction {
	    flex-direction: column;
	}
	.border-b {
	    border-bottom: 1rpx solid #f3f3f3 !important;
	}
	.text-xl {
	    font-size: 36rpx;
	}
	.margin-bottom-5, .mb-5 {
	    margin-bottom: 5rpx !important;
	}
	.mine_bg{
		padding-top: 50rpx;
		height: 355rpx;
		background-size: 100% 100%;
		background: linear-gradient(90deg, hsl(180, 46%, 90%) 0%, #a5e5ee 50%, #b5e4e7 100%);
	}
	.mine_info{
			padding-top:70rpx;
		  display: flex;
		  flex-direction: row;
		  margin-top: 0rpx;
		  margin-left: 50rpx;
		  display: flex;
	}
	.mine__bg--avatar{
	  width: 110rpx;
	  height: 110rpx;
	  border: 5rpx solid #FFFFFF;
	  border-radius: 50%;
	}
	.mine__info{
	  display: flex;
	  flex-direction: row;
	  margin-top: 0rpx;
	  margin-left: 50rpx;
	  display: flex;
	}
	
	.mine__info--cell{
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  margin-left: 20rpx;
	}
	
	.level_set{
	  display: flex;
	  flex-direction: row;
	  justify-content: space-around;
	  margin-top: 40rpx;
	  margin-left: 30rpx;
	  width: 690rpx;
	  height: 92rpx;
	  background: linear-gradient(90deg, #6d5e66 0%, #F3E0BC 100%);
	  border-radius: 16rpx;
	  align-items: center;    /**子view垂直居中*/
	  
	}
	.levelName{
	  display: flex;
	  flex-direction: row;
	  font-size: 32rpx;
	  font-family: Source Han Sans CN;
	  font-weight: bold;
	  color: #000000;
	  line-height: 42rpx;
	 margin-left: -30rpx;
	}
	.level_desc{
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  color: #FFF;
	  height: 76rpx;
	  opacity: 1; 
	  border-radius: 0 38rpx 38rpx 0;
	  font-size: 24rpx;
	  width: 150rpx;
	  height: 50rpx;
	  background: linear-gradient(-90deg, #1A1A1A 0%, #434343 100%);
	  border-radius: 22rpx;
	}
	
	.level_name{
	 margin-top: 8rpx;
	  width: 108rpx;
	  height: 36rpx;
	  background: linear-gradient(90deg, hsl(119, 52%, 52%) 0%, #4ab321 50%, #73db53 100%);
	  border-radius: 6rpx;
	  font-size: 24rpx;
	  margin-left: 15rpx;
	  text-align: center;
	  font-size: 22rpx;
	  font-family: Source Han Sans CN;
	  font-weight: 400;
	  color: #fff;
	  line-height: 38rpx;  
	}
	
	.mine__info--name{
	  display: flex;
	  font-size: 34rpx;
	  color: #000000;
	  font-weight: bold;
	}
	
	.mine__info--desc{
	  font-size: 28rpx;
	  color: #000000;
	  margin-top: 10rpx;
	}
	.mine__order{
	  background: #ffffffb5;
	}
	
	.mine__cell-wrap{
	  padding: 0 25rpx;
	  margin-top: -90rpx;
	  padding-bottom: 20rpx;
	}
	
	.mine__cell{
	  box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.01);
	  border-radius: 15rpx !important;
	}
	
	.official-account{
	  position: fixed;
	  bottom: 25rpx;
	  padding: 0 25rpx;
	  width: 705rpx;
	}
	.orderNav{
		padding: 0 25rpx;
	}
	.orderNav .orderTab{
		width:100%;
		background-color: #fff;
		padding:20rpx;
		border-radius: 15rpx !important;
		
		.navTitle .title{
				font-size: 36rpx;
				font-weight: bolder;
		}
		.navTitle .hyperlink{
			float:right;
			color: #888888;
		}
		.items{
			width: 33.3333%;
			display: inline-block;
			text-align: center;
			margin-top: 20rpx;
		}
		.items image{
			width:68rpx;
			height: 68rpx;
		}
		.items text{
				width:100%;
				height: 30rpx;
				display: block;
		}
	}
	
	.myservice{
		margin-top: 20rpx;
		padding: 0 25rpx;
	}
	.myservice .serviceTab{
		width:100%;
		background-color: #fff;
		padding:20rpx;
		border-radius: 15rpx !important;
		
		.navTitle .title{
				font-size: 36rpx;
				font-weight: bolder;
		}
		.navTitle .hyperlink{
			float:right;
			color: #888888;
		}
		.items{
			width: 33.3333%;
			display: inline-block;
			text-align: center;
			margin-top: 20rpx;
		}
		.items image{
			width:60rpx;
			height: 60rpx;
		}
		.items text{
			width:100%;
			height: 30rpx;
			display: block;
		}
	}
	.advs{
		padding: 0 25rpx;
		height: auto;
		display: block;
		
		.adv{
			width: 100%;
			height: auto;
			min-height: 200rpx;
			margin-top: 10px;
			display: block;
			margin-top: 20rpx;
		}
		.adv image{
			width: 100%;
			height: 100%;
		}
	}
</style>