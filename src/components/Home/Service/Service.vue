<template>
    <div class="service">
      <div class="service-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>
      <div class="topbar-item">
        <Button type="primary" size="small" class="item-button" @click="_toggleCreate">
          <Icon type="android-add-circle" class="item-button-icon"></Icon><span class="item-button-text">新增</span>
        </Button>

        <Button type="ghost" size="small" class="item-button" @click="showSearch">
          <Icon type="search" class="item-button-icon"></Icon><span class="item-button-text">筛选</span>
        </Button>
      </div>

      <Modal
      v-model="searchFlag">
        <Form :label-width="80">
          <FormItem label="所属单位">
            <Input type="text" v-model.trim="filterValueThree" placeholder="公司名" class="search" @keyup.enter.native="_getData()"></Input>
          </FormItem>

          <FormItem label="服务员工">
            <Input type="text" v-model.trim="filterValueFour" placeholder="员工名可能会因目标有空格而搜索失败" class="search" @keyup.enter.native="_getData()"></Input>
          </FormItem>
        </Form>
      </Modal>

      <div class="service-search">
        <input type="text" v-model.trim="searchWord" placeholder="服务单号" class="search">
      </div>

      <!--导出csv-->
      <Button type="primary" size="small" @click="exportData" class="csv-button"><Icon type="ios-download-outline"></Icon>导出本页</Button>

      <lazy-component>
      <div v-cloak>
        <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" :loading="loading"
        ref="table"></i-table>
      </div>
      </lazy-component>

      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <lazy-component>
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
            <FormItem label="套餐类型" prop="contract_plan_id">
              <Select v-model="createModel.contract_plan_id" v-if="curPlans">
                <Option v-for="(s, sk) in curPlans" :key="sk" :value="s.id">{{s.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem label="套餐用量" v-if="_checkPlanForC()">
              <Input v-model.trim="createModel.plan_num" placeholder="套餐用量默认为1"></Input>
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

            <div v-show="createModel.charge_if === '收费'">
              <FormItem label="收费数额">
                <Input v-model.trim="createModel.charge" placeholder="请输入数额"></Input>
              </FormItem>
              <FormItem label="是否到款">
                <RadioGroup v-model="createModel.charge_flag" type="button">
                  <Radio label="到款"></Radio>
                  <Radio label="未到款"></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="到款时间">
                <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="createModel.time4" @on-change="setCTime4"></DatePicker>
              </FormItem>
            </div>

            <FormItem label="同步故障" prop="charge_if">
              <RadioGroup v-model="createModel.problem_if" type="button">
                <Radio :label="parseInt(1)">
                  <span>同步</span>
                </Radio>
                <Radio :label="parseInt(0)">
                  <span>不同步</span>
                </Radio>
              </RadioGroup>
            </FormItem>

            <div v-show="createModel.problem_if == 1">
              <FormItem label="选择设备">
                <SearchDevice @select-device="getCreateModelDevice"></SearchDevice>
              </FormItem>
              <FormItem label="故障类型">
                <Select v-model="createModel.problem_type">
                  <Option v-for="(type, key) in problem_types" :key="key" :value="type.ptype_id">{{type.ptype_name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="故障进展">
                <Select v-model="createModel.problem_step">
                  <Option v-for="(step, key) in problem_steps" :key="key" :value="step">{{step}}</Option>
                </Select>
              </FormItem>
              <FormItem label="紧急程度">
                <Select v-model="createModel.problem_urgency">
                  <Option v-for="(urgency, key) in problem_urgencies" :key="key" :value="urgency">{{urgency}}</Option>
                </Select>
              </FormItem>
              <FormItem label="重要程度">
                <Select v-model="createModel.problem_importance">
                  <Option v-for="(importance, key) in problem_importances" :key="key" :value="importance">{{importance}}</Option>
                </Select>
              </FormItem>
            </div>

            <FormItem label="问题描述" prop="desc1">
              <Input v-model.trim="createModel.desc1" placeholder="问题描述" type="textarea"></Input>
            </FormItem>
            <FormItem label="解决方法">
              <Input v-model.trim="createModel.desc2" placeholder="解决方法" type="textarea"></Input>
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
          <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
            <NewSearchContract @on-select="selectContractForU"></NewSearchContract>
            <!--合同编号自动生成 + 手工填写-->
            <FormItem label="套餐类型" prop="contract_plan_id">
              <Select v-model="updateModel.contract_plan_id" v-if="curPlans">
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

            <div v-show="updateModel.charge_if === '收费'">
              <FormItem label="收费数额">
                <Input v-model.trim="updateModel.charge" placeholder="请输入数额"></Input>
              </FormItem>
              <FormItem label="是否到款">
                <RadioGroup v-model="updateModel.charge_flag" type="button">
                  <Radio label="到款"></Radio>
                  <Radio label="未到款"></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="到款时间">
                <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time4" @on-change="setUTime4"></DatePicker>
              </FormItem>
            </div>

            <FormItem label="同步故障" prop="charge_if">
              <RadioGroup v-model="updateModel.problem_if" type="button">
                <Radio :label="parseInt(1)">
                  <span>同步</span>
                </Radio>
                <Radio :label="parseInt(0)">
                  <span>不同步</span>
                </Radio>
              </RadioGroup>
            </FormItem>

            <div v-show="updateModel.problem_if == 1">
              <FormItem label="选择设备">
                <SearchDevice @select-device="getUpdateModelDevice" />
              </FormItem>
              <FormItem label="故障类型">
                <Select v-model="updateModel.problem && updateModel.problem.problem_type">
                  <Option v-for="(type, key) in problem_types" :key="key" :value="type.ptype_id">{{type.ptype_name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="故障进展">
                <Select v-model="updateModel.problem && updateModel.problem.problem_step">
                  <Option v-for="(step, key) in problem_steps" :key="key" :value="step">{{step}}</Option>
                </Select>
              </FormItem>
              <FormItem label="紧急程度">
                <Select v-model="updateModel.problem && updateModel.problem.problem_urgency">
                  <Option v-for="(urgency, key) in problem_urgencies" :key="key" :value="urgency">{{urgency}}</Option>
                </Select>
              </FormItem>
              <FormItem label="重要程度">
                <Select v-model="updateModel.problem && updateModel.problem.problem_importance">
                  <Option v-for="(importance, key) in problem_importances" :key="key" :value="importance">{{importance}}</Option>
                </Select>
              </FormItem>
            </div>

            <FormItem label="问题描述" prop="desc1">
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
            <!--<NewSearchEmps @on-select="selectEmpForVisit" type="VISITOR"></NewSearchEmps>-->
            <SearchVisitor @on-select="selectEmpForVisit"></SearchVisitor>
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
      </lazy-component>
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import NewSearchContract from 'base/SearchContract/NewSearchContract'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  import SearchDevice from 'base/SearchDevice/SearchDevice'
  import SearchVisitor from 'base/SearchEmps/SearchVisitor'
  import {curdMixin, pageMixin} from 'common/js/mixin'
  import {uploadMixin} from 'common/js/baseMixin'
  import Validator from 'common/js/validator'
  import ShowDetail from 'base/Show/ShowDetail'
  import { mapGetters, mapMutations } from 'vuex'

  import ServiceModel from './ServiceModel'

  export default {
    mixins:[curdMixin, pageMixin, uploadMixin],
    data(){
      return {
        url: 'services',
        //筛选搜索
        searchFlag: false,
        curDetail:{
          name:null,
          phone:null,
          email:null,
          company:{}
        },
        types: [],
        sources: [],
        problem_types: [],
        problem_steps: ['未解决', '运维解决中', '技术或厂商解决中', '专家解决中', '已解决'],
        problem_urgencies: ['一般', '紧急', '非常紧急'],
        problem_importances: ['一般', '重要', '非常重要'],
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
            key:"company",
            fixed: 'left',
            render: (h, params) => {
              if (this.dataArr[params.index].contract) {
                return h('div', this.dataArr[params.index].contract.company.name)
              }
            }
          },
          {
            title: `所属合同`,
            key: 'contract_id',
            width: 150,
            render : (h, params)=>{
              if(this.dataArr[params.index].contract){
                return h('div', this.dataArr[params.index].contract.contract_id)
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
            filterRemote: function(value, row){
              this.filterValueOne = (!!value[0]) === false ? "" : value[0]
              this._getData()
            }.bind(this)
          },
          {
            title: '信息来源',
            key: 'source',
            width: 100,
            render: (h, params) => {
              let index = params.row.source
              let value =  typeof this.sources[index] !== 'undefined' ? this.sources[index].name : '其他'
              return h('div', value)
            }
          },
          {
            title: '服务类型',
            key: 'type',
            width: 100,
            render: (h, params) => {
              let index = params.row.type
              let value =  typeof this.types[index] !== 'undefined' ? this.types[index].name : '其他'
              return h('div', value)
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
              } else {
                dom = "未选择"
              }
              return h('div', [
                dom
              ])
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
              } else {
                dom = '未派单'
              }
              return h('div', [
                dom
              ])
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
              } else {
                dom = "未选择"
              }
              return h('div', [
                dom
              ])
            }
          },
          {
            title: '派单时间',
            key: 'time1',
            width: 120,
            render: (h, params) => {
              let time = this.dataArr[params.index].time1
              return h('div', !time ? '未填写' : time)
            }
          },
          {
            title: '解决时间',
            key: 'time2',
            width: 120,
            render: (h, params) => {
              let time = this.dataArr[params.index].time2
              return h('div', !time ? '未填写' : time)
            }
          },
          {
            title: '占用工时',
            key: 'day_sum',
            width: 120,
            render: (h, params) => {
              let time = this.dataArr[params.index].day_sum
              return h('div', !time ? '未填写' : time)
            }
          },
          {
            title: '问题描述',
            key: 'desc1',
            width: 200,
            render: (h, params) => {
              let time = this.dataArr[params.index].desc1
              return h('div', !time ? '未填写' : time)
            }
          },
          {
            title: '处理描述',
            key: 'desc2',
            width: 200,
            render: (h, params) => {
              let time = this.dataArr[params.index].desc2
              return h('div', !time ? '未填写' : time)
            }
          },
          {
            "title":"回访记录",
            key: 'visit',
            width: 150,
            render: (h, params) => {
              let style = {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on:{}
                },
                type = '未回访'
              if( typeof params.row.visits !== 'undefined' && params.row.visits.length > 0){
                style.props.type = 'primary'
                style.on.click = () =>{
                  this._toggleVisitShow(params.index)
                }
                type = '查看回访记录'
              }

              return h('div', [
                h('Button', style, type),
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
                return h('div', '不收费')
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
                return h('div', '不收费')
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
            filterRemote: function(value, row){
              if(this.filterValueOne === ""){
                this.filterValueOne = "待派单"
              }
              this.filterValueTwo = (!!value[0]) === false ? "" : value[0]
              this._getData()
            }.bind(this)
          },
          {
            title: '到款时间',
            key: 'time4',
            width: 120,
            render: (h, params) => {
              let time = this.dataArr[params.index].time4
              return h('div', !time ? '未填写' : time)
            }
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
                return h('div', '无文件')
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
        createModel: new ServiceModel(),
        updateModel: new ServiceModel(),
        ruleValidate: {
          contract_plan_id:[
            {type: 'number', required: true, message: '请选择套餐', trigger: 'blur'}
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
          ],
          desc1: [
            {required: true, message: '请填写问题描述', trigger: 'blur'}
          ]
        },
        ruleValidateVisit: {
          visitor:[
            {required: true, type:'number', message: '请选择回访人', trigger: 'blur'}
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
        defaultFileList:[],
        editDefaultFileList:[],
        searchFlag:false
      }
    },
    created(){
      this._getData()
    },
    computed:{
      ...mapGetters([
          'visitObj'
      ])
    },
    watch:{
      visitModel(newModel){
          this.setVisitObj(newModel)
      }
    },
    methods:{
      showSearch(){
        this.searchFlag = !this.searchFlag
      },
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
          if(this.dataArr[index].visits.length > 0) {
            this.visitModel = Object.assign({}, this.dataArr[index].visits[0])
            //判断this.visitModel的visitor是否存在, 不存在就装上去  ==> 针对提交后刷新页面再打开时没有visitor
          }else{
            this.visitModel = {service_id:this.dataArr[index].id}
          }

          this.setVisitObj(this.visitModel)
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
          let _url = `/${this.url}/visit/${this.visitModel.service_id}`
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
      exportData(){
        this.$refs.table.exportCsv({
          filename: '原始数据.xlsx',
          data: this.dataArr.map((item, index)=>{
              //信息来源
              item.source = typeof this.sources[item.source] !=="undefined" && this.sources[item.source].name
              //服务类型
              item.source = typeof this.types[item.type] !=="undefined" && this.types[item.type].name
              //所属合同
              item.company = item.contract.company.name
              //申请人
              let name = ""
              for(let i in item.refer_man){
                  name += item.refer_man[i].name +" "
              }
              item.refer_man = name
              //服务员工
              name = ""
              for(let i in item.man){
                name += item.man[i].name +" "
              }
              item.man = name
              //客户联系人
              name = ""
              for(let i in item.customer){
                name += item.customer[i].name +" "
              }
              item.customer= name
              return item
          })
        });
      },
      //todo 得到设备id的监听函数
      getCreateModelDevice(device_ids){
        this.createModel.device_ids = new Array(device_ids)[0]
      },
      getUpdateModelDevice(device_ids){
        this.updateModel.device_ids = new Array(device_ids)[0]
      },
      _getData(){
        this._setLoading()
        //1=>状态 2=>是否到款 3=>公司 4=>员工
        let url = `/${this.url}/page/${this.page}/${this.pageSize}`,
            data = {
              value1:this.filterValueOne,
              value2:this.filterValueTwo,
              value3:this.filterValueThree,
              value4:this.filterValueFour,
              // value5:this.filterValueFive
            }

        this.$http.post(url, data)
          .then(res=>{
            res = res.data.data
            this.sources = res.sources
            this.types = res.types
            this.problem_types = res.problem_types
            //假设无数据
            if(res.data.length === 0){
              this.$Message.info({
                'content': `没有数据`,
                'duration':3
              })
              res.data = [{}]
            }
            let arr = []
            //不知道为什么, 当进行筛选时, 返回变成对象了
            if(typeof res.data === "object"){
                for(let i in res.data){
                  arr.push(res.data[i])
                }
                res.data = arr
            }
            this.setDataArr(res.data)
            this.setTotal(res.total)
            this._setLoading()
          })
      },
      ...mapMutations({
        'setVisitObj' : 'SET_VISIT_OBJ'
      })
    },
    components:{
        Loading, NewSearchEmps, NewSearchContract, ShowDetail, SearchVisitor,
        SearchDevice
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .service
    width 100%
    .topbar-item
      width 100%
      position absolute
      top 15px
      left 85px
      .item-button
        float:left
        width 80px
        padding 4px 6px
        margin-left 8px
        .item-button-text, .item-button-icon
          vertical-align baseline
          margin-left 4px
    .page-wrapper
      margin 10px auto
    .service-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .service-search, .service-search-company, .service-search-emp
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
    .service-search-company
      top 142px
    .service-search-emp
      top 162px
    .csv-button
      position absolute
      top: 66px;
      left: 300px;
</style>
