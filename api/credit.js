//获取用户积分方法函数
import request from "@/utils/request.js";

//获取会员积分列表
export function memberCreditList(data) {
	return request.post("mcenter/creditList", data, {
		noAuth: true
	});
}

