<template>
<view class="innerheader">
  <!-- 状态栏高度 -->
  <view :style="{ height: `${statusBarHeight}px`,'background-color':`${bgcolor}` }"></view>
  <!-- 自定义导航栏高度 并 居中 -->
  <view class="inner-header" :style="{height: `${barHeight}px`,'background-color':`${bgcolor}`,'color':`${color}`}">
  	<view class="back-arrow iconfont icon-mjiantou-copy" @tap="toPrepage()"></view>
  	<view class="head-title">{{title}}</view>
  </view>
</view>
</template>

<script>
 
  export default {
    name: "innerheader",
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
		title:{
			type:String,
			default:''
		},
		url:{
			type:String,
			default:'/pages/index/index'
		},
		bgcolor:{
			type:String,
			default:'#ffffff'
		},
		color:{
			type:String,
			default:'#000000'
		}
    },
    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data() {
      return {
		statusBarHeight:0,
		barHeight:0
      }
    },
	
	mounted() {
			// #ifdef MP
			const windowInfo = wx.getWindowInfo();
			this.statusBarHeight = windowInfo.statusBarHeight; 
			const { top, height } = wx.getMenuButtonBoundingClientRect();
			this.barHeight = height ? height + (top - this.statusBarHeight) * 2 : 38;
			// #endif
			
			// #ifndef MP
			this.statusBarHeight=0;
			this.barHeight=50;
			// #endif
	},

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
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
       }
    }

  }
</script>

<style lang="scss" scoped>
.innerheader{
	width:100%;
	overflow: hidden;
}
.inner-header{
	overflow: hidden;
	text-align: center;
	width:100%;
	padding-top: 20rpx;
	height: 100rpx;
	font-size: 36rpx;
	.back-arrow{
		display: block;
		width:40rpx;
		height: 40rpx;
		float:left;
		margin-left:20rpx;
		padding-top: 8rpx;
	}
}
</style>