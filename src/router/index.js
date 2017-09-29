import Vue from 'vue'
import Router from 'vue-router'


import Signin from 'comp/Sign/Signin/Signin'
import Home from 'comp/Home/Home'
import Customer from 'comp/Home/Customer/Customer'
import Emp from 'comp/Home/Emp/Emp'
import Contract from 'comp/Home/Contract/Contract'
import Contractc from 'comp/Home/Contractc/Contractc'


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
        {path:'customer', component: Customer},
        {path:'emp', component: Emp},
        {path:'contract', component: Contract},
        {path:'contractc', component: Contractc},
      ]
    }
  ]
})
