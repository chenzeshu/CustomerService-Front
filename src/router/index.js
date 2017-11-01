import Vue from 'vue'
import Router from 'vue-router'


import Signin from 'comp/Sign/Signin/Signin'
import Home from 'comp/Home/Home'
import Company from 'comp/Home/Company/Company'
import Emp from 'comp/Home/Emp/Emp'
import Contract from 'comp/Home/Contract/Contract'
import Service from 'comp/Home/Service/Service'
import Contractc from 'comp/Home/Contractc/Contractc'
import Test from 'comp/Home/Test/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/signin',
      component: Signin
    },
    {
      path: '/home',
      component: Home,
      children:[
        {path:'company', component: Company},
        {path:'emp', component: Emp},
        {path:'contract', component: Contract},
        {path:'service', component: Service},
        {path:'contractc', component: Contractc},
        {path:'test', component: Test},
      ]
    }
  ]
})
