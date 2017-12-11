<template>
    <div class="front-page">
      <Alert type="warning">提示: 尊敬的 {{ username }} ， 欢迎您的使用， 您上次的登陆时间为{{loginInfo.created_at}}， 登陆IP为{{ loginInfo.ip }}</Alert>
      <Row :gutter="16">
        <i-col span="24">
          <MyCard title="平台单位总数"></MyCard>
        </i-col>
      </Row>
      <Split type="xi" style="margin:10px 0"></Split>
      <Row :gutter="16">
        <i-col span="6">
          <MyCard title="未结清普通合同" :num="calData.contract_count"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="green" title="未结清信道合同" :num="calData.contractc_count"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="red" title="待审批普通服务" :num="calData.service_count"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="purple" title="待审批信道服务" :num="calData.channel_count"></MyCard>
        </i-col>
      </Row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MyCard from 'base/MyCard/MyCard'
    import Split from 'base/Split/Split'
    export default {
        data(){
          return {
              calData:{},
            loginInfo:{}
          }
        },
        computed:{
          ...mapGetters([
              'username'
          ])
        },
        created(){
            this._getBasicData()
        },
        methods:{
          _getBasicData(){
              this.$http.get("/calculate/basic").then(res=>{
                  res = res.data
                  if(parseInt(res.code) === 200){
                      this.calData = res.data.calData
                      this.loginInfo = res.data.loginInfo
                  }
              })
          },
        },
        components:{
              MyCard, Split
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

</style>
