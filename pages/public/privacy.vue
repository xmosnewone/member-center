<template>
	<view class="container">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<view class='newsDetail'>
			<view class='conters'>
				<jyf-parser :html="content" ref="article" :tag-style="tagStyle"></jyf-parser>
			</view>
		</view>
	</view>
</template>

<script>
	import {portocalContent} from '@/api/config.js';
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
				pageTitle:'隐私政策',
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
			
		},
		onShow: function() {
			this.getArticleOne();
		},
		onShareAppMessage: function() {
			
		},
		onShareTimeline() {
			
		},
		methods: {
			getArticleOne: function() {
				let that = this;
				portocalContent({'cid':2}).then(res => {
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
		font-size: 34rpx;
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