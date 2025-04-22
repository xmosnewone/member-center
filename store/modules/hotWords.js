export default {
	namespaced: true,
	state: {
		// 搜索关键字
		hotWord: []
	},
	getters: {},
	mutations: {
		setHotWord(state, fastsearchforhotwords) {
			state.hotWord = fastsearchforhotwords;
		}
	}
}
