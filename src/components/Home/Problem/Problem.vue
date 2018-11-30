<template>
  <div class="problem">
    <div class="problem-plus" @click="_toggleCreate">
      <Icon type="plus-circled"></Icon>
    </div>

    <div class="problem-search">
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

    <!--create-->
    <Modal
      v-model="createFlag"
      title="创建"
      width="400"
      @on-ok="_create">
      <!--@on-cancel="cancel"-->
      <Form :model="createModel" :rules="ruleValidate" ref="createForm" :label-width="80">
        <FormItem label="故障类型" prop="problem_type">
          <Select v-model.trim="createModel.problem_type">
            <Option v-for="(type, key) in types" :key="key" :value="type.ptype_id">{{type.ptype_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障进度" prop="problem_step">
          <Select v-model.trim="createModel.problem_step">
            <Option v-for="(step, key) in steps" :key="key" :value="step">{{step}}</Option>
          </Select>
        </FormItem>
        <FormItem label="紧急程度">
          <Select v-model.trim="createModel.problem_urgency">
            <Option v-for="urgency in urgencies" :key="urgency" :value="urgency">{{urgency}}</Option>
          </Select>
        </FormItem>
        <FormItem label="重要程度">
          <Select v-model.trim="createModel.problem_importance">
            <Option v-for="importance in importances" :key="importance" :value="importance">{{importance}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障描述" prop="problem_desc">
          <Input v-model.trim="createModel.problem_desc" placeholder="请输入" type="textarea"></Input>
        </FormItem>
        <FormItem label="解决方法" >
          <Input v-model.trim="createModel.problem_solution" placeholder="请输入" type="textarea"></Input>
        </FormItem>
        <FormItem label="备注" >
          <Input v-model.trim="createModel.problem_remark" placeholder="请输入" type="textarea"></Input>
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
        <FormItem label="故障类型" >
          <Select v-model.trim="updateModel.problem_type">
            <Option v-for="(type,key) in types" :key="key" :value="type.ptype_id">{{type.ptype_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="紧急程度" >
          <Select v-model.trim="updateModel.problem_urgency">
            <Option v-for="urgency in urgencies" :key="urgency" :value="urgency">{{urgency}}</Option>
          </Select>
        </FormItem>
        <FormItem label="重要程度" >
          <Select v-model.trim="updateModel.problem_importance">
            <Option v-for="importance in importances" :key="importance" :value="importance">{{importance}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障描述" >
          <Input v-model.trim="updateModel.problem_desc" placeholder="请输入" type="textarea"></Input>
        </FormItem>
        <FormItem label="解决方法" >
          <Input v-model.trim="updateModel.problem_solution" placeholder="请输入" type="textarea"></Input>
        </FormItem>
        <FormItem label="备注" >
          <Input v-model.trim="updateModel.problem_remark" placeholder="请输入" type="textarea"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!--delete-->
    <Modal
      v-model="deleteFlag"
      title="删除"
      @on-ok="_delete">
      <p>确定要删除该故障信息?</p>
    </Modal>
  </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import {curdMixin, pageMixin} from 'common/js/mixin'

  let docWidth = document.documentElement.clientWidth
  let cellWidth = docWidth > 1200 ? 900 : 331

  export default {
    mixins:[curdMixin, pageMixin],
    data(){
      return {
        types: [],
        steps: ['未解决', '运维解决中', '技术或厂商解决中', '专家解决中', '已解决'],
        urgencies: ['一般', '紧急', '非常紧急'],
        importances: ['一般', '重要', '非常重要'],
        url:"problems",
        columns:[
          {
            title: `　故障id`,
            key: 'problem_id',
            width: 100,
            fixed: 'left'
          },
          {
            title: `故障类型`,
            key: 'problem_type',
            width: 100,
            fixed: 'left',
            render: (h, params) => {
              return this.dataArr[params.index].problem_type && this.dataArr[params.index].problem_type.ptype_name
            }
          },
          {
            title: `故障描述`,
            key: 'problem_desc',
            width: 400,
          },
          {
            title: `解决办法`,
            key: 'problem_solution',
            width: 400,
          },
          {
            title: `紧急程度`,
            key: 'problem_urgency',
            width: 150,
          },
          {
            title: `重要程度`,
            key: 'problem_importance',
            width: 150,
          },
          {
            title: `对应服务单号`,
            key: '',
            width: 150,
            render: (h, params) => {
              return `这里还要做个ORM和null判断`
              // return this.dataArr[params.index].service_id && this.dataArr[params.index].problem_type.ptype_name
            }
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
          problem_type: null,
          problem_step: null,
          problem_desc:null,
          problem_solution:null,
          problem_urgency:"一般",
          problem_importance:"一般",
          problem_remark: null
        },
        updateModel:{
          problem_desc:null,
          problem_step:null,
          problem_solution:null,
          problem_urgency:null,
          problem_importance:null,
        },
        ruleValidate:{
          problem_type: [
            {required: true, message: '必须选择类型', trigger: 'blur', type:'number'}
          ],
          problem_step: [
            {required: true, message: '必须选择进度', trigger: 'blur' }
          ],
          problem_desc: [
            {required: true, message: '必须填写故障描述', trigger: 'blur' }
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
      _toggleUpdate(index){
        this.updateFlag = !this.updateFlag
        this.setUpdateIndex(index)
        this.setUpdateObj(this.$lodash.cloneDeep(this.dataArr[index]))
        this.updateModel = this.$lodash.cloneDeep(this.dataArr[index])
        this.updateModel.problem_type = this.updateModel.problem_type.ptype_id

        // console.log(this.updateModel)
        if(typeof this.updateModel !== 'undefined' && typeof this.updateModel.document !== 'undefined'){
          if(this.updateModel.document === null) {
            this.editDefaultList = []
          }else{
            this.editDefaultList = this.updateModel.document
          }
        }
      },
      _getData(){
        this._setLoading()
        this.$http
          .post(`/${this.url}/page/${this.page}/${this.pageSize}`)
          .then(res=>{
            res = res.data.data
            this.types = res.types
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
  .problem
    width 100%
    .page-wrapper
      margin 10px auto
    .problem-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .problem-search
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
