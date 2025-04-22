//首页api数据
import request from "@/utils/request.js";

//获取新闻
export function newsIndex(data) {
	return request.post("mcenter/newslist", data, {
		noAuth: true
	});
}
//获取主广告
export function advIndex(data) {
	return request.post("mcenter/advlist", data, {
		noAuth: true
	});
}
