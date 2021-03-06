<template>
    <div class="customer" ref="customer">
      <div class="customer-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="customer-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model="cusSearch" placeholder="单位名称" class="search">
      </div>

      <Table border :columns="columns" :data="companies" :width="curWidth"></Table>

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
          <FormItem label="单位名称">
            <Input v-model="createModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="是否签约">
            <RadioGroup v-model="createModel.type" type="button">
              <Radio label="未签约"></Radio>
              <Radio label="已签约"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属行业">
            <Select v-model="createModel.profession" placeholder="请选择">
              <Option :value="pro.name" v-for="(pro, pk) in professions" :key="pk">{{pro.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位地址">
            <Input v-model="createModel.address" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--update-->
      <Modal
        v-model="updateFlag"
        title="编辑单位"
        width="400"
        @on-ok="update">
        <!--@on-cancel="cancel"-->
        <Form :model="updateModel" :label-width="80">
          <FormItem label="单位名称">
            <Input v-model="updateModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="是否签约">
            <RadioGroup v-model="updateModel.type" type="button">
              <Radio label="未签约"></Radio>
              <Radio label="已签约"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属行业">
            <Select v-model="updateModel.profession" placeholder="请选择">
              <Option :value="pro.name" v-for="(pro, pk) in professions" :key="pk">{{pro.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位地址">
            <Input v-model="updateModel.address" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除单位?</p>
      </Modal>

    </div>
</template>

<script>
  import {debounce,interval} from 'common/js/utils'
  import Loading from 'base/Loading/Loading'

  export default {
    data () {
      return {
        cusSearch:null,
        loading:true,  //等待遮罩层的开关
        page:1,  //当前页码
        pageSize:10, //单页数目
        total:100,   //数组总数
        columns: [
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
            title: '地址',
            key: 'address',
            width: 400
          },
          {
            title: '行业',
            key: 'profession',
            width: 100
          },
          {
            title: '签约类型',
            key: 'type',
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
        companies:[],
        professions:[],
        createFlag:false,
        createModel:{
            name:null,
            address:null,
            profession:null,
            type:null,
        },
        updateFlag:false,
        updateModel:{
            name:null,
            address:null,
            profession:null,
            type:null,
        },
        updateIndex:null,
        deleteFlag:false,
        deleteIndex:null
      }
    },
    mounted(){
      this._getCompanies()
      this._search()
    },
    watch:{
      companies(newCompanies){
          if(newCompanies){
            if(!newCompanies.length){
              this._setLoading()
            }
          }
      },
    },
    computed:{
      curWidth(){
          let w = document.documentElement.clientWidth
          return w >1200 ? 1103: 800
      },
    },
    methods:{
        onChange(curPage){
          this._setLoading()
          let _url = `/company/page/${curPage}/${this.pageSize}`
          this.$http
            .get(_url)
            .then(res=>{
              res = res.data.data
              this.total = res.total  //数组总数
              this.companies = res.data
              this.loading = false
            })
        },
        _toggleCreate(){
            this.createFlag = ! this.createFlag
        },
        _create(){
            let _url =  `${url.url}/company/`
            this.$http.post(_url, this.createModel).then(res=>{
                this.createModel = {}
                res = res.data
                if(parseInt(res.code) === 2002){
                    this.$Message.success(res.msg);
                }
            })
        },
        _toggleUpdate(index){
            this.updateFlag = !this.updateFlag
            this.index = index
            this.updateModel = Object.assign({}, this.companies[index])
        },
        update(){
          let _url =  `/company/update/${this.updateModel.id}`
          this.$http.post(_url, this.updateModel).then(res=>{
            res = res.data
            if(parseInt(res.code) === 2003){
              //由于vue无法监听数组dom更新, 所以需要使用变异方法
              //删除数组中index元素, 然后重新插入
              this.companies.splice(this.index, 1, this.updateModel)
              this.$Message.success(res.msg);
            }
          }, err=>{
            this.$Message.error('删除失败');
          })
        },
        _toggleDelete(index){
            this.deleteFlag = !this.deleteFlag
            this.deleteIndex = index
        },
        _delete(){
          let _url =  `/company/delete/${this.companies[this.deleteIndex].id}`
          this.$http.get(_url).then(res=>{
            res = res.data
            if(parseInt(res.code) === 2004) {
              this.$Message.success('删除成功');
              this.companies.splice(this.deleteIndex, 1)
            }
          }, err=>{
            this.$Message.error('删除失败');
          })
        },
        _search(){
          this.$watch('cusSearch', debounce((newS) => {
              if(this.cusSearch === ""){
                return
              }
              this._setLoading()

              this.$http
                .get(`/company/s/${newS}/${this.page}/${this.pageSize}`)
                .then(res=>{
                    res = res.data.data
                    this.total = res.total
                    this.companies = res.data
                    this.loading = false
                })
            }, 1000)
          )
        },
        _setLoading(){
          this.loading = !this.loading
        },
        _getCompanies(){
            let _url = `/company/page/${this.page}/${this.pageSize}`
            this.$http.get(_url).then(res=>{
               if(parseInt(res.data.code) === 2000){
                 res = res.data.data
                  this.$nextTick(()=>{
                    this.total = res.total
                    this.professions = res.pros
                    this.companies = res.data
                    this.loading = false
                  })
               }
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
  .customer
    width 100%
    .page-wrapper
      margin 10px auto
    .customer-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .customer-search
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
