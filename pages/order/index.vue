<template>
	<view class="container my-order">
		<!--返回顶部-->
		<view class="order-header" :style="{'padding-top':`${magtop}rpx` }" >
		<view class="navhead">
			<view class="back-arrow iconfont icon-mjiantou-copy" @click="toPrepage()"></view>
			<view class="head-title">我的订单</view>
		</view>
		
		<view class="nav row-around">
			<view class="item" :class="orderStatus == 0 ? 'on' : ''" @click="statusClick(0)">
				<view class="txt">全部</view>
			</view>
			<view class="item" :class="orderStatus == 1 ? 'on' : ''" @click="statusClick(1)">
				<view class="txt">未支付</view>
			</view>
			<view class="item" :class="orderStatus == 2 ? 'on' : ''" @click="statusClick(2)">
				<view class="txt">已退款</view>
			</view>
			<view class="item" :class="orderStatus == 3 ? 'on' : ''" @click="statusClick(3)">
				<view class="txt">已完成</view>
			</view>
		</view>
		</view>
		
		<!--订单列表-->
		<view class="orders" :style="{ 'min-height': `${windowHeight}px`,'margin-top':`${omgtop}rpx` }">
		<view class="list">
			<view class="item" v-for="(item, index) in orderList" :key="index">
				
				<view class="itembody" @click="orderDetails(item.flow_no)">
					<view class="posname">
						<image :src="item.branch_logo" class="posimage">
						<text class="shopname">{{item.branch_no}} {{item.branch_name}}</text>
						<text class="postype" v-if="item.pos_status.postype==1">自助购</text>
						<view class="orderStatus">
							{{item.order_status}}
						</view>
					</view>
					
					<!--显示方式1 单个商品 显示商品，名称-->
					<view class="gooditem1" v-if="item.sales_info.length==1">
						<view class="goodImg">
							<image :src="item.sales_info[0].img_src!=''?item.sales_info[0].img_src:'/static/images/public/noimg.png'"></image>
						</view>
						<view class="goodContent">
							<view class="title">{{item.sales_info[0].item_name}}</view>
							<view class="pricetxt">
								<view class="price">￥{{item.sales_info[0].sale_price}}</view>
								<view class="num">x{{item.sales_info[0].sale_qnty}}</view>
							</view>
						</view>
						<view class="ordertime">
							下单时间 {{item.oper_date}}
						</view>
						<view class="ordersum">
							共{{item.sales_info[0].sale_qnty}}件 应付总额 <text class="sum">￥ {{item.pay_amount}}</text>
						</view>
						
					</view>
				
					<view class="gooditem2" v-else="item.sales_info.length>1">
						<view class="goodImg" v-for="(item1, index1) in item.sales_info" :key="index1">
							<image :src="item1.img_src!=''?item1.img_src:'/static/images/public/noimg.png'"></image>
						</view>
						<view class="ordertime">
							下单时间 {{item.oper_date}}
						</view>
						<view class="ordersum">
							共{{item.sale_qnty}}件 应付总额 <text class="sum">￥ {{item.pay_amount}}</text>
						</view>
					</view>
				</view>
				
				<view class="viewBarcode">
					<view class="bnt" @click="orderBarcode(item.flow_no)">订单条码</view>
				</view>
			</view>
		</view>
		
		<view v-if="orderList.length == 0">
			<emptyPage v-if="!loading" title="暂无订单"></emptyPage>
			<view class="loadingicon acea-row row-center-wrapper">
				<text class="loading iconfont icon-jiazai" :hidden="loading == false"></text>
			</view>
		</view>
		</view>

		<LtBackTop ref="pscroll" />
		<tabbar index="2"></tabbar>
	</view>
</template>

