<template>
  <div id="app">
    <Logo :logined="logined"></Logo>
    <!--一级路由-->
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {saveToLocal, loadFromLocal} from 'common/js/local'
  import Logo from 'base/Logo/Logo.vue'
  import base64 from 'common/js/base64'

  export default {
    data(){
        return {

        }
    },
    created(){
      let token = loadFromLocal('token')
          token = JSON.parse(base64.decode(token.split(".")[1])).exp * 1000
      let exp = parseInt(token) * 1000,
          now = Date.now()
      this.setLogined( exp > now ? true : false )
    },
    computed:{
      ...mapGetters([
        'logined'
      ])
    },
    watch:{
      logined(newLogined){
        if(newLogined){
          this.$Message.success('登陆成功')
          this.$router.push('/home/frontpage')
        }else{
          this.$router.push('/signin')
        }
      },
    },
    methods:{
      ...mapMutations({
        setLogined:'SET_LOGINED'
      })
    },
    components:{
        Logo
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  html, body, #app
    height 96%
    background #f1f1f1
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  .layout
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height 100%
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
    min-height: 200px;
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
