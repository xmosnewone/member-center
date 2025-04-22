<template>
	<view class="container">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<form @submit="formSubmit">
			<view class='personal-data'>
				<view class='list'>
					<view class='item acea-row row-between-wrapper'>
						<view class="label">头像</view>
						<view class="avatar-box" v-if="!mp_is_new" @click.stop='uploadpic'>
							<image :src="userInfo.headimg?userInfo.headimg:'/static/default-avatar.png'"></image>
						</view>
						<view class="avatar-box" v-else>
							<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image :src="userInfo.headimg?userInfo.headimg:'/static/default-avatar.png'"></image>
							</button>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class="label">姓名</view>
						<view class='input'><input type='text' name='uname' :maxlength="15"
								:value='userInfo.uname' @click="editUname()"></input>
						</view>
					</view>
					<!-- #ifndef MP -->
					<view class='item acea-row row-between-wrapper'>
						<view class="label">昵称</view>
						<view class='input'><input type='text' name='nickname' :maxlength="15"
								:value='userInfo.nickname'  @click="editNickname()"></input>
						</view>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<view class='item acea-row row-between-wrapper'>
						<view class="label">昵称</view>
						<view class='input'>
							<input type='nickname' name='nickname' :maxlength="15"
								:value='userInfo.nickname' @change="changeNick"></input>
						</view>
					</view>
					<!-- #endif -->
					<view class='item acea-row row-between-wrapper'>
						<view class="label">手机号</view>
						<view class='input acea-row row-between-wrapper'>
							<view class=""></view>
							<view class="acea-row row-middle">
								<input type='text' :disabled='disMobile' name='mobile' :value='userInfo.mobile'
									class='id'  @click="editMobile()"></input>
							</view>
	
						</view>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view class="label">性别</view>
						<picker class="pickerBox" @change="sexChange" :value="selectSex" :range="sexList">
						<view class='iconfont icon-yonghu3 fontcolor'></view>
						<view class="uni-input">{{sexName}}</view>
						</picker>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view class="label">密码</view>
						<view class='input' @click="editPasswd()">
							点击修改密码 <text class="iconfont icon-xiangyou"></text>
						</view>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<view class="label">地址</view>
						<view class='input'><input type='text' name='address' :maxlength="50"
								:value='userInfo.address' @click="editAddress()"></input>
						</view>
					</view>
					<!-- #ifdef MP -->
					<view class="item acea-row row-between-wrapper">
						<view class="label">解绑微信</view>
						<view class='input' @click="unbindMP">
							<text class="iconfont icon-guanbi"></text>解绑后，当前账户将退出
						</view>
					</view>
					<!-- #endif -->
				</view>

				<!-- #ifdef H5 || MP -->
				<view class="logOut cartcolor row-center-wrapper" @click="outLogin">退出登录</view>
				<!-- #endif -->
			</view>
		</form>
		<!--修改姓名窗口-->
		<unamemodify ref="unamemodify" :uid="uid" :show="showuname" @close="closeuWin"></unamemodify>
		<!--修改昵称窗口-->
		<nickmodify ref="nickmodify" :uid="uid" :show="shownickname" @close="closeuWin"></nickmodify>
		<!--修改地址窗口-->
		<addressmodify ref="addressmodify" :uid="uid" :show="showaddress" @close="closeuWin"></addressmodify>
		<!--修改密码窗口-->
		<passwdmodify ref="passwdmodify" :uid="uid" :show="showpasswd" @close="closeuWin"></passwdmodify>
		<!--修改手机窗口-->
		<mobilemodify ref="mobilemodify" :uid="uid" :show="showmobile" @close="closeuWin"></mobilemodify>
	</view>
</template>

