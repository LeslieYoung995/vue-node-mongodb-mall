// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import {currency} from "./utils/currency";

Vue.use(Vuex);
Vue.use(infiniteScroll);

Vue.use(VueLazyLoad, {
  loading: './../static/loading-bars.svg',
  try: 3
});
Vue.config.productionTip = false;

Vue.filter("currency", currency);

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
