<template>
    <div class="employee">
      <div class="employee-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="employee-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model="searchWord" placeholder="人员名称" class="search">
      </div>

      <Table border :columns="columns" :data="dataArr" :width="curWidth"></Table>

      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <Loading :loading="loading"></Loading>

      <!--create-->
      <Modal
        v-model="createFlag"
        title="创建单位"
        width="400"
        @on-ok="_create">
        <!--@on-cancel="cancel"-->
        <Form :model="createModel" :label-width="80">
          <FormItem label="人员名称">
            <Input v-model="createModel.name" placeholder="输入公司名后, 下方会显示公司列表"></Input>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="createModel.status" type="button">
              <Radio label="offline"></Radio>
              <Radio label="online"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属公司">
            <Input v-model="companyWord" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="公司列表" v-if="!companies.length && companyWord !==null">
            <h3 :class="{'no-result':sTotal===0, 'waiting' : sTotal !==0}">{{ companySearchResult }}</h3>
          </FormItem>
          <FormItem label="公司列表" v-if="companies.length && companyWord !== null">
            <Select v-model="createModel.company" placeholder="请选择公司">
              <Option :value="cv.name" v-for="(cv, ck) in companies" :key="ck">{{cv.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系手机">
            <Input v-model="createModel.phone" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="邮箱地址">
            <Input v-model="createModel.email" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
    import {curdMixin, pageMixin} from 'common/js/mixin'
    import {debounce} from 'common/js/utils'
    import Loading from 'base/Loading/Loading'

    export default {
      mixins:[curdMixin, pageMixin],
      data(){
          return {
              companySearchResult:"检索中......",
              sTotal:null,
              url:'employees',
              dataArr:[],
              columns:[
                {
                  title: ' ',
                  key: 'id',
                  width: 100,
                  fixed: 'left'
                },
                {
                  title: ' ',
                  key: 'name',
                  width: 200,
                  fixed:'left'
                },
                {
                  title: '所属公司',
                  width: 300,
                  render: (h, params) => {
                      return `${this.dataArr[params.index].company.name}`
                  }
                },
                {
                  title: '手机',
                  key: 'phone',
                  width: 100
                },
                {
                  title: '邮箱',
                  key: 'email',
                  width: 100
                },
                {
                  title: '状态',
                  key: 'status',
                  width: 100
                },
                {
                  title: '审核时间',
                  key: 'changed_at',
                  width: 100
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
              companyWord:null,
              companies:[],
              createModel:{
                  name:null,
                  company:null,
                  email:null,
                  phone:null,
                status:null
              },
              updateModel:{
                name:null,
                company:null,
                email:null,
                phone:null,
                status:null
              },
          }
      },
      mounted(){
          this._getEmp()
          this._searchCompany()
      },
      methods:{
        _getEmp(){
            this.$http
                .get(`/${this.url}/page/${this.page}/${this.pageSize}`)
                .then( res => {
                        res = res.data.data
                        console.log(res.data)
                        this.dataArr = res.data
                        this.total = res.total
                        this._setLoading()
                })
        },
        _searchCompany(){
          this.$watch('companyWord', debounce((newC)=>{
            if(!this.companyWord){
              this.companies = []
              this.companyWord = null
              return
            }

            //todo 情况列表, 触发`等待中`提示语显示
            this.companies = []

            this.$http
              .get(`/${this.url}/sc/${newC}`)
              .then(res=>{
                res = res.data.data
                this.$Message.info({
                  content:`共检索到${parseInt(res.sTotal)}个相似公司, 仅展示最前10个数据`,
                  duration:3
                })
                this.companySearchResult = res.sTotal === 0 ? `暂无数据, 请重新搜索` : `检索中......`
                this.companies = res.data
              })
          }, 1000))
        }
      },
      components:{
          Loading
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .employee
    width 100%
    .no-result
      color #ff9900!important
    .waiting
      color #ed3f14!important
    .page-wrapper
      margin 10px auto
    .employee-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .employee-search
      position absolute
      top 117px
      left 140px
      z-index 50
      .search-icon
        display inline-block
        padding-bottom 5px
        color #39f
        font-size 16px
        line-height: 12px;
        vertical-align: middle
      .search
        display: inline-block;
        height: 20px;
        width: 8vw
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
