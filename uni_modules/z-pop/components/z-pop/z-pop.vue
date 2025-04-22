<template>
	<view class="box">
		<uni-popup ref="popup" @click="open" background-color="rgba(0, 0, 0, 0)" :mask-click="false">
			<view class="box__pop"
				:style="{height:maskBg?'auto':'550rpx',backgroundColor: maskBg ? 'rgba(0, 0, 0, 0)' : '#fff',padding:maskBg?'0':'50rpx 20rpx'}">
				<image :src="maskBg" mode="widthFix" v-if="maskBg" class="box__pop__maskBg" @click="clickImage"></image>
				<view v-else class="box__pop">
					<view class="box__pop__top">
						<image :src="icon" mode="" v-if="state=='success'">
						</image>
						<image :src="errimage" mode="" v-if="state=='error'">
						</image>
					</view>
					<view class="box__pop__title">
						{{title}}
					</view>
					<view class="box__pop__desc">
						{{desc}}
					</view>
					<view class="box__pop__btn">
						<view class="btn">
							<button :style="{color:textColor,background:computedBtnBg}"
								@click="submit">{{btnStr}}</button>
						</view>
						<slot name="btn"></slot>
					</view>
				</view>
				<view class="box__pop__close" @click="close">
					<uni-icons type="close" size="55rpx" color="#fff"></uni-icons>
				</view>
			</view>
			<slot name="mask"></slot>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "zfy-pop",
		props: {
			//顶部图标
			icon: {
				type: String,
				default: ""
			},
			state: {
				type: String,
				default: "success"
			},
			//标题
			title: {
				type: String,
				default: ""
			},
			//副标题
			desc: {
				type: String,
				default: "！"
			},
			// 背景图
			maskBg: {
				type: String
			},
			//按钮的文字
			btnStr: {
				type: String,
				default: "确认"
			}
		},
		data() {
			return {
				textColor:'#ffffff',
				errimage: ''
			};
		},
		methods: {
			open(type) {
				this.$refs.popup.open(type)
			},
			close() {
				this.$refs.popup.close()
			},
			submit() {
				this.$emit("submit")
			},
			clickImage() {
				this.$emit("clickImage")
			}
		},
		computed: {
			// 按钮颜色
			btnBg() {
				if (this.state == "error") {
					return "linear-gradient(0deg, #FF4929, #FF9368)";
				} else if (this.state == "success") {
					return "linear-gradient(0deg, #01C25E, #25D28E)";
				}
				this.$forceUpdate()
			},
			computedBtnBg() {
				return this.btnBg || 'linear-gradient(0deg, #01C25E, #25D28E)';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		width: 100%;
		height: 100%;

		.btn {
			width: 100%;
			height: 100%;

			button {
				width: 100%;
				height: 100%;
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		&__pop {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-around;
			flex-direction: column;
			background-color: #fff;
			width: 500rpx;
			height: 550rpx;
			border-radius: 20rpx;
			padding: 50rpx 20rpx;

			&__maskBg {
				width: 100%;
			}

			&__top {
				image {
					width: 110rpx;
					height: 110rpx;
				}
			}

			&__title {
				font-size: 38rpx;
			}

			&__desc {
				color: #999;
				font-size: 28rpx;
			}

			&__btn {
				height: 75rpx;
				width: 80%;
			}

			&__close {
				position: absolute;
				bottom: -80rpx;

			}
		}
	}
</style>