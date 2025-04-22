export default {
	token: state => state.app.token,
	isLogin: state => !!state.app.token,
	backgroundColor: state => state.app.backgroundColor,
	userInfo: state => state.app.userInfo,
	auto_login:state => state.app.auto_login,
	uid:state => state.app.uid,
	mem_no:state => state.app.mem_no,
	home: state => state.app.home,
	cartNum: state => state.indexData.cartNum,
	activityTab: state => state.app.activityTab,
};
