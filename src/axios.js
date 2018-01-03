import axios from 'axios'
import url from 'common/js/url'
import store from './store'
//functions
import {loadFromLocal, saveToLocal} from 'common/js/local'
import Vue from "./main"

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
   if(!!error.response){
     let token = error.response.headers.authorization
     let username = error.response.headers.username
     saveToLocal('token', token)
     store.commit('SET_USERNAME', decodeURI(username))
     switch (error.response.status){
       case 401:
         alert('请勿频繁刷新页面')
         //如果是401权限问题, 不一定是登陆失败, 可能是权限不足, 不该踢出, 但是由于状态码有限, 又不想在版本1中对一个状态码分不通的code, 所以尽量避免401
         saveToLocal('loginFlag', false)
         store.commit('SET_LOGINED', false)
         break
       case 404:
         break
       case 422:
         //如果是422问题, 就重新请求特定的refresh_token_route刷新jwt
         break
       case 500:
         alert('服务端异常, 请联系维护者')
         break
       default:
         break
     }
     let text = error.response.data.errors
     let content = ''
     for ( let key in text){
       content += `${key} : ${text[key]}<br>`
     }
     Vue.$Notice.error({
       title: '异常通知',
       desc: content,
       duration:10
     });
   }
  return Promise.reject(error);
});

export default axios
