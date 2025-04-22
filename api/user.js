//获取用户信息方法函数
import request from "@/utils/request.js";

/**
 * 会员登录
 * 
 */
export function memberLogin(data) {
	return request.post("mcenter/account_login", data, {
		noAuth: true
	});
}
/**
 * 手动填写手机号码注册
 */
export function mobileRegister(data) {
	return request.post("mcenter/register", data, {
		noAuth: true
	});
}
/**
 * 检测是否有优惠券
 * data 中应包含 uid(消费者会员的uid)/username营业员名称/password营业员密码
 */
export function memberInfo(data) {
	return request.post("mcenter/userinfo", data, {
		noAuth: true
	});
}
/**
 * 年报
 * data 中应包含 uid(消费者会员的uid)/ vip_no
 */
export function yearReport(data) {
	return request.post("mcenter/yearreport", data, {
		noAuth: true
	});
}
/**
 * 小程序获取到code后获取当前用户的openid
 * data 中应包含 code
 */
export function getOpenid(data) {
	return request.post('mcenter/code2Openid', data, {
		noAuth: true
	});
}
/**
 * 小程序获取code后，普通用户登录（非手机）
 * data 中应包含 code 等信息
 */
export function authLogin(data) {
	return request.post('mcenter/mplogin', data, {
		noAuth: true
	});
}
/**
 * 小程序获取到code后提交到服务端获取快速验证后的手机号
 * data 中应包含 code iv encryptedData
 */
export function mpBindPhone(data) {
	return request.post('mcenter/mpphonelogin', data, {
		noAuth: true
	});
}
/**
 * 修改用户字段
 * data {uname:'名称'}
 */
export function modifyUser(data) {
	return request.post('mcenter/updateMember', data, {
		noAuth: true
	});
}
/**
 * 发送短信验证码
 * data {mobile:'手机号码'}
 */
export function sendSms(data) {
	return request.post('mcenter/sendSmsCode', data, {
		noAuth: true
	});
}
/**
 * 修改用户手机
 * data {uid:'',mobile:'',code:''}
 */
export function modifyMobile(data) {
	return request.post('mcenter/modifyMobile', data, {
		noAuth: true
	});
}
/**
 * 解绑微信
 * data {uid:''}
 */
export function mpUnbind(data) {
	return request.post('mcenter/unbindmp', data, {
		noAuth: true
	});
}

