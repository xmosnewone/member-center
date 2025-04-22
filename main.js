import App from './App'
import Vue from 'vue'
import store from './store'
import Cache from './utils/cache'
import Md5 from './utils/md5.min.js'
import util from './utils/util.js'
import configs from './config/app.js'
Vue.prototype.$config = configs;
Vue.prototype.$Cache = Cache;
Vue.prototype.$md5 = Md5;
Vue.prototype.$util = util;
Vue.prototype.$eventHub = new Vue();
import './uni.promisify.adaptor';
Vue.config.productionTip = false;

App.mpType = 'app'
const app = new Vue({
  ...App,
  store,
  Cache,
})
app.$mount()