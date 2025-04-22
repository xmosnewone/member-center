<template>
	<view class="container" >
		<!--返回顶部-->
		<innerheader :title="pageTitle" :bgcolor="bgColor" :color="color"></innerheader>
		<view class="codebody">
			<view class="memo">
				<image src='/static/images/member/scanicon.png'></image>
				<view class="txtmemo">结算前请出示会员码扫一扫</view>
			</view>
			<view class="qrcode">
				<yz-qr :qrPath.sync="qrPath" :text="qrtext" :size="size" :quality="quality" :colorDark="colorDark"
							:colorLight="colorLight"></yz-qr>
			</view>
			
			<view class="barcode">
				<tkiBarcode cid="code128" :loadMake="false" :opations="opations" :onval="true" format="code128" :val="bral" ref="code128" @result="code128" />
			</view>
		</view>
	</view>
</template>

<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import {checkLogin} from "@/libs/login.js";
	import {memberInfo} from "@/api/user.js";
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			tkiBarcode,
			tkiBarcode2: tkiBarcode,
			innerheader
		},
		data() {
			return {
				pageTitle:'会员条码',
				bgColor:"#2bae67",
				color:"#ffffff",
				qrPath: '',
				qrtext: '',
				size: 180,
				quality: 'L',
				colorDark: '#000000',
				colorLight: '#ffffff',
				
				//条形码
				bral: "",
				opations: {
					// format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
					width: 4,//设置条之间的宽度
					height: 120,//高度
					displayValue: true,//是否在条形码下方显示文字
					//text: "FB19A1650-100S",//覆盖显示的文本
					textAlign: "center",//设置文本的水平对齐方式
					textPosition: "bottom",//设置文本的垂直位置
					textMargin: 0,//设置条形码和文本之间的间距
					// fontSize: 24,//设置文本的大小
					// fontColor: "#0000ef",//设置文本的颜色
					// lineColor: "#0000ef",//设置条形码的颜色
					background: "#FFFFFF",//设置条形码的背景色
					margin: 0,//设置条形码周围的空白边距
					// marginTop: 10,//设置条形码周围的上边距
					// marginBottom: 20,//设置条形码周围的下边距
					// marginLeft: 30,//设置条形码周围的左边距
					// marginRight: 40,//设置条形码周围的右边距
					//会员信息
					userInfo: { uid: 0, nickname: '', headimg: '',mobile:'',ucode:'' },
				},
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.userLogin();
		},
		methods: {
			code128(v) {
						// console.log('code128:', v)
			},
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
					this.getUserInfo();
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
						that.qrtext=data.mobile==''?data.ucode:data.mobile;
						that.bral=data.mobile==''?data.ucode:data.mobile;
						setTimeout(() => {
							this.$refs["code128"]._makeCode();
						}, 200);
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						},'/pages/login/mplogin');
					}
				})
			},
			//返回上一页
			toPrepage:function(){
				var pages = getCurrentPages();
				if(pages.length>1){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.switchTab({
						url:'/pages/order/index'
					})
				}
			},
		}
	}
</script>


<style lang="scss">
	page{
		height: 100%;
	}
	.container{
		width: 100%;
		height: 100%;
		background-color: #2bae67;
		position: absolute;
	}
	.codebody{
		background-color: #fff;
		margin:30rpx auto;
		width: 90%;
		border-radius: 20rpx;
	}
	.memo{
		width: 400rpx;
		padding-top: 40rpx;
		font-size: 28rpx;
		text-align: center;
		margin: 0 auto;
		line-height: 100rpx;
		height: 100rpx;
		
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
	.qrcode{
		width: 100%;
		height: auto;
		text-align: center;
		margin-bottom: 50rpx;
		margin-top: 30rpx;
	}
	.dash{
		border-bottom: solid 2rpx #fff;
	}
	.ordernum{
		font-size: 28rpx;
		font-weight: bolder;
		text-align: center;
		position: relative;
		top:-20rpx;
		background-color: #fff;
		width: 400rpx;
		margin: 0 auto;
	}
	.barcode{
		width:100%;
		text-align: center;
		margin-top:20rpx;
		height: 250rpx;
	}
</style>