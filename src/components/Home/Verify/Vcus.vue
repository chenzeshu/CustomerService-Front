<template>
    <div class="v-cus">
      <!--wrapper-->
      <div class="vcus-empty" v-if="total === 0">
        <span class="no-verify">暂时没有新申请</span>
      </div>
      <div class="vcus-wrapper" v-else>
        <!--title-->
        <div class="title">
            <div class="left-title">
                待审核人员({{total}})
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
                  <img src="/static/avatar.png" alt="" width="64" height="64" v-if="item.avatar === null">
                  <img :src="item.avatar" alt="" width="64" height="64" v-else>
                </div>
                <div class="info1">
                  <span class="name">姓名:{{ item.name }}</span>
                  <span>联系方式:{{ item.phone }}</span>
                </div>
                <div class="info2" v-if="item.company">
                  <span>填写公司:
                    <span>{{ item.company }}</span>
                  </span>
                  <span>邮箱:
                    <span v-if="item.email !== null">{{ item.email }}</span>
                    <span v-else>未填写</span>
                  </span>
                </div>
              </div>

              <div class="verify">
                <i-button type="primary" size="large" @click="_togglePass(key)">通过审核</i-button>
                <i-button type="error" size="large" @click="_toggleRej(key)">拒绝</i-button>
              </div>

            </div>
            <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
          </div>
        </div>
      </div>

      <!--update-->
      <Modal
        v-model="PFlag"
        title="补充并通过审核"
        width="400"
        @on-ok="passUpdate">
        <!--@on-cancel="cancel"-->
        <Form :model="passModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <NewSearchCompany @on-select="selectCompanyForReg"></NewSearchCompany>
        </Form>
      </Modal>

      <!--rej-->
      <Modal
        v-model="RFlag"
        title="拒绝"
        width="400"
        @on-ok="rej">
        <!--@on-cancel="cancel"-->
        <Form :model="rejModel" :label-width="80">
          <FormItem label="拒绝原因" v-if="rejModel">
            <CheckboxGroup v-model="rejModel.reason">
              <Checkbox v-for="item in reasons" :label="item.reason" :key="item.id">
                <span>{{item.reason}}</span>
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
  import Split from 'base/Split/Split'
  import {curdMixin} from 'common/js/mixin'
  import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'

  export default {
        mixins:[curdMixin],
        data(){
          return {
              url:"employees",
              dataCount : null,
              PFlag:false,
              RFlag:false,
              passModel:{},
              ruleValidate:{
                  company: [
                    {required : true}
                  ]
              },
              rejModel:{
                  reason:[]
              },
              reasons:[
                {id:1,reason:"无法联系的手机号码"},
                {id:2,reason:"无法找到关联公司"},
                {id:3,reason:"恶意注册"}
              ]
          }
        },
        created(){
          this._getData()
        },
        methods:{
          _toggleRej(index){
            this.RFlag = !this.RFlag
            this.rejModel.id = this.dataArr[index].id
          },
          _togglePass(index){
              this.PFlag = !this.PFlag
              this.passModel.id = this.dataArr[index].id
              this.passModel.name = this.dataArr[index].name
              this.passModel.phone = this.dataArr[index].phone
              this.passModel.openid = this.dataArr[index].openid
              this.passModel.avatar = this.dataArr[index].avatar
          },
          rej(){
            this.$http
              .post(`/${this.url}/rej/${this.rejModel.id}`, this.rejModel)
              .then(res=>{
                if(parseInt(res.data.code) === 200){
                  this.$Message.success(res.data.msg);
                  this._getData()
                }else{
                  this.$Message.error('失败');
                }
                this.rejModel = {}
              })
          },
          passUpdate(){
                this.$http
                  .post(`/${this.url}/pass/${this.passModel.id}`, this.passModel)
                  .then(res=>{
                      if(parseInt(res.data.code) === 200){
                        this.$Message.success(res.data.msg);
                        this._getData()
                      }else{
                        this.$Message.error('失败');
                      }
                      this.passModel = {}
                })
          },
          selectCompanyForReg(v){
                this.passModel.company_id = v
          },
          _getData(){
            this.$http
              .get(`/${this.url}/verify`)
              .then( res => {
                res = res.data.data
                this.$nextTick(()=>{
                  this.$Message.info(`有${res.total}条数据`);
                  this.setTotal(res.total)
                  this.setDataArr(res.data)
                  this.dataCount = this.dataArr.length
                  this.loading = false
                }, err=>{
                })
              })
          }
        },
        components:{
            Split, NewSearchCompany
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-cus
    .vcus-empty
      width 100%
      margin 0 auto
      .no-verify
        display block
        margin-top 100px
        font-size:36px
        font-weight:700
    .vcus-wrapper
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
           flex 0 0 150px
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
            .info1, .info2
              flex 0 0 240px
              display flex
              flex-direction column
              justify-content space-around
              align-items flex-start
              font-size 14px
              .name
                font-weight 700
            .info2
              flex 0 0 300px
          .verify
            flex 0 0 160px
            width 105px
            margin-top 10px
</style>
