<template>
    <div class="v-chan">

      <!--wrapper-->

      <!--假若没有申请-->
      <div class="vchan-empty" v-if="total === 0">
        <span class="no-verify">暂时没有新申请</span>
      </div>

      <!--存在申请-->
      <div class="vchan-wrapper" v-else>
        <!--title-->
        <div class="title">
          <div class="left-title">
            待审核信道服务单({{total}})
            </div>
          <div class="right-title">
            <a href="#" style="color:#2d8cf0" @click.prevent="_getData">
              <Icon type="ios-loop-strong"></Icon>
              Refresh
            </a>
          </div>
        </div>

        <Split type="zhong"></Split>

        <!--详细内容content-->
        <div class="content">
          <div class="list-item-wrapper" v-for="(item, key) in this.dataArr">
            <div class="list-item">
              <div class="item-left">
                <div class="avatar">
                  <img src="/static/avatar.png" alt="" width="64" height="64"
                  @mouseover="showManDetail(key, $event)"
                  @mouseleave="closeDetail"
                  >
                </div>
                <div class="info1">
                  <span class="name">申请人:{{ item.employee.name }}</span>
                  <span>信息来源:{{ item.source.name }}</span>
                  <span v-if="item.contractc">所属合同:{{ item.contractc.name }}</span>
                  <span>所选套餐:{{ item.channel_applys[0].contractc_plan.alias }}</span>
                  <span><div class="icon">
                    <Icon type="clock"></Icon>
                  </div>开始时间:{{ item.channel_applys[0].t1 }}</span>
                </div>
                <div class="info2">
                  <span>通信卫星: <span v-if="item.tongxin[0]">{{ item.tongxin[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>极化: <span v-if="item.jihua[0]">{{ item.jihua[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>带宽: <span v-if="item.daikuan[0]">{{ item.daikuan[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>类型:{{ item.type }}</span>
                  <span><div class="icon">
                    <Icon type="clock"></Icon>
                  </div>结束时间:{{ item.channel_applys[0].t2 }}</span>
                </div>
              </div>

              <!--显隐的具体实现: https://segmentfault.com/q/1010000011144074-->

              <div class="verify">
                <i-button type="primary" size="large" @click="_pass(item)">通过审核</i-button>
                <i-button type="error" size="large" @click="_rej(item.id)">拒绝</i-button>
              </div>

            </div>
            <div class="control-item" @click="showContent(key)" v-if="contentIndex !==key">
              --------------------------------展开设备列表---------------------------------
            </div>
            <div class="control-item" @click="hiddenContent()" v-else>
              --------------------------------隐藏设备列表---------------------------------
            </div>

            <transition name="slide-fade">
              <table class="ivu-table ivu-table-border" style="width:50vw;min-width:700px; margin:10px auto"
                     cellspacing="0" cellpadding="0" v-if="contentIndex === key">
                <thead class="ivu-table-header">
                <tr>
                  <th class="ivu-table-cell">节点</th>
                  <th class="ivu-table-cell">所属单位</th>
                  <th class="ivu-table-cell">设备型号</th>
                  <th class="ivu-table-cell">设备类型</th>
                  <th class="ivu-table-cell">设备ip</th>
                </tr>
                </thead>
                <tbody class="ivu-table-body">
                <tr class="ivu-table-row" v-for="(device, kd) in item.channel_applys[0].channel_relations" :key="kd">
                  <td class="ivu-table-cell">节点{{ kd+1 }}</td>
                  <td class="ivu-table-cell">{{ device.company.name }}</td>
                  <td class="ivu-table-cell">{{ device.device.device_id}}</td>
                  <td class="ivu-table-cell">{{ device.device.type}}</td>
                  <td class="ivu-table-cell">{{ device.device.ip}}</td>
                </tr>
                </tbody>
              </table>
            </transition>

            <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
          </div>
        </div>
      </div>

      <ShowDetail class="show-man-detail" ref="showDetail">
         <span class="name">
                <div class="icon">
                  <Icon type="person"></Icon>
                </div>
            姓名: {{ curDetail.name }}</span>
        <span><div class="icon">
                  <Icon type="home"></Icon>
                </div>
            单位: <span>{{ curDetail.company.name }}</span></span>
        <span><div class="icon">
                  <Icon type="iphone"></Icon>
                </div>
            手机: <span>{{ curDetail.phone }}</span></span>
      </ShowDetail>

      <br>
      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <Loading :loading="loading"></Loading>

      <!--update-->
      <Modal
        v-model="PFlag"
        title="补充并通过审核"
        width="400"
        @on-ok="passUpdate">
        <!--@on-cancel="cancel"-->
        <Form :model="channel_apply" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <FormItem label="通信卫星" prop="id2">
            <RadioGroup v-model="channel_apply.id2" type="button">
              <Radio :label="t.id" v-for="(t, tk) in tongxin" :key="tk">{{t.name}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="极化" prop="id3">
            <RadioGroup v-model="channel_apply.id3" type="button">
              <Radio :label="t.id" v-for="(t, tk) in jihua" :key="tk">{{t.name}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="带宽" prop="id4">
            <RadioGroup v-model="channel_apply.id4" type="button">
              <Radio :label="t.id" v-for="(t, tk) in daikuan" :key="tk">{{t.name}}</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
  import {curdMixin, pageMixin} from 'common/js/mixin'
  import Loading from 'base/Loading/Loading'
  import Split from 'base/Split/Split'
  import ShowDetail from 'base/Show/ShowDetail'
  export default {
    mixins:[curdMixin, pageMixin],
    data () {
      return {
          url:'apply',
          dataCount : null,
          PFlag:false,           //通过审核ModelFlag
          contentIndex:null,
          tongxin:[],
          daikuan:[],
          jihua:[],
          curDetail:{
            name:null,
            phone:null,
            email:null,
            company:{}
          },
          channel_apply:{  //用于channel_applys方便表单验证
                id2:null,
                id3:null,
                id4:null,
          },
          passModel:{ //用于给后台
                channel_applys:[]
          },
          ruleValidate:{
                id2:[{type:'number', required: true, message: '选择通信卫星', trigger: 'blur' }],
                id3:[{type:'number', required: true, message: '选择极化', trigger: 'blur' }],
                id4:[{type:'number', required: true, message: '选择带宽', trigger: 'blur' }],
          }
      }
    },
    created(){
      this._getData()
    },
    methods: {
        showManDetail(key, e){
            let emp = this.dataArr[key].employee
            this.curDetail = Object.assign({}, emp)
            //调用组件方法显示细节面板并改变位置
            this.$refs.showDetail.showManDetail(e)
        },
        closeDetail(){
          this.$refs.showDetail.closeDetail()
        },
        passUpdate(){
          this.passModel.channel_applys[0] = this.channel_apply

          this.$refs['updateForm'].validate((valid) => {
            if (!valid) {
              this.$Message.error('请完善表单!');
              setTimeout(() => {
                this.PFlag = !this.PFlag
              }, 500)
              return
            }

            let _url = `/${this.url}/update/${this.passModel.channel_applys[0].id}`
            this.$http.post(_url, this.passModel.channel_applys[0])
              .then(res => {
                res = res.data
                if (parseInt(res.code) === 2003) {
                  this.$Message.success(res.msg);
                  this._getData()
                }
              }, err => {
                this.$Message.error('修改失败');
              })
          })
        },
        showContent(key){
            this.contentIndex = key
        },
        hiddenContent(){
            this.contentIndex = null
        },
        _pass(item){
          this.PFlag = !this.PFlag
          this.passModel = this.$lodash.cloneDeep(item)
          this.channel_apply = this.$lodash.cloneDeep(item.channel_applys[0])
        },
        _rej(id){
          this.$http
            .get(`/${this.url}/rej/${id}`)
            .then(res=>{
              if(parseInt(res.data.code) === 200){
                this.$Message.success(res.data.msg);
                this._getData()
              }else{
                this.$Message.error('失败');
              }
            })
        },
        _getData(){
          this.$http
            .get(`/${this.url}/page/${this.page}/${this.pageSize}`)
            .then( res => {
              res = res.data.data
              this.$nextTick(()=>{
                this.$Message.info(`有${res.total}条数据`);
                this.setTotal(res.total)
                this.setDataArr(res.data)
                this.tongxin = res.tongxin
                this.jihua = res.jihua
                this.daikuan = res.daikuan
                this.dataCount = this.dataArr.length
                this.loading = false
              }, err=>{
              })
            })
        }
    },
    components:{
        Loading, Split, ShowDetail
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-chan
    .vchan-empty
      width 100%
      margin 0 auto
      .no-verify
        display block
        margin-top 100px
        font-size:36px
        font-weight:700
    .vchan-wrapper
      width 70%
      min-width 800px
      min-height 184px
      border 1px solid rgba(7,17,27,0.2)
      border-radius 5px
      .title
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        width 100%
        min-height 47px
        .left-title
          flex 0 0 300px
          margin-left -55px
          font-weight: 700
        .right-title
          flex 0 0 150px
      .content
        display flex
        width 100%
        height 100%
        flex-direction column
        justify-content space-around
        padding 10px 10px
        .list-item
          display flex
          flex-direction row
          margin 10px 0
          padding 10px 0
          min-height 77px
          .item-left
            flex 1
            display flex
            .avatar
              flex 0 0 150px
              display block
              vertical-align top
              width 64px
              height 64px
              cursor pointer
            .info1, .info2
              flex 0 0 300px
              display flex
              flex-direction column
              justify-content space-around
              align-items flex-start
              font-size 14px
              line-height 24px
              .icon
                display inline-block
                width 20px
              .name
                font-weight 700
            .info2
              flex 0 0 300px
            .info-more
              cursor: pointer;
          .verify
            flex 0 0 160px
            width 105px
            margin-top 10px
        .control-item
          display flex
          width 400px
          margin 5px auto
          color rgba(7,17,27,0.2)
          cursor pointer
          font-size 14px
          font-weight:700
        .slide-fade-enter-active
          transition: opacity .5s
        .slide-fade-leave-active
          transition: all .4s ease;
        .slide-fade-enter, .slide-fade-leave-to
          /* .slide-fade-leave-active for below version 2.1.8 */
          opacity: 0;
  .show-man-detail
      .name
        font-weight:700
        .icon
          display inline-block
          width 20px
          margin-right 20px
      .icon
        display inline-block
        width 20px
        margin-right 20px


</style>
