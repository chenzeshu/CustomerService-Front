<template>
    <div class="contract">
      <div class="topbar-item">
          <Button type="primary" size="small" class="item-button" @click="_toggleCreate">
            <Icon type="android-add-circle" class="item-button-icon"></Icon><span class="item-button-text">新增</span>
          </Button>

          <Button type="ghost" size="small" class="item-button" @click="_toggleSearch">
            <Icon type="search" class="item-button-icon"></Icon><span class="item-button-text">筛选</span>
          </Button>
      </div>

      <div class="contract-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="合同名称" class="search">
      </div>

      <lazy-component>
        <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" :loading="loading"></i-table>
      </lazy-component>
      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <lazy-component>
        <!--筛选-->
        <Modal
          v-model="searchFlag"
          @on-ok="_beginSearch"
        >
          <Form :model="searchObj" :label-width="80">
            <FormItem label="所属单位">
              <Select
                v-model="searchObj.company.id"
                clearable
                filterable
                remote
                :loading="searchLoading"
                :loading-text="searchCompanyLoadingText"
                :remote-method="getCompanyQuery"
                @keyup.enter.native="searchCompany"
              >
                <Option v-for="(option, index) in companies" :value="option.id" :key="index">{{option.name}}</Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
        <!--create-->
        <Modal
          v-model="createFlag"
          title="创建"
          width="400"
          @on-ok="_create">
          <!--@on-cancel="cancel"-->
          <Form :model="createModel" :rules="ruleValidate" ref="createForm" :label-width="80">
            <!--自动生成 + 手工填写-->
            <FormItem label="合同名称" prop="name">
              <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
            </FormItem>
            <NewSearchCompany @on-select="newSelectCompanyForC"></NewSearchCompany>
            <FormItem label="合同金额">
              <Input v-model.trim="createModel.money" placeholder="请输入合同总金额"></Input>
            </FormItem>
            <FormItem label="合同类型" prop="type1">
              <RadioGroup v-model="createModel.type1" type="button">
                <Radio :label="t.id" v-for="(t, tk) in types" :key="tk">{{t.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="签约类型" prop="type2">
              <RadioGroup v-model="createModel.type2" type="button">
                <Radio label="销售"></Radio>
                <Radio label="客服"></Radio>
              </RadioGroup>
            </FormItem>
            <NewSearchEmps @on-select="newSelectEmpForPMC"></NewSearchEmps>
            <NewSearchEmps @on-select="newSelectEmpForTMC" type="TM"></NewSearchEmps>
            <FormItem label="签订日期" prop="time1">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime1"></DatePicker>
            </FormItem>
            <FormItem label="验收日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime2"></DatePicker>
            </FormItem>
            <FormItem label="失效日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime3"></DatePicker>
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
            <FormItem label="协作单位">
              <Select v-model.trim="createModel.coor" placeholder="请选择">
                <Option :value="c.id" v-for="(c, ck) in coors" :key="ck">{{c.name}}</Option>
              </Select>
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
            <!--自动生成 + 手工填写-->
            <FormItem label="合同编号">
              <Input v-model.trim="updateModel.contract_id" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="合同名称" prop="name">
              <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
            </FormItem>

            <NewSearchCompany @on-select="newSelectCompanyForU"></NewSearchCompany>

            <FormItem label="合同金额">
              <Input v-model.trim="updateModel.money" placeholder="请输入合同总金额"></Input>
            </FormItem>

            <FormItem label="合同类型" prop="type1">
              <RadioGroup v-model.number="updateModel.type1" type="button">
                <Radio :label="t.id" v-for="(t, tk) in types" :key="tk">{{t.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="签约类型" prop="type2">
              <RadioGroup v-model="updateModel.type2" type="button">
                <Radio label="销售"></Radio>
                <Radio label="客服"></Radio>
              </RadioGroup>
            </FormItem>
            <NewSearchEmps @on-select="newSelectEmpForPMU"></NewSearchEmps>
            <NewSearchEmps @on-select="newSelectEmpForTMU" type="TM"></NewSearchEmps>
            <FormItem label="签订日期" prop="time1">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time1" @on-change="setUTime1"></DatePicker>
            </FormItem>
            <FormItem label="验收日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time2" @on-change="setUTime2"></DatePicker>
            </FormItem>
            <FormItem label="失效日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.time3" @on-change="setUTime3"></DatePicker>
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
            <FormItem label="协作单位">
              <Select v-model.trim="updateModel.coor" placeholder="请选择">
                <Option :value="c.id" v-for="(c, ck) in coors" :key="ck">{{c.name}}</Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
        <!--delete-->
        <Modal
          v-model="deleteFlag"
          title="删除"
          @on-ok="_delete">
          <p>确定要删除合同?</p>
        </Modal>
        <!--回款情况-->
        <Modal
          v-model="moneyFlag"
          title="回款情况"
          :width="MoneyTableWidth + 50">
          <Tabs>
            <TabPane label="回款详情" icon="social-apple" v-if="moneyModel">
              <div v-if="contractMoney">
                <p class="detail-font">合同金额总计: <span style="font-weight: 700">{{ contractMoney }} </span> 元</p>
                <p class="detail-font">到款金额总计: <span style="font-weight: 700">{{moneyModel.reach}} </span> 元</p>
                <p class="detail-font">剩余金额总计: <span style="font-weight: 700">{{moneyModel.left }} </span> 元</p>
                <p class="detail-font">是否结清: <span style="font-weight: 700">{{moneyModel.finish }} </span></p>
                <p class="detail-font">分次数目: <span style="font-weight: 700">{{moneyModel.num}} </span> </p>
                <p class="detail-font" v-if="moneyModel.checker">责任人: <span style="font-weight: 700">{{moneyModel.checker.name}} </span> </p>
                <p class="detail-font">约定截止日期: <span style="font-weight: 700">{{moneyModel.t1}} </span> </p>
                <p class="detail-font">实际到款日期: <span style="font-weight: 700">{{moneyModel.t2}} </span> </p>
              </div>
              <div v-else>
                <h1 style="font-size:24px">未填写</h1>
              </div>
              <i-button @click="_toggleMoneyEdit" style="margin-left:20px;width:200px">编辑</i-button>
            </TabPane>
            <TabPane label="历次回款" icon="social-windows">
              <i-table border :columns="moneyColumn" :data="moneyDetailModel" :width="MoneyTableWidth" :loading="loading"></i-table>
              <br>
              <Button @click="_toggleMoneyDetailCreate" type="primary">新增回款细节</Button>
            </TabPane>
          </Tabs>
        </Modal>
        <!--回款详情编辑-->
        <Modal
          v-model="moneyEditFlag"
          title="回款情况编辑"
          width="400"
          @on-ok="updateMoney">
          <Form :model="moneyEditModel" :label-width="80">
            <FormItem label="是否分次" prop="type">
              <RadioGroup v-model="moneyEditModel.type" type="button">
                <Radio label="分次付款"></Radio>
                <Radio label="不分次"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="分次次数" v-if="moneyEditModel.type === '分次付款'">
              <Input v-model.number="moneyEditModel.num" placeholder="请输入分次次数"></Input>
            </FormItem>
            <FormItem label="是否结清">
              <RadioGroup v-model="moneyEditModel.finish" type="button">
                <Radio label="结清"></Radio>
                <Radio label="未结清"></Radio>
              </RadioGroup>
            </FormItem>
            <SearchChecker @on-select="selectCheckerForMoney"></SearchChecker>

            <FormItem label="约定日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="moneyEditModel.t1" @on-change="setMoneyTime1"></DatePicker>
            </FormItem>
            <FormItem label="结清日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="moneyEditModel.t2" @on-change="setMoneyTime2"></DatePicker>
            </FormItem>
          </Form>
        </Modal>
        <!--历次回款create-->
        <Modal
          v-model="moneyDetailCreateFlag"
          title="回款记录"
          width="400"
          @on-ok="_createMoneyDetail">
          <Form :model="moneyDetailCreateModel" :label-width="80">
            <FormItem label="合同金额">
              <Input v-model.trim="moneyDetailCreateModel.money" placeholder="请输入合同总金额"></Input>
            </FormItem>
            <FormItem label="约定日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="moneyDetailCreateModel.t1" @on-change="setMoneyCTime1"></DatePicker>
            </FormItem>
            <FormItem label="结清日期">
              <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="moneyDetailCreateModel.t2" @on-change="setMoneyCTime2"></DatePicker>
            </FormItem>
          </Form>
        </Modal>
        <!--套餐使用情况-->
        <Modal
          v-model="planFlag"
          title="合同套餐详情"
          width="800"
       >
          <i-table border :columns="planColumns" :data="planModel" :loading="loading"></i-table>
          <br>
          <i-button type="primary" @click="_toggleAddPlan">新增套餐</i-button>
        </Modal>
        <!--添加套餐-->
        <Modal
          v-model="planCreateFlag"
          title="为合同添加套餐"
          width="400"
          @on-ok="addPlan">
          <Form :model="planCreateModel" :label-width="80">
            <FormItem label="套餐类型">
              <Select v-model.trim="planCreateModel.plan_id" placeholder="请选择套餐">
                <Option :value="c.id" v-for="(c, ck) in contract_plans" :key="ck">{{c.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="标准/规格描述(别名)">
              <Input v-model.trim="planCreateModel.desc" placeholder="请输入标准/规格描述(别名)" type="textarea"></Input>
            </FormItem>
            <FormItem label="填写次数">
              <Input v-model.number="planCreateModel.total" placeholder="请输入次数"></Input>
            </FormItem>
            <FormItem label="备注">
              <Input v-model.trim="planCreateModel.remark" placeholder="有备注吗?" type="textarea"></Input>
            </FormItem>
          </Form>
        </Modal>
      </lazy-component>
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  import SearchChecker from 'base/SearchEmps/SearchChecker'
  import {curdMixin, pageMixin, moneyMixin} from 'common/js/mixin'
  import {uploadMixin} from 'common/js/baseMixin'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    mixins:[curdMixin, pageMixin, uploadMixin, moneyMixin],
    data(){
        return {
          url:'contracts',
          types:[],
          coors:[],
          contract_plans:[],
          //筛选搜索
          searchFlag:false,
          searchObj:{
            contract:{},
            company:{}
          },
            //公司
            companies:[],
            searchLoading: false,
            searchCompanyQuery: "",
            searchCompanyLoadingText:"",
          columns:[
            {
              title: `　合同编号`,
              key: 'contract_id',
              width: 120,
              fixed: 'left'
            },
            {
              title: ' ',
              key: 'name',
              width: 200,
              fixed:'left'
            },
            {
              title: '所属单位',
              key: 'company',
              width: 200,
              render: (h, params) => {
                if(this.dataArr[params.index].company){
                  return h('div', this.dataArr[params.index].company.name)
                }
              }
            },
            {
              title: '合同金额(元)',
              width: 150,
              key: 'money',
              render: (h, params) => {
                let money = this.dataArr[params.index].money
                if(!money){
                  money = '未填写'
                }
                return h('div', money)
              }
            },
            {
              title: '是否结清',
              width: 150,
              render: (h, params) => {
                let sm = this.dataArr[params.index].service_money
                let selfProp = {}

                true === !!sm
                  ? sm.finish === '结清'
                    ? selfProp = {type: 'success', word: sm.finish}
                    : selfProp = {type: 'error', word: sm.finish}
                  : selfProp = {type : "warning", word : "未填写"}

                return h('Button',{
                  props:{
                    type: selfProp.type,
                    size: 'small'
                  }
                }, selfProp.word)
              },
              filters:[
                {
                  label: '结清',
                  value: '结清'
                },
                {
                  label: '未结清',
                  value: '未结清'
                },
              ],
              filterMultiple:false,
              filterRemote:function(value, row){
                this.filterValueOne = (!!value[0]) === false ? "" : value[0]
                this._getData()
              }.bind(this)
            },
            {
              title: '合同类型',
              key: 'type1',
              width: 100,
              render: (h, params) => {
                  let retWord = ""
                  switch (this.dataArr[params.index].type1){
                    case "1":
                        retWord = `集成`
                        break
                    case "2":
                        retWord =  `服务`
                        break
                    case "3":
                        retWord =  `综合`
                        break
                    default:
                        break
                  }
                  return h('div', retWord)
              }
            },
            {
              title: '签订类型',
              key: 'type2',
              width: 100
            },
            {
              title: '项目经理',
              key: 'PM',
              width: 300,  //改成中文人名后, 缩短为200
              render: (h, params) => {
                  let data = this.dataArr[params.index].PM
                  let dom = []
                  if(data && data.length){
                      for(let pm of data){
                          dom.push(h('Button', {props:{size:'small'}, style: {margin:'3px'},}, pm.name))
                      }
                  }else {

                  }
                  return h('div', [
                    dom
                  ])
              }
            },
            {
              title: '技术经理',
              key: 'TM',
              width: 300,
              render: (h, params) => {
                let data = this.dataArr[params.index].TM
                let dom = []
                if(data && data.length){
                  for(let tm of data){
                    dom.push(h('Button', {props:{size:'small'}, style: {margin: '3px'},}, tm.name))
                  }
                }else {
                  dom = "未选择"
                }
                return h('div', [
                  dom
                ])
              }
            },
            {
              title: '签订日期',
              key: 'time1',
              width: 120
            },
            {
              title: '验收日期',
              key: 'time2',
              width: 120,
              render: (h, params) => {
                let time2 = this.dataArr[params.index].time2
                if(!time2){
                  time2 = '未填写'
                }
                return h('div', time2)
              }
            },
            {
              title: '失效日期',
              key: 'time3',
              width: 120,
              render: (h, params) => {
                let time3 = this.dataArr[params.index].time3
                if(!time3){
                  time3 = '未填写'
                }
                return h('div', time3)
              }
            },
            {
              title: '文件',
              key: 'document',
              width: 400,
              render: (h, params) => {
                let data = this.dataArr[params.index].document
                let dom = []
                if(data && data.length){
                  for(let doc of data){
                    dom.push(h('Button', {props:{size:'small'}, style: {marginRight: '3px'},}, doc.name))
                  }
                }else {
                  dom = "未上传"
                }
                return h('div', [
                  dom
                ])
              }
            },
            {
              title:"操作",
              align: "center",
              width: 280,
              fixed:'right',
              render: (h, params) => {
                  let planNum = params.row.contract_plans && params.row.contract_plans.length
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
                        this._togglePlans(params.index)
                      }
                    }
                  }, `${planNum}个套餐`),
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
                        this.toggleMoney(params.index)
                      }
                    }
                  }, '回款情况'),
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
                contract_id:null,  //合同id
                PM:null,  //项目经理id  多选,值格式 1,2,3
                TM:null,  //技术经理id  多选,值格式 1,2,3
                company_id:null,  //单位id
                desc:null,  //合同描述
                document: null,   //合同文件id--->关联文件表id  多选,值格式 1,2,3
//                money: null,  //合同金额 2位小数
                time1: null,  //签订日期
                time2: null,  //验收日期
                time3: null,  //失效日期
                type1: null,   //合同类型
                type2: null,    //合同签订类型
                coor : null,   //外协单位id 多选,值格式 1,2,3
            },
          updateModel:{
            name:null,
            contract_id:null,
            PM:null,
            TM:null,
            company:null,
            company_id:null,
            desc:null,
            document: null,
//            money: null,
            time1: null,
            time2: null,
            time3: null,
            type1: null,
            type2: null,
            coor : null,
          },
          ruleValidate: {
            PM: [
              {required: true, message: '项目经理不能为空', trigger: 'blur' }
            ],
            company_id: [
              {type:'number', required: true, message:'请选择单位', trigger: 'blur' }
            ],
            name: [
              {required: true, message: '合同名不能为空', trigger: 'blur' }
            ],
            type1: [
              { type:"number", required: true, message: '请选择合同类型', trigger: 'blur' }
            ],
            type2: [
              { required: true, message: '请选择签订类型', trigger: 'blur' }
            ],
            time1: [
              { required: true, message: '请填写签订日期', trigger: 'blur' }
            ],
          },
          //回款
          moneyColumn:[
            {
              title: `序号`,
              key: 'id',
              width: 60,
              fixed:'left',
              render : (h, params) => {
                  return ++params.index
              }
            },
            {
              title: `到款金额`,
              key: 'money',
              width: 120,
            },
            {
              title: `预计到款时间`,
              key: 't1',
              width: 180,
            },
            {
              title: `实际到款时间`,
              key: 't2',
              width: 180,
            },
            {
              title:"操作",
              align: "center",
              width: 120,
              fixed:'right',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this._deleteMoneyDetail(params.row.id)
                      }
                    }
                  }, '删除')
                ]);
              }
            }
          ],
          //回款细节
          moneyDetailCreateFlag:false,
          moneyDetailCreateModel:{},
          //套餐详情
          planFlag:false,
          planCreateFlag:false,
          contract_id : null, //用于存储打开时的合同id便于ORM
          planIndex:null,  //用于更新planModel
          planChanged:0,
          planColumns:[
            {
              title:"#",
              key:"id",
              width:60,
            },
            {
              title:"描述(别名)",
              key:"desc",
              width:150,
            },
            {
              title:"套餐原名",
              key:"name",
              width:120,
              render: (h, params) => {
                return params.row.plan_util.name
              }
            },
            {
              title:"总数",
              key:"total",
              width:80,
            },
            {
              title:"单位",
              key:"unit",
              width:120,
              render: (h, params) => {
                return params.row.plan_util.unit
              }
            },
            {
              title:"已使用",
              key:"use",
              width:80
            },
            {
              title:"备注",
              key:"remark",
              width:150,
            },
            {
              title:"操作",
              align: "center",
              width: 100,
              fixed:'right',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this._togglePlanDelete(params.row.id)
                      }
                    }
                  }, '删除')
                ]);
              }
            }
          ],
          planModel:[],
          planCreateModel:{}
        }
    },
    mounted(){
      this._getData()
    },
    computed:{
      ...mapGetters([
          'stepObj'
      ])
    },
    watch:{
      dataArr(newD, oldD){
        if(this.index !== null && this.dataArr[this.index].service_money.service_money_details){
          this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[this.index].service_money.service_money_details)
        }
        if(this.planIndex !== null){
          this.planModel = this.$lodash.cloneDeep(this.dataArr[this.planIndex].contract_plans)
        }
      }
    },
    methods:{
      //搜索
      _toggleSearch(){
        this.searchFlag = !this.searchFlag
      },
      getCompanyQuery(query){
        this.searchCompanyQuery = query
        this.searchLoading = true
        this.searchCompanyLoadingText = "按回车进行搜索"
      },
      searchCompany(){
        this.$http
          .get(`company/s/${this.searchCompanyQuery}/${this.page}/${this.pageSize}`)
          .then(res=>{
            this.companies = res.data.data.data
            this.searchLoading = false
          })
      },
      _beginSearch(){
        let body = Object.assign({}, this.searchObj)
        body.searchCondition = {
          page: this.page,
          pageSize: this.pageSize,
          company_id : body.company.id,
        }
        this._setLoading()
        this.$http.post(`contracts/newpage`, body).then(res=>{
          this.$Message.success(res.msg)
          res = res.data.data
          this.coors = res.coors
          this.types = res.contract_types
          this.contract_plans = res.contract_plans

          //假设无数据
          if(res.data.length === 0){
            this.$Message.info({
              'content': `没有数据`,
              'duration':3
            })
            res.data = [{}]
          }

          this.setDataArr(res.data)
          this.setTotal(res.total)

          this._setLoading()
        })

      },
      //套餐详情
        _togglePlans(index){
            this.planIndex = index
            this.contract_id = this.dataArr[index].id
            this.planModel = this.$lodash.cloneDeep(this.dataArr[index].contract_plans)
            this.planFlag = !this.planFlag
        },
        _toggleAddPlan(){
            this.planCreateFlag = !this.planCreateFlag
        },
        addPlan(){
          let url = `/${this.url}/addPlan/${this.contract_id}`
          this.$http.post(url, this.planCreateModel)
            .then(res=>{
              if(parseInt(res.data.code) === 2004){
                this._getData()
              }
            })
        },
        _togglePlanDelete(id){
          let url = `/${this.url}/deletePlan/${id}`
          this.$http
            .get(url)
            .then(res=>{
                if(parseInt(res.data.code) === 2006){
                    this._getData()
                }
            })
        },
      //回款的一些组件暴露的选择方法, 不放入moneyMixin
        setMoneyCTime1(v){this.moneyDetailCreateModel.t1 = v},
        setMoneyCTime2(v){this.moneyDetailCreateModel.t2 = v},
        selectCheckerForMoney(v){this.moneyEditModel.checker_id = v},
        setMoneyTime1(v){this.moneyEditModel.t1 = v},
        setMoneyTime2(v){this.moneyEditModel.t2 = v},
        //CURD
        showList(){console.log(this.fileList)},
        newSelectCompanyForC(v){this.createModel.company_id = v},
        newSelectCompanyForU(v){this.updateModel.company_id = v},
        newSelectEmpForPMC(v){this.createModel.PM = v},
        newSelectEmpForTMC(v){this.createModel.TM = v},
        newSelectEmpForPMU(v){this.updateModel.PM = v},
        newSelectEmpForTMU(v){this.updateModel.TM = v},
        setCTime1(date){this.createModel.time1 = date},
        setCTime2(date){this.createModel.time2 = date},
        setCTime3(date){this.createModel.time3 = date},
        setUTime1(date){this.updateModel.time1 = date},
        setUTime2(date){this.updateModel.time2 = date},
        setUTime3(date){this.updateModel.time3 = date},
        selectCompanyIdForC(v){this.createModel.company_id = v},
        selectCompanyIdForU(v){this.updateModel.company_id = v},
        _getData(){
            this._setLoading()
            let url = `/${this.url}/page/${this.page}/${this.pageSize}`,
            data = {
              value1:this.filterValueOne,
              value2:this.filterValueTwo,
              value3:this.filterValueThree,
              value4:this.filterValueFour
            }
            this.$http.post(url, data)
              .then(res=>{
                  res = res.data.data
                  this.coors = res.coors
                  this.types = res.contract_types
                  this.contract_plans = res.contract_plans

                  //假设无数据
                  if(res.data.length === 0){
                    this.$Message.info({
                      'content': `没有数据`,
                      'duration':3
                    })
                    res.data = [{}]
                  }

                  this.setDataArr(res.data)
                  this.setTotal(res.total)
                  this._setLoading()
              })
        },
        ...mapMutations({
          setStepObj : 'SET_STEP_OBJ'
        })
    },
    components:{
        Loading, NewSearchEmps, NewSearchCompany, SearchChecker
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .contract
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
    .contract-search
      position absolute
      top 117px
      left 140px
      z-index 50
      .search-icon
        display inline-block
        margin-left 20px
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
  .detail-font
    font-size: 14px;
    line-height: 32px;
    margin-left: 16px;
</style>
