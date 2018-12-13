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

        <Row type="flex">
          <!--左边-->
          <Col :span="spanLeft" class="layout-menu-left">
            <Menu :active-name="curMenuName" :theme="theme2" width="auto" @on-select="getCurMenuName">
              <Submenu v-for="(module,mk) in modules" :key="mk" :name="module.name">
                <template slot="title">
                  <Icon type="navicon" :size="iconSize"></Icon>
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
                <BreadcrumbItem>{{ curMenuName }}{{ curMenuName === '管理控制台' ? '' : `（${total}个）`}}</BreadcrumbItem>
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
    import {catlogs} from './catlogs'
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
          modules: catlogs
        }
      },
       computed:{
         iconSize () {
           return this.spanLeft === 5 ? 14 : 24;
         },
         ...mapGetters([
             'logined' , 'username', 'total'
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
             this.setLogined(false)
             this.setDataArr([])
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

