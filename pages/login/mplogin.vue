<template>
	<view class="container my-order" >
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<view class="codebody">
			<view class="mplogo">
				<image src="/static/images/loginlogo.png"></image>
			</view>
			
			<!-- #ifdef MP -->
			<view class="memo">
				ICEPOS会员中心申请获取授权，用于会员服务 请您完成授权登录
			</view>
			<!-- #endif -->
			
			<view class="wechat_login">
				<view class="btn-wrapper">
				<template>
					<!-- #ifdef MP -->
					<button class="bg-theme btn1" v-if="needMobile"  open-type="getPhoneNumber"
						@getphonenumber="getphonenumber">手机授权登录</button>
					<button class="bg-theme btn1" v-else-if="!needMobile" @click="getAuthLogin">
							授权登录
					</button>
					<!-- #endif -->	
					<button class="bg-theme btn2"  @click="inputLogin">
						账号密码登录
					</button>
				</template>
				</view>
			</view>
			
			<view class="register">
				<view class="regnavi" url="/pages/login/register" @click="mpregister()">
					会员注册
				</view>
			</view>
			
			<view class="protocol" >
				<checkbox-group @click.stop='ChangeIsDefault'>
					<checkbox color="#0ba522" class="custom-checkbox"
						:checked="protocol ? true : false" /> <text @click.stop='ChangeIsDefault'>已阅读并同意</text>
					<text class="main-color" @click.stop="privacy(1)">《用户协议》</text>
					与<text class="main-color" @click.stop="privacy(2)">《隐私政策》</text>
				</checkbox-group>
			</view>

		</view>
		<loginwin :login_close="showPasslogin"  @onChangeFun="onChangeFun"></loginwin>
		<!-- #ifdef MP -->
		<privacyAgreementPopup v-if="canGetPrivacySetting" @onReject="onReject" @onAgree="onAgree">
		</privacyAgreementPopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import {getOpenid,authLogin,mpBindPhone} from '@/api/user.js';
	import {systeminfo} from "@/api/config.js";
	import MiniProgram from '@/libs/miniprogram.js';
	import {checkLogin} from "@/libs/login.js";
	import innerheader from '@/components/innerheader/index';
	import loginwin from '@/components/loginwin';
	import privacyAgreementPopup from '@/components/privacyAgreementPopup';
	export default {
		components: {
			loginwin,
			privacyAgreementPopup,
			innerheader
		},
		data() {
			return {
				pageTitle:'会员登录',
				protocol: false,
				inAnimation: false,
				showPasslogin:false,
				needMobile:false,//是否开启微信手机号验证组件
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				canGetPrivacySetting: false,
				openid:'',//当前小程序用户的openid
				unionid:'',//小程序用户的unionid
			}
		},
		onLoad() {
			let isLogin=checkLogin();
			if(isLogin){
				uni.switchTab({
					url:"/pages/index/index"
				})
				return;
			}
			
			// #ifdef MP
			 wx.getPrivacySetting({
			      success: res => {
			        if (res.needAuthorization) {
			          // 需要弹出隐私协议
					  this.canGetPrivacySetting=true;
			        } else {
						console.log("用户已经同意隐私协议");
			          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
			        }
			      },
			      fail: () => {},
			      complete: () => {}
			});
			// #endif
		},
		onShow() {
			let that=this;
			systeminfo().then(res=>{
				let config=res.data.content;
				that.$Cache.set("siteName",config['web_name']);
				if(config['mp_mobile_verify']==1){
					that.needMobile=true;
					//需要用手机号注册，才获取code
					that.userLogin();
				}
			})
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
			mpregister(){
				uni.navigateTo({
					url:"/pages/login/register"
				})
			},
			ChangeIsDefault(e) {
				this.$set(this, 'protocol', !this.protocol);
			},
			onReject() {
				uni.navigateBack();
			},
			onAgree() {
				this.protocol = true
			},
			//弹窗其他方式登录
			inputLogin(){
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.showPasslogin=true;
			},
			//关闭窗口
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				this.showPasslogin = false;
			},
			privacy(type) {
				let page="/pages/public/protocal";
				if(type==2){
					page="/pages/public/privacy";
				}
				uni.navigateTo({
					url: page
				})
			},
			// #ifdef MP
			//获取用户微信code，获取openid等
			userLogin() {
				MiniProgram.getCode().then(code => {
						let that=this;
							that.code=code;
						getOpenid({
							'code':code,
							}).then(res=>{
								let data=res.data;
								that.openid=data.openid;
								that.unionid=data.unionid;
								//console.log("获取微信用户openid成功"+that.openid+" unionid"+that.unionid);
							}).catch(error=>{
								//console.log("服务器获取OPENID错误:"+error)
							})
					})
					.catch(err => {
							console.log(err)
					});
			},
			//普通授权登录
			getAuthLogin(){
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.showLoading({
					title: '正在登录中'
				});
				let that=this;
				MiniProgram.getCode().then(code => {
						authLogin({
							'code': code
						}).then(res => {
							let data=res.data;
							if(data.code==1){
								let userinfo=data.userinfo;
								that.$store.commit('LOGIN', {
									uid: String(userinfo.uid),
									mem_no: String(userinfo.ucode),
									user_info:userinfo
								});
								if(data.isNew==1){
									uni.showToast({
										title: '注册成功！密码是年月日:'+data.passwd,
										icon: 'none',
										duration: 3900
									});
									setTimeout(()=>{
										uni.switchTab({
											url:'/pages/member/index'
										})
									},4000)
								}else{
									uni.switchTab({
										url:'/pages/member/index'
									})
								}
							}else{
								uni.showToast({
									title: '微信登录失败，请重试',
									icon: 'none',
									duration: 2000
								});
							}
						}).catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: err,
								icon: 'none',
								duration: 2000
							});
						});
				})
				.catch(err => {
					console.log(err)
				});
				
			},
			// 小程序获取手机号码
			getphonenumber(e) {
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.showLoading({
					title: '正在登录中'
				});
				this.getUserPhoneNumber(e.detail.encryptedData, e.detail.iv,e.detail.code);
			},
			// 小程序获取手机号码回调
			getUserPhoneNumber(encryptedData, iv, code) {
				let that=this;
				//获取手机号后注册/判断登录
				mpBindPhone({
						'encryptedData': encryptedData,
						'iv': iv,
						'code': code,
						'openid':that.openid,
						'unionid':that.unionid
					})
					.then(res => {
						let data=res.data;
						if(data.code==1){
							let userinfo=data.userinfo;
							that.$store.commit('LOGIN', {
								uid: String(userinfo.uid),
								mem_no: String(userinfo.ucode),
								user_info:userinfo
							});
							if(data.isNew==1){
								uni.showToast({
									title: '注册成功！密码是年月日:'+data.passwd,
									icon: 'none',
									duration: 3900
								});
								setTimeout(()=>{
									uni.switchTab({
										url:'/pages/member/index'
									})
								},4000)
							}else{
								uni.switchTab({
									url:'/pages/member/index'
								})
							}
						}else{
							uni.showToast({
								title: '获取手机号失败！请重试',
								icon: 'none',
								duration: 2000
							});
						}
					})
					.catch(res => {
						uni.hideLoading();
					});
			},
			// #endif
		}
	}