<script>
	import {memberInfo} from "@/api/user.js";
	import {checkLogin} from "@/libs/login.js";
	import {memberOrderList} from "@/api/order.js";
	import Cache from '../../utils/cache';
	import emptyPage from '../public/emptyPage.vue';
	import LtBackTop from '@/components/lt-back-top/lt-back-top.vue'
	import backMixins from '@/components/lt-back-top/back-mixins.js'
	
	const app = getApp();
	export default {
		mixins: [backMixins],
		components: {
			emptyPage,
			LtBackTop
		},
		data() {
			return {
				isLogin:false,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				totalRecord:0,//订单总数
				orderStatus: 0, //订单状态
				page: 1,
				limit: 10,
				windowHeight:1000,
				magtop:40,
				omgtop:200,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '',ucode:'' }
			}
		},
		onLoad() {
				
		},
		onShow() {

			//判断用户登录
			this.userLogin();
			
			if(!this.isLogin){
				return this.$util.Tips({
					title: '请登录会员'
				},'/pages/login/mplogin');
			}
			
			this.windowHeight=app.globalData.windowHeight-150;
			this.orderStatus=Cache.get("orderstatus");
			if(this.orderStatus==null||this.orderStatus==""){
				this.orderStatus=0;
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
		onUnload(){
			
		},
		onHide() {
			this.page=1;
		},
		onReachBottom() {
			this.getOrderList();
		},
		methods: {
			//返回上一页
			toPrepage:function(){
					uni.switchTab({
						url:'/pages/member/index'
					})
			},
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
					this.getUserInfo();
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
						that.$set(that,"uid",data.uid);
						that.$set(that,"userInfo",data);
						
						setTimeout(function(){
							//获取当前订单
							that.getOrderList();
						},100);
						
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//切换订单状态
			statusClick: function(status) {
				if (status == this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				Cache.set("orderstatus", status);
				this.getOrderList();
			},
			
			//获取订单列表
			getOrderList:function(){
				if(this.totalRecord>0
					&&this.orderList.length>0
					&&this.orderList.length==this.totalRecord
				){
					return;
				}
				let that=this;
				if(!that.isLogin){
					return;
				}
				
				if (that.loadend||that.loading) {
					return;
				};

				that.loading = true;
				
				uni.showLoading({
					title: "加载订单中"
				});
				
				memberOrderList({
					uid:that.uid,
					vip_no:that.userInfo.ucode,
					order_status:that.orderStatus,
					page:that.page,
					limit:that.limit
				}).then(res=>{
					let orders=res.data.orders;
					let total=res.data.total;
					that.totalRecord=total;
					if(res.data.code==1){
						for(let i in orders){
							let one=orders[i];
							if(one.branch_logo==''||one.branch_logo==null){
								one.branch_logo='/static/images/home/firework.png';	
							}
							that.orderList.push(one);
						}
					}
					
					if(that.page==1){
						uni.pageScrollTo({
						  scrollTop: 0, // 滚动到页面的目标位置（单位px）
						  duration: 0 // 滚动动画的时长，默认300ms
						});
					}
					
					if(total==that.orderList.length){
						that.loadend=true;
						that.page=1;
					}else if(that.orderList.length<total){
						that.page+=1;
					}
					that.loading=false;
					uni.hideLoading();
				});
				
			},
			orderDetails:function(no){
				uni.navigateTo({
					url:"/pages/order/detail?no="+no,
				})
			},
			orderBarcode:function(no){
				uni.navigateTo({
					url:"/pages/order/barcode?no="+no,
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
		.order-header{
			text-align: center;
			width:100%;
			padding-top: 40rpx;
			height: 200rpx;
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
		.my-order .nav {
			background-color: #fff;
			width: 100%;
			height: 50rpx;
			border-radius: 6rpx;
			margin: 0 auto 0 auto;
			display: flex;
			z-index:1000;
		}
		.my-order .nav .item {
			text-align: center;
			font-size: 26rpx;
			width: 25%;
			height: 50rpx;
			display: block;
			color: #929292;
			line-height: 50rpx;
			font-size: 32rpx;
			font-weight: 400;
		}
		.my-order .nav .item .txt{
			padding-bottom: 10rpx;
			height: 50rpx;
			display: inline-block;
			width: auto;
			text-align: center;
			
		}
		.my-order .nav .item.on {
			color: #2bae67;
			font-weight: 600;
			
			/* #ifdef H5 || MP */
			
			/* #endif */
			/* #ifdef APP-PLUS */
			
			/* #endif */
		}
		.my-order .nav .item.on .txt {
			border-bottom: 6rpx solid #2bae67;
		}
		
		.my-order .orders{
			width: 100%;
			height: auto;
			min-height: 1200rpx;
			background: #f5f5f5;
			padding-top:20rpx;
			margin-top: 200rpx;
		}
		.my-order .orders .list {
			width: 690rpx;
			margin:0 auto;
			padding-bottom: 90rpx;
		}
		
		.my-order .orders .list .item {
			background-color: #fff;
			border-radius: 6rpx;
			margin-bottom: 14rpx;
			padding:28rpx;
		}
		.my-order .orders .list .item .posname{
			display: block;
			width: 100%;
			height: 60rpx;
			overflow: hidden;
		}
		.my-order .orders .list .item .posname .posimage{
			width: 60rpx;
			height: 60rpx;
			border-radius: 30rpx;
			float:left;
			margin-right: 16rpx;
		}
		.my-order .orders .list .item .posname .shopname{
			font-size: 32rpx;
			font-weight: 600;
			line-height: 60rpx;
			margin-right: 10rpx;
		}
		
		.my-order .orders .list .item .posname .postype{
			display: inline-block;
			background-color: #ffe7da;
			padding:5rpx;
			color: #fd7a4e;
			font-size: 24rpx;
		}
		.my-order .orders .list .item .posname .orderStatus{
			float: right;
			width: auto;
			height: 60rpx;
			line-height: 60rpx;
			font-weight: 600;
		}
		.my-order .orders .list .item .gooditem1,
		.my-order .orders .list .item .gooditem2{
			display: block;
			width: 100%;
			min-height: 260rpx;
			height: auto;
			padding: 10rpx 0;
			border-bottom: solid 2rpx #eeeeee;
			text-align: center;
			align-items: center;
			overflow: auto;
		}
		.my-order .orders .list .item .gooditem1 .goodImg,
		.my-order .orders .list .item .gooditem2 .goodImg{
			width:130rpx;
			height: 130rpx;
			border:solid 2rpx #eeeeee;
			float: left;
			margin:10rpx;
			image{
				width:100%;
				height: 100%;
				display: block;
			}
		}
		.my-order .orders .list .item .gooditem1 .goodContent,
		.my-order .orders .list .item .gooditem2 .goodContent{
			width:430rpx;
			height: 130rpx;
			float: left;
			text-align: left;
			padding-left: 20rpx;
			.title{
				font-size: 24rpx;
				height: 80rpx;
				width: 100%;
				overflow: hidden;
			}
			.pricetxt{
				height: 50rpx;
				line-height: 60rpx;
				width: 100%;
				display: flex;
			}
			.pricetxt .price{
				font-weight: 600;
				font-size: 26rpx;
				width: 60%;
			}
			.pricetxt .num{
				text-align: right;
				width: 40%;
			}
		}
		.my-order .orders .list .item .gooditem1 .ordertime,
		.my-order .orders .list .item .gooditem2 .ordertime{
			width: 100%;
			height: 50rpx;
			float: left;
			text-align: left;
			padding-top: 10rpx;
			color: #afafaf;
			font-size: 20rpx;
		}
		.my-order .orders .list .item .gooditem1 .ordersum,
		.my-order .orders .list .item .gooditem2 .ordersum{
			width: 100%;
			height: 60rpx;
			float: left;
			text-align: right;
			padding-top: 10rpx;
			font-size: 20rpx;
			color: #5b5b5b;
		}
		.my-order .orders .list .item .gooditem1 .ordersum .sum,
		.my-order .orders .list .item .gooditem2 .ordersum .sum{
			font-weight: bolder;
		}
		.my-order .orders .list .item .viewBarcode{
			width: 100%;
			height: 60rpx;
			text-align: center;
			margin-top: 10rpx;
			.bnt{
				border: solid 2rpx #cbcbcb;
				width: 180rpx;
				height: 52rpx;
				border-radius:30rpx;
				float: right;
				color: #5b5b5b;
				padding:5rpx 0rpx ;
			}
		}
</style>