//获取系统配置信息方法函数
import request from "@/utils/request.js";

//获取系统配置信息
export function systeminfo(data) {
	return request.post("mcenter/systeminfo", data, {
		noAuth: true
	});
}
//获取积分使用说明\用户协议\隐私协议
export function portocalContent(data) {
	return request.post("mcenter/portocalcontent", data, {
		noAuth: true
	});
}




