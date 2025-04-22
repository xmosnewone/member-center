<template>
	<view class="container">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<view class="homeBlock">
		    <Banner :itemStyle="options.bannerStyle" :params="options.bannerParam" :dataList="banner"/>
		</view>
		<view class='newsList'>
			<view class='list'>
				<block v-for="(item,index) in articleList" :key="index">
					<navigator :url='"/pages/news/newsdetail?id="+item.id' hover-class='none'
						class='item acea-row row-between-wrapper' v-if="item.headimg_small!='' ">
						<view class='text acea-row row-column-between'>
							<view class='name line2'>{{item.title}}</view>
							<view>{{item.add_time}}</view>
						</view>
						<view class='pictrue'>
							<image :src='item.headimg_small'></image>
						</view>
					</navigator>
					
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {getArticleList,advIndex} from '@/api/news.js';
	import Banner from '@/components/banner';
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			Banner,
			innerheader
		},
		mixins: [],
		data() {
			return {
				pageTitle:'活动公告',
				//imgHost: HTTP_REQUEST_URL,
				imgUrls: [],
				articleList: [],
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
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				navList: [],
				active: 0,
				page: 1,
				limit:5,
				status: false,
			};
		},
		onLoad: function() {
			this.status = false;
			this.page = 1;
			this.articleList = [];
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// this.getArticleHot();
			this.getArticle();
			this.getArticleBanner();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getArticle();
		},
		methods: {
			//返回上一页
			toPrepage:function(){
				var pages = getCurrentPages();
				if(pages.length>1){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			},
			getArticleBanner: function() {
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
			getArticle() {
				let that = this;
				
				let page = that.page;
				let limit = that.limit;
				let articleList = that.articleList;
				if (that.status){
					return;
				}
				getArticleList({
					'page': page,
					'limit':limit
				}).then(res => {
					let articleListNew = [];
					let len = res.data.count;
					articleListNew = articleList.concat(res.data.data);
					that.page+=1;
					that.$set(that, 'articleList', articleListNew);
					if(articleListNew.length>=len){
						that.status=true;
					}
					that.page = that.page;
				});
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #fff !important;
	}
	.homeBlock{
		display: block;
		align-items: center;
		margin: 0 0 10rpx 0;
	}
	.noCommodity {
		border-top-width: 0;
		padding-bottom: 30rpx;

		.emptyBox {
			margin-top: 50rpx;
			text-align: center;

			.tips {
				color: #aaa;
				font-size: 26rpx;
			}

			image {
				width: 414rpx;
				height: 304rpx;
			}
		}
	}
	.newsList .swiper {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		padding: 30rpx 30rpx 0 30rpx;
	}
	.newsList .swiper swiper {
		width: 100%;
		height: 365rpx;
		position: relative;
	}
	.newsList .swiper .slide-image {
		width: 100%;
		height: 335rpx;
		border-radius: 6rpx;
	}
	// #ifdef APP-PLUS || H5
	.newsList uni-swiper .uni-swiper-dots-horizontal {
		bottom: 20px;
	}
	.newsList .swiper .uni-swiper-dot {
		width: 12rpx !important;
		height: 12rpx !important;
		border-radius: 0;
		transform: rotate(-45deg);
		transform-origin: 0 100%;
	}
	.newsList .swiper .uni-swiper-dot~.uni-swiper-dot {
		margin-left: 5rpx;
	}
	// #endif
	// #ifdef MP
	.newsList wx-swiper .wx-swiper-dots-horizontal {
		bottom: 0;
	}
	.newsList .swiper .wx-swiper-dot {
		width: 12rpx !important;
		height: 12rpx !important;
		border-radius: 0;
		transform: rotate(-45deg);
		transform-origin: 0 100%;
	}
	.newsList .swiper .wx-swiper-dot~.wx-swiper-dot {
		margin-left: 5rpx;
	}
	// #endif
	.newsList .nav {
		padding: 0 30rpx;
		width: 100%;
		white-space: nowrap;
		box-sizing: border-box;
		margin-top: 43rpx;
	}
	.newsList .nav .item {
		display: inline-block;
		font-size: 32rpx;
		color: #999999;
	}
	.newsList .nav .item.on {
		color: #000;
		font-size: 36rpx;
		font-weight: bold;
	}
	.newsList .nav .item~.item {
		margin-left: 46rpx;
	}
	.newsList .nav .item .line {
		width: 24rpx;
		height: 4rpx;
		border-radius: 2rpx;
		margin: 10rpx auto 0 auto;
	}
	.newsList .list {
		margin-top: 20rpx;
	}
	.newsList .list .item {
		margin: 0 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
	}
	.newsList .list .item .pictrue {
		width: 250rpx;
		height: 156rpx;
	}
	.newsList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}
	.newsList .list .item .text {
		width: 420rpx;
		height: 156rpx;
		font-size: 24rpx;
		color: #999;
	}
	.newsList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
	}
	.newsList .list .item .picList .pictrue {
		width: 335rpx;
		height: 210rpx;
		margin-top: 30rpx;
	}
	.newsList .list .item .picList.on .pictrue {
		width: 217rpx;
		height: 136rpx;
	}
	.newsList .list .item .picList .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}
	.newsList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	.coutry-list {
		display: flex;
		align-items: center;
		margin: 10rpx 0;
		padding-top: 10rpx;
		border-top: 1px solid #F2F2F2;
		height: 80rpx;

		.coutry {
			// background-color: #F5F5F5;
			border-radius: 26rpx;
			padding: 4rpx 20rpx;
			color: #666666;
			font-size: 26rpx;
			margin-right: 20rpx;
		}

		.coutry.on {
			// background-color: rgba(220, 217, 236, 1);
			border-style: solid;
			border-width: 2rpx;
			color: #E93323;
		}
	}
</style>