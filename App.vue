<script>
	import {
		HTTP_REQUEST_URL
	} from './config/app';
	import MiniProgram from './libs/miniprogram.js';
	import {
		mapGetters
	} from "vuex";
	import colors from '@/mixins/color.js';
	import Cache from '@/utils/cache';

	export default {
		globalData: {
			code: 0,
			isLogin: false,
			userInfo: {},
			tabbarShow: true,
			windowHeight: 0,
			windowWidth:0,
			locale: '',
			themeColor:'#07c160',//主题颜色
			receiptNo:'',//记录购物车列表的票据单号
			buyList:{},//客户购物车流水记录
		},
		mixins: [colors],
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				deep: true, //深度监听设置为 true
				handler: function(newV, oldV) {
					if (newV) {
						
					} else {
						
					}
				}
			}	
		},
		onLaunch: function() {
			uni.hideTabBar();
			let that = this;
			// #ifdef MP
			if (HTTP_REQUEST_URL == '') {
				console.error(
					"请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'\n\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n\n填写自己的 appId"
				);
				return false;
			}
			
			const updateManager = wx.getUpdateManager();
			const startParamObj = wx.getEnterOptionsSync();
			if (wx.canIUse('getUpdateManager') && startParamObj.scene != 1154) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					// console.log(res.hasUpdate)
					if (res.hasUpdate) {
						updateManager.onUpdateFailed(function() {
							return that.Tips({
								title: '新版本下载失败'
							});
						});
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经下载好，是否重启当前应用？',
								success(res) {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '发现新版本',
								content: '请删除当前小程序，重启搜索打开...',
							})
						})
					}
				})
			}
			
			const windowInfo = wx.getWindowInfo();
			that.globalData.navHeight = windowInfo.statusBarHeight * (750 / windowInfo.windowWidth) + 91;
			that.globalData.windowHeight=windowInfo.windowHeight;
			that.globalData.windowWidth=windowInfo.windowWidth;
			// #endif
			
			// #ifndef MP
			// 获取导航高度；
			uni.getSystemInfo({
				success: function(res) {
					that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91;
					that.globalData.windowHeight=res.windowHeight;
					that.globalData.windowWidth=res.windowWidth;
				}
			});
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {
			
		}
	}
</script>

<style lang="scss">
  /* 引入uView库样式 */
  @import "uview-ui/index.scss";
</style>

<style>
  /* 项目基础样式 */
  @import "./app.scss";
</style>
