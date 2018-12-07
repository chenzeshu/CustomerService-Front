<template>
  <div class="problem">
    <div class="problem-plus" @click="_toggleCreate">
      <Icon type="plus-circled"></Icon>
    </div>

    <div class="search">
      <Button type="primary" size="small"
              style="width: 80px"
      @click="showSearch">筛选</Button>
    </div>

    <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length"></i-table>

    <div class="page-wrapper">
      <div class="page">
        <Page :current="page" :total="total" simple @on-change="_getData"></Page>
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
        <FormItem label="故障类型" prop="problem_type">
          <Select v-model.trim="updateModel.problem_type">
            <Option v-for="(type,key) in types" :key="key" :value="type.ptype_id">{{type.ptype_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障进度" prop="problem_step">
          <Select v-model.trim="updateModel.problem_step">
            <Option v-for="(step, key) in steps" :key="key" :value="step">{{step}}</Option>
          </Select>
        </FormItem>
        <FormItem label="紧急程度">
          <Select v-model.trim="updateModel.problem_urgency">
            <Option v-for="urgency in urgencies" :key="urgency" :value="urgency">{{urgency}}</Option>
          </Select>
        </FormItem>
        <FormItem label="重要程度">
          <Select v-model.trim="updateModel.problem_importance">
            <Option v-for="importance in importances" :key="importance" :value="importance">{{importance}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障描述" prop="problem_desc">
          <Input v-model.trim="updateModel.problem_desc" placeholder="请输入" type="textarea"></Input>
        </FormItem>
        <FormItem label="解决方法">
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

    <!--search-->
    <Modal
      v-model="searchFlag"
      width="400"
      title="筛选"
      @on-ok="_getData"
    >
      <Form inline  :label-width="80">
        <FormItem label="故障类型">
          <Select
            v-model="searchObj.problem_type && searchObj.problem_type.ptype_id"
            clearable
            >
            <Option v-for="(type, key) of types" :key="type.ptype_id" :value="type.ptype_id">{{type.ptype_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障进度">
          <Select v-model.trim="searchObj.problem_step" clearable>
            <Option v-for="(step, key) in steps" :key="key" :value="step">{{step}}</Option>
          </Select>
        </FormItem>
        <FormItem label="紧急程度">
          <Select v-model.trim="searchObj.problem_urgency" clearable>
            <Option v-for="urgency in urgencies" :key="urgency" :value="urgency">{{urgency}}</Option>
          </Select>
        </FormItem>
        <FormItem label="重要程度">
          <Select v-model.trim="searchObj.problem_importance" clearable>
            <Option v-for="importance in importances" :key="importance" :value="importance">{{importance}}</Option>
          </Select>
        </FormItem>
        <FormItem label="故障描述">
          <Input v-model.trim="searchObj.problem_desc" placeholder="请输入" type="textarea"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!--report-->
    <Modal
      v-model="reportFlag"
      title="报警"
      width="600"
      @on-ok="report"
    >
      <Form inline  :label-width="80" :model="reportModel">
        <FormItem label="关联设备">
          <SearchDevice @select-device="selectDevices"/>
        </FormItem>
        <NewSearchEmps @on-select="selectEmps" type="CUS"></NewSearchEmps>
      </Form>
      1. 关联设备
      2. 联系人电话
      3. 同步problemRecord : 被报警人、报警内容、报警人、时间、（报警方式）？
    </Modal>
  </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import {curdMixin, pageMixin} from 'common/js/mixin'
  import SearchDevice from 'base/SearchDevice/SearchDevice'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  let docWidth = document.documentElement.clientWidth
  let cellWidth = docWidth > 1200 ? 900 : 331

  export default {
    mixins:[curdMixin, pageMixin],
    data(){
      return {
        url:"problem",
        types: [],
        steps: ['未解决', '运维解决中', '技术或厂商解决中', '专家解决中', '已解决'],
        urgencies: ['一般', '紧急', '非常紧急'],
        importances: ['一般', '重要', '非常重要'],
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
              return true === !!this.dataArr[params.index].service
                ?  `对应服务单：${this.dataArr[params.index].service.service_id}`
                :  '不对应服务单'
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
                    type: 'default',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showReport(params.index)
                    }
                  }
                }, '报警'),
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
        },
        searchObj:{
          problem_type:{
            ptype_id:null,
            ptype_name: null,
          }
        },
        searchFlag: false,
        reportFlag: false,
        reportModel: {
          problem_id: null,
          device_ids: null,
          emp_ids: null
        }
      }
    },
    mounted(){
      this._getData()
    },
    methods:{
      report(){
        this.reportModel.emp_ids = this.reportModel.emp_ids.split(',').map(id=>parseInt(id))

        let url = `${this.url}/report`

        this.$http
          .post(url, this.reportModel)
          .then(res=>{
            res = res.data
            if(res.code === 2002){
              this.$Message.success(res.msg)
            }
          })

      },
      selectDevices(device_ids){
        this.reportModel.device_ids = device_ids
      },
      selectEmps(emp_ids){
        this.reportModel.emp_ids = emp_ids
      },
      showReport(index){
        this.reportFlag = true
        this.reportModel.problem_id = this.dataArr[index].problem_id
      },
      showSearch(){
        this.searchFlag = true
      },
      _toggleUpdate(index){
        this.updateFlag = !this.updateFlag
        this.setUpdateIndex(index)
        this.setUpdateObj(this.$lodash.cloneDeep(this.dataArr[index]))
        this.updateModel = this.$lodash.cloneDeep(this.dataArr[index])
        this.updateModel.problem_type = this.updateModel.problem_type.ptype_id
      },
      _getData(){
        this._setLoading()
        if(this.$route.params.ptype_id){
          this.searchObj.problem_type.ptype_id = this.$route.params.ptype_id
        }

        this.$http
          .post(`/${this.url}/page/${this.page}/${this.pageSize}`, {
            'searchObj':this.searchObj
          })
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
      Loading, SearchDevice, NewSearchEmps
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
    .search
      position absolute
      top 66px
      left 316px
</style>
