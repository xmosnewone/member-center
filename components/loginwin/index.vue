<template>
	<view>
		<view class="login_window" :class="login_close ? 'win-show' : ''">
			<view class="title">
				账号和密码登录
				<text class="close iconfont icon-close" @click="close()"></text>
			</view>
			
			<form @submit.prevent="submit">
				<view class="item acea-row">
					<input type="text" v-model="account" class="uni-input" focus placeholder="请输入手机账号" />
				</view>
				
				<view class="item acea-row">
					<input password type="text" v-model="passwd" class="uni-input" focus placeholder="请输入密码" />
				</view>
			</form>
			<view class="logon acea-row " @click='accountlogin()'>登录
			</view>
		</view>
		<view class="mask" @click='close' v-if="login_close"></view>
	</view>
</template>

<script>
	import {memberLogin} from '@/api/user.js';
	export default {
		props: {
			login_close: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				account:'',//账户
				passwd:'',//密码
				keyLock:true,//标记重复提交
			};
		},
		mounted() {
				this.selectOper_id=this.oper_id;
				this.operator_name=this.oper_name;
		},
		methods: {
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			//确认登录
			accountlogin(){
				let that = this;
				
				if (!that.account)
					return that.$util.Tips({
						title: '请填写手机号码'
					});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account))
					return that.$util.Tips({
						title: '请输入正确的手机号码'
					});

				if (!that.passwd)
					return that.$util.Tips({
						title: '请填写密码'
					});
				if (this.keyLock) {
					this.keyLock = !this.keyLock;
				} else {
					return that.$util.Tips({
						title: '请勿重复点击'
					});
				}
				memberLogin({
					account: that.account,
					passwd: that.passwd
				})
					.then((res) => {
						that.keyLock = true;
						let data = res.data;
						if(String(data)=="-10"){
							return that.$util.Tips({
								title: '访问接口ACCESSTOKEN错误'
							});
						}
						if(data['code']=="0"){
							return that.$util.Tips({
								title: '密码错误或登录失败'
							});
						}
						that.$store.commit('LOGIN', {
							uid: String(data.uid),
							mem_no: String(data.ucode),
							user_info:data
						});
						let backUrl = that.$Cache.get('login_back_url') || '/pages/index/index';
						that.$Cache.clear('login_back_url');
						
						
						if (backUrl.indexOf('/pages/login/mplogin') !== -1) {
							backUrl = '/pages/index/index';
						}
						uni.reLaunch({
							url: backUrl
						});
						
					})
					.catch((res) => {
						that.keyLock = true;
						that.$util.Tips({
							title: res
						});
					});
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.mask {
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, 0.5);
	    z-index: 100;
	    display: flex;
	}
	.login_window {
		position: fixed;
		bottom: 0;
		left: 0;
		right:0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		background: #ffffff;
		min-height: 80%;

		.button {
			width: 690rpx;
			height: 90rpx;
			border-radius: 45rpx;
			color: #FFFFFF;
			margin: 20rpx auto 0 auto;
		}
	}
	
	.win-show {
			transform: translate3d(0, 0, 0);
			visibility: visible;
	}
	
	.title{
		text-align: center;
		font-size: 36rpx;
		margin: 20rpx 0 80rpx 0;
		width: 100%;
	}
	.close{
		float:right;
		font-size:30rpx;
		padding-right: 20rpx;
		padding-top: 10rpx;
	}

	.item {
		border-bottom: 1rpx solid #eee;
		height: 80rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}
	
	.item .iconfont {
		font-size: 40rpx;
		color: #ccc;
	}
	
	.logon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 86rpx;
		background-color:#18a836;
		border-radius: 120rpx;
		color: #FFFFFF;
		font-size: 40rpx;
		margin:80rpx auto;
	}
	
</style>