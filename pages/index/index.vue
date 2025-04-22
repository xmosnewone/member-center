<template>
	<view class="container">
		<!-- #ifdef MP -->
		<block>
		<mpheader></mpheader>
		</block>
		<!-- #endif -->
		<!-- 页面头部 -->
		<view class="main-header">
		  <!-- 用户信息 -->
		  <view class="user-info">
			<!--头像-->
			<view class="user-avatar" @click="onLogin">
			  <image class="image" :src="userInfo.headimg ? userInfo.headimg : '/static/default-avatar.png'"></image>
			</view>
			<view class="user-content" @click="onLogin">
			  <!-- 会员昵称 -->
			  <view class="nick-name">{{ userInfo.nickname ? userInfo.nickname : '未登录'}}</view>
			  <view class="login-tips" v-if="!isLogin">(点击头像登录)</view>
			  <!-- 会员等级 -->
			  <view v-if="userInfo.level > 0 && userInfo.levelname" class="user-grade">
				<view class="user-grade_name">
				  <text>Hi,{{ userInfo.levelname }}</text>
				</view>
			  </view>
			  <view v-else class="user-grade">
					<view class="user-grade_name">
					  <text>欢迎使用会员中心</text>
					</view>
			  </view>
			  <!-- 会员无等级时显示手机号 -->
			  <view v-if="userInfo.uid > 0 " class="active-time">有效期至{{userInfo.expire}}</view>
			</view>
			
			<view class="contentr">
			<view class="amount-info" @click="toReport">
				<view class="amount-num" v-if="isLogin">￥{{ parseFloat(userInfo.year_consume).toFixed(2) }}</view>
				<view class="amount-num" v-if="!isLogin">￥0.00</view>
				<view class="amount-tip">年内消费</view>
			</view>
			<view class="pay-qr" @click="toMemberCode(userInfo.uid ? userInfo.uid : 0)">
				<view class="qrcode iconfont icon-qr-extract"></view>
				<text>会员码</text>
			</view>
			</view>
		  </view>
		  
		  <view class="user-wellfare">
			  <view class="point-amount" @click="onCredits"> 
			  {{ userInfo.credit ? userInfo.credit : 0 }}
				<view class="point-title">积分</view>
			  </view>
			  <view class="point-amount" @click="accountMore">
				{{ userInfo.account ? userInfo.account : 0 }}
				<view class="point-title">账户</view>
			  </view>
			  <view class="point-amount" @click="toMemberOrder">
			  {{ userInfo.order_count ? userInfo.order_count : 0 }}
			  <view class="point-title">订单</view>
			  </view>
			  <view class="point-amount" @click="onConsumes">
			  {{ userInfo.total_consu ? userInfo.total_consu : 0 }}
			  <view class="point-title">消费总额</view>
			  </view>
		  </view>

		</view>
		
		<view class="homeBlock">
		<xzw-notice theme="success" :list="newslist" theKey="title" speed="fast" @goMore="gotoNews" @goItem="toNewsDetail"/>
		</view>
		
		<view class="homeBlock">
		    <Banner :itemStyle="options.bannerStyle" :params="options.bannerParam" :dataList="banner" @onLinkClick="onLink"/>
		</view>
		
		<!--首页其他广告列表-->
		<view class="homeBlock">
			<view class="homeAdv">
					<view class="advs" v-for="(dataItem, index) in homeAdv" :key="index">
						<image :src="dataItem.image" @click="onLink(dataItem.url)" mode="widthFix"></image>
					</view>
			</view>
		</view>
		
		<block>
			<pageFooter></pageFooter>
		</block>
		
		<z-pop ref="maskSuccess" :title="popConfig.title"
		            @clickImage="clickImage" :maskBg="popConfig.image"></z-pop>
		
		<!--脚本导航-->
		<tabbar index="0"></tabbar>
	</view>
	
</template>

