// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import store from './store'
import url from 'common/js/url'
import 'iview/dist/styles/iview.css';
import "common/stylus/index.styl"
Vue.use(iView)

//functions
import {loadFromLocal, saveToLocal} from 'common/js/local'

axios.defaults.baseURL = url.url;
// axios.defaults.headers.post['Content-Type'] = 'json/application'
//axios 请求拦截器
axios.interceptors.request.use(
  config => {
    if (loadFromLocal('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = 'Bearer ' + loadFromLocal('token');
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(function (res) {
  // Do something with response data
  if(res.headers.authorization){
    let token = res.headers.authorization
    saveToLocal('token', token)
  }
  return res;
}, function (error) {
  // Do something with response error
  switch (error.response.status){
    case 401:
      //如果是401权限问题, 就将本地loginFlag设false并返回登陆
      saveToLocal('loginFlag', false)
      store.commit('SET_LOGINED', false)
    default:
      break
  }
  return Promise.reject(error);
});

Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

router.push('/signin')
// router.beforeEach((to, from, next) => {
//   if (loadFromLocal('loginFlag') && store.state.logined){
//     next()
//   }
//   else {
//     next({
//       path:'/signin'
//     })
//   }
// })


