<template>
  <div class="problem-record">
    <!--<div class="problem-record-plus" @click="_toggleCreate">-->
      <!--<Icon type="plus-circled"></Icon>-->
    <!--</div>-->

    <div class="problem-record-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
      <input type="text" v-model.trim="searchWord" placeholder="故障描述" class="search">
    </div>

    <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length"></i-table>

    <div class="page-wrapper">
      <div class="page">
        <Page :current="page" :total="total" simple @on-change="onChange"></Page>
      </div>
    </div>

    <Loading :loading="loading"></Loading>

    <!--delete-->
    <Modal
      v-model="deleteFlag"
      title="删除"
      @on-ok="_delete">
      <p>确定要删除该报警记录?</p>
    </Modal>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import Loading from 'base/Loading/Loading'
  import {curdMixin, pageMixin} from 'common/js/mixin'

  let docWidth = document.documentElement.clientWidth
  let cellWidth = docWidth > 1200 ? 900 : 331

  export default {
    mixins:[curdMixin, pageMixin],
    data(){
      return {
        url:"precord",
        columns:[
          {
            title: `id`,
            key: 'precord_id',
            width: 80,
            fixed: 'left'
          },
          {
            title: `设备`,
            key: 'precord_type',
            width: 120,
            fixed: 'left',
            render: (h, params)=>{
              return this.dataArr[params.index].device && this.dataArr[params.index].device.device_id
            }
          },
          {
            title: `预警描述`,
            key: 'precord_desc',
            width: 500,
            render: (h, params)=>{
              return this.dataArr[params.index].problem && this.dataArr[params.index].problem.problem_desc
            }
          },
          {
            title: `解决办法`,
            key: 'precord_solution',
            width: 500,
            render: (h, params)=>{
              return this.dataArr[params.index].problem && this.dataArr[params.index].problem.problem_solution
            }
          },
          {
            title: `报警时间`,
            key: 'created_at',
            fixed: 'right',
            width: 120,
          },
          {
            title:"操作",
            align: "center",
            width: 120,
            fixed:'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this._toggleDelete(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        createModel:{
          name:null
        },
        updateModel:{
          name:null
        },
        ruleValidate:{
          name: [
            {required: true, message: '类型名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed:{

    },
    created(){
      this._getData()
    },
    methods:{
      _getData(){
        this._setLoading()
        this.$http
          .post(`/${this.url}/page/${this.page}/${this.pageSize}`)
          .then(res=>{
            res = res.data.data
            if(res.total === 0){
              this._setLoading()
              return
            }
            this.setTotal(res.total)
            this.setDataArr(res.data)
            this._setLoading()
          })
      },
    },
    components:{
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .problem-record
    width 100%
    .page-wrapper
      margin 10px auto
    .problem-record-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .problem-record-search
      position absolute
      top 68px
      left 350px
      z-index 40
      .search
        display: inline-block;
        height: 20px;
        width: 6vw
        border none
        border-bottom: 1px dotted rgba(0,0,0,.2);
        background #f5f7f9
        font-size 12px
        line-height: 24px;
        text-indent: 16px;
        outline: 0;
        &::placeholder
          font-size 12px
          font-weight 700
          color #657180
</style>
