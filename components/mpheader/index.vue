<template>
<view class="mpheader">
  <!-- 状态栏高度 -->
  <view :style="{ height: `${statusBarHeight}px` }"></view>
  <!-- 自定义导航栏高度 并 居中 -->
  <view class="tophead" :style="{
    height: `${barHeight}px`,
    'line-height': `${barHeight}px`,
    'text-align': 'center',
  }">
  <img class="headlogo" src="/static/images/headlogo.png" />
  </view>
</view>
</template>

<script>
 
  export default {
    name: "mpheader",

    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
		
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
			const windowInfo = wx.getWindowInfo();
			this.statusBarHeight = windowInfo.statusBarHeight; 
			const { top, height } = wx.getMenuButtonBoundingClientRect();
			this.barHeight = height ? height + (top - this.statusBarHeight) * 2 : 38;
	},
    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
       
    }

  }
</script>

<style lang="scss" scoped>
.tophead{
	overflow: hidden;
}
.headlogo{
	 height:70rpx;
	 max-height: 100%;
	 margin:0 auto;
	 width: 283rpx;
	 position:relative;
	 left:6%;
}
</style>