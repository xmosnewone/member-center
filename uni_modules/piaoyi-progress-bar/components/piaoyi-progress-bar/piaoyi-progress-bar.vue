<template>
	<view class="progress-bar" :style="'min-height:' + height + 'rpx'">
		<view v-if="!isCircular" class="progress-bar-bg"
			:style="{ backgroundColor: backgroundColor, height: height + 'rpx' }"></view>
		<view v-if="!isCircular" class="progress-bar-inner"
			:style="{ width: progress + '%', backgroundColor: progressBackgroundColor, height: height + 'rpx' }">
			<view v-if="showText" class="progress-bar-text" :style="{ color: textColor, fontSize: textSize + 'rpx' }">
				{{ progress + '%' }}
			</view>
		</view>
		<view v-if="isCircular" class="progress-bar-circular"
			:style="{ width: diameter + 'rpx', height: diameter + 'rpx'}">
			<canvas v-show="!canvasHide" :canvas-id="canvasId" :style="{ width: diameter + 'rpx', height: diameter + 'rpx' }"></canvas>
			<image v-show="imgShow" :src="imgUrl" :style="{ width: diameter + 'rpx', height: diameter + 'rpx' }">
			</image>
			<view v-if="showText" class="progress-bar-text" :style="{ color: textColor, fontSize: textSize + 'rpx' }">
				{{ progress + '%' }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				screenWidth: 0, // 屏幕宽度
				canvasHide:false,
				imgShow:false,
				imgUrl:""
			}
		},
		props: {
			progress: {
				type: Number,
				required: true,
				validator(value) {
					// 自定义验证函数，限制范围为 0 到 100
					return value >= 0 && value <= 100;
				}
			},
			backgroundColor: {
				type: String,
				default: '#EFEFF4'
			},
			progressBackgroundColor: {
				type: String,
				default: '#07C160'
			},
			showText: {
				type: Boolean,
				default: false
			},
			textColor: {
				type: String,
				default: '#000000'
			},
			textSize: {
				type: Number,
				default: 28
			},
			height: {
				type: Number,
				default: 20
			},
			isCircular: {
				type: Boolean,
				default: false
			},
			diameter: {
				type: Number,
				default: 100
			},
			canvasId: {
				type: String,
				default: 'canvasId'
			}
		},
		mounted() {
			// 获取设备信息
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth = res.windowWidth;
					if (this.isCircular) {
						this.drawCircularProgress();
					}
				}
			});
		},
		watch: {
			progress: function(val) {
				if (this.isCircular) {
					this.drawCircularProgress();
				}
			}
		},
		methods: {
			drawCircularProgress() {
				const canvas = uni.createCanvasContext(this.canvasId, this);
				const radius = (this.rpxToPx(this.diameter) - this.rpxToPx(this.height)) /
				2; // Subtracting 10 to leave space for the border

				const startAngle = -Math.PI / 2;
				const endAngle = (2 * Math.PI * this.progress) / 100 + startAngle;
				// Draw background circle
				canvas.setLineWidth(this.rpxToPx(this.height));
				canvas.setStrokeStyle(this.backgroundColor);
				canvas.beginPath();
				canvas.arc(this.rpxToPx(this.diameter) / 2, this.rpxToPx(this.diameter) / 2, radius, 0, 2 * Math.PI);
				canvas.stroke();

				// Draw progress arc
				canvas.setLineWidth(this.rpxToPx(this.height));
				canvas.setStrokeStyle(this.progressBackgroundColor);
				canvas.beginPath();
				canvas.arc(this.rpxToPx(this.diameter) / 2, this.rpxToPx(this.diameter) / 2, radius, startAngle, endAngle,
					false);
				canvas.stroke();
				canvas.draw(false, (res) => {
						if (res.errMsg == "drawCanvas:ok") {
							setTimeout(() => {
								var that = this
								try{
									uni.canvasToTempFilePath({
										canvasId: that.canvasId,
										success: (res) => {
												// 在H5平台下，tempFilePath 为 base64
												this.imgShow = true
												setTimeout(() => {
													this.canvasHide = true
												}, 100)
												this.imgUrl = res.tempFilePath
											},
											fail: (err) => {
												console.error(err, 'err')
											}
									}, that)
								}catch(e){
									console.log(e);
								}
								
							}, 1000)
						}
					}
				);
			},
			rpxToPx(rpx) {
				// 计算像素值
				const px = (rpx / 750) * this.screenWidth
				return px;
			}
		}
	}
</script>

<style scoped lang="scss">
	.progress-bar {
		position: relative;
		z-index:0;
	}

	.progress-bar-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		border-radius: 10rpx;
	}

	.progress-bar-inner {
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 10rpx;
		transition: width 0.3s ease-in-out;
	}

	.progress-bar-circular {
		position: relative;
		z-index:0;
		
		canvas{
			z-index:0;
			position: absolute;
		}
	}

	.progress-bar-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
