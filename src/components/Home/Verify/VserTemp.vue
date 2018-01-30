<template>
    <div class="v-ser">
        <!--wrapper-->
      <div class="vser-empty" v-if="total === 0">
        <span class="no-verify">{{ serverRes}}</span>
      </div>
      <div class="vser-wrapper" v-else>
        <!--title-->
        <div class="title">
            <div class="left-title">
                待审核[临时]服务单({{total}})
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
                  <img src="/static/avatar.png" alt="" width="64" height="64" style="cursor: pointer"
                       @mouseover="showManDetail(key, $event)"
                       @mouseleave="closeDetail">
                  <p class="name1">提交人</p>
                  <p class="name2">{{ item.refer_man[0].name }}</p>
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
                    所属合同: {{ item.contract && item.contract.name }}</span>
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
                <i-button type="primary" size="large" @click="_pass(item.id)">通过审核</i-button>
                <i-button type="error" size="large" @click="_rej(item.id)">拒绝</i-button>
              </div>
            </div>
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
    </div>
</template>

<script>
  import Split from 'base/Split/Split'
  import {curdMixin} from 'common/js/mixin'
  import ShowDetail from 'base/Show/ShowDetail'

  export default {
        mixins:[curdMixin],
        data(){
          return {
              url:"services",
              dataCount : null,
              serverRes: "",
              curDetail:{
                name:null,
                phone:null,
                email:null,
                company:{}
              },
          }
        },
        created(){
          this._getData()
        },
        methods:{
          showManDetail(key, e){
            let emp = this.dataArr[key].refer_man[0]
            this.curDetail = Object.assign({}, emp)
            //调用组件方法显示细节面板并改变位置
            this.$refs.showDetail.showManDetail(e)
          },
          closeDetail(){
            this.$refs.showDetail.closeDetail()
          },
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
              .get(`/${this.url}/temp/verify/`)
              .then( res => {
                res = res.data.data
                this.$nextTick(()=>{
                  if(parseInt(res.code) === -4001){
                    this.setTotal(0)
                    this.serverRes = "你没有权限"
                  }else if(parseInt(res.total) === 0){
                    this.setTotal(0)
                    this.serverRes = "暂时没有新申请"
                  }
                  else {
                    this.$Message.info(`有${res.total}条数据`);
                    this.setTotal(res.total)
                    this.setDataArr(res.data)
                    this.dataCount = this.dataArr.length
                    this.loading = false
                  }
                }, err=>{
                })
              })
          }
        },
        components:{
            Split, ShowDetail
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
           flex 0 0 220px
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
              .name1, .name2
                font-size:14px
                font-weight 700
              .name2
                margin-top 6px
            .info1, .info2
              flex 0 0 500px
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
