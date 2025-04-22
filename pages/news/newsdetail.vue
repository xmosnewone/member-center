<template>
	<view class="container">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<view class='newsDetail'>
			<view class='title'>{{articleInfo.title || ''}}</view>
			<view class='list acea-row row-middle'>
				<view class='label'>{{articleInfo.catename || ''}}</view>
				<view class='item'></text>{{articleInfo.time || ''}}</view>
				<view class='item'><text class='qrcode iconfont icon-favorite'></text>{{articleInfo.visit}}</view>
			</view>
			<view class='conters'>
				<jyf-parser :html="content" ref="article"></jyf-parser>
			</view>
		</view>
	</view>
</template>

<script>
	import {getDetail} from '@/api/news.js';
	import parser from "@/components/jyf-parser/jyf-parser";
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			"jyf-parser": parser,
			innerheader
		},
		mixins: [],
		data() {
			return {
				pageTitle:'内容详情',
				id: 0,
				articleInfo: {},
				store_info: {},
				content: '',
				shareInfoStatus: false,
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%'
				}
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.hasOwnProperty('id')) {
				this.id = options.id;
			} else {
				// #ifndef H5
				uni.navigateBack({
					delta: 1
				});
				// #endif
				// #ifdef H5
				history.back();
				// #endif
			}
		},
		onShow: function() {
			this.getArticleOne();
		},
		onShareAppMessage: function() {
			let that = this;
			return {
				title: this.articleInfo.title || "",
				imageUrl: this.articleInfo.headimg ? this.articleInfo.headimg : "",
				path: "/pages/news/newsdetail?id=" + that.id,
			};
		},
		onShareTimeline() {
			let that = this;
			return {
				title: this.articleInfo.title,
				query: {
					id: that.id
				},
				imageUrl: this.articleInfo.headimg ? this.articleInfo.headimg : "",
			};
		},
		methods: {
			getArticleOne: function() {
				let that = this;
				getDetail(that.id).then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title.substring(0, 7) + "..."
					});
					that.$set(that, 'articleInfo', res.data);
					that.content = res.data.content;
				});
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}
	.order-header{
		text-align: center;
		width:100%;
		padding-top: 40rpx;
		height: 90rpx;
		font-size: 30rpx;
		overflow: hidden;
		.back-arrow{
			float:left;
			margin-left:20rpx;
		}
	}
	.newsDetail .title {
		padding: 0 30rpx;
		font-size: 34rpx;
		color: #282828;
		font-weight: bold;
		margin: 45rpx 0 23rpx 0;
		line-height: 1.5;
	}

	.newsDetail .list {
		margin: 0 30rpx;
		// border-bottom: 1rpx solid #eee;
		padding-bottom: 25rpx;
	}

	.newsDetail .list .label {
		font-size: 24rpx;
		color: #B1B2B3;
	}

	.newsDetail .list .item {
		margin-left: 27rpx;
		font-size: 24rpx;
		color: #B1B2B3;
	}

	.newsDetail .list .item .iconfont {
		font-size: 28rpx;
		margin-right: 10rpx;
	}

	.newsDetail .list .item .iconfont.icon-shenhezhong {
		font-size: 26rpx;
	}

	.newsDetail .conters {
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #8A8B8C;
		line-height: 1.7;
	}
</style>