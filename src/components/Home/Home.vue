<template>
    <div class="home">
      <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Logo :logined="logined"></Logo>

        <div class="layout-ceiling" >
          <div class="layout-ceiling-main" @click="test">
            <a href="#" v-show="!logined">登陆平台</a>
            <a href="#" v-show="logined">注销账户</a>
          </div>
        </div>
        <Row type="flex" >
          <!---->
          <Col :span="spanLeft" class="layout-menu-left">
            <Menu :active-name="curMenuName" :theme="theme2" width="auto" @on-select="getCurMenuName">
              <Submenu v-for="module in modules" name="module.name">
                <template slot="title">
                  <Icon type="ios-paper" :size="iconSize"></Icon>
                  <span class="layout-text">{{ module.title }}</span>
                </template>
                  <router-link v-for="child in module.children" :to="child.path">
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
                <BreadcrumbItem>某应用</BreadcrumbItem>
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


    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height 100%
  }
  /*
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  */
  .layout-ceiling{
    background: #464c5b;
    padding: 10px 0;
    overflow: hidden;
  }
  .layout-ceiling-main{
    float: right;
    margin-right: 15px;
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }

  .layout-breadcrumb{
    position relative
    padding: 10px 15px 0;
    height 20px
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    display block
    position fixed
    bottom:20px
    left 38vw
    text-align: center;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    position relative
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .show-left{
    display block
    position absolute
    left 20px
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
  }

</style>

<script>
    import {saveToLocal} from 'common/js/local'
    import {mapGetters, mapMutations} from 'vuex'
    import Logo from 'base/Logo/Logo.vue'
    export default {
      data(){
        return {
          spanLeft: 5,
          spanRight: 19,
          theme2:'dark',
          curMenuName:"1",
          //这个modules可以单独做一个js文件
          modules:[
            {
                title:"单位管理",
                name:"1",
                children:[
                  {title:"单位列表", path:'/home/customer', name:"1-1"}
                ]
            },
            {
              title:"用户管理",
              name:"2",
              children:[
                {title:"用户列表", path:'/home/emp', name:"2-1"}
              ]
            },
            {
              title:"普通合同",
              name:"3",
              children:[
                {title:"合同列表", path:'/home/contract', name:"3-1"}
              ]
            },
            {
              title:"信道合同",
              name:"4",
              children:[
                {title:"合同列表", path:'/home/contractc', name:"4-1"}
              ]
            },
          ]
        }
      },
      watch:{
          logined(newV){
              if(!newV){
                  console.log('注销了')
                  this.$router.push('/signin')
              }
          }
      },
       computed:{
         iconSize () {
           return this.spanLeft === 5 ? 14 : 24;
         },
         ...mapGetters([
             'logined'
           ])
       },
       mounted(){
          console.log(this.logined)
       },
       methods:{
         getCurMenuName(curName){
             this.CurMenuName = curName
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
           saveToLocal('myJWT', null)
         },
         test(){
              console.log(12313)
               this.$router.push('/home/test')
         },
         ...mapMutations({
           setLogined:'SET_LOGINED'
         })
       },
      components:{
        Logo
      }
    }
</script>


