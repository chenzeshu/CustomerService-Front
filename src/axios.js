import axios from 'axios'
import url from 'common/js/url'
import store from './store'
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
    let username = res.headers.username
    saveToLocal('token', token)
    store.commit('SET_USERNAME', decodeURI(username))
  }
  return res;
}, function (error) {
  // Do something with response error
  switch (error.response.status){
    case 401:
      //如果是401权限问题, 就将本地loginFlag设false并返回登陆
      saveToLocal('loginFlag', false)
      store.commit('SET_LOGINED', false)
      break
    case 422:
      //如果是422问题, 就重新请求特定的refresh_token_route刷新jwt
      break
    default:
      break
  }
  return Promise.reject(error);
});

export default axios
