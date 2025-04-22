<template>
	<view class="container">
		<innerheader :title="pageTitle"></innerheader>
		<view class="report">
			
			<view class="summary">
				<view class="last_account">
					{{bill.lastyear}}年度账单 <text  class="iconfont icon-favorite"></text>
				</view>
				<view class="total_summary">
					<view class="txt">总支出金额: <text class="numeric">{{bill.summary.totalconsume}}元</text> </view>
					<view class="txt">节省金额: <text class="numeric">{{bill.summary.totaldiscount}}元</text> </view>
				</view>
				<view class="details">
					<view class="line">
						<text class="title">订单笔数</text>
						<view class="num"><text class="numeric">{{bill.summary.totalorder}}</text>笔</view>
					</view>
					<view class="line">
						<text class="title">总支出金额</text>
						<view class="num"><text class="numeric">{{bill.summary.totalconsume}}</text>元</view>
					</view>
					<view class="line">
						<text class="title">节省金额</text>
						<view class="num"><text class="numeric">{{bill.summary.totaldiscount}}</text>元</view>
					</view>
					<view class="line">
						<text class="title">已获积分</text>
						<view class="num"><text class="numeric">{{bill.summary.totalcredit}}</text>分</view>
					</view>
				</view>
			</view>
			<view class="gap"></view>
			<view class="charts">
				<view class="chart-con">
					<view class="chart-wrap">
						<view class="title">
							<view class="ver-line"></view>
							<view class="title-desc">最爱商品分类</view>
						</view>
						<view class="ring-chart">
							<l-echart ref="ringChart"></l-echart>
						</view>
					</view>
				</view>
			</view>
			<view class="gap"></view>
			<view class="favorite">
				<view class="title">最爱单品</view>
				
				<view class="line" v-for="(item, index) in favorite" :key="index">
					<image :src="item.img" v-if="index<3">
						{{item.item_name}}
					 <text class="numeric">{{item.num}}件</text>	
				</view>

			</view>
			<view class="gap"></view>
			<view class="rating">
				<view class="nickname">
					<image src="/static/images/member/reportcup.jpg">
				</view>
				<view class="hero">
					{{bill.nick}}
				</view>
			</view>
			<view class="bottom"></view>
		</view>
	</view>
</template>

