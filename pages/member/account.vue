<template>
	<view class="container">
		<!--返回顶部-->
		<view class="order-header my-account" :style="{'padding-top':`${magtop}rpx` }" >
			<view class="navhead">
				<view class="back-arrow iconfont icon-mjiantou-copy" @click="toPrepage()"></view>
				<view class="head-title">我的账户</view>
			</view>
		</view>
		
		<view class="accountlist">
			<view class="list">
				<block v-for="(item, index) in accountList" :key="index">
				<view class="itemc">
					<view class="leftc">
						<text :class="['amount', item.act=='+' ? 'green' : 'red']">{{item.act}}{{item.money}}</text>
						<text class="cond">{{item.type}}</text>
					</view>
					<view class="rightc">
						<text class="title" v-if="item.flowno!=''">订单号: {{item.flowno}}</text>
						<text class="expire">日期:{{item.add_date}}</text>
					</view>
				</view>
				</block>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {checkLogin} from "@/libs/login.js";
	import {memberInfo} from "@/api/user.js";
	import {memberAccount} from '@/api/account.js';
	export default {
		components: {
			
		},
		data() {
			return {
				//会员相关
				isLogin:false,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '' },
				page: 1,
				limit: 10,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				status:0,
				accountList: [], //订单数组
				
				windowHeight:1000,
				magtop:40,
				omgtop:200,
			}
		},
		onLoad() {
				
		},
		onShow() {
			
			this.userLogin();
			
			if(!this.isLogin){
				return this.$util.Tips({
					title: '请登录会员'
				},'/pages/login/mplogin');
			}else{
				this.getUserInfo();
			}
			
			// #ifdef MP
			const windowInfo = wx.getWindowInfo();
			this.statusBarHeight = windowInfo.statusBarHeight; 
			const { top, height } = wx.getMenuButtonBoundingClientRect();
			this.barHeight = height ? height + (top - this.statusBarHeight) * 2 : 38;
			this.magtop=this.statusBarHeight+this.barHeight;
			this.omgtop=this.statusBarHeight+this.barHeight+140;
			// #endif
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
				}
			},
			//返回上一页
			toPrepage:function(){
				var pages = getCurrentPages();
				if(pages.length>1){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.switchTab({
						url:'/pages/member/index'
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
						
						setTimeout(function(){
							//获取当前订单
							that.getList();
						},100);
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//获取列表
			getList:function(){
				let that=this;
				if(!that.isLogin){
					return;
				}
				
				if (that.loadend||that.loading) {
					return;
				};
				
				that.loading = true;
				
				uni.showLoading({
					title: "加载中"
				});
				
				memberAccount({
					uid:that.uid,
					page:that.page,
					limit:that.limit
				}).then(res=>{
					let list=res.data.list;
					let total=res.data.total;
					if(res.data.code==1){
						for(let i in list){
							let one=list[i];
							that.accountList.push(one);
						}
					}
					
					if(total==that.accountList.length){
						that.loadend=true;
						that.page=1;
					}else if(that.accountList.length<total){
						that.page+=1;
					}
					that.loading=false;
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #f5f5f5;
	}
	.order-header{
		text-align: center;
		width:100%;
		padding-top: 40rpx;
		min-height:140rpx;
		position: fixed;
		top:0;
		background-color: #fff;
		z-index:1000;
		font-size: 36rpx;
		.navhead{
			height: 80rpx;
		}
		.back-arrow{
			display: block;
			width:40rpx;
			height: 40rpx;
			float:left;
			margin-left:20rpx;
			padding-top: 8rpx;
		}
	}
	
	.accountlist{
		width: 100%;
		height: auto;
		min-height: 1200rpx;
		padding-top:20rpx;
		margin-top: 130rpx;
		background: #f5f5f5;
		
		.list{
			
			width: 96%;
			height: auto;
			min-height:800rpx;
			align-items: center;
			margin: 0 auto;
		}
		.list .itemc{
			background-color: #fff;
			border-radius: 10rpx;
			min-height: 120rpx;
			height: auto;
			width: 100%;
			margin: 20rpx auto 0 auto;
			padding: 20rpx;
			display: inline-block;
			color: #38373d;
		}
		.list .itemc .leftc{
			color:#000;
			width:100%;
			height: auto;
			float: left;
		}
		.list .itemc .leftc .coin{
			font-size: 32rpx;
			font-weight: bolder;
		}
		.list .itemc .leftc .amount{
			font-size: 60rpx;
			font-weight: bolder;
			color:#2bae67;
			float: left;
			line-height: 60rpx;
		}
		.list .itemc .leftc .amount.green{
			color: #2bae67;
		}
		.list .itemc .leftc .amount.red{
			color: red;
		}
		.list .itemc .leftc .cond{
			font-size: 38rpx;
			width: 100rpx;
			margin-left: 20rpx;
			color: #929292;
			line-height: 60rpx;
			float: left;
		}
		.list .endcoupon .leftc .amount{
			color: #929292;
		}
		.list .expirecoupon .leftc .amount{
			color: #929292;
		}
		.list .itemc .rightc{
			color:#000;
			width:100%;
			height: 120rpx;
			float:left;
			text-align: left;
			color: #007b5e;
			font-size: 32rpx;
			padding-top: 10rpx;
		}
		.list .itemc .rightc .title{
			color: #38373d;
			display: inline-block;
			width: 100%;
			overflow: hidden;
			height: 40rpx;
			font-size:28rpx;
		}
		.list .itemc .rightc .expire{
			color: #929292;
			display: inline-block;
			width: 100%;
			overflow: hidden;
			height: 40rpx;
			font-size: 32rpx;
		}
	
	}
</style>