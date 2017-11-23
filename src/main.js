// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import iView from 'iview'
import store from './store'
// import UnserScore from 'underscore'
import lodash from 'lodash'
import 'iview/dist/styles/iview.css';
import "common/stylus/index.styl"
Vue.use(iView)
Vue.prototype.$lodash = lodash
Vue.prototype.$http = axios
// Vue.prototype.$obj = UnserScore

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


