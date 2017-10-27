<template>
    <div class="service">
      <div class="service-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="service-search">
        <input type="text" v-model.trim="searchWord" placeholder="服务单号" class="search">
      </div>

      <div v-cloak>
        <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" v-cloak></i-table>
      </div>


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
          <!--自动生成 + 手工填写-->
          <FormItem label="服务单编号" prop="service_id">
            <Input v-model.trim="createModel.service_id" placeholder="请输入"></Input>
          </FormItem>
          <SearchContract @selectcontract="selectContractForC"></SearchContract>
          <FormItem label="服务类型" prop="type">
            <Select v-model="createModel.type">
              <Option v-for="(t, tk) in types" :key="tk" :value="t.id">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="信息来源" prop="source">
            <Select v-model="createModel.source">
              <Option v-for="(s, sk) in sources" :key="sk" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model="createModel.status">
              <Option v-for="(s, sk) in status" :key="sk" :value="s">{{s}}</Option>
            </Select>
          </FormItem>
          <SearchEmps @selectEmp="selectEmpForMan" type="MAN" v-if="dataArr.length"></SearchEmps>
          <SearchEmps @selectEmp="selectEmpForCus" type="CUS" v-if="dataArr.length"></SearchEmps>
          <FormItem label="受理时间" prop="time1">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime1"></DatePicker>
          </FormItem>
          <FormItem label="解决时间">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime2"></DatePicker>
          </FormItem>
          <FormItem label="占用工时">
            <Input v-model.trim="createModel.day_sum" placeholder="请输入工时"></Input>
          </FormItem>
          <FormItem label="是否收费">
            <RadioGroup v-model="createModel.charge_if" type="button">
              <Radio label="收费"></Radio>
              <Radio label="未收费"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收费数额" v-show="createModel.charge_if==='收费'">
            <Input v-model.trim="createModel.charge" placeholder="请输入数额"></Input>
          </FormItem>
          <FormItem label="问题描述">
            <Input v-model.trim="createModel.desc1" placeholder="问题描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="处理描述">
            <Input v-model.trim="createModel.desc2" placeholder="处理描述" type="textarea"></Input>
          </FormItem>
          <!--<FormItem label="上传文件">-->
          <!--<Input v-model.trim="createModel.document" placeholder="请输入"></Input>-->
          <!--</FormItem>-->
          <FormItem label="申述内容">
            <Input v-model.trim="createModel.allege" placeholder="申述内容" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        v-model="updateFlag"
        title="修改"
        width="400"
        @on-ok="update">
        <!--@on-cancel="cancel"-->
        <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <FormItem label="服务单编号" prop="service_id">
            <Input v-model.trim="updateModel.service_id" placeholder="请输入"></Input>
          </FormItem>
          <SearchContract @selectcontract="selectContractForU"></SearchContract>
          <FormItem label="服务类型" prop="type">
            <Select v-model="updateModel.type">
              <Option v-for="(t, tk) in types" :key="tk" :value="t.id">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="信息来源" prop="source">
            <Select v-model="updateModel.source">
              <Option v-for="(s, sk) in sources" :key="sk" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model="updateModel.status">
              <Option v-for="(s, sk) in status" :key="sk" :value="s">{{s}}</Option>
            </Select>
          </FormItem>
          <SearchEmps @selectEmp="selectEmpForManU" type="MAN" v-if="dataArr.length"></SearchEmps>
          <SearchEmps @selectEmp="selectEmpForCusU" type="CUS" v-if="dataArr.length"></SearchEmps>
          <FormItem label="受理时间" prop="time1">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" v-model="updateModel.time1" @on-change="setUTime1"></DatePicker>
          </FormItem>
          <FormItem label="解决时间">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" v-model="updateModel.time2" @on-change="setUTime2"></DatePicker>
          </FormItem>
          <FormItem label="占用工时">
            <Input v-model.trim="updateModel.day_sum" placeholder="请输入工时"></Input>
          </FormItem>
          <FormItem label="是否收费">
            <RadioGroup v-model="updateModel.charge_if" type="button">
              <Radio label="收费"></Radio>
              <Radio label="未收费"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收费数额" v-show="updateModel.charge_if==='收费'">
            <Input v-model.trim="updateModel.charge" placeholder="请输入数额"></Input>
          </FormItem>
          <FormItem label="问题描述">
            <Input v-model.trim="updateModel.desc1" placeholder="问题描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="处理描述">
            <Input v-model.trim="updateModel.desc2" placeholder="处理描述" type="textarea"></Input>
          </FormItem>
          <!--<FormItem label="上传文件">-->
          <!--<Input v-model.trim="updateModel.document" placeholder="请输入"></Input>-->
          <!--</FormItem>-->
          <FormItem label="申述内容">
            <Input v-model.trim="updateModel.allege" placeholder="申述内容" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除?</p>
      </Modal>
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import SearchContract from 'base/SearchContract/SearchContract'
  import SearchEmps from 'base/SearchEmps/SearchEmps'
  import {curdMixin, pageMixin, selMixin} from 'common/js/mixin'
  export default {
    mixins:[curdMixin, pageMixin, selMixin],
    data(){
      return {
        url: 'services',
        types: [],
        sources: [],
        status:["待审核", "拒绝", "待派单", "已派单", "申请完成", "已完成", "申述中"],
        columns: [
          {
            title: `　 服务单号`,
            key: 'service_id',
            width: 150,
            fixed: 'left'
          },
          {
            title: '所属单位',
            width: 200,
            fixed: 'left',
            render: (h, params) => {
              if (this.dataArr[params.index].company) {
                return `${this.dataArr[params.index].company.name}`
              }
            }
          },
          {
            title: `所属合同`,
            key: 'contract_id',
            width: 150,
            render : (h, params)=>{
                if(this.dataArr[params.index].contract){
                    return `${this.dataArr[params.index].contract.contract_id}`
                }
            }
          },
          {
            title: '服务单状态',
            key: 'status',
            width: 100,
          },
          {
            title: '信息来源',
            key: 'source',
            width: 100,
            render: (h, params) => {
                let index = params.row.source
                return typeof this.sources[index] !== 'undefined' ? this.sources[index].name : '其他'
            }
          },
          {
            title: '服务类型',
            key: 'type',
            width: 100,
            render: (h, params) => {
                let index = params.row.type
                return typeof this.types[index] !== 'undefined' ? this.types[index].name : '其他'
            }
          },
          {
            title: '服务员工',
            key: 'man',
            width: 300,
            render: (h, params) => {
              let data = this.dataArr[params.index].man
              let dom = []
              if (data && data.length) {
                for (let man of data) {
                  dom.push(h('Button', {props: {size: 'small'}, style: {margin: '3px'},}, man.name))
                }
                return h('div', [
                  dom
                ])
              } else {
                return "未填写"
              }
            }
          },
          {
            title: '客户联系人',
            key: 'customer',
            width: 300,
            render: (h, params) => {
              let data = this.dataArr[params.index].customer
              let dom = []
              if (data && data.length) {
                for (let customer of data) {
                  dom.push(h('Button', {props: {size: 'small'}, style: {margin: '3px'},}, customer.name))
                }
                return h('div', [
                  dom
                ])
              } else {
                return "未填写"
              }
            }
          },
          {
            title: '受理时间',
            key: 'time1',
            width: 120
          },
          {
            title: '解决时间',
            key: 'time2',
            width: 120
          },
          {
            title: '占用工时',
            key: 'day_sum',
            width: 120
          },
          {
            title: '问题描述',
            key: 'desc1',
            width: 120
          },
          {
            title: '处理描述',
            key: 'desc2',
            width: 120
          },
          {
            title: '备注',
            key: 'remark',
            width: 120
          },
          {
            title: '文件',
            key: 'document',
            width: 400,
            render: (h, params) => {
              let data = this.dataArr[params.index].document
              let dom = []
              if (data && data.length) {
                for (let doc of data) {
                  dom.push(h('Button', {props: {size: 'small'}, style: {marginRight: '3px'},}, doc.name))
                }
                return h('div', [
                  dom
                ])
              } else {
                return "未填写"
              }
            }
          },
          {
            title: '申述内容',
            key: 'allege',
            width: 120
          },
          {
            title: "操作",
            align: "center",
            width: 200,
            fixed: 'right',
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
        createModel: {
          contract_id: null,  //合同id
          service_id:null,
          status:null,
          source:null,
          type:null,
          man:null,
          customer:null,
          charge_if:null,
          charge:null,
          time1:null,
          time2:null,
          day_sum:null,
          desc1:null,
          desc2:null,
          remark:null,
          document:null,
          allege:null
        },
        updateModel: {
          contract_id: null,  //合同id
          service_id:null,
          status:null,
          source:null,
          type:null,
          man:null,
          customer:null,
          charge_if:null,
          charge:null,
          time1:null,
          time2:null,
          day_sum:null,
          desc1:null,
          desc2:null,
          remark:null,
          document:null,
          allege:null
        },
        ruleValidate: {
          service_id: [
            {required: true, message: '服务单编号不能为空', trigger: 'blur'}
          ],
          contract_id: [
            {required: true, message: '所属合同编号不能为空', trigger: 'blur'}
          ],
          type: [
            {type: 'number', required: true, message: '请选择服务单类型', trigger: 'blur'}
          ],
          source: [
            {type: 'number', required: true, message: '请选择服务单来源', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择服务单状态', trigger: 'blur'}
          ],
          time1: [
            {required: true, message: '请填写受理日期', trigger: 'blur'}
          ],
        },
      }
    },
    created(){
    },
    mounted(){
      this._getData()
    },
    methods:{
      selectContractForC(contract_id){
          this.createModel.contract_id = contract_id
      },
      selectContractForU(contract_id){
        this.updateModel.contract_id = contract_id
      },
      setCTime1(date){
        this.createModel.time1 = date
      },
      setCTime2(date){
        this.createModel.time2 = date
      },
      selectEmpForMan(result){
        this.createModel.man = this.selectEmpUtilFunc(result)
      },
      selectEmpForCus(result){
        this.createModel.customer = this.selectEmpUtilFunc(result)
      },
      setUTime1(date){
        this.updateModel.time1 = date
      },
      setUTime2(date){
        this.updateModel.time2 = date
      },
      selectEmpForManU(result){
        this.updateModel.man = this.selectEmpUtilFunc(result)
      },
      selectEmpForCusU(result){
        this.updateModel.customer = this.selectEmpUtilFunc(result)
      },
      _getData(){
        this._setLoading()
        this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
          .then(res=>{
            res = res.data.data
            this.total = res.total
            this.sources = res.sources
            this.types = res.types
            this.setDataArr(res.data)
            this._setLoading()
          })
      }
    },
    components:{
        Loading, SearchEmps, SearchContract
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .service
    width 100%
    .page-wrapper
      margin 10px auto
    .service-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .service-search
      position absolute
      top 117px
      left 45px
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
