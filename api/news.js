//新闻页api数据
import request from "@/utils/request.js";

//获取新闻列表
export function getArticleList(data) {
	return request.post("mcenter/newslist", data, {
		noAuth: true
	});
}
//获取主广告
export function getDetail(id) {
	return request.post("mcenter/newsdetail", {"id":id}, {
		noAuth: true
	});
}
//获取主广告
export function advIndex(data) {
	return request.post("mcenter/advlist", data, {
		noAuth: true
	});
}