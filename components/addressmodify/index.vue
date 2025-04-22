<template>
	<view class="modifycontent" v-if="show">
		<!-- mask层 -->
		<view :class="['mask', show ? '' : 'visible']"></view>
		<!-- 键盘 -->
		<view :class="['address', show ? '' : 'visible', isIphoneX ? 'isIphone' : '']">
			<view class="utitle">修改地址</view>
			<view class="addressinput">
				<input class="inputs" type="text" v-model="address" placeholder="请输入完整的详细地址"/>
			</view>
			<view class="notice">请输入您的详细地址，包括省市区(可选填)</view>
			<view class="address-item delte" @tap="close()">关闭</view>
			<view class="address-item confirmbtn" @tap="confirm()">保存</view>
		</view>
		
	</view>
</template>

<script>
	import {modifyUser} from "@/api/user.js";
	export default {
		props: {
			show: {
				type: Boolean,
				default: false 
			},
			isIphoneX: {
				type: Boolean,
				default: false 
			},
			uid:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				field: 'address',//字段名称
				trantision: false,
				isFocus:false,
				address:'',
			};
		},
		methods: {
			initData(address){
				this.address=address;
			},
			clear() {
				this.address = '';
			},
			close() {
				this.address = '';
				this.$emit('close', false);
			},
			confirm(){
				let that=this;
				modifyUser({
					'uid':that.uid,
					'field':that.field,
					'value':that.address
				}).then(res=>{
					let data=res.data;
					let msg="保存成功";
					if(data.code!=1){
						if(data.code==-2){
							msg='缺少必要字段值';
						}else if(data.code==-10){
							msg="TOKEN错误";
						}else{
							msg="数据保存失败";
						}
						//console.log(data.code);
					}
					that.clear();
					this.close();
					return that.$util.Tips({
						title: msg
					});
				})
			},
			setFocus(){
				 
			}
		}
	}
</script>

<style lang="scss">
	.mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;
		background: rgba(102, 102, 102, 0.3);
		opacity: 1;
		z-index: 25;
		visibility: visible;
	}
	.visible {
		opacity: 0;
		z-index: 2;
		visibility: hidden;
		display:none;
	}
	.utitle{
		font-size: 36rpx;
		font-weight: normal;
		text-align: center;
		width: 100%;
		color: #333;
	}
	.address{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 380rpx;
		width: 90%;
		font-size: 32rpx;
		background-color: #fff;
		border:solid 1px #EBEBEB;
		border-radius: 3px;
		margin-bottom: 10px;
		padding: 0 20rpx;
	}
	.addressinput{
		width: 100%;
		height: 80rpx;
		margin: 20rpx 0;
	}
	.address .fixcode{
		width: 100rpx;
		height: 90rpx;
		margin-right: 5px;
	}
	.address .inputs{
		width: 90%;
		height: 80rpx;
		font-size: 18px;
		color:#000000;
		border: solid 1px #d0d0d0;
		margin: 0 auto;
		border-radius: 10rpx;
		padding-left: 10rpx;
	}
	.address .notice{
		color: #8f8f8f;
		font-size: 28rpx;
		text-align: left;
		width: 90%;
	}
	.center {
		color: #333;
		font-size: 32rpx;
		width: 100%;
	}
	.close {
		width: 50rpx;
		height: 50rpx;	
	}
	image {
		width: 100%;
		height: 100%;
	}
	.code {
		width: 100%;
		height: 120rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}
	.code-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid #d0d0d0;
	}
	.code-box-item {
		width: 86rpx;
		height: 86rpx;
		background: #fff;
		font-size: 40rpx;
		line-height: 75rpx;
		text-align: center;
	}
	.code-box-item:not(:last-child) {
		border-right: 1px solid #d0d0d0;
	}
	.address {
		position: fixed;
		top: 30%;
		left: 0;
		width: 96%;
		background: #fff;
		display: flex;
		justify-content: center;
		z-index: 1000;
		flex-wrap: wrap;
		border-radius: 5px;
		margin-left: 2%;
		padding:40rpx 0;
	}
	.active {
		bottom: -400rpx;
	}
	.address-item {
		box-sizing: border-box;
		border-radius: 10rpx;
		width: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #fdfdfd;
		font-size: 28rpx;
		color: #333;
		height: 60rpx;
		margin: 5rpx;
		background:rgba(253,253,253,0.3)!important;
	}
	.address-item .bspace{
		width: 79rpx;
		height: 64rpx;
	}
	.confirmbtn{
		background: #2bae67 !important;
		color: #fff;
		width: 45%;
	}
	.hide {
		opacity: 0;
	}
	.delte {
		background:rgba(225, 225, 225, 1.0)!important;
		box-shadow: none;
		width: 45%;
	}
	.delte image {
		width: 60rpx;
		height: 60rpx;
	}
	.isIphone {
		padding-bottom: 68rpx !important;
	}
</style>
