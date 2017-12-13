import Vue from 'vue'
import Router from 'vue-router'

import Signin from 'comp/Sign/Signin/Signin'
import Home from 'comp/Home/Home'
import FrontPage from 'comp/Home/FrontPage'
import Company from 'comp/Home/Company/Company'
import Emp from 'comp/Home/Emp/Emp'
import Contract from 'comp/Home/Contract/Contract'
import Service from 'comp/Home/Service/Service'
import Contractc from 'comp/Home/Contractc/Contractc'
import Channel from 'comp/Home/Channel/Channel'
import Test from 'comp/Home/Test/test'
//utils
import Coor from 'comp/Home/Utils/Coor'
import ContractType from 'comp/Home/Utils/ContractType'
import ServiceType from 'comp/Home/Utils/ServiceType'
import ServiceSource from 'comp/Home/Utils/ServiceSource'
import Profession from 'comp/Home/Utils/Profession'
import File from 'comp/Home/Utils/File'

//channel utils
import Info1 from 'comp/Home/UtilsC/info1'
import Info2 from 'comp/Home/UtilsC/info2'
import Info3 from 'comp/Home/UtilsC/info3'
// import Info4 from 'comp/Home/UtilsC/info4'
import Info5 from 'comp/Home/UtilsC/info5'
import Info6 from 'comp/Home/UtilsC/info6'
import Device from 'comp/Home/Device/Device'
import Plan from 'comp/Home/Plan/Plan'
import ChannelDuty from 'comp/Home/Channel/ChannelDuty'
//Verify
import Vcus from 'comp/Home/Verify/Vcus'
import Vser from 'comp/Home/Verify/Vser'
import Vchan from 'comp/Home/Verify/Vchan'
import VserTemp from 'comp/Home/Verify/VserTemp'
import VchanTemp from 'comp/Home/Verify/VchanTemp'

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
        //管理控制台
        {path:'frontpage', component: FrontPage},
        //功能页
        {path:'company', component: Company},
        {path:'emp', component: Emp},
        {path:'contract', component: Contract},
        {path:'service', component: Service},
        {path:'contractc', component: Contractc},
        {path:'channel', component: Channel},
        {path:'test', component: Test},
        //utils
        {path:'coor', component: Coor},
        {path:'contractType', component: ContractType},
        {path:'serviceType', component: ServiceType},
        {path:'serviceSource', component: ServiceSource},
        {path:'profession', component: Profession},
        {path:'file', component: File},
        //utilsC
        {path:'info1', component: Info1},
        {path:'info2', component: Info2},
        {path:'info3', component: Info3},
        {path:'channelDuty', component: ChannelDuty},
        // {path:'info4', component: Info4}, //频率
        {path:'info5', component: Info5},
        {path:'info6', component: Info6},
        {path:'device', component: Device},
        {path:'plan', component: Plan},
        //Verify
        {path:'vcus', component: Vcus},
        {path:'vser', component: Vser},
        {path:'vchan', component: Vchan},
        {path:'vserTemp', component: VserTemp},
        {path:'vchanTemp', component: VchanTemp},
      ]
    }
  ]
})


