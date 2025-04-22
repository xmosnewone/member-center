//颜色管理类
export default {
	data() {
		return {
			colorStyle: '',
			colorStatus: ''
		};
	},
	created() {
		this.colorStyle = uni.getStorageSync('colorStyle')
		uni.$on('ok', (data, status) => {
			this.colorStyle = data
			this.colorStatus = status
		})
	},
	methods: {}
};
