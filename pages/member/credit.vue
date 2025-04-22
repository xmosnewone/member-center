<template>
	<view class="container">
		<view class="mcHeader">
			<!--返回顶部-->
			<innerheader :title="pageTitle" :bgcolor="bgColor" :color="color"></innerheader>
			<view class="mycredit">
				<text class="mc">我的积分</text>
				<text class="mcnum">{{userInfo.credit}}</text>
				<text class="mcuse">积分可以当钱花</text>
				<view class="helpmenu" @click="agreement()">使用帮助</view>
			</view>
		</view>
		
		<view class="tablist">
			<circle-tabs @input="statusClick" v-model='tabIndex' :tabList="list" mode='circle'></circle-tabs>
		</view>
		
		<view class="creditlist">
			<view class="list">
				<view class="itemc" v-for="(item, index) in creditList" :key="index">
					<view class="leftc">
					<text class="title" v-if="item.flow_no!=''">下单返积分</text>
					<text class="title" v-else-if="item.flow_no==''">其他</text>
					<text class="time">{{item.add_date}}</text>
					</view>
					<view class="rightc">
						<text class="num">{{item.act}}{{item.credit}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {checkLogin} from "@/libs/login.js";
	import {memberInfo} from "@/api/user.js";
	import {memberCreditList} from "@/api/credit.js";
	import cricleTabs from "@/components/circle-tabs/circle-tabs.vue";
	import innerheader from '@/components/innerheader';
	export default {
		components: {
		    cricleTabs,
			innerheader
		},
		data() {
			return {
				pageTitle:'会员积分',
				bgColor:'#007b5e',
				color:'#ffffff',
				//积分类型
				tabIndex:0,
				list:[
					{
						id:0,
						title:'积分收入',
					},
					{
						id:1,
						title:'积分支出',
					},
					{
						id:2,
						title:'过期积分',
					}
				],
				//会员相关
				isLogin:false,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '' },
				page: 1,
				limit: 20,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				creditList: [], //订单数组
			}
		},
		onLoad() {
			
		},
		onShow() {
			
			this.userLogin();
			
			if(!this.isLogin){
				return this.$util.Tips({
					title: '请登录会员'
				},'/pages/login/mplogin');
			}else{
				this.getUserInfo();
			}
			
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			//使用帮助
			agreement:function(){
				uni.navigateTo({
					url:'/pages/public/creditagreement'
				})
			},
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
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
						
						setTimeout(function(){
							//获取当前订单
							that.getList();
						},100);
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//切换订单状态
			statusClick: function(status) {
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'creditList', []);
				this.getList();
			},
			//获取列表
			getList:function(){
				let that=this;
				if(!that.isLogin){
					return;
				}
				
				if (that.loadend||that.loading) {
					return;
				};
				
				that.loading = true;
				
				uni.showLoading({
					title: "加载中"
				});
				
				memberCreditList({
					uid:that.uid,
					vip_no:that.userInfo.ucode,
					condition:that.tabIndex,
					page:that.page,
					limit:that.limit
				}).then(res=>{
					let list=res.data.list;
					let total=res.data.total;
					if(res.data.code==1){
						for(let i in list){
							let one=list[i];
							
							that.creditList.push(one);
						}
					}
					
					if(total==that.creditList.length){
						that.loadend=true;
						that.page=1;
					}else if(that.creditList.length<total){
						that.page+=1;
					}
					that.loading=false;
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mcHeader{
		text-align: center;
		width:100%;
		height: 500rpx;
		background-color: #007b5e;
		background-image: url('/static/images/member/credibg.png');
		background-repeat: no-repeat;
		background-size: 200rpx 200rpx ;
		background-position: center center;
		color: #fff;
		overflow: hidden;
		.back-arrow{
			float:left;
			margin-left:20rpx;
		}
	}
	.credit-header{
		height: 80rpx;
		font-size: 30rpx;
	}
	.mycredit{
		color:#fff;
		width: 100%;
		height: 200rpx;
		margin-left:50rpx;
		position: relative;
		margin-top: 30rpx;
		.mc{
			width: 100%;
			text-align: left;
			height: 30rpx;
			display: inline-block;
		}
		.mcnum{
			font-size: 48rpx;
			font-weight: bolder;
			height: 48rpx;
			display: inline-block;
			text-align: left;
			width: 100%;
			margin-top: 20rpx;
		}
		.mcuse{
			height: 48rpx;
			display: inline-block;
			text-align: left;
			width: 100%;
			margin-top: 20rpx;
		}
		.helpmenu{
			position: absolute;
			top:0;
			right:30rpx;
			width:180rpx;
			border-radius: 20rpx;
			height: 40rpx;
			padding-left: 10rpx;
			background-color:rgba(255, 255, 255, 0.3);
		}
	}
	.tablist{
		position: relative;
		top:-100rpx;
		height: auto;
		overflow: hidden;
		padding:0 20rpx;
	}
	.creditlist{
		min-height:800rpx;
		background-color: #fafafa;
		position: relative;
		top:-100rpx;
		padding:0 20rpx;
		border-top: solid 1rpx #fafcfb;
		
		.list{
			background-color: #fff;
			width: 100%;
			height: auto;
			min-height:800rpx;
			align-items: center;
		}
		.list .itemc{
			border-bottom: solid 1rpx #fafcfb;
			height: 120rpx;
			width: 90%;
			margin: 0 auto;
			padding: 20rpx 0;
			
		}
		.list .itemc .leftc{
			color:#000;
			width:70%;
			height: 100rpx;
			float: left;
		}
		.list .itemc .leftc .title{
			width: 100%;
			display: inline-block;
			padding-bottom: 15rpx;
		}
		.list .itemc .leftc .time{
			width: 100%;
			color: #ababab;
		}
		.list .itemc .rightc{
			color:#000;
			width:30%;
			height: 120rpx;
			float:right;
			text-align: right;
			color: #007b5e;
			font-size: 40rpx;
			font-weight: bolder;
			line-height: 100rpx;
		}
	}
</style>