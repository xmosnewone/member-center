<template>
	<view class="modifycontent" v-if="show">
		<!-- mask层 -->
		<view :class="['mask', show ? '' : 'visible']"></view>
		<!-- 键盘 -->
		<view :class="['mobile', show ? '' : 'visible', isIphoneX ? 'isIphone' : '']">
			<view class="utitle">修改手机号</view>
			<view class="mobileinput">
				<input class="inputs" type="text" v-model="mobile" placeholder="请输入手机号"/>
			</view>
			<view class="mobileinput" v-if="showVericode">
				<input class="inputs smsinput" type="text" v-model="vericode" placeholder="短信验证码"/>
				<button class="smsbtn" @click.stop="getSms">
					<label ref="countdown">{{codeLabel}}</label>
				</button>
			</view>
			<view class="notice">规则:请输入纯数字的手机号码</view>
			<view class="mobile-item delte" @tap="close()">关闭</view>
			<view class="mobile-item confirmbtn" @tap="confirm()">保存</view>
		</view>
		
	</view>
</template>

<script>
	import {modifyUser,modifyMobile,sendSms} from "@/api/user.js";
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
				field: 'mobile',//字段名称
				trantision: false,
				isFocus:false,
				mobile:'',//手机号
				vericode:'',//手机验证号
				showVericode:false,//显示短信验证码
				countDown:60,//获取验证码间隔
				codeLabel:'获取验证码',
				itv:null,//setInterval间隔
			};
		},
		onUnload() {
			if(this.itv!=null){
				clearInterval(this.itv);
			}
		},
		methods: {
			initData(bool,mobile){
				this.mobile=mobile;
				this.vericode='';
				this.showVericode=bool;
			},
			clear() {
				this.mobile = '';
			},
			close() {
				this.mobile = '';
				this.$emit('close', false);
			},
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
			confirm(){
				if(this.showVericode&&this.vericode==""){
					return this.$util.Tips({
						title: "请输入短信验证码"
					});
				}
				if(this.mobile.trim()==""){
					return this.$util.Tips({
						title: "请输入手机号码"
					});
				}
				let that=this;
				modifyMobile({
					'uid':that.uid,
					'mobile':that.mobile,
					'code':that.vericode
				}).then(res=>{
					let data=res.data;
					let msg="保存成功";
					if(data.code!=1){
						if(data.code==-6){
							msg='手机号码已使用';
						}else if(data.code==-3){
							msg="短信验证码错误";
						}else if(data.code==-4){
							msg="短信验证码已过期";
						}else{
							msg="更新手机号失败，请重试";
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
				 setTimeout(()=>{
				         this.isFocus=true;
				},20);
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
	}
	.utitle{
		font-size: 36rpx;
		font-weight: normal;
		text-align: center;
		width: 100%;
		color: #333;
	}
	.mobile{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 480rpx;
		width: 90%;
		font-size: 32rpx;
		background-color: #fff;
		border:solid 1px #EBEBEB;
		border-radius: 3px;
		margin-bottom: 10px;
		padding: 0 20rpx;
	}
	.mobileinput{
		width: 100%;
		height: 80rpx;
		margin: 20rpx 0;
		display: flex;
	}
	.mobile .fixcode{
		width: 100rpx;
		height: 90rpx;
		margin-right: 5px;
	}
	.mobile .inputs{
		width: 90%;
		height: 80rpx;
		font-size: 18px;
		color:#000000;
		border: solid 1px #d0d0d0;
		margin: 0 auto;
		border-radius: 10rpx;
		padding-left: 10rpx;
	}
	.mobile .smsinput{
		width: 50%;
		height: 80rpx;
	}
	.mobile .smsbtn{
		width: 30%;
		height: 80rpx;
		font-size: 18px;
		margin-left: 10rpx;
		color:#9e9e9e;
	}
	.mobile .notice{
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
	.mobile {
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
	.mobile-item {
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
	.mobile-item .bspace{
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
