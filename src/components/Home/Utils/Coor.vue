<template>
    <div class="coor">
      <div class="coor-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="coor-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="外协单位" class="search">
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
          <FormItem label="单位名称" prop="name">
            <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model.trim="createModel.address" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系方式" prop="phone">
            <Input v-model.trim="createModel.phone" placeholder="请输入"></Input>
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
          <FormItem label="单位名称" prop="name">
            <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model.trim="updateModel.address" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系方式" prop="phone">
            <Input v-model.trim="updateModel.phone" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除该外协单位?</p>
      </Modal>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import Loading from 'base/Loading/Loading'
    import {curdMixin, pageMixin} from 'common/js/mixin'

    export default {
      mixins:[curdMixin, pageMixin],
      data(){
        return {
            url:"coors",
            columns:[
              {
                title: `　单位id`,
                key: 'id',
                width: 100,
                fixed: 'left'
              },
              {
                title: `　`,
                key: 'name',
                width: 250,
                fixed: 'left'
              },
              {
                title: `地址`,
                key: 'address',
                width: 350,
                fixed: 'left'
              },
              {
                title: `联系方式`,
                key: 'phone',
                width: 200,
                fixed: 'left'
              },
              {
                title:"操作",
                align: "center",
                width: 200,
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
              name:null,
              address:null,
              phone:null
            },
            updateModel:{
              name:null,
              address:null,
              phone:null
            },
            ruleValidate:{
              name: [
                {required: true, message: '外协单位名称不能为空', trigger: 'blur' }
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
  .coor
    width 100%
    .page-wrapper
      margin 10px auto
    .coor-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .coor-search
      position absolute
      top 117px
      left 160px
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
