<template>
    <div class="service">
      <div class="service-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="service-search">
        <input type="text" v-model.trim="searchWord" placeholder="服务单号" class="search">
      </div>

      <div v-cloak>
        <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" :loading="loading"></i-table>
      </div>

      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <!--create-->
      <Modal
        v-model="createFlag"
        title="创建"
        width="400"
        @on-ok="_create">
        <!--@on-cancel="cancel"-->
        <Form :model="createModel" :rules="ruleValidate" ref="createForm" :label-width="80">
          <NewSearchContract @on-select="selectContractForC"></NewSearchContract>

          <!--自动生成 + 手工填写-->
          <FormItem label="套餐类型" prop="type">
            <Select v-model="createModel.type" v-if="curPlans">
              <Option v-for="(s, sk) in curPlans" :key="sk" :value="s.id">{{s.desc}}</Option>
            </Select>
          </FormItem>
          <FormItem label="套餐用量" v-if="_checkPlanForC()">
            <Input v-model.trim="createModel.plan_num" placeholder="套餐用量默认为1"></Input>
          </FormItem>
          <FormItem label="服务单编号" prop="service_id">
            <Input v-model.trim="createModel.service_id" placeholder="请输入"></Input>
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
          <NewSearchEmps @on-select="selectEmpForRefer" type="REFER"></NewSearchEmps>
          <NewSearchEmps @on-select="selectEmpForCus" type="CUS"></NewSearchEmps>
          <NewSearchEmps @on-select="selectEmpForMan" type="MAN"></NewSearchEmps>
          <FormItem label="派单时间" prop="time1">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime1"></DatePicker>
          </FormItem>
          <FormItem label="解决时间">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime2"></DatePicker>
          </FormItem>
          <FormItem label="占用工时">
            <Input v-model.trim="createModel.day_sum" placeholder="请输入工时"></Input>
          </FormItem>
          <FormItem label="是否收费" prop="charge_if">
            <RadioGroup v-model="createModel.charge_if" type="button">
              <Radio label="收费"></Radio>
              <Radio label="不收费"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收费数额" v-show="createModel.charge_if==='收费'">
            <Input v-model.trim="createModel.charge" placeholder="请输入数额"></Input>
          </FormItem>
          <FormItem label="是否到款" v-show="createModel.charge_if==='收费'">
            <RadioGroup v-model="createModel.charge_flag" type="button">
              <Radio label="到款"></Radio>
              <Radio label="未到款"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="到款时间" v-show="createModel.charge_if==='收费'">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="createModel.time4" @on-change="setCTime4"></DatePicker>
          </FormItem>
          <FormItem label="问题描述">
            <Input v-model.trim="createModel.desc1" placeholder="问题描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="处理描述">
            <Input v-model.trim="createModel.desc2" placeholder="处理描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="上传文件">
            <Upload
              ref="upload"
              multiple
              type="drag"
              :action="action"
              :name="uploadName"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-remove="handleRemove">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="1" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="申述内容">
            <Input v-model.trim="createModel.allege" placeholder="申述内容" type="textarea"></Input>
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
          <NewSearchContract @on-select="selectContractForU"></NewSearchContract>
          <!--合同编号自动生成 + 手工填写-->
          <FormItem label="套餐类型" prop="type">
            <Select v-model="updateModel.type" v-if="curPlans" disabled>
              <Option v-for="(s, sk) in curPlans" :key="sk" :value="s.id">{{s.desc}}</Option>
            </Select>
          </FormItem>
          <FormItem label="套餐用量" v-if="_checkPlanForC()">
            <!--做validate时, 一定要做正负判断-->
            <Input v-model.number="updateModel.plan_num" placeholder="套餐用量默认为1" readonly></Input>
          </FormItem>
          <FormItem label="服务单编号" prop="service_id">
            <Input v-model.trim="updateModel.service_id" placeholder="请输入"></Input>
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
          <NewSearchEmps @on-select="selectEmpForReferU" type="REFER"></NewSearchEmps>
          <NewSearchEmps @on-select="selectEmpForCusU" type="CUS"></NewSearchEmps>
          <NewSearchEmps @on-select="selectEmpForManU" type="MAN"></NewSearchEmps>
          <FormItem label="派单时间" prop="time1">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time1" @on-change="setUTime1"></DatePicker>
          </FormItem>
          <FormItem label="解决时间">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time2" @on-change="setUTime2"></DatePicker>
          </FormItem>
          <FormItem label="占用工时">
            <Input v-model.trim="updateModel.day_sum" placeholder="请输入工时"></Input>
          </FormItem>
          <FormItem label="是否收费" prop="charge_if">
            <RadioGroup v-model="updateModel.charge_if" type="button">
              <Radio label="收费"></Radio>
              <Radio label="不收费"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收费数额" v-show="updateModel.charge_if==='收费'">
            <Input v-model.trim="updateModel.charge" placeholder="请输入数额"></Input>
          </FormItem>
          <FormItem label="是否到款" v-show="updateModel.charge_if==='收费'">
            <RadioGroup v-model="updateModel.charge_flag" type="button">
              <Radio label="到款"></Radio>
              <Radio label="未到款"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="到款时间" v-show="updateModel.charge_if==='收费'">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time4" @on-change="setUTime4"></DatePicker>
          </FormItem>
          <FormItem label="问题描述">
            <Input v-model.trim="updateModel.desc1" placeholder="问题描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="处理描述">
            <Input v-model.trim="updateModel.desc2" placeholder="处理描述" type="textarea"></Input>
          </FormItem>
          <FormItem label="上传文件">
            <Upload
              ref="upload"
              multiple
              type="drag"
              :action="action"
              :name="uploadName"
              :default-file-list="editDefaultList"
              :before-upload="handleUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-remove="handleRemove">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="1" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </FormItem>
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

      <!--showVisit-->
      <Modal
        v-model="visitShowFlag"
        title="回访记录"
        width="600"
      >
        <p>处理结果:{{ visitShowModel.result_deal }}</p>
        <p>服务评价:{{ result_rating[visitShowModel.result_rating].content }}</p>
        <p v-if="typeof visitShowModel.employees !== 'undefined' && visitShowModel.employees.length > 0">回访人:{{ visitShowModel.employees[0].name }}</p>
        <p>回访结果:{{ result_visit[visitShowModel.result_visit].content }}</p>
        <p>回访时间:{{ visitShowModel.time }}</p>
      </Modal>

      <!--createOrUpdateVisit-->
      <Modal
        v-model="visitFlag"
        title="回访"
        width="400"
        @on-ok="visit">
        <!--@on-cancel="cancel"-->
        <Form :model="visitModel" :rules="ruleValidateVisit" ref="visitForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <FormItem label="处理结果" prop="result_deal">
            <Select v-model="visitModel.result_deal">
              <Option v-for="s in result_deal" :key="s" :value="s">{{s}}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务评价" prop="result_rating">
            <Select v-model="visitModel.result_rating">
              <Option v-for="s in result_rating" :key="s.id" :value="s.id">{{s.content}}</Option>
            </Select>
          </FormItem>
          <FormItem label="回访结果" prop="result_visit">
            <Select v-model="visitModel.result_visit">
              <Option v-for="s in result_visit" :key="s.id" :value="s.id">{{s.content}}</Option>
            </Select>
          </FormItem>
          <!--回访人-->
          <NewSearchEmps @on-select="selectEmpForVisit" type="VISITOR"></NewSearchEmps>

          <FormItem label="回访时间" prop="time">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="visitModel.time" @on-change="setVTime"></DatePicker>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="visitModel.remark" placeholder="备注内容" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--showDetail-->
      <ShowDetail class="show-man-detail" ref="showDetail">
         <span class="name">
                <div class="icon">
                  <Icon type="person"></Icon>
                </div>
            姓名: {{ curDetail.name }}</span>
        <span><div class="icon">
                  <Icon type="iphone"></Icon>
                </div>
            手机: <span>{{ curDetail.phone }}</span></span>
      </ShowDetail>
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import NewSearchContract from 'base/SearchContract/NewSearchContract'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  import {curdMixin, pageMixin} from 'common/js/mixin'
  import {uploadMixin} from 'common/js/baseMixin'
  import Validator from 'common/js/validator'
  import ShowDetail from 'base/Show/ShowDetail'

  export default {
    mixins:[curdMixin, pageMixin, uploadMixin],
    data(){
      return {
        url: 'services',
        curDetail:{
          name:null,
          phone:null,
          email:null,
          company:{}
        },
        types: [],
        sources: [],
        status:["待审核", "拒绝", "待派单", "已派单", "申请完成", "已完成", "申述中"],
        visitShowFlag:false,
        visitShowModel:{
          service_id:null,
          result_deal:"待解决",
          result_rating:4,
          result_visit:4,
          remark:null,
          time:null,
          visit:{
              employees:[
                {name:"测试"}
              ]
          },
          visitor:null,
        },
        visitFlag : false,
        visitModel:{
          service_id:null,
          result_deal:"待解决",
          result_rating:4,
          result_visit:4,
          remark:null,
          time:null,
          visitor:null,
        },
        result_deal:["待解决", "未解决", "已解决"],  //默认待解决
        result_rating:[
          {id:0, content:"非常满意"},
          {id:1, content:"满意"},
          {id:2, content:"一般"},
          {id:3, content:"不满意"},
          {id:4, content:"未评价"},  //默认
        ],
        result_visit:[
          {id:0, content:"非常满意"},
          {id:1, content:"满意"},
          {id:2, content:"一般"},
          {id:3, content:"不满意"},
          {id:4, content:"未回访"},  //默认
        ],
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
              if (this.dataArr[params.index].contract) {
                return `${this.dataArr[params.index].contract.company.name}`
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
            width: 150,
            filters:[
              {
                label: '待派单',
                value: '待派单'
              },
              {
                label: '已派单',
                value: '已派单'
              },
              {
                label: '申请完成',
                value: '申请完成'
              },
              {
                label: '已完成',
                value: '已完成'
              },
              {
                label: '拒绝',
                value: '拒绝'
              }
            ],
            filterMultiple:false,
            filterRemote(value, row){
              this.filterValueOne = (!!value[0]) === false ? "" : value[0]
              this._setLoading()
              let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
              this.$http.get(url)
                .then(res=>{
                  res = res.data.data
                  this.total = res.total
                  this.sources = res.sources
                  this.types = res.types
                  this.setDataArr(res.data)
                  this._setLoading()
                  return
                })
            }
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
            title: '申请人',
            key: 'refer_man',
            width: 100,
            render: (h, params) => {
              let refer_man = this.dataArr[params.index].refer_man
              let dom = []
              if (refer_man) {
                for (let man of refer_man) {
                  dom.push(h('Button', { nativeOn:{
                    mouseover: ($event) => {
                      this.showManDetail(params.index, $event)
                    },
                    mouseleave: () => {
                      this.closeDetail()
                    }
                  }, props: {size: 'small'}, style: {margin: '3px'},}, man.name))
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
            title: '服务员工',
            key: 'man',
            width: 200,
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
            width: 100,
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
            title: '派单时间',
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
            width: 200
          },
          {
            title: '处理描述',
            key: 'desc2',
            width: 200
          },
          {
            "title":"回访记录",
            key: 'visit',
            width: 150,
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
                      this._toggleVisitShow(params.index)
                    }
                  }
                }, '查看回访记录'),
              ]);
            }
          },
          {
            title: '是否收费',
            key: 'charge_if',
            width: 100
          },
          {
            title: '收费数额',
            key: 'charge',
            width: 100,
            render: (h, params)=>{
                if(params.row.charge_if === '收费'){
                    return params.row.charge
                }else{
                    return '无'
                }
            }
          },
          {
            title: '是否到款',
            key: 'charge_flag',
            width: 100,
            render: (h, params, row, column)=>{
              if(params.row.charge_if === '收费'){
                return params.row.charge_flag
              }else{
                return '无'
              }
            },
            filters:[
              {
                label: '到款',
                value: '到款'
              },
              {
                label: '未到款',
                value: '未到款'
              },
            ],
            filterMultiple:false,
            filterRemote(value, row){
              this.filterValueTwo = (!!value[0]) === false ? "" : value[0]
              this._getData()
            }
          },
          {
            title: '到款时间',
            key: 'time4',
            width: 120
          },
          {
            title: '备注',
            key: 'remark',
            width: 200
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
                    type: 'default',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this._toggleVisit(params.index)
                    }
                  }
                }, '回访'),
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
          plan_num : 1,
          contract_id: null,  //合同id
          service_id:null,
          status:null,
          source:null,
          type:null,
          refer_man:null,
          man:null,
          customer:null,
          charge_if:null,
          charge:null,
          charge_flag:null,
          time4:null,  //到账时间
          time1:null,
          time2:null,
          time3:null,
          day_sum:null,
          desc1:null,
          desc2:null,
          remark:null,
          document:null,
          allege:null
        },
        updateModel: {
          plan_num : 1, //套餐用量
          contract_id: null,  //合同id
          service_id:null,
          status:null,
          source:null,
          type:null,
          refer_man:null,
          man:null,
          customer:null,
          charge_if:null,
          charge:null,
          charge_flag:null,
          time4:null,  //到账时间
          time1:null,
          time2:null,
          time3:null,
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
            {type: 'number', required: true, message: '所属合同编号不能为空', trigger: 'blur'}
          ],
          refer_man: [
            { required: true, message: '申请人不能为空', trigger: 'blur'},
            { validator:Validator.validateRefer, trigger: 'change' }
          ],
          customer: [
            {required: true, message: '项目经理不能为空', trigger: 'blur' }
          ],
          charge_if:[
            {required: true, message: '是否收费', trigger: 'blur' }
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
          plan_num : [
              //  做validate时, 一定要做正负判断, 不然被恶意增加了负数就杯具了
          ]
        },
        ruleValidateVisit:{
          visitor:[
            {required: true, message: '请选择回访人', trigger: 'blur'}
          ] ,
          result_deal: [
            {required: true, message: '请选择处理结果', trigger: 'blur'}
          ],
          result_visit: [
            {type: 'number', required: true, message: '请选择回访结果', trigger: 'blur'}
          ],
          result_rating: [
            {type: 'number', required: true, message: '请选择服务评价', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请填写回访日期', trigger: 'blur'}
          ],
        },
        curPlans:[],//用于承载根据合同id检索到的合同下的套餐
      }
    },
    created(){
      this._getData()
    },
    methods:{
        //校验是否是金钱套餐
      _checkPlanForC(){
          let id = this.createdModel && this.createdModel.type
          let uid = !!this.updateModel && this.updateModel.type
          let choose = this.curPlans.filter((item)=>{
              return item.plan_util && item.plan_util.type2 === "财务" && (item.id === id || item.id === uid)
          })
          return choose.length > 0 ? true : false
      },
      _checkPlanForU(){
          //iview的input的方法都同时触发了, 看ForC即可
      },
      showManDetail(key, e){
        let emp = this.dataArr[key].refer_man[0]
        this.curDetail = Object.assign({}, emp)
        //调用组件方法显示细节面板并改变位置
        this.$refs.showDetail.showManDetail(e)
      },
      closeDetail(){
        this.$refs.showDetail.closeDetail()
      },
      _toggleVisitShow(index){  //showVisit
          this.visitShowModel = Object.assign({}, this.dataArr[index].visits[0])
          this.visitShowFlag = !this.visitShowFlag
      },
      _toggleVisit(index){  //createOrUpdateVisit
          this.visitModel = Object.assign({}, this.dataArr[index].visits[0])
          this.visitFlag = !this.visitFlag
      },
      selectEmpForVisit(v){
          this.visitModel.visitor = v
      },
      setVTime(v){
          this.visitModel.time = v
      },
      visit(){
        this.$refs['visitForm'].validate((valid) => {
          if (!valid) {
            this.$Message.error('请完善表单!');
            setTimeout(() => {
              this.visitFlag = !this.visitFlag
            }, 500)
            return
          }

          let _url = `/${this.url}/visit/${this.visitModel.id}`
          this.$http.post(_url, this.visitModel)
            .then(res => {
              res = res.data
              if (parseInt(res.code) === 2005) {
                this.$Message.success(res.msg);
                this._getData()
              }
            }, err => {
              this.$Message.error('修改失败');
            })
        })
      },
      selectContractForC(contract_id){
          //FIXME-提醒 由于代码没有深入到iview组件的watch, 所以写在统一组件的C和U都有用
          if(typeof contract_id !== 'object'){
            this.createModel.contract_id = contract_id
            this.$http(`contracts/getContractPlans/${contract_id}`).then(res=>{
              this.curPlans = res.data.data
              this.$Message.info({
                'content': `所属合同下有${this.curPlans.length}个套餐`,
                'duration':3
              })
            })
          }
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
      setCTime4(date){
        this.createModel.time4 = date
      },
      selectEmpForRefer(v){
        this.createModel.refer_man = v
      },
      selectEmpForMan(v){
        this.createModel.man = v
      },
      selectEmpForCus(v){
        this.createModel.customer = v
      },
      setUTime1(date){
        this.updateModel.time1 = date
      },
      setUTime2(date){
        this.updateModel.time2 = date
      },
      setUTime4(date){
        this.updateModel.time4 = date
      },
      selectEmpForReferU(v){
        this.updateModel.refer_man = v
      },
      selectEmpForManU(v){
        this.updateModel.man = v
      },
      selectEmpForCusU(v){
        this.updateModel.customer = v
      },
      _getData(){
        this._setLoading()
        let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
        this.$http.get(url)
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
        Loading, NewSearchEmps, NewSearchContract, ShowDetail
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
