import {
	ACCESS_TOKEN,
	HTTP_REQUEST_URL
} from '../config/app.js';
export default {
	/**
	 * 小程序比较版本信息
	 * @param v1 当前版本
	 * @param v2 进行比较的版本 
	 * @return boolen
	 * 
	 */
	compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}

		return 0
	},
	/*
	* 获取当前时间
	*/
	getNowTime() {
		let today = new Date();
		let year = today.getFullYear(); // 获取当前年份
		let month = today.getMonth() + 1; // 获取当前月份（注意：月份从 0 开始计数，所以需要加 1）
		let day = today.getDate(); // 获取当前日（几号）
		let hour = today.getHours(); // 获取当前小时
		let minute = today.getMinutes(); // 获取当前分钟
		let second = today.getSeconds(); // 获取当前秒钟

		// 格式化输出当前时间
		let nowTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
		return nowTime
	},
	/**
	 * 处理服务器扫码带进来的参数
	 * @param string param 扫码携带参数
	 * @param string k 整体分割符 默认为：&
	 * @param string p 单个分隔符 默认为：=
	 * @return object
	 * 
	 */
	// #ifdef MP
	getUrlParams: function(param, k, p) {
		if (typeof param != 'string') return {};
		k = k ? k : '&'; //整体参数分隔符
		p = p ? p : '='; //单个参数分隔符
		var value = {};
		if (param.indexOf(k) !== -1) {
			param = param.split(k);
			for (var val in param) {
				if (param[val].indexOf(p) !== -1) {
					var item = param[val].split(p);
					value[item[0]] = item[1];
				}
			}
		} else if (param.indexOf(p) !== -1) {
			var item = param.split(p);
			value[item[0]] = item[1];
		} else {
			return param;
		}
		return value;
	},
	// #endif
	/*
	 * 合并数组
	 */
	SplitArray(list, sp) {
		if (typeof list != 'object') return [];
		if (sp === undefined) sp = [];
		for (var i = 0; i < list.length; i++) {
			sp.push(list[i]);
		}
		return sp;
	},
	trim(backUrlCRshlcICwGdGY) {
		return String.prototype.trim.call(backUrlCRshlcICwGdGY);
	},
	$math: {
		//加法函数，用来得到精确的加法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
		//调用：$math.Add(arg1,arg2)
		//返回值：arg1加上arg2的精确结果
		Add: function(arg1, arg2) {
			arg2 = parseFloat(arg2);
			var r1, r2, m;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(100, Math.max(r1, r2));
			return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
		},
		//减法函数，用来得到精确的减法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
		//调用：$math.Sub(arg1,arg2)
		//返回值：arg1减去arg2的精确结果
		Sub: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var r1, r2, m, n;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2));
			//动态控制精度长度
			n = (r1 >= r2) ? r1 : r2;
			return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
		},
		//乘法函数，用来得到精确的乘法结果
		//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
		//调用：$math.Mul(arg1,arg2)
		//返回值：arg1乘以arg2的精确结果
		Mul: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length
			} catch (e) {}
			try {
				m += s2.split(".")[1].length
			} catch (e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},
		//除法函数，用来得到精确的除法结果
		//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
		//调用：$math.Div(arg1,arg2)
		//返回值：arg1除以arg2的精确结果
		Div: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var t1 = 0,
				t2 = 0,
				r1, r2;
			try {
				t1 = arg1.toString().split(".")[1].length;
			} catch (e) {}
			try {
				t2 = arg2.toString().split(".")[1].length;
			} catch (e) {}
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
		}
	},
	/**
	 * opt  object | string
	 * to_url object | string
	 * 例:
	 * this.Tips('/pages/test/test'); 跳转不提示
	 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
	 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
	 * tab=1 一定时间后跳转至 table上
	 * tab=2 一定时间后跳转至非 table上
	 * tab=3 一定时间后返回上页面
	 * tab=4 关闭所有页面，打开到应用内的某个页面
	 * tab=5 关闭当前页面，跳转到应用内的某个页面
	 */
	Tips: function(opt, to_url) {
		if (typeof opt == 'string') {
			to_url = opt;
			opt = {};
		}
		let title = opt.title || '',
			icon = opt.icon || 'none',
			endtime = opt.endtime || 2000,
			success = opt.success;
		if (title) uni.showToast({
			title: title,
			icon: icon,
			duration: endtime,
			success
		})
		if (to_url != undefined) {
			if (typeof to_url == 'object') {
				let tab = to_url.tab || 1,
					url = to_url.url || '';
				switch (tab) {
					case 1:
						//一定时间后跳转至 table
						setTimeout(function() {
							uni.switchTab({
								url: url
							})
						}, endtime);
						break;
					case 2:
						//跳转至非table页面
						setTimeout(function() {
							uni.navigateTo({
								url: url,
							})
						}, endtime);
						break;
					case 3:
						//返回上页面
						setTimeout(function() {
							// #ifndef H5
							uni.navigateBack({
								delta: parseInt(url),
							})
							// #endif
							// #ifdef H5
							history.back();
							// #endif
						}, endtime);
						break;
					case 4:
						//关闭所有页面，打开到应用内的某个页面
						setTimeout(function() {
							uni.reLaunch({
								url: url,
							})
						}, endtime);
						break;
					case 5:
						//关闭当前页面，跳转到应用内的某个页面
						setTimeout(function() {
							uni.redirectTo({
								url: url,
							})
						}, endtime);
						break;
				}
	
			} else if (typeof to_url == 'function') {
				setTimeout(function() {
					to_url && to_url();
				}, endtime);
			} else {
				//没有提示时跳转不延迟
				setTimeout(function() {
					uni.navigateTo({
						url: to_url,
					})
				}, title ? endtime : 0);
			}
		}
	},
	/*
	 * 单图上传
	 * @param object opt
	 * @param callable successCallback 成功执行方法 data 
	 * @param callable errorCallback 失败执行方法 
	 */
	uploadImageOne: function(opt, successCallback, errorCallback) {
		let that = this;
		if (typeof opt === 'string') {
			let url = opt;
			opt = {};
			opt.url = url;
		}
		let count = opt.count || 1,
			sizeType = opt.sizeType || ['compressed'],
			sourceType = opt.sourceType || ['album', 'camera'],
			is_load = opt.is_load || true,
			uploadUrl = opt.url || '',
			inputName = opt.name || 'pics',
			fileType = opt.fileType || 'image';
		uni.chooseImage({
			count: count, //最多可以选择的图片总数  
			sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有  
			sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有  
			success: function(res) {
				//启动上传等待中...  
				uni.showLoading({
					title: '图片上传中',
				});
				uni.uploadFile({
					url: HTTP_REQUEST_URL + '/api/' + uploadUrl,
					filePath: res.tempFilePaths[0],
					fileType: fileType,
					name: inputName,
					formData: {
						'filename': inputName,
						'access_token':ACCESS_TOKEN
					},
					header: {
						// #ifdef MP
						"Content-Type": "multipart/form-data",
						// #endif
					},
					success: function(res) {
						uni.hideLoading();
						if (res.statusCode == 403) {
							that.Tips({
								title: res.data
							});
						} else {
							let data = res.data ? JSON.parse(res.data) : {};
							if (data.status == 1) {
								successCallback && successCallback(data)
							} else {
								errorCallback && errorCallback(data);
							}
						}
					},
					fail: function(res) {
						uni.hideLoading();
						that.Tips({
							title: '上传图片失败'
						});
					}
				})
			}
		})
	},
	/**
	 * 小程序头像获取上传
	 * @param uploadUrl 上传接口地址
	 * @param filePath 上传文件路径 
	 * @param successCallback success回调 
	 * @param errorCallback err回调
	 */
	uploadImgs(uploadUrl, filePath, successCallback, errorCallback) {
		let that = this;
		uni.uploadFile({
			url: HTTP_REQUEST_URL + '/api/' +uploadUrl,
			filePath: filePath,
			fileType: 'image',
			name: 'pics',
			formData: {
				'filename': 'pics',
				'access_token':ACCESS_TOKEN
			},
			header: {
				// #ifdef MP
				"Content-Type": "multipart/form-data",
				// #endif
			},
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode == 403) {
					that.Tips({
						title: res.data
					});
				} else {
					let data = res.data ? JSON
						.parse(res.data) : {};
					if (data.status == 1) {
						successCallback &&
							successCallback(
								data)
					} else {
						errorCallback &&
							errorCallback(data);
						that.Tips({
							title: '上传图片失败'
						});
					}
				}
			},
			fail: (err) => {
				uni.hideLoading();
				that.Tips({
					title: '上传图片失败'
				});
			}
		})
	},
}
