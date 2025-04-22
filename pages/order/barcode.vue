<template>
	<view class="container my-order">
		<!--返回顶部-->
		<innerheader :title="pageTitle"></innerheader>
		<view class="memo">凭订单条码到对应门店服务台进行售后服务</view>
		<view class="qrcode">
			<yz-qr :qrPath.sync="qrPath" :text="text" :size="size" :quality="quality" :colorDark="colorDark"
						:colorLight="colorLight"></yz-qr>
		</view>
		<view class="dash"></view>
		<view class="ordernum">订单号:{{text}}</view>
		<view class="barcode">
			<tkiBarcode cid="code128" :loadMake="false" :opations="opations" :onval="true" format="code128" :val="val" ref="code128" @result="code128" />
		</view>
	</view>
</template>

<script>
	import {checkLogin} from "@/libs/login.js";
	import {orderBarcode} from "@/api/order.js";
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			tkiBarcode,
			tkiBarcode2: tkiBarcode,
			innerheader
		},
		data() {
			return {
				pageTitle:'订单条码',
				isLogin:false,
				flow_no:"",
				qrPath: '',
				text: '',
				size: 180,
				quality: 'L',
				colorDark: '#000000',
				colorLight: '#ffffff',
				
				//条形码
				val: "",
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
				}
			}
		},
		onLoad: function(options) {
			if (options.hasOwnProperty('no')) {
				this.flow_no = options.no;
			} else {
				// #ifndef H5
				uni.navigateBack({
					delta: 1
				});
				// #endif
				// #ifdef H5
				history.back();
				// #endif
			}
			if(this.flow_no==""||this.flow_no==null){
				return this.$util.Tips({
					title: '缺少订单号'
				},{'url':'/pages/order/index','tab':1});
			}
		},
		onShow() {
			//判断用户登录
			this.userLogin();
			
			if(!this.isLogin){
				return this.$util.Tips({
					title: '请登录会员'
				},'/pages/login/mplogin');
			}
			//获取订单详细
			this.order_detail();
			
		},
		methods: {
			//判断登录
			userLogin:function(){
				let isLogin=checkLogin();
				if(isLogin){
					this.isLogin=true;
				}
			},
			
			code128(v) {
						// console.log('code128:', v)
			},
			//获取订单详细
			order_detail:function(){
				let that=this;
				let flow_no=this.flow_no;
				orderBarcode({
					'flow_no':flow_no
				}).then(res=>{
					let data=res.data;
					if(data.code==1){
						that.text=flow_no;
						that.val=flow_no;
						setTimeout(() => {
							that.$refs["code128"]._makeCode();
						}, 200);
					}else{
						this.$util.Tips({
							title: '订单不存在'
						},{'url':'/pages/order/index','tab':1});
					}
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.memo{
		width: 100%;
		padding-top: 20rpx;
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 100rpx;
	}
	.qrcode{
		width: 100%;
		height: auto;
		text-align: center;
		margin-bottom: 50rpx;
	}
	.dash{
		border-bottom: solid 2rpx #eee;
	}
	.ordernum{
		font-size: 28rpx;
		font-weight: bolder;
		text-align: center;
		position: relative;
		top:-20rpx;
		background-color: #fff;
		width: 550rpx;
		margin: 0 auto;
	}
	.barcode{
		width:100%;
		text-align: center;
		margin-top:20rpx;
	}
</style>