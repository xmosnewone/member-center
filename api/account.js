//获取用户账户余额方法函数
import request from "@/utils/request.js";

//获取会员账户变动列表
export function memberAccount(data) {
	return request.post("mcenter/memberAccount", data, {
		noAuth: true
	});
}

