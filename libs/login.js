//登录相关库
import store from "../store";
import Cache from '../utils/cache';
import Md5 from '../utils/md5.min.js';
import {
	Debounce
} from '@/utils/validate.js'

import {
	LOGIN_STATUS,
	USER_INFO,
	EXPIRES_TIME,
	STATE_R_KEY,
	UID
} from './../config/cache';
import MiniProgram from '@/libs/miniprogram.js';

function prePage() {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 1];
	// #ifndef APP-PLUS
	return prePage.route;
	// #endif
	// #ifdef APP-PLUS
	return prePage.$page.fullPath;
	// #endif

}

function isWeixin() {
	return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
}

export const toLogin = Debounce(_toLogin, 800)

function _toLogin() {
	// #ifdef H5
	if (isWeixin()) {
		if (!uni.getStorageSync('authIng')) {
			store.commit("LOGOUT");
		}
	} else {
		store.commit("LOGOUT");
	}
	// #endif
	// #ifndef H5
	store.commit("LOGOUT");
	// #endif
	let path = prePage();
	// #ifdef H5
	path = location.pathname + location.search;
	// #endif
	Cache.set('login_back_url', path);
	
	uni.navigateTo({
		url: '/pages/login/mplogin'
	})
}


export function checkLogin() {
	let _uid = Cache.get(UID);
	if (!_uid||_uid==null) {
		Cache.clear(LOGIN_STATUS);
		store.commit("LOGOUT");
		return false;
	} else {
		return true;
	}

}

//会员退出
export function memberLogout() {
	store.commit("LOGOUT");
}