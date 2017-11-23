<template>
    <div class="v-chan">

      <!--wrapper-->
      <div class="vchan-empty" v-if="total === 0">
        <span class="no-verify">暂时没有新申请</span>
      </div>
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
        <!--content-->
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
                  <span>所属合同:{{ item.contractc.name }}</span>
                  <span>所选套餐:{{ item.plans[0].name }}</span>
                  <span><div class="icon">
                    <Icon type="clock"></Icon>
                  </div>开始时间:{{ item.channel_applys[0].t1 }}</span>
                </div>
                <div class="info2">
                  <span>通信卫星: <span v-if="item.tongxin[0]">{{ item.tongxin[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>极化: <span v-if="item.jihua[0]">{{ item.jihua[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>频率: <span v-if="item.pinlv[0]">{{ item.pinlv[0].name }}</span> <span style="color:red" v-else>未选择</span></span>
                  <span>类型:{{ item.type }}</span>
                  <span><div class="icon">
                    <Icon type="clock"></Icon>
                  </div>结束时间:{{ item.channel_applys[0].t2 }}</span>
                </div>
              </div>

              <div class="verify">
                <i-button type="primary" size="large" @click="_pass(item)">过审</i-button>
                <i-button type="error" size="large" @click="_rej(item.id)">拒绝</i-button>
              </div>

            </div>
            <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
          </div>
        </div>
      </div>

      <div class="show-man-detail" v-show="DFlag && curDetail" ref="showWrapper">
          <span class="name">
                <div class="icon">
                  <Icon type="person"></Icon>
                </div>
            姓名: {{ curDetail.name }}</span>
          <span><div class="icon">
                  <Icon type="home"></Icon>
                </div>
            公司: <span>{{ curDetail.company.name }}</span></span>
          <span><div class="icon">
                  <Icon type="iphone"></Icon>
                </div>
            手机: <span>{{ curDetail.phone }}</span></span>
          <span><div class="icon">
                  <Icon type="email"></Icon>
                </div>
            邮箱: <span>{{ curDetail.email }}</span> </span>
      </div>

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
        title="补充并过审"
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
          <FormItem label="频率" prop="id4">
            <RadioGroup v-model="channel_apply.id4" type="button">
              <Radio :label="t.id" v-for="(t, tk) in pinlv" :key="tk">{{t.name}}</Radio>
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
  export default {
    mixins:[curdMixin, pageMixin],
    data () {
      return {
          url:'apply',
          total:0,
          dataCount : null,
          DFlag:false,
          PFlag:false,
          tongxin:[],
          pinlv:[],
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
          updateModel:{ //用于给后台
                channel_applys:[]
          },
          ruleValidate:{
                id2:[{type:'number', required: true, message: '选择通信卫星', trigger: 'blur' }],
                id3:[{type:'number', required: true, message: '选择极化', trigger: 'blur' }],
                id4:[{type:'number', required: true, message: '选择频率', trigger: 'blur' }],
          }
      }
    },
    created(){
      this._getData()
    },
    methods: {
        showManDetail(key, e){
            this.DFlag = true
            let emp = this.dataArr[key].employee
            this.curDetail = Object.assign({}, emp)
            //获得焦点的坐标
            let rect = e.target.getBoundingClientRect()
            let x = rect.left + 64
            let y = rect.top + 32
            this.$refs.showWrapper.style.position = "fixed"
            this.$refs.showWrapper.style.top = `${y}px`
            this.$refs.showWrapper.style.left = `${x}px`
        },
        closeDetail(){
          this.DFlag = false
        },
        _pass(item){
            this.PFlag = !this.PFlag
            this.updateModel = Object.assign({}, item)
            this.channel_apply = Object.assign({}, item.channel_applys[0])
        },
        passUpdate(){
            this.updateModel.channel_applys[0] = this.channel_apply
            console.log(this.updateModel)

          this.$refs['updateForm'].validate((valid) => {
            if (!valid) {
              this.$Message.error('请完善表单!');
              setTimeout(() => {
                this.PFlag = !this.PFlag
              }, 500)
              return
            }

            let _url = `/${this.url}/update/${this.updateModel.channel_applys[0].id}`
            this.$http.post(_url, this.updateModel.channel_applys[0])
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
                this.total = res.total
                this.setDataArr(res.data)
                this.tongxin = res.tongxin
                this.jihua = res.jihua
                this.pinlv = res.pinlv
                this.dataCount = this.dataArr.length
                this.loading = false
              }, err=>{
              })
            })
        }
    },
    components:{
        Loading, Split
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
          .verify
            flex 0 0 160px
            width 105px
            margin-top 10px
    .show-man-detail
      display flex
      flex-direction column
      justify-content space-around
      align-items flex-start
      width 340px
      height 140px
      padding 4px 20px
      border 1px solid rgba(7,17,27,0.2)
      border-radius 5px
      box-shadow 2px 2px 2px rgb(7,17,27)
      background #fff
      font-size 14px
      z-index 100
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
