import {
	LOGIN_STATUS,
	UID,
	MEM_NO,
	USER_INFO
} from '../../config/cache';
import Cache from '../../utils/cache';
import Md5 from '../../utils/md5.min.js';

const state = {
	token: Cache.get(LOGIN_STATUS) || false,
	backgroundColor: "#fff",
	userInfo: Cache.get(USER_INFO) ||false,
	uid: Cache.get(UID) || 0,//普通会员登录的uid
	mem_no: Cache.get(MEM_NO) || '',//普通会员登录的mem_no会员编码
};

const mutations = {
	SETPHONESTATUS(state, val) {
		state.phoneStatus = val;
	},
	LOGIN(state, opt) {
		state.uid = opt.uid;
		state.mem_no = opt.mem_no;
		state.userInfo = opt.user_info;//整条会员信息
		Cache.set(UID, opt.uid);
		Cache.set(MEM_NO, opt.mem_no);
		Cache.set(USER_INFO, opt.user_info);
	},
	SETUID(state, val) {
		state.uid = val;
		Cache.set(UID, val);
	},
	LOGOUT(state) {
		state.uid = 0;
		state.mem_no='';
		state.userInfo=false;
		Cache.clear(UID);
		Cache.clear(MEM_NO);
		Cache.clear(USER_INFO);
	},
	BACKGROUND_COLOR(state, color) {
		state.color = color;
		document.body.style.backgroundColor = color;
	},
	UPDATE_USERINFO(state, userInfo) {
		state.userInfo = userInfo;
		Cache.set(USER_INFO, userInfo);
	}
};

const actions = {
	
};

export default {
	state,
	mutations,
	actions
};