<script>
	import {memberInfo,modifyUser,mpUnbind} from "@/api/user.js";
	import {checkLogin} from "@/libs/login.js";
	import {systeminfo} from "@/api/config.js";
	import unamemodify from "@/components/unamemodify";
	import nickmodify from "@/components/nickmodify";
	import addressmodify from "@/components/addressmodify";
	import passwdmodify from "@/components/passwdmodify";
	import mobilemodify from "@/components/mobilemodify";
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			unamemodify,
			nickmodify,
			addressmodify,
			passwdmodify,
			mobilemodify,
			innerheader
		},
		data() {
			return {
				pageTitle:'我的信息',
				userInfo: {},
				loginType: 'h5', //app.globalData.loginType
				array: [],
				setIndex: 0,
				showuname:false,
				showaddress:false,
				showpasswd:false,
				shownickname:false,
				showmobile:false,
				//不允许修改手机号
				disMobile:true,
				//系统开启SMS验证手机号
				smsVerify:false,
				//性别下拉
				selectSex:0,//性别数值
				sexName:'先生',//性别名称
				sexList:['先生','女士','保密'],
				
				// #ifdef MP
				mp_is_new: true,
				// #endif
				// #ifndef MP
				mp_is_new: false,
				// #endif
				// 是否已登录
				isLogin: false,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '' },
			};
		},
		onLoad() {
			
		},
		onShow() {
			//判断用户登录
			this.userLogin();
			
			let that=this;
			systeminfo().then(res=>{
				let config=res.data.content;
				if(config['sms_verify']==1){
					that.smsVerify=true;
				}
			})
		},
		methods: {
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
					this.getUserInfo();
				}else{
					return this.$util.Tips({
						title: '请登录会员'
					},'/pages/login/mplogin');
				}
			},
			//获取登录用户信息
			getUserInfo:function(){
				var uid=this.$store.getters.uid;
				var mem_no=this.$store.getters.mem_no;
				let that=this;
				memberInfo({
					'uid':uid,
					'mem_no':mem_no
				}).then(res=>{
					let data=res.data;
					if(data!=-10&&data!=-2&&data!=-3){
						//获取成功	
						that.userInfo=data;
						that.uid=data.uid;
						that.fixedSex(that);
						if(data.mobile==""){
							that.disMobile=false;
						}
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//性别选择器
			fixedSex: function(obj){
				let sex=obj.userInfo.sex;
				for(let i in obj.sexList){
					if(i==sex){
						obj.sexName=obj.sexList[i];
						obj.selectSex=sex;
					}
				}
			},
			/**
			 * 退出登录
			 * 
			 */
			outLogin: function() {
				let that = this;
				if (that.loginType == 'h5') {
					uni.showModal({
						title: '提示',
						content: '确认退出登录',
						success: function(res) {
							if (res.confirm) {
									// uni.clearStorage()
									that.$store.commit("LOGOUT");
									uni.reLaunch({
										url: '/pages/index/index'
									})
							} else if (res.cancel) {}
						}
					});
				}
			},
			/**
			 * 上传文件
			 * 
			 */
			uploadpic: function(type) {
				let that = this;
				that.$util.uploadImageOne('mcenter/uploadHeadimg', function(res) {
					that.userInfo.headimg=res.url;
					//保存图片路径到服务器
					modifyUser({
						'uid':that.uid,
						'field':'headimg',
						'value':res.url
					}).then(res=>{
						//console.log(data);
					})
				},function(res){
					let info='保存图片失败，请重试';
					if(res.code==-10){
						info='ACCESS_TOKEN 错误';
					}
					that.$util.Tips({
						'title':info
					})
				});
			},
			// 微信头像获取
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				
				//上传头像到服务器
				let that=this;
				that.$util.uploadImgs('mcenter/uploadHeadimg', avatarUrl, (res) => {
					let url=res.url;
					that.userInfo.headimg=url;
					if(url==""){
						return;
					}
					//保存图片路径到服务器
					modifyUser({
						'uid':that.uid,
						'field':'headimg',
						'value':url
					}).then(res=>{
						//let data=res.data;
						//console.log(data);
					})
					
				}, (err) => {
					console.log(err)
				});
			},
			//修改姓名
			editUname:function(){
				this.$refs.unamemodify.initData(this.userInfo.uname);
				this.showuname=true;
			},
			//修改昵称
			editNickname:function(){
				this.$refs.nickmodify.initData(this.userInfo.nickname);
				this.shownickname=true;
			},
			//手机号
			editMobile:function(){
				if(this.disMobile){
					return;
				}
				this.$refs.mobilemodify.initData(this.smsVerify,this.userInfo.mobile);
				this.showmobile=true;
			},
			//地址
			editAddress:function(){
				this.$refs.addressmodify.initData(this.userInfo.address);
				this.showaddress=true;
			},
			//密码
			editPasswd:function(){
				this.$refs.passwdmodify.initData();
				this.showpasswd=true;
			},
			//隐藏修改姓名
			closeuWin:function(){
				this.showuname=false;
				this.showaddress=false;
				this.showpasswd=false;
				this.shownickname=false;
				this.showmobile=false;
				this.getUserInfo();
			},
			//微信小程序调用昵称
			changeNick:function(e){
				let nickname=e.detail.value;
				console.log(nickname);
				let that=this;
				modifyUser({
					'uid':that.uid,
					'field':'nickname',
					'value':nickname
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
					return that.$util.Tips({
						title: msg
					});
				})
			},
			//性别选择
			sexChange(e) {
				this.selectSex = e.detail.value;
				this.sexName=this.sexList[this.selectSex];
				let that=this;
				modifyUser({
					'uid':that.uid,
					'field':'sex',
					'value':that.selectSex
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
					return that.$util.Tips({
						title: msg
					});
				})
			},
			//解绑微信
			unbindMP:function(){
				let that=this;
				uni.showModal({
					title: '警告',
					content: '取消绑定后，用户头像等信息设置将清除',
					success: function (res) {
						if (res.confirm) {
							mpUnbind({
								'uid':that.uid
							}).then(res=>{
								if(res.data.code==1){
									that.outLogin();
								}else{
									return that.$util.Tips({
										title: "解绑失败，请重试"
									});
								}
							});
						} else if (res.cancel) {
							
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		overflow: hidden;
	}
	uni-view {
	    display: block;
		box-sizing: border-box;
	}
	.bg-color{
		background-color: #2bae67;
	}
	.cartcolor {
		color:#2bae67;
		border: 1px solid #2bae67;
	}
	.personal-data {
		padding-bottom: 50rpx;
		padding-bottom: calc(50rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.personal-data .wrapper {
		margin: 10rpx 0;
		background-color: #fff;
		padding: 36rpx 30rpx 13rpx 30rpx;
	}
	.personal-data .wrapper .title {
		margin-bottom: 30rpx;
		font-size: 32rpx;
		color: #282828;
	}
	.uni-input-input {
		font-size: 28rpx;
	}
	.personal-data .list {
		margin-top: 15rpx;
		background-color: #fff;
	}
	.personal-data .list .item .label{
		float:left;
		width: 120rpx;
	}
	.personal-data .list .item {
		padding: 30rpx 30rpx 30rpx 0;
		border-bottom: 1rpx solid #f2f2f2;
		margin-left: 30rpx;
		font-size: 28rpx;
		color: #282828;
		display: flex;
		width: 100%;
		-webkit-justify-content: flex-start;
		justify-content: flex-start;
	}
	.personal-data .list .item .phone {
		width: 160rpx;
		height: 56rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 56rpx;
		border-radius: 32rpx
	}
	.personal-data .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 76rpx auto 0 auto;
	}
	.personal-data .logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}
	.avatar-box {
		width: 96rpx;
		height: 96rpx;
		display: inline-block;
		overflow: hidden;
		position: relative;
		border-radius: 50%;
		padding: 0;
		button{
			width: 96rpx;
			height: 96rpx;
			display: block;
		}
		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			display: block;
			position: absolute;
			left: 0;
		}
	}
</style>