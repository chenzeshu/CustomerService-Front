<template>
    <div class="v-ser">
        <!--wrapper-->
      <div class="vser-empty" v-if="total === 0">
        <span class="no-verify">暂时没有新申请</span>
      </div>
      <div class="vser-wrapper" v-else>
        <!--title-->
        <div class="title">
            <div class="left-title">
                待审核服务单({{total}})
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
                  <img src="/static/avatar.png" alt="" width="64" height="64">
                </div>
                <div class="info1" v-if="item.customer[0]">
                  <span class="name" >客户联系人:{{ item.customer[0].name }}</span>
                  <span>
                    <div class="icon">
                      <Icon type="iphone"></Icon>
                    </div>
                    联系方式: {{ item.customer[0].phone }}</span>
                  <span>
                    <div class="icon">
                      <Icon type="android-document"></Icon>
                    </div>
                    所属合同: {{ item.contract.name }}</span>
                  <span>
                    <div class="icon">
                      <Icon type="man"></Icon>
                    </div>
                    项目经理: <span v-for="pm in item.project_manager">{{pm.name}}　</span></span>
                  <span v-if="item.source[0]">
                    <div class="icon">
                      <Icon type="location"></Icon>
                    </div>
                    来源:{{ item.source[0].name }}</span>
                  <span v-if="item.type[0]">
                    <div class="icon">
                      <Icon type="flag"></Icon>
                    </div>
                    类型:{{ item.type[0].name }}</span>
                </div>
              </div>
              <div class="info2">

              </div>
              <div class="verify">
                <i-button type="primary" size="large" @click="_pass(item.id)">过审</i-button>
                <i-button type="error" size="large" @click="_rej(item.id)">拒绝</i-button>
              </div>

            </div>
            <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import Split from 'base/Split/Split'
  import {curdMixin} from 'common/js/mixin'
  export default {
        mixins:[curdMixin],
        data(){
          return {
              url:"services",
              total:0,
              dataCount : null,
          }
        },
        created(){
          this._getData()
        },
        methods:{
          _pass(id){
              this.$http
                .get(`/${this.url}/pass/${id}`)
                .then(res=>{
                    if(parseInt(res.data.code) === 200){
                      this.$Message.success(res.data.msg);
                      this._getData()
                    }else{
                      this.$Message.error('失败');
                    }
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
              .get(`/${this.url}/verify`)
              .then( res => {
                res = res.data.data
                this.$nextTick(()=>{
                  this.$Message.info(`有${res.total}条数据`);
                  this.total = res.total
                  this.setDataArr(res.data)
                  this.dataCount = this.dataArr.length
                  this.loading = false
                }, err=>{
                })
              })
          }
        },
        components:{
            Split
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-ser
    .vser-empty
      width 100%
      margin 0 auto
      .no-verify
        display block
        margin-top 100px
        font-size:36px
        font-weight:700
    .vser-wrapper
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
          min-height 177px
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
              flex 0 0 400px
              display flex
              flex-direction column
              flex-wrap: wrap
              justify-content space-around
              align-items flex-start
              font-size 14px
              .name
                font-weight 700
              .icon
                display inline-block
                width 20px
            .info2
              flex 0 0 300px
          .verify
            flex 0 0 160px
            width 105px
            margin-top 10px
</style>
