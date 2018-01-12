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
            <div class="middle-title">
              <Button class="select-button" @click="setStatus('待审核')" :type="type1">申请审核</Button>
              <Button class="select-button" @click="setStatus('申请完成')" :type="type2">申请完成</Button>
              <Button class="select-button" @click="setStatus('申述中')" :type="type3">用户申述</Button>
            </div>
            <div class="right-title">
              <a href="#" style="color:#2d8cf0" @click.prevent="_getData">
                <Icon type="ios-loop-strong"></Icon>
                Refresh
              </a>
            </div>
        </div>

        <Split type="zhong"></Split>
        <!--申请审核-->
        <div class="content" v-if="status === '待审核'">
          <div class="list-item-wrapper" v-for="(item, key) in this.dataArr">
            <div class="list-item">
              <div class="item-left">
                <div class="avatar">
                  <img src="/static/avatar.png" alt="" width="64" height="64" style="cursor: pointer"
                       @mouseover="showManDetail(key, $event)"
                       @mouseleave="closeDetail">
                  <br>
                  <br>
                  <p class="name1">提交人：{{ item.refer_man[0].name }}</p>
                  <p class="name2">{{ item.updated_at.substr(0, 10) }}</p>
                  <p class="name2">{{ item.updated_at.substr(11) }}</p>
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

        <lazy-component>
          <!--申请完成-->
          <div class="content"  v-if="status === '申请完成'">
            <div class="list-item-wrapper" v-for="(item, key) in this.dataArr">
              <div class="list-item">
                <div class="item-left">
                  <div class="avatar">
                    <img src="/static/avatar.png" alt="" width="64" height="64" style="cursor: pointer"
                         @mouseover="showManDetail(key, $event)"
                         @mouseleave="closeDetail">
                    <br>
                    <br>
                    <p class="name1">提交员工：<span v-for="workman in item.workman">[{{workman.name}}] </span></p>
                    <p class="name2">{{ item.updated_at.substr(0, 10) }}</p>
                    <p class="name2">{{ item.updated_at.substr(11) }}</p>
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
                  <div class="info2">

                  </div>
                </div>

                <div class="verify">
                  <i-button type="default" size="large" @click="_toggleDesc(key)">查看描述</i-button>
                  <i-button type="primary" size="large" @click="_passAsk(item.id)">通过审核</i-button>
                  <i-button type="error" size="large" @click="_rejAsk(item.id)">拒绝</i-button>
                </div>
              </div>
              <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
            </div>
          </div>

          <!--申述-->
          <div class="content"  v-if="status === '申述中'">
            <div class="list-item-wrapper" v-for="(item, key) in this.dataArr">
              <div class="list-item">
                <div class="item-left">
                  <div class="avatar">
                    <img src="/static/avatar.png" alt="" width="64" height="64" style="cursor: pointer"
                         @mouseover="showManDetail(key, $event)"
                         @mouseleave="closeDetail">
                    <br>
                    <br>
                    <p class="name1">申述人：[{{item.customer[0].name}}]</p>
                    <p class="name2">{{ item.updated_at.substr(0, 10) }}</p>
                    <p class="name2">{{ item.updated_at.substr(11) }}</p>
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
                  <div class="info2">

                  </div>
                </div>

                <div class="verify">
                  <i-button type="default" size="large" @click="_toggleAllege(key)">申述详情</i-button>
                  <i-button type="primary" size="large" @click="_passAsk(item.id)">想好</i-button>
                  <i-button type="error" size="large" @click="_rejAsk(item.id)">怎么处理</i-button>
                </div>
              </div>
              <Split type="xi" v-show="key !== dataArr.length - 1"></Split>
            </div>
          </div>
        </lazy-component>
      </div>

      <Loading :loading="loading"></Loading>

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

      <!--显示申请完成详情-->
      <Modal
        v-model="descFlag"
        width="400"
        height="400"
      >
        <h2 style="font-size: 18px;font-weight: 700;height: 36px;line-height: 36px;">服务问题描述</h2>
        <p style="font-size:16px;font-weight:500;line-height:36px;">{{desc1}}</p>
        <Split type="xi"></Split>
        <h2 style="font-size: 18px;font-weight: 700;height: 36px;line-height: 36px;">服务处理描述</h2>
        <p style="font-size:16px;font-weight:500;line-height:36px;">{{desc2}}</p>
        <Split type="xi"></Split>
        <br>
        <i-button type="primary" size="large" @click="_toggleImg(imgUrl)" v-if="imgUrl">展示图片</i-button>
        <i-button type="default" size="large" v-else>没有附件</i-button>
      </Modal>

      <!--申述中详情-->
      <Modal
        v-model="allegeFlag"
        width="400"
        height="400"
      >
        <h2 style="font-size: 18px;font-weight: 700;height: 36px;line-height: 36px;">申述详情</h2>
        <p style="font-size:16px;font-weight:500;line-height:36px;">{{allege}}</p>

      </Modal>

      <!--展示附件图片-->
      <Modal
        v-model="imgFlag"
        width="600"
        height="600"
      >
        <img :src="imgUrl" alt="">
      </Modal>
    </div>
</template>

<script>
  import Split from 'base/Split/Split'
  import {curdMixin} from 'common/js/mixin'
  import ShowDetail from 'base/Show/ShowDetail'
  import Loading from 'base/Loading/Loading'
  import Url from 'common/js/url'
  export default {
        mixins:[curdMixin],
        data(){
          return {
              url:"services",
              total:0,
              dataCount : null,
              curDetail:{
                name:null,
                phone:null,
                email:null,
                company:{}
              },
            status:"待审核",
            type1:'primary',
            type2:null,
            type3:null,
            //申请完成的图片
            descFlag:false,
            imgFlag: false,
            allegeFlag:false,
            imgUrl:"",
            desc1:"",
            desc2:"",
            allege:""
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
          _toggleAllege(index){
            this.allegeFlag = !this.allegeFlag
            this.allege = this.dataArr[index].allege
          },
          _toggleDesc(index){
            this.descFlag = !this.descFlag
            this.desc1 = this.dataArr[index].desc1
            this.desc2 = this.dataArr[index].desc2
            this.imgUrl = this.dataArr[index].img && this.dataArr[index].img.path.replace('public', Url.storage)
          },
          _toggleImg(){
              this.imgFlag = !this.imgFlag
          },
          _passAsk(id){
            this.$http
              .get(`/${this.url}/passFinish/${id}`)
              .then(res=>{
                if(parseInt(res.data.code) === 7006){
                  this.$Message.success(res.data.msg);
                  this._getData()
                }else{
                  this.$Message.error('失败');
                }
              })
          },
          _rejAsk(id){
            this.$http
              .get(`/${this.url}/rejectFinish/${id}`)
              .then(res=>{
                if(parseInt(res.data.code) === -7006){
                  this.$Message.success(res.data.msg);
                  this._getData()
                }else{
                  this.$Message.error('失败');
                }
              })
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
          setStatus(status){
            this.status = status
            this.type1 = this.type2 = this.type3 = null
            switch (status){
              case "待审核":
                this.type1 = "primary"
                  break
              case "申请完成":
                this.type2 = "primary"
                break
              case "申述中":
                this.type3 = "primary"
                break
            }
            this._getData()
          },
          _getData(){
            this._setLoading()
            this.$http
              .get(`/${this.url}/verify/${this.status}`)
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
            Split, ShowDetail, Loading
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
        .middle-title
           .select-button
             margin-left 50px
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
                font-weight 500
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
            flex 0 0 260px
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