</script>


<style lang="scss" scoped>
	page{
		background-color: #ffffff;
		height: 100%;
	}
	.codebody{
		background-color: #fff;
		margin:30rpx auto;
		width: 90%;
		border-radius: 20rpx;
		
		.mplogo{
			width: 320rpx;
			height: 320rpx;
			margin: 0 auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.memo{
		width: 80%;
		padding-top: 40rpx;
		font-size: 28rpx;
		text-align: center;
		margin: 0 auto;
		line-height: 30rpx;
		font-weight: bolder;
		
		.txtmemo{
			color: #313131;
			height: 40rpx;
			float: left;
			line-height: 40rpx;
		}
		
		image{
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
			float: left;
		}
	}

	.btn-wrapper {
		padding: 0 66rpx;
		margin-top: 50rpx;
		button {
			width: 100%;
			height: 86rpx;
			line-height: 86rpx;
			margin-bottom: 30rpx;
			border-radius: 120rpx;
			font-size: 30rpx;
	
			&.btn1 {
				color: #fff;
				background-color: #18a836;
			}
			&.btn1:hover {
				color: #fff;
				background-color: #23b222;
			}
	
			&.btn2 {
				color: #18a836;
				border: 1px solid #18a836;
				background-color: #fff;
			}
		}
	}
	
	.protocol {
		
		width: 100%;
		margin: 0 auto;
		color: #999999;
		font-size: 24rpx;
		line-height: 24rpx;
		text-align: center;

		.main-color {
			color: #18a836;
		}
	
		.trembling {
			animation: shake 0.6s;
			color: #18a836;
		}
	}

	.register{
		width:100%;
		text-align: center;
		margin-bottom: 30rpx;
	}

</style>