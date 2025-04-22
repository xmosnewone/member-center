<template>
	<view class="container my-order">
		<!--返回顶部-->
		<innerheader :title="pageTitle" :bgcolor="bgcolor" :color="color"></innerheader>
		<view class="topstatus">
			<view v-if="order_status==3" class="qrcode iconfont icon-shouhou"></view>
			<view v-if="order_status==2" class="qrcode">
				<image src="/static/images/order/refund.png">
			</view>
			<view v-if="order_status==1" class="qrcode ">
				<image src="/static/images/order/unpay.png">
			</view>
			<view class="thank">
				<text class="status">{{order.order_status}}</text>
				<text class="info">感谢购物，期待再次光临</text>
			</view>
		</view>
		
		<view class="orderDetail">
				<view class="shopOrder">
					<view class="shopName">
						<image :src="order.branch_logo" class="posimage">
						<text class="shop">{{order.branch}} {{order.branch_name}}</text>
					</view>
					<view class="orderNum">
						<text class="flowno">订单:{{order.flow_no}}</text>
						<view class="barcode" @click="orderBarcode(flow_no)">订单条码</view>
						<view class="clipboard" @click="copyFlowno">复制</view>
					</view>
				</view>
				
				<view class="detalList">
					
					<view class="item" v-for="(item, index) in order.sales_info" :key="index">
						<view class="itemName">{{item.item_name}}</view>
						<view class="itemNum">
							<text class="num">x{{item.sale_qnty}}</text>
							<text class="price">￥{{item.sale_price}}</text>
						</view>
					</view>
					
					
				</view>
				
		</view>
		
		<view class="orderSum">
			<view class="goodprice">
					商品金额
					<view class="gprice">￥{{order.goods_amount}}</view>
			</view>
			<view class="promoprice">促销优惠
				<view class="pprice">-￥{{order.discount}}</view>
			</view>
			<view class="promoprice" v-if="order.credit_pay>0">积分抵扣
				<view class="pprice">-￥{{order.credit_pay}}</view>
			</view>
			<view class="promoprice" v-if="order.coupon_pay>0">优惠券抵扣
				<view class="pprice">-￥{{order.coupon_pay}}</view>
			</view>
			<view class="hr"></view>
			<view class="paymoney">
				实付金额 <text class="money">￥{{order.real_pay}}</text>
			</view>
		</view>
		
		<view class="orderNote">
			<view class="title">订单信息</view>
			<view class="orderNo">订单号码
				<view class="pprice">{{order.flow_no}}</view>
			</view>
			<view class="orderNo">下单时间
				<view class="pprice">{{order.oper_date}}</view>
			</view>
			<view class="orderNo">支付方式
				<view class="pprice">
					<text v-for="(item, index) in order.pay_name" :key="index">{{item}}</text>
				</view>
			</view>
			<view class="orderNo">订单备注
				<view class="pprice">
					
					<text v-for="(item, index) in order.memo" :key="index">{{item}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {checkLogin} from "@/libs/login.js";
	import {orderDetail} from "@/api/order.js";
	import innerheader from '@/components/innerheader';
	export default {
		components: {
			innerheader
		},
		data() {
			return {
				pageTitle:'订单详情',
				bgcolor:'none',
				color:'#ffffff',
				isLogin:false,
				flow_no:"",
				order:{"credit_pay":0,"coupon_pay":0,"real_pay":0,"branch_logo":''},
				order_status:0,//默认已完成订单状态
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
			//获取订单详细
			order_detail:function(){
				let that=this;
				let flow_no=this.flow_no;
				orderDetail({
					'flow_no':flow_no
				}).then(res=>{
					let data=res.data;
					if(data.code==1){
						let order=data.order;
							if(order.order_status=='已完成'){
								that.order_status=3;
							}else if(order.order_status=='已退款'||order.order_status=='部分退款'){
								that.order_status=2;
							}else if(order.order_status=='未支付'){
								that.order_status=1;
							}
							
							if(order.branch_logo==''||order.branch_logo==null){
								order.branch_logo='/static/images/home/firework.png';	
							}
							
							that.order=order;
					}else{
						this.$util.Tips({
							title: '订单不存在'
						},{'url':'/pages/order/index','tab':1});
					}
					
				})
			},
			//复制单号到粘贴板
			copyFlowno:function(){
				uni.setClipboardData({
				    data: this.flow_no,
				    success: function () {
						uni.showToast({
							title:'复制成功',
							icon:'none'
						})
				    },fail:(error)=> {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				})
			},
			orderBarcode:function(no){
				uni.navigateTo({
					url:"/pages/order/barcode?no="+no,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding:0 20rpx;
	}
	.my-order{
		background-image: url('/static/images/order/ob.jpg');
		background-repeat: repeat-x;
		min-height: 1500rpx;
		height: auto;
		background-color: #fafafa;
	}
	.topstatus{
		width: 100%;
		height: 140rpx;
		padding:20rpx;
		background-color: #fff;
		border-radius:20rpx;
		
		.iconfont{
			background-color: #2bae67;
			padding-top: 10rpx;
		}
		.qrcode{
			width:50rpx;
			height: 50rpx;
			border-radius: 50rpx;
			color: #fff;
			text-align: center;
			float: left;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
		.thank{
			width:400rpx;
			margin-left:10rpx;
			height: 100%;
			float: left;
			text-align: left;
		}
		.thank .status{
			font-size: 36rpx;
			font-weight: bolder;
			width: 100%;
			display: inline-block;
		}
		.thank .info{
			width:100%;
			margin-top: 10rpx;
			display: inline-block;
			font-size: 30rpx;
		}
	}
	.orderDetail{
		width: 100%;
		height: auto;
		padding:20rpx 20rpx 60rpx 20rpx;
		background-color: #fff;
		border-radius:20rpx;
		margin-top: 20rpx;
		
		.shopOrder{
			width:100%;
			padding-bottom: 20rpx;
			border-bottom: solid 1px #eeeeee;
			.shopName image{
				width:60rpx;
				height: 60rpx;
				border-radius:60rpx;
				float:left;
			}
			.shopName .shop {
				font-size: 32rpx;
				font-weight: bolder;
				line-height: 60rpx;
				margin-left: 10rpx;
			}
			.orderNum{
				font-size: 24rpx;
				color: #afafaf;
				margin-left: 70rpx;
				
				.flowno{
					max-width: 380rpx;
					overflow:hidden;
					width:500rpx;
					display: inline-block;
					height: 60rpx;
					text-align: left;
					word-break: break-all;
				}
				
			}
			.clipboard{
				width:auto;
				padding: 0 10rpx;
				border: solid 2rpx #cbcbcb;
				width: 80rpx;
				height: 38rpx;
				text-align: center;
				border-radius:30rpx;
				float:right;
			}
			.barcode{
				width:auto;
				padding: 0 10rpx;
				border: solid 2rpx #cbcbcb;
				width: 120rpx;
				height: 38rpx;
				text-align: center;
				border-radius:30rpx;
				float:right;
			}
		}
		
		.detalList{
			padding: 20rpx 0;
			.item{
				display: block;
				width: 100%;
				height: auto;
				text-align: left;
				min-height: 80rpx;
				margin-bottom:30rpx;
			}
			.item .itemName{
				width: 100%;
				text-align: left;
				min-height: 40rpx;
			}
			.item .itemNum{
				margin-top:10rpx;
				width: 100%;
				min-height: 40rpx;
				.num{
					float:left;
				}
				.price{
					float:right;
				}
			}
		}
	}
	.orderSum{
		width: 100%;
		height: auto;
		padding:20rpx;
		background-color: #fff;
		border-radius:20rpx;
		margin-top: 20rpx;
		color: #868686;
		.goodprice{
			margin-bottom: 10rpx;
		}
		.goodprice .gprice{
			float:right;
		}
		.pprice{
			float:right;
			color: orange;
		}
		.hr{
			width: 100%;
			padding-bottom: 10rpx;
			border-bottom: solid 1px #eeeeee;
		}
		.paymoney{
			width: 100%;
			margin-top: 15rpx;
			font-size: 32rpx;
			text-align: right;
		}
		.paymoney .money{
			font-weight: bolder;
			font-size: 36rpx;
			color: #000;
		}
	}
	.orderNote{
		width: 100%;
		height: auto;
		display: inline-block;
		padding:20rpx;
		background-color: #fff;
		border-radius:20rpx;
		margin-top: 20rpx;
		color: #868686;
		.title{
			width: 100%;
			font-size: 36rpx;
			font-weight: bolder;
			margin-bottom: 20rpx;
			color: #000;
		}
		.orderNo{
			text-align: left;
			width: 100%;
			display: inline-block;
		}
		.orderNo .pprice{
			float: right;
			text-align: right;
			width: 450rpx;
			display: inline-block;
			height: auto;
			
			text{
				width: 100%;
				text-align: right;
				display: inline-block;
				word-break: break-all;
			}
		}
		.orderNo{
			text-align: left;
			width: 100%;
			margin-bottom: 15rpx;
		}
		.orderNo .pprice{
			float: right;
			text-align: right;
		}
	}
	
</style>