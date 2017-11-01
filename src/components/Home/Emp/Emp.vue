<template>
    <div class="employee">
      <div class="employee-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="employee-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="人员名称" class="search">
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
          <FormItem label="人员名称" prop="name">
            <Input v-model.trim="createModel.name" placeholder="人员名称"></Input>
          </FormItem>
          <FormItem label="状态" prop="status">
            <RadioGroup v-model="createModel.status" type="button">
              <Radio label="offline"></Radio>
              <Radio label="online"></Radio>
            </RadioGroup>
          </FormItem>
          <NewSearchCompany @on-select="selectCompanyIdForC"></NewSearchCompany>
          <FormItem label="openid" prop="openid">
            <Input v-model.trim="createModel.openid" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系手机" prop="phone">
            <Input v-model.trim="createModel.phone" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="邮箱地址" prop="email">
            <Input v-model.trim="createModel.email" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--update-->
      <Modal
        v-model="updateFlag"
        title="编辑"
        width="400"
        @on-ok="update">
        <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <FormItem label="人员名称" prop="name">
            <Input v-model.trim="updateModel.name" placeholder="输入公司名后, 下方会显示公司列表"></Input>
          </FormItem>
          <FormItem label="状态" prop="status">
            <RadioGroup v-model.trim="updateModel.status" type="button">
              <Radio label="offline"></Radio>
              <Radio label="online"></Radio>
            </RadioGroup>
          </FormItem>
          <NewSearchCompany @on-select="selectCompanyIdForU"></NewSearchCompany>
          <FormItem label="openid" prop="openid">
            <Input v-model.trim="updateModel.openid" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系手机" prop="phone">
            <Input v-model.trim="updateModel.phone" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="邮箱地址" prop="email">
            <Input v-model.trim="updateModel.email" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model.trim="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除?</p>
      </Modal>
    </div>
</template>

<script>
    import Loading from 'base/Loading/Loading'
    import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
    import {curdMixin, pageMixin} from 'common/js/mixin'
    import Validator from 'common/js/validator'
    export default {
      mixins:[curdMixin, pageMixin],
      data(){
          return {
              url:'employees',
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
                  width: this.curWidth < 1200 ? 200 : 350,
                  render: (h, params) => {
                        if(this.dataArr[params.index].company){
                          return `${this.dataArr[params.index].company.name}`
                        }
                  }
                },
                {
                  title: '手机',
                  key: 'phone',
                  width: this.curWidth < 1200 ? 100 : 150,
                },
                {
                  title: '邮箱',
                  key: 'email',
                  width: this.curWidth < 1200 ? 100 : 150,
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
              createModel:{
                  name:null,
                  company_id:null,
                  email:null,
                  phone:null,
                  openid:null,
                  status:null
              },
              updateModel:{
                name:null,
                company_id:null,
                email:null,
                phone:null,
                openid:null,
                status:null
              },
              ruleValidate: {
                name: [
                  { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                status: [
                  { required: true, message: '请选择状态', trigger: 'blur' }
                ],
                company_id: [
                  { type:'number', required: true, message: '请选择公司', trigger: 'blur' }
                ],
                email: [
                  { required: true, message: '邮箱不能为空', trigger: 'blur' },
                  { validator: Validator.validateEmail, message: '邮箱格式不正确', trigger: 'change' }
                ],
                phone: [
                  { required: true, message: '必须填写手机号码', trigger: 'blur' },
                  { validator:Validator.validatePhone, trigger: 'change' }
                ],
                openid: [
                  { required: true, message: '请填写openid', trigger: 'blur' },
                ]
              },
            }
      },
      mounted(){
          this._getData()
      },
      methods:{
          selectCompanyIdForC(v){
            this.createModel.company_id = v
          },
          selectCompanyIdForU(v){
            this.updateModel.company_id = v
          },
          _getData(){
              this._setLoading()
              this.$http
                  .get(`/${this.url}/page/${this.page}/${this.pageSize}`)
                  .then( res => {
                      res = res.data.data
                      this.$nextTick(()=>{
                        this.total = res.total
                        this.setDataArr(res.data)
                        this.loading = false
                      })
                  })
          },
      },
      components:{
          Loading, NewSearchCompany
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .employee
    width 100%
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