<script>
	import {memberInfo} from "@/api/user.js";
	import {checkLogin} from "@/libs/login.js";
	import {yearReport} from '@/api/user.js';
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min.js';
	import innerheader from '@/components/innerheader';
	export default {
		components: {
		    innerheader
		},
		mounted() {
		},
		data() {
			return {
				pageTitle:'年度账单',
				isLogin:false,
				// 当前用户信息
				uid:0,
				userInfo: { uid: 0, nickname: '', headimg: '',ucode:'' },
				//账单
				bill:{'lastyear':'','nick':'','favorite':[],"piecharts":[],"summary":{}},
				//最爱单品
				favorite:[],
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
			}
		},
		methods: {
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
						that.$set(that,"uid",data.uid);
						that.$set(that,"userInfo",data);
						
						setTimeout(function(){
							//获取当前订单
							that.getUserReprot(data.uid,data.ucode);
						},100);
						
					}else if(data==-3){
						return that.$util.Tips({
							title: '会员不存在'
						});
					}
				})
			},
			//加载数据
			getUserReprot(uid,vip_no){
				let that=this;
				yearReport({
					'uid':uid,
					'vip_no':vip_no
				}).then(res=>{
					let data=res.data;
					if(data.code==1){
						that.bill.lastyear=data.lastyear;
						that.bill.nick=data.nick;
						that.bill.favorite=data.favorite;
						that.bill.piecharts=data.piecharts;
						that.bill.summary=data.summary;
						that.loadRingData(data.piecharts);
						if(data.favorite!=null&&data.favorite.length>0){
							for(let i in data.favorite){
								let t={};
									t.num=data.favorite[i]['num'];
									t.item_name=data.favorite[i]['item_name'];
								let img="/static/images/member/num2.png";
									if(i<3){
										img="/static/images/member/num"+(parseInt(i)+1)+".png";
									}
									t.img=img;
								that.favorite.push(t);
							}
						}
					}
				})
			},
			//加载饼环数据,这里可以去请求服务器获取数据
			loadRingData(data) {
				//这里请求服务器得到数据
				//这里option配置参考文档：https://echarts.apache.org/zh/option.html
				this.$refs.ringChart.init(echarts, chart => {
					chart.setOption({
						series: [{
							type: 'pie',
							// selectedMode: 'single',
							// selectedOffset: 0,
							// hoverAnimation: false,
							radius: [50, 80],
							left: 'center',
							width: '98%',
							//隐藏默认白边
							itemStyle: {
								borderColor: '#fff',
								borderWidth: 0
							},
							//格式化label显示
							label: {
								alignTo: 'edge',
								formatter: '{name|{b}}\n{time|{c} 件}',
								minMargin: 5,
								edgeDistance: 20,
								lineHeight: 24,
								rich: {
									time: {
										fontSize: 10,
										color: '#999'
									}
								}
							},
							//指向label的线设置
							labelLine: {
								length: 15,
								length2: 0,
								maxSurfaceAngle: 80
							},
							//布局样式
							labelLayout: function(params) {
								const isLeft = params.labelRect.x < chart.getWidth() / 2;
								const points = params.labelLinePoints;

								points[2][0] = isLeft ?
									params.labelRect.x :
									params.labelRect.x + params.labelRect.width;
								return {
									labelLinePoints: points
								};
							},

							//数据
							data: data
						}]
					});
					
					//监听图标项点击事件
					chart.on("click", function(e) {
						for (var i = 0; i < data.length; i++) {
							if (i != e.dataIndex) {
								chart.dispatchAction({
									type: 'downplay', //取消高亮显示;
									seriesIndex: 0,
									dataIndex: i
								});
							} else {
								chart.dispatchAction({
									type: 'highlight', //突出高亮显示;
									seriesIndex: 0,
									dataIndex: i
								});
							}
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.report{
		background-image: linear-gradient(to bottom, #f65155, #ff894a);
		height: auto;
		padding-bottom: 100rpx;
		width: 100%;
	}
	.summary{
		width: 96%;
		background-image:url('@/static/images/member/reporttop.jpg');
		min-height: 200rpx;
		background-repeat: no-repeat;
		background-size:100%;
		margin: 0 auto;
		background-color: #ffffff;
		padding:30rpx;
		padding-top: 160rpx !important;
		
		.last_account{
			font-size: 42rpx;
			font-weight: bolder;
			
			.iconfont{
				color:#fab727;
				line-height: 42rpx;
				font-size: 42rpx;
				margin-left: 10rpx;
			}
		}
		.total_summary{
			margin-top: 30rpx;
			font-size: 28rpx;
			font-weight: bolder;
			
			.numeric{
				color: #ff894a;
				padding-left: 10rpx;
			}
		}
		.details{
			border-radius: 10rpx;
			height: auto;
			width: 100%;
			background-color:#fef4f2 ;
			padding:30rpx 28rpx;
			margin-top: 30rpx;
			.line{
				width: 100%;
				display: inline-block;
				height: 50rpx;
				
				.num{
					float: right;
					.numeric{
						font-size: 36rpx;
						font-weight: bolder;
					}
				}
			}
		}
	}
	.charts{
		width: 96%;
		margin: 0 auto;
		min-height: 200rpx;
		background-color: #ffffff;
		padding:30rpx;
		
		.chart-con .chart-wrap .title .title-desc{
			text-align: center;
			width: 100%;
			font-weight: bolder;
			font-size: 36rpx;
		}
	}
	.favorite{
		width: 96%;
		margin: 0 auto;
		min-height: 200rpx;
		background-color: #ffffff;
		padding:30rpx;
		
		.title{
			font-size: 36rpx;
			width: 100%;
			height: 50rpx;
			font-weight: bolder;
			text-align: center;
			margin-bottom: 30rpx;
		}
		.line{
			display: inline-block;
			height: 100rpx;
			width: 100%;
			line-height:100rpx;
			
			image{
				width: 64rpx;
				height: 64rpx;
				margin-right: 10rpx;
				float: left;
				margin-top: 10rpx;
			}
			
			.numeric{
				float: right;
				font-weight: bolder;
			}
		}
	}
	.rating{
		width: 96%;
		margin: 0 auto;
		min-height: 200rpx;
		background-color: #ffffff;
		padding:30rpx;
		
		.nickname{
			width:100%;
			text-align: center;
			
			image{
				width:500rpx;
				height: 160rpx;
			}
		}
		.hero{
			font-size: 42rpx;
			font-weight: bolder;
			width:100%;
			text-align: center;
		}
	}
	.gap{
		width: 96%;
		margin: 0 auto;
		height: 62rpx;
		background-image:url('@/static/images/member/reportgap.png');
		background-size:100%;
		
	}
	.bottom{
		width: 96%;
		margin: 0 auto;
		height: 62rpx;
		background-image:url('@/static/images/member/reportbottom.png');
		background-size:100%;
		background-repeat: no-repeat;
	}
	
</style>