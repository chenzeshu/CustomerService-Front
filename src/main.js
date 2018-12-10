// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import iView from 'iview'
import store from './store'
import {cloneDeep} from 'lodash'
import 'iview/dist/styles/iview.css';
import "common/stylus/index.styl"
import VueLazyload from 'vue-lazyload'
import VCharts from 'v-charts'

Vue.use(VueLazyload, {
  lazyComponent:true
})
Vue.use(iView)
Vue.use(VCharts)
Vue.prototype.$lodash = {cloneDeep}
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


router.push('/signin')
// 全局配置
router.beforeEach((to, from, next) => {
  // Change doc title
  // document.title = to.meta.title || 'Unknow title'
  document.title ='中网客服管理平台'
  // document.querySelector('meta[name="keywords"]').setAttribute('content', 'keywords')
  // document.querySelector('meta[name="description"]').setAttribute('content', 'description')
  next()
})



