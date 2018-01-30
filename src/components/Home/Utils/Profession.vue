<template>
  <div class="profession">
    <div class="profession-plus" @click="_toggleCreate">
      <Icon type="plus-circled"></Icon>
    </div>

    <div class="profession-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
      <input type="text" v-model.trim="searchWord" placeholder="行业名称" class="search">
    </div>

    <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length"></i-table>

    <div class="page-wrapper">
      <div class="page">
        <Page :current="page" :total="total" simple @on-change="onChange"></Page>
      </div>
    </div>

    <Loading :loading="loading"></Loading>

    <!--create-->
    <Modal
      v-model="createFlag"
      title="创建"
      width="400"
      @on-ok="_create">
      <!--@on-cancel="cancel"-->
      <Form :model="createModel" :rules="ruleValidate" ref="createForm" :label-width="80">
        <FormItem label="行业名称" prop="name">
          <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!--update-->
    <Modal
      v-model="updateFlag"
      title="修改"
      width="400"
      @on-ok="update">
      <!--@on-cancel="cancel"-->
      <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
        <FormItem label="行业名称" prop="name">
          <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!--delete-->
    <Modal
      v-model="deleteFlag"
      title="删除"
      @on-ok="_delete">
      <p>确定要删除该行业?</p>
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
        url:"pros",
        columns:[
          {
            title: `　行业id`,
            key: 'id',
            width: 200,
            fixed: 'left'
          },
          {
            title: `　`,
            key: 'name',
            width: cellWidth,
            fixed: 'left'
          },
          {
            title:"操作",
            align: "center",
            width: 250,
            fixed:'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this._toggleUpdate(params.index)
                    }
                  }
                }, '编辑'),
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
            {required: true, message: '行业名称不能为空', trigger: 'blur' }
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
        this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
          .then(res=>{
            res = res.data.data
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
  .profession
    width 100%
    .page-wrapper
      margin 10px auto
    .profession-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .profession-search
      position absolute
      top 117px
      left 250px
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
