<template>
    <div class="home">
      <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Logo :logined="!logined"></Logo>
        <div class="layout-ceiling" >
          <div class="layout-ceiling-main">
            <a href="#" v-show="!logined">登陆平台</a>
            <span v-show="logined">
              <span style="display: inline-block;vertical-align: top;margin-right:16px;cursor:pointer"
                  @click="showChat">
                <Icon type="chatbubbles" size="20" color="#29d10bfc"></Icon>
              </span>
              <span style="color:#9ba7b5">你好, {{ username }} |</span>
              <a href="#" @click.prevent="logout">注销账户</a>
            </span>

          </div>
        </div>
        <Row type="flex" >
          <!--左边-->
          <Col :span="spanLeft" class="layout-menu-left">
            <Menu :active-name="curMenuName" :theme="theme2" width="auto" @on-select="getCurMenuName">
              <Submenu v-for="(module,mk) in modules" :key="mk" name="module.name">
                <template slot="title">
                  <Icon type="ios-paper" :size="iconSize"></Icon>
                  <span class="layout-text">{{ module.title }}</span>
                </template>
                  <router-link v-for="(child, ck) in module.children" :key="ck" :to="child.path">
                    <MenuItem :name="child.name">{{ child.title }}</MenuItem>
                  </router-link>
              </Submenu>
            </Menu>
          </Col>
          <!-- 右边-->
          <Col :span="spanRight">
          <div class="layout-header">
            <div class="show-left">
              <Button type="text" @click="toggleClick">
                <Icon type="navicon" size="32"></Icon>
              </Button>
            </div>
          </div>
          <div class="layout-breadcrumb">
            <div class="show-left">
              <Breadcrumb>
                <BreadcrumbItem href="#">首页</BreadcrumbItem>
                <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
                <BreadcrumbItem>{{ curMenuName }}</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
          <div class="layout-content">
            <div class="layout-content-main">
              <router-view></router-view>
            </div>
          </div>
          <div class="layout-copy">
            2011-2017 &copy; 南京中网卫星通信股份有限公司
          </div>
          </Col>
        </Row>
      </div>

      <Chat v-show="chatFlag"></Chat>
    </div>
</template>

<script>
    import {saveToLocal, loadFromLocal} from 'common/js/local'
    import {mapGetters, mapMutations} from 'vuex'
    import Logo from 'base/Logo/Logo.vue'
    import Chat from 'base/Chat/Chat.vue'

    export default {
      data(){
        return {
          spanLeft: 5,
          spanRight: 19,
          theme2:'dark',
          chatFlag : false,
          curMenuName:"管理控制台",
          //这个modules可以单独做一个js文件
          modules:[
            {
              title:"控制台",
              name:"1",
              children:[
                {title:"管理控制台", path:'/home/frontpage', name:"管理控制台"},
              ]
            },
            {
              title:"等待审核",
              name:"2",
              children:[
                {title:"注册申请", path:'/home/vcus', name:"注册申请"},
                {title:"服务申请", path:'/home/vser', name:"服务申请"},
                {title:"信道申请", path:'/home/vchan', name:"信道申请"},
                {title:"临时服务申请", path:'/home/vserTemp', name:"临时服务申请"},
                {title:"临时信道申请", path:'/home/vchanTemp', name:"临时信道申请"}
              ]
            },
            {
              title:"单位管理",
              name:"3",
              children:[
                {title:"单位列表", path:'/home/company', name:"单位列表"}
              ]
            },
            {
              title:"用户管理",
              name:"4",
              children:[
                {title:"用户列表", path:'/home/emp', name:"用户列表"}
              ]
            },
            {
              title:"服务库",
              name:"5",
              children:[
                {title:"服务合同", path:'/home/contract', name:"服务合同"},
                {title:"普通服务单", path:'/home/service', name:"普通服务单"},
                {title:"服务套餐表", path:'/home/contractPlan', name:"服务套餐表"}
              ]
            },
            {
              title:"信道库",
              name:"6",
              children:[
                {title:"信道合同", path:'/home/contractc', name:"信道合同"},
                {title:"信道服务单", path:'/home/channel', name:"信道服务单"},
                {title:"信道值班表", path:'/home/channelDuty', name:"信道值班表"},
                {title:"设备列表", path:'/home/device', name:"设备列表"},
                {title:"套餐列表", path:'/home/plan', name:"套餐列表"},
//                {title:"测试", path:'/home/test', name:"测试"}
              ]
            },
            {
              title:"普通工具列表",
              name:"7",
              children:[
                {title:"外协单位", path:'/home/coor', name:"外协单位"},
                {title:"合同类型", path:'/home/contractType', name:"合同类型"},
                {title:"服务信息来源", path:'/home/serviceSource', name:"服务信息来源"},
//                {title:"服务类型", path:'/home/serviceType', name:"服务类型"},
                {title:"行业列表", path:'/home/profession', name:"行业列表"},
                {title:"文件列表", path:'/home/file', name:"文件列表"},
              ]
            },
            {
              title:"带宽工具列表",
              name:"8",
              children:[
                {title:"带宽表", path:'/home/info1', name:"带宽表"},
                {title:"站类型表", path:'/home/info2', name:"站类型表"},
                {title:"通信卫星表", path:'/home/info3', name:"通信卫星表"},
//                {title:"频率表", path:'/home/info4', name:"频率表"},
                {title:"极化表", path:'/home/info5', name:"极化表"},
                {title:"网络类型表", path:'/home/info6', name:"网络类型表"},
              ]
            }
          ]
        }
      },
       computed:{
         iconSize () {
           return this.spanLeft === 5 ? 14 : 24;
         },
         ...mapGetters([
             'logined' , 'username'
           ])
       },
       mounted(){},
       methods:{
         showChat(){
           this.chatFlag = !this.chatFlag
         },
         getCurMenuName(curName){
             this.curMenuName = curName
         },
         toggleClick () {
           if (this.spanLeft === 5) {
             this.spanLeft = 2;
             this.spanRight = 22;
           } else {
             this.spanLeft = 5;
             this.spanRight = 19;
           }
         },
         logout(){
           saveToLocal('loginFlag', false)
           this.setLogined(false)
           this.setDataArr([])
         },
         test(){
               this.$router.push('/home/test')
         },
         ...mapMutations({
           setLogined:'SET_LOGINED',
           setDataArr:'SET_DATAARR'
         })
       },
      components:{
        Logo, Chat
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .layout
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height 100%
  .layout-ceiling
    background: #464c5b;
    padding: 10px 0;
    overflow: hidden;
  .layout-ceiling-main
    float: right;
    margin-right: 15px;
  .layout-ceiling-main a
    color: #9ba7b5;
  .layout-breadcrumb
    position relative
    padding: 10px 15px 0;
    height 20px
  .layout-content
    min-height: 85vh;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  .layout-content-main
    padding: 10px;
  .layout-copy
    display block
    position fixed
    bottom:20px
    left 38vw
    text-align: center;
    color: #9ea7b4;
  .layout-menu-left
    background: #464c5b;
  .layout-header
    position relative
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  .show-left
    display block
    position absolute
    left 20px
  .layout-ceiling-main a
    color: #9ba7b5;
  .layout-hide-text .layout-text
    display: none;
  .ivu-col
    transition: width .2s ease-in-out;
</style>