<script>
	import {ADV_CID} from "@/config/app.js";
	import {
				couponHome,
				newsIndex,
				advIndex
			} from "@/api/index.js";
	import {memberInfo} from "@/api/user.js";
	import {checkLogin} from "@/libs/login.js";
	import {todayTimeStr} from "@/utils/timer.js";
	import mpheader from '@/components/mpheader/index.vue';
	import Banner from '@/components/banner/index.vue';
	import pageFooter from '../public/footer.vue';
	import piaoyiProgressBar from '@/uni_modules/piaoyi-progress-bar/components/piaoyi-progress-bar/piaoyi-progress-bar.vue';
	
	const app=getApp();
	const popTime="popTime";
	export default {
		data() {
			return {
				// 是否已登录
				isLogin: false,
				// 系统设置
				setting: {},
				// 当前用户信息
				uid:0,
				ucode:'',
				userInfo: { uid: 0, nickname: '', headimg: '',year_consume:0 },
				gradeInfo: {name:'您好！'},
				gradeEndTime: '',
				//滚动图片
				banner: [],
				options:{
					"bannerStyle": {
					    "btnColor": "#ffffff",
					    "btnShape": "round",
					    "interval": 5,
					    
					},
					"bannerParam": {
					    "interval": 2000
					}
				},
				//首页其他广告
				homeAdv: [],
				//弹窗广告
				popConfig:{"title":'',"image":'',"link":''},
				//滚动播报新闻
				newslist: [],
				
			}
		},
		mixins: [],
		components: {
		   mpheader,
		   piaoyiProgressBar,
		   Banner,
		   pageFooter
		},
		onLoad() {
				//设置进度条宽度
				// #ifdef MP || H5
				this.progressWidth=120;
				// #endif
		},
		onShow() {
			//判断用户登录
			this.userLogin();
			
			//加载广告
			this.getBannerAdv();
			
			//加载首页其他广告
			this.getHomeAdv();
			
			//加载首页弹窗广告
			this.getPopAdv();
			
			//加载新闻
			this.getNews();
		},
		onReady() {
			
		},
		methods: {
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
					this.getUserInfo();
				}
			},
			
			//跳转登录
			onLogin:function(){
				if(this.isLogin){
					uni.switchTab({
						url:"/pages/member/index"
					});
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
			
			//跳转到会员二维码
			toMemberCode:function(uid){
				if(!uid||uid==0){
					uni.navigateTo({
						url:'/pages/login/mplogin'
					})
				}else{
					uni.navigateTo({
						url:'/pages/member/usercode'
					})
				}
			},
			
			//获取新闻信息
			getNews:function(){
				let that=this;
				newsIndex({
					'page':1,
					}).then(res=>{
						let news=res.data.data;
							for(var i in news){
								that.newslist.push(news[i]);
							}
					});
			},
			
			toNewsDetail:function(item){
				if(item){
					uni.navigateTo({
						url:"/pages/news/newsdetail?id="+item.id
					})
				}
			},
			
			//获取主广告
			getBannerAdv:function(){
				let that=this;
				advIndex({
					'branch_no':'',
					'space_id': 3//后台预设值广告位置id
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
			//获取其他广告
			getHomeAdv:function(){
				let that=this;
				advIndex({
					'branch_no':'',
					'space_id': 4//后台预设值广告位置id
				}).then(res => {
					let list=res.data;
					let banList=[];
					if(list.length>0){
						for(var i in list){
							banList.push(list[i]);
						}
						that.homeAdv=banList;
					}
				});
			},
			//获取弹窗广告
			getPopAdv:function(){
				let that=this;
				advIndex({
					'branch_no':'',
					'space_id': 6//后台预设值广告位置id
				}).then(res => {
					let list=res.data;
					let banList=[];
					if(list.length>0){
						let one=list[0];
							that.popConfig.title=one.title;
							that.popConfig.image=one.image;
							that.popConfig.link=one.url;
							
						let popTimeDay=that.$Cache.get(popTime);
						let today=todayTimeStr();
						if(popTimeDay!=undefined&&popTimeDay!=null&&today==popTimeDay){
							//当天已经提醒弹窗，不再弹出
							return;
						}else{
							that.$refs.maskSuccess.open();
							//更新本地弹窗时间
							that.$Cache.set(popTime,today);
						}
					}else{
							//没有弹窗广告则删除记录时间
							that.$Cache.clear(popTime);
					}
				});
			},
			//跳转到新闻页面
			gotoNews:function(){
				uni.navigateTo({
					url:"/pages/news/newslist"
				})
			},
			//跳转到我的消费（订单）
			toMemberOrder:function(){
				if(!this.isLogin){
					this.$util.Tips({
						title: '请登录'
					},'/pages/login/mplogin');
					return; 
				}
				uni.switchTab({
					url:'/pages/order/index'
				})
			},
			//跳转到我的积分
			onCredits:function(){
				if(!this.isLogin){
					this.$util.Tips({
						title: '请登录'
					},'/pages/login/mplogin');
					return; 
				}
				uni.navigateTo({
					url:'/pages/member/credit'
				})
			},
			//跳转到我的账户
			accountMore:function(){
				uni.navigateTo({
					url:'/pages/member/account'
				})
			},
			//年内消费
			toReport:function(){
				if(!this.isLogin){
					this.$util.Tips({
						title: '请登录'
					},'/pages/login/mplogin');
					return; 
				}
				uni.navigateTo({
					url:'/pages/member/report'
				})
			},
			//跳转到消费总额
			onConsumes:function(){
				if(!this.isLogin){
					this.$util.Tips({
						title: '请登录'
					},'/pages/login/mplogin');
					return; 
				}
				uni.navigateTo({
					url:'/pages/member/report?type=all'
				})
			},
			clickImage:function(){
				this.onLink(this.popConfig.link);
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

<style lang="scss" scoped>
	.container{
		padding-bottom: 200rpx;
	}
	.homeBlock{
		display: block;
		align-items: center;
		margin: 10rpx 25rpx 10rpx 25rpx;
	}
	// 页面头部
	.main-header {
	  background-color:#fefbf2 ;
	  height: 360rpx;
	  background-size: cover;
	  overflow: hidden;
	  display: block;
	  align-items: center;
	  margin: 10rpx 25rpx 10rpx 25rpx;
	  border-radius: 10rpx;
	  
	  .user-info {
	    display: block;
	    height: 180rpx;
	    margin: 20rpx;
	    margin-left: 20rpx;
	    .user-avatar {
	        padding-top: 10rpx;
	        width: 50rpx;
	        float: left;
	        .image {
	            display: block;
	            width: 100rpx;
	            height: 100rpx;
	            border-radius: 999rpx;
	        }
	    }
	    
	    .user-content {
	      display: block;
	      justify-content: center;
	      margin-top: 20rpx;
	      margin-left: 60rpx;
	      float: left;
	      color: #000;
	      max-width: 300rpx;
		  min-width: 300rpx;
		  
	      .nick-name {
	          font-size: 32rpx;
	          font-weight: bold;
	          max-width: 270rpx;
	          white-space: nowrap;
	          overflow: hidden;
	          text-overflow: ellipsis;
	      }
	      .user-grade {
	        display: block;
	        align-items: center;
	        margin-top: 20rpx;
	        border-radius: 10rpx;
	        padding: 5rpx 0;
	        width: 90%;
	        min-width: 180rpx;
	        height: 40rpx;
	
	        .user-grade_name {
	          margin-left: 5rpx;
	          font-size: 32rpx;
	          color: #000;
	          float: left;
			  font-weight: 700;
			  text-align: left;
	        }
	      }
	      .active-time {
	          margin-top: 3rpx;
			  width: 100%;
			  min-width: 180rpx;
			  display: flex;
			  text-align: left;
	      }
	
	      .login-tips {
	        margin-top: 9rpx;
	        font-size: 25rpx;
	      }
	    }
		
		.contentr{
			display: flex;
			float:right;
			height: 180rpx;
			padding-top:20rpx;
			width:250rpx;
		}
	    .amount-info {
			padding-top:60rpx;
	        margin-left:20rpx;
	        color: #000;
	        display: block;
	        float: left;
			width:220rpx;
	        max-width: 250rpx;
			overflow:hidden;
			text-align: left;
	        .amount-tip {
	            font-size: 28rpx;
	        }
	        .amount-num {
	            margin-top: 10rpx;
	            font-size: 28rpx;
	        }
	        
	    }
	    .pay-qr {
			padding-top:40rpx;
	        color: #000;
	        margin-left: 10rpx;
	        text-align: center;
	        width: 138rpx;
	        float: left;
			height: 80rpx;
			display: block;
	        .qrcode {
	            display: block;
	            font-size: 60rpx;
	        }
	    }
	  }
	  
	  .user-wellfare{
		  border-top: solid 2px #e3e3e3;
		  width: 90%;
		  margin: 0 auto;
		  padding-top: 16rpx;
		  .point-amount {
		      display: block;
		      margin-top: 2px;
		      width: 25%;
			  height: 80rpx;
			  float: left;
			  text-align: center;
		  }
		  .point-title{
			padding-top: 16rpx;
		  }
	  }
	}
	
	//广告列表
	.homeAdv{
		width:100%;
		height: auto;
		display: block;
		
		.advs{
			width:100%;
			height: auto;
			margin: 0 auto;
			
			image{
				width:100% !important;
				border-radius: 20rpx;
			}
		}
	}
</style>
