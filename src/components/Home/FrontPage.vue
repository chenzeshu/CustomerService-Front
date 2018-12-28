<template>
    <div class="front-page">

      <Row :gutter="24">
        <i-col span="6" class="report">
          <span class="report-span">自动报警：</span>
          <div class="report-switch">
            <i-switch
              v-model="switchReport"
              @on-change="switchReportChange"
              size="large"
              :disabled="switchDisabled"
            ></i-switch>
          </div>
        </i-col>
        <i-col span="18">
          <Alert type="warning">提示: 尊敬的 {{ username }} ， 欢迎您的使用， 您上次的登陆时间为{{loginInfo.created_at}}， 登陆IP为{{ loginInfo.ip }}</Alert>
        </i-col>
      </Row>
      <Row :gutter="24">
        <i-col span="8">
          <Card>
            <h1 slot="title">客户服务单统计</h1>
            <ve-ring :data="services"></ve-ring>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <h1 slot="title">信道服务单统计</h1>
            <ve-ring :data="channels"></ve-ring>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <h1 slot="title">故障率统计</h1>
            <ve-ring :data="problem_count"></ve-ring>
          </Card>
        </i-col>
      </Row>
      <Split type="xi" style="margin:10px 0"></Split>
      <Row :gutter="24">
        <i-col span="8">
          <Card>
            <h1 slot="title">单位签约情况</h1>
            <ve-pie :data="companies" :settings="settings.company_setting"></ve-pie>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <h1 slot="title">客服合同结清情况</h1>
            <ve-ring :data="contracts"></ve-ring>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <h1 slot="title">信道合同结清情况</h1>
            <ve-ring :data="contractcs"></ve-ring>
          </Card>
        </i-col>
      </Row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MyCard from 'base/MyCard/MyCard'
    import Split from 'base/Split/Split'
    import params from './params'

    var delayKeyFrame

    export default {
        data(){
          return {
              calData:{},
              loginInfo:{created_at:"...", ip:"..."},
              companies:{columns: params.company_param, rows: []},
              services: {columns: params.other_param, rows: []},
              channels: {columns: params.other_param, rows: []},
              contracts: {columns: params.finish_param, rows: []},
              contractcs: {columns: params.finish_param, rows: []},
              problem_count:  {columns: params.problem_param, rows: []},
              settings: {
                company_setting: {
                  label: '单位统计'
                }
              },
              switchReport:false, //自动预警开关
              switchDisabled: false
          }
        },
        computed:{
          ...mapGetters([
              'username'
          ])
        },
        mounted(){
          let code = "■", repeat = 1
          delayKeyFrame = setInterval(()=> {
            this.loginInfo = {
              created_at: code.repeat(repeat),
              ip: code.repeat(repeat)
            }
            if(repeat > 6){
              repeat = 1
            }else{
              repeat++
            }
          }, 100)

          setTimeout(this._getBasicData, 500)
        },
        methods:{
          switchReportChange(status){
            this.switchDisabled = true
            let switch_int = status === true ? 1 : 0
            let url = `allow/report/${switch_int}`

            this.$http.get(url).then(res=>{
              res = res.data
              this.$Message.info(res.msg);
              this.switchDisabled = false
            })
          },
          _getBasicData(){
              this.$http.get("/calculate/basic").then(res=>{
                  clearInterval(delayKeyFrame)
                  res = res.data
                  if(parseInt(res.code) === 200){
                      this.calData = res.data.calData
                      this.companies.rows = this.calData.company_count
                      this.contracts.rows = this.calData.contract_count
                      this.contractcs.rows = this.calData.contractc_count
                      this.services.rows = this.calData.service_count
                      this.channels.rows = this.calData.channel_count
                      this.problem_count.rows = this.calData.problem_count
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

  .front-page
    .report
      line-height:16px;
      padding-top:6px;
      .report-span
        margin-top: 5px;
        font-size: 1px;
      .report-switch
        display:inline-block


</style>
