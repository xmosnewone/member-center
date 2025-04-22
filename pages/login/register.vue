<template>
	<view class="container">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<form @submit="register">
			<view class="MemberRegister">
				<view class="list">
					<view class="item">
						<input type='text' placeholder='填写您的昵称' placeholder-class='placeholder'
							v-model="nickname"></input>
					</view>
					<view class="item">
						<input type='number' placeholder='填写手机号码' placeholder-class='placeholder'
							v-model="mobile"></input>
					</view>
					
					<view class="item">
						<input type='password' placeholder='填写密码' placeholder-class='placeholder'
							v-model="passwd"></input>
					</view>
					
					<view class="item">
						<input type='password' placeholder='填写确认密码' placeholder-class='placeholder'
							v-model="passwd2"></input>
					</view>
					
					<view class="item" v-if="showVericode">
						<input class="inputs smsinput" type="text" v-model="vericode" placeholder="短信验证码"/>
						<button class="smsbtn" @click.stop="getSms">
							<label ref="countdown">{{codeLabel}}</label>
						</button>
					</view>
					
					<view class="item acea-row row-between-wrapper">
						<input type='text' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput"
							v-model="captcha"></input>
						<image @click="changeCaptcha" class="captcha" :src="captchaUrl"/>
						<button class="code font-num" :class="disabled === true ? 'on' : ''" :disabled='disabled'
							@click="code">
							{{ text }}
						</button>
					</view>
				</view>
				<button form-type="submit" class="confirmBnt bg-color">注册</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {HTTP_REQUEST_URL} from "@/config/app.js";
	import {mobileRegister,sendSms} from "@/api/user.js";
	import {systeminfo} from "@/api/config.js";
	import Cache from '../../utils/cache';
	import innerheader from '@/components/innerheader/index';
	export default {
		mixins: [],
		components: {
			innerheader
		},
		data() {
			return {
				pageTitle:'会员注册',
				nickname:'',
				passwd:'',
				passwd2:'',
				mobile: '',
				captcha: '',
				branch_no:'',
				showCaptcha:false,
				captchaUrl:"",
				text:'',
				disabled:true,
				vericode:'',//手机验证号
				showVericode:false,//显示短信验证码
				countDown:60,//获取验证码间隔
				codeLabel:'获取验证码',
				itv:null,//setInterval间隔
			};
		},
		onLoad(options) {
			this.changeCaptcha();
		},
		onShow() {
			this.branch_no=Cache.get("branch_no") || ""; 
			let that=this;
			systeminfo().then(res=>{
				let config=res.data.content;
				if(config['sms_verify']==1){
					that.showVericode=true;
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
			changeCaptcha(){
				let timestamp = new Date().getTime();
				this.captchaUrl=HTTP_REQUEST_URL+'/api/mcenter/verifyimg?date='+timestamp;
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			register: function() {
				let that = this;
				if (!that.nickname) return that.$util.Tips({
					title: '请填您的昵称'
				});
				if (!that.mobile) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/i.test(that.mobile))) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				
				if(that.passwd.trim()==""||that.passwd2.trim()==""){
					return that.$util.Tips({
						title: '请输入密码'
					});
				};
					
				if(that.passwd!=that.passwd2){
					return that.$util.Tips({
						title:'两次输入密码不一致'
					});
				}
				
				if(that.showVericode&&that.vericode.trim()==''){
						return that.$util.Tips({
							title:'请填写短信验证码'
						});
				}
				
				mobileRegister({
					mobile: that.mobile,
					passwd:that.passwd,
					nickname:that.nickname,
					branch_no:that.branch_no,
					code:that.vericode,
					captcha: that.captcha
				}).then(res => {
					let data=res.data;
					if(data.code==1&&data.uid>0){
						return that.$util.Tips({
							title:'注册成功，请登录'
						},'/pages/login/mplogin');
					}else{
						switch(data.code){
							case -1:
							return that.$util.Tips({
								title:'手机格式错误'
							});
							break;
							case -2:
							return that.$util.Tips({
								title:'手机已被其他用户注册'
							});
							break;
							case -3:
							return that.$util.Tips({
								title:'短信验证码错误'
							});
							break;
							case -4:
							return that.$util.Tips({
								title:'短信验证码超时'
							});
							break;
							case -5:
							return that.$util.Tips({
								title:'注册会员失败'
							});
							break;
							case -9:
							that.changeCaptcha();
							return that.$util.Tips({
								title:'图片验证码错误'
							});
							break;
						}
					}
					
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
				
			},
			/**
			 * 发送验证码
			 *
			 */
			getSms(){
				if(this.countDown<60){
					return;
				}
				if(this.mobile.trim()==''){
					return this.$util.Tips({
						title: "请输入手机号码"
					});
				}
				//发送验证码
				let that=this;
				sendSms(
					{'mobile':that.mobile}
				).then(res=>{
					
					let data=res.data;
					if(data.code==1){
						that.$util.Tips({
							title: "短信已发送"
						});
						that.starCountDown(that);
					}else{
						let msg="短信发送失败";
						if(data.code==6){
							msg="手机号已被注册";
						}
						return that.$util.Tips({
							title: msg
						});
					}
					
				});
			},
			starCountDown(that){
				if(that.countDown<60){
					return;
				}
				that.itv=setInterval(function(){
					that.countDown-=1;
					that.codeLabel=String(that.countDown)+" S";
					if(that.countDown<=0){
						that.codeLabel="获取验证码";
						that.countDown=60;
					}
				},1000);
				setTimeout(()=>{
					clearInterval(that.itv);
				},60000)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}
	.bg-color{
		background-color: #2bae67;
	}
	.MemberRegister .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
	}

	.MemberRegister .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.MemberRegister .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.MemberRegister .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.MemberRegister .list .item .placeholder {
		color: #b9b9bc;
	}

	.MemberRegister .list .item input.codeIput {
		width: 340rpx;
	}

	.MemberRegister .list .item .code {
		font-size: 32rpx;
		background-color: #fff;
	}

	.MemberRegister .list .item .code.on {
		color: #b9b9bc !important;
	}

	.MemberRegister .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
	}
	.captcha{
		width:200rpx;
		height: 80rpx;
	}
	.MemberRegister .list .item input.smsinput{
		width: 50%;
		height: 80rpx;
		float: left;
	}
	.item .smsbtn{
		width: 30%;
		height: 80rpx;
		font-size: 18px;
		margin-left: 10rpx;
		color:#9e9e9e;
		float: right;
		margin-top: 15rpx;
	}
</style>