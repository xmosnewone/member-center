<template>
	<view class="container">
		<innerheader :title="pageTitle"></innerheader>
		<web-view :webview-styles="webviewStyles" style="margin-top: 100rpx;" :src="url"></web-view>
	</view>
</template>

<script>
	import innerheader from '@/components/innerheader';
	export default {
			components: {
				innerheader
			},
			data() {
				return {
					pageTitle:'',
					url:'https://www.icepos.cn',
					webviewStyles: {
						progress: {
							color: '#FF3333'
						}
					}
				}
			},
			onLoad() {
				let _url=this.$Cache.get("webviewUrl");
				this.url=_url;
				if(this.url==""||this.url==null||this.url==false){
					uni.showToast({
						title:"URL为空",
						icon:'error',
						complete() {
							setTimeout(()=>{
								uni.switchTab({
									url:"/pages/index/index"
								})
							},2000)
						}
					})
				}
				
			}
	}
	
</script>

<style>
	
</style>