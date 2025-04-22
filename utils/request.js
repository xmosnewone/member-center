//通信请求后台方法
import {
	HTTP_REQUEST_URL,
	ACCESS_TOKEN,
	CLIENT_ID,
	HEADER,
	TOKENNAME
} from '@/config/app';
import {
	toLogin,
	checkLogin
} from '../libs/login';
import store from '../store';
import i18n from './lang.js';
import Md5 from './md5.min.js'

/**
 * 生成KEY
 */
function generateKey(uname,passwd){
	let username=uname??'';
	let password=passwd??'';
	let key = "access_token="+ACCESS_TOKEN+"&client_id="+CLIENT_ID+"&username="+username+"&password="+password;
		key+=ACCESS_TOKEN;
		return Md5(Md5(key)).toLowerCase();
	
}
/**
 * 发送请求
 */
function baseRequest(url, method, data, {
	noAuth = false,
	noVerify = false
}) {
	let Url = HTTP_REQUEST_URL,
		header = HEADER;
	if (!noAuth) {
		//登录过期自动登录
		if (!store.state.app.oper_token && !checkLogin()) {
			toLogin();
			return Promise.reject({
				msg: i18n.t(`未登录`)
			});
		}
	}
	if (store.state.app.token) header[TOKENNAME] = 'Bearer ' + store.state.app.token;

	return new Promise((reslove, reject) => {
		if (uni.getStorageSync('locale')) {
			header['Cb-lang'] = uni.getStorageSync('locale')
		}
		
		let transData=data || {};
			transData.access_token=ACCESS_TOKEN;//访问api的ACCESS_TOKEN
			transData.client_id=CLIENT_ID;//访问api的client_id
		let _key=generateKey(transData.username,transData.password);
			transData.key=_key;
			
		uni.request({
			url: Url + '/api/' + url,//默认是api模块
			method: method || 'GET',
			header: header,
			data: transData,
			success: (res) => {
				
					reslove(res, res);
				
			},
			fail: (msg) => {
				let data = {
					mag: i18n.t(`请求失败`),
					status: 1 //1没网
				}
				// #ifdef APP-PLUS
				reject(data);
				// #endif
				// #ifndef APP-PLUS
				reject(i18n.t(`请求失败`));
				// #endif
			}
		})
	});
}

const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});



export default request;
