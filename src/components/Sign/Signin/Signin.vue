<template>
  <div class="signin">
    <div class="signin-wrapper" ref="signinWrapper">
      <form autocomplete="off" class="input">
        <div class="icon">
          <Icon type="person-stalker"></Icon>
        </div>
        <input type="text" :placeholder="userPlcehd" v-model="username">
        <Poptip trigger="hover" title="提示标题" placement="right" v-model="userFlag">
          <div slot="title">{{ userPlcehd }}不能为空</div>
        </Poptip>
      </form>
      <form autocomplete="off" class="input">
        <div class="icon">
          <Icon type="ios-locked"></Icon>
        </div>
        <input type="text" :placeholder="passPlcehd" v-model="password" ref="password">
        <Poptip trigger="hover" title="提示标题" placement="right" v-model="passFlag">
          <div slot="title" class="my-danger">{{ passPlcehd }}不能为空</div>
        </Poptip>
      </form>
      <!--登陆失败超过3次显示验证码-->
      <div class="code" v-show="loginFalse">
          <input type="text" :placeholder="codePlcehd" v-model="code">
        <div class="code-image">
          <img src="../../../assets/code.png" alt="验证码" width="100" height="40" >
        </div>
        <Poptip trigger="hover" title="提示标题" placement="right" v-model="codeFlag">
          <div slot="title">{{ codePlcehd }}不能为空</div>
        </Poptip>
      </div>
      <!--记住我(一周) 不选这个,JWT 2小时失效-->
      <div class="options">
        <i-switch size="large" v-model="remember_me">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
        <span>记住我(一周)</span>
      </div>
      <div class="button">
        <button class="button-button" @click="login">登陆</button>
      </div>
    </div>
    <button @click="test">出现验证码</button>
    <!--<clock></clock>-->
  </div>
</template>

<script>
  import {saveToLocal, loadFromLocal} from 'common/js/local'
  import {mapGetters, mapMutations} from 'vuex'
  import Clock from 'base/Clock/Clock'
  import url from 'common/js/url'
  import Chen from 'chen-utils'

  export default {
  data () {
    return {
      //变量区
      username:null,
      password:null,
      code:null,
      codeImageUrl:"../../../assets/code.png",
      remember_me : false,
      loginFalse : false, //登陆三次失败,变为true, 出现验证码
      userFlag: false,
      passFlag: false,
      codeFlag: false,
      //常量区
      userPlcehd : "邮箱或手机号",
      passPlcehd : "密码",
      codePlcehd : "验证码"
    }
  },
  watch:{
    logined(newLog){
        if(newLog){
            this.$router.push('/home')
        }
    },
    loginFalse(newLoginFalse){
        if(newLoginFalse){
            this.$refs.signinWrapper.style.height=`427px`
        }else{
            this.$refs.signinWrapper.style.height=`357px`
        }
    },
    username(newName){
      if(newName){
          this.userFlag = false
      }
    },
    //form下直接填写type=password, 还是会触发下拉框, 所以要先设为text,然后用js去改变
    password(newPass){
        if(newPass){
          this.$refs.password.type = 'password'
          this.passFlag = false
        }
        else {
          this.$refs.password.type = 'text'
        }
    },
    code(newCode){
        if(newCode){
            this.codeFlag = false
        }
    }
  },
  created(){
      this._checkToken()
//      if(this.logined){
//        this.$router.push({path:'/home'})
//      }
  },
  computed:{
    ...mapGetters([
        'logined'
    ])
  },
  methods:{
      _checkToken(){
        this.$http.get(url.url + "/check").then(res=>{
          if(res.data.code === 1000){
            alert(res.data.msg)
            this.setLogined(true)
          }
        } ,err=>{
            alert("登陆过期, 请重新登陆")
            this.$router.push('/signin')
        })
      },
      login(){
        this._checkInput()
        let postData = {
            phone:this.username,
            password:this.password
        }
        this.$http.post(url.url + "/login", postData).then(res=>{
            res = res.data
          if(parseInt(res.code) === 1000){
              //todo 将token存入localStorage
              saveToLocal('token', res.data.token)
              alert(res.msg)
              this.setLogined(true)
          }else {
              alert(res.msg)
          }
        })
      },
      _checkInput(){
        if(this.logined){
          this.$router.push('/home')
          return
        }
        if(!this.username){
          this.userFlag = true
          return
        }
        if(!this.password){
          this.passFlag = true
          return
        }
        if(this.loginFalse && !this.code){
          this.codeFlag = true
          return
        }
      },
      test(){
          let time = Chen.formatDate(new Date(), 'yMd')
//          this.loginFalse = !this.loginFalse
      },
      ...mapMutations({
        setLogined:'SET_LOGINED'
      })
  },
  components:{
    Clock
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .signin
    position absolute
    top 15vh
    height 60vh
    width 100%
    .signin-wrapper
      display flex
      width 360px
      height 357px
      margin 0 auto
      flex-flow column wrap
      justify-content center
      align-items center
      border-radius 6px
      box-shadow 0 0 8px rgba(0,0,0,.1)
      background #fff
      .input
        display: flex
        justify-content right
        align-items center
        width 280px
        height 50px
        background #f8f8f8
        border 1px solid $color-background-d
        &:nth-child(1)
          border-radius 4px 4px 0 0
        &:nth-child(2)
          border-radius  0 0 4px 4px
          border-top none
          margin-bottom 15px
        .icon
          width 15%
          font-size 18px
          color $color-icon-grey
        input
          width:80%
          height 100%
          font-size 14px
          outline none
          background #fff !important
          box-shadow: 40px 40px 40px 40px #f8f8f8 inset
          &::-webkit-input-placeholder
            color $color-font-grey
      .code
        display flex
        flex-flow row nowrap
        justify-content center
        width 280px
        height 40px
        margin 15px 0
        input
          border-bottom 1px solid $color-highlight-background
          vertical-align: bottom
          outline none
          font-size 18px
          width 60%
          margin 0 5%
          text-indent 28px
          letter-spacing 4px
          &::-webkit-input-placeholder
            color $color-font-grey
        .code-image
          width 35%
      .options
        margin 15px 0 0 0
        font-size 13px
        margin-bottom 25px
      .button
        width 80%
        margin 20px 0 0 0
        .button-button
          width: 80%;
          border-radius: 30px;
          background: $color-button-blue
          color: #fff;
          padding: 15px 0;
          border none
          outline none
          &:hover
            background $color-button-blue-hignlight
            cursor pointer

</style>
