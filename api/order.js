//订单中心api数据
import request from "@/utils/request.js";

//获取会员订单
export function memberOrderList(data) {
	return request.post("mcenter/orderList", data, {
		noAuth: true
	});
}
//查询订单是否存在
export function orderBarcode(data) {
	return request.post("mcenter/barcodeDetail", data, {
		noAuth: true
	});
}
//查询订单详情
export function orderDetail(data) {
	return request.post("mcenter/orderDetail", data, {
		noAuth: true
	});
}