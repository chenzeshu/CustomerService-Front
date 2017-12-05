<template>
    <div class="contract">
      <div class="contract-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="contract-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="合同名称" class="search">
      </div>

      <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" :loading="loading"></i-table>

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
          <!--自动生成 + 手工填写-->
          <FormItem label="合同编号" prop="contract_id">
            <Input v-model.trim="createModel.contract_id" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="合同名称" prop="name">
            <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
          </FormItem>
          <NewSearchCompany @on-select="newSelectCompanyForC"></NewSearchCompany>
          <FormItem label="合同类型" prop="type1">
            <RadioGroup v-model="createModel.type1" type="button">
              <Radio :label="t.id" v-for="(t, tk) in types" :key="tk">{{t.name}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="签约类型" prop="type2">
            <RadioGroup v-model="createModel.type2" type="button">
              <Radio label="销售"></Radio>
              <Radio label="客服"></Radio>
              <Radio label="临时"></Radio>
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
          <FormItem label="质保截止">
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
          <FormItem label="合同编号" prop="contract_id">
            <Input v-model.trim="updateModel.contract_id" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="合同名称" prop="name">
            <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
          </FormItem>

          <NewSearchCompany @on-select="newSelectCompanyForU"></NewSearchCompany>

          <FormItem label="合同类型" prop="type1">
            <RadioGroup v-model.number="updateModel.type1" type="button">
              <Radio :label="t.id" v-for="(t, tk) in types" :key="tk">{{t.name}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="签约类型" prop="type2">
            <RadioGroup v-model="updateModel.type2" type="button">
              <Radio label="销售"></Radio>
              <Radio label="客服"></Radio>
              <Radio label="临时"></Radio>
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
          <FormItem label="质保截止">
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
            <div v-if="moneyModel.money">
              <p class="detail-font">合同金额总计: <span style="font-weight: 700">{{moneyModel.money}} </span> 元</p>
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
          <FormItem label="合同金额">
            <Input v-model.trim="moneyEditModel.money" placeholder="请输入合同总金额"></Input>
          </FormItem>
          <FormItem label="是否分次" prop="type">
            <RadioGroup v-model="moneyEditModel.type" type="button">
              <Radio label="分次付款"></Radio>
              <Radio label="不分次"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="分次次数">
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
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  import SearchChecker from 'base/SearchEmps/SearchChecker'
  import {curdMixin, pageMixin} from 'common/js/mixin'
  import {uploadMixin} from 'common/js/baseMixin'
  import {mapGetters, mapMutations} from 'vuex'


  export default {
    mixins:[curdMixin, pageMixin, uploadMixin],
    data(){
        return {
          url:'contracts',
          types:[],
          coors:[],
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
              width: 200,
              render: (h, params) => {
                if(this.dataArr[params.index].company){
                  return `${this.dataArr[params.index].company.name}`
                }
              }
            },
            {
              title: '是否结清',
              width: 150,
              render: (h, params) => {
                if(this.dataArr[params.index].service_money){
                  return `${this.dataArr[params.index].service_money.finish}`
                }
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
              filterRemote(value, row){
                this.filterValueOne = (!!value[0]) === false ? "" : value[0]
                this._setLoading()
                let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
                this.$http.get(url)
                  .then(res=>{
                    res = res.data.data
                    this.total = res.total
                    this.coors = res.coors
                    this.types = res.types
                    this.setDataArr(res.data)
                    this._setLoading()
                    return
                  })
              }
            },
            {
              title: '合同类型',
              key: 'type1',
              width: 100,
              render: (h, params) => {
                  switch (this.dataArr[params.index].type1){
                    case "1":
                        return `集成`
                        break
                    case "2":
                        return `服务`
                        break
                    case "3":
                        return `综合`
                        break
                    default:
                        break
                  }
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
                      return h('div', [
                          dom
                      ])
                  }else {
                      return "未填写"
                  }
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
                  return h('div', [
                    dom
                  ])
                }else {
                  return "未填写"
                }
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
              width: 120
            },
            {
              title: '质保截止日期',
              key: 'time3',
              width: 120
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
                  return h('div', [
                    dom
                  ])
                }else {
                  return "未填写"
                }
              }
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
                time3: null,  //质保截止日期
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
            contract_id: [
              {required: true, message: '合同编号不能为空', trigger: 'blur' }
            ],
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
          index:null,
          moneyId : null,
          moneyFlag:false,
          moneyEditFlag:false,
          moneyModel:{},    //详情展示model
          moneyDetailModel:[],  //历次回款展示数组model
          moneyEditModel:{  //详情修改model
            money:null,
            t1:null,
            t2:null
          },
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
      dataArr(){
        if(this.index !== null){
          this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[this.index].service_money.service_money_details)
        }
      }
    },
    methods:{
        //回款细节
        setMoneyCTime1(v){
          this.moneyDetailCreateModel.t1 = v
        },
        setMoneyCTime2(v){
          this.moneyDetailCreateModel.t2 = v
        },
        _toggleMoneyDetailCreate(){
          //校验是否超过次数
          if(this.moneyDetailModel.length >= this.moneyModel.num){
              this.$Message.error({
                'content' : '已达回款分次次数上限',
                'duration' : 3
              })
              return
          }


          this.moneyDetailCreateFlag = !this.moneyDetailCreateFlag
        },
        _createMoneyDetail(){
          let url = `${this.url}/createMoneyDetail/${this.moneyId}`
          this.$http.post(url, this.moneyDetailCreateModel)
            .then(res=>{
              res = res.data
              if(parseInt(res.code) === 2006){
                this.$Message.success({
                  'content':res.msg
                })
                this._getData()
              }
            })
        },
        _updateMoneyDetail(){

        },
        _deleteMoneyDetail(id){
          let url = `${this.url}/delMoneyDetail/${id}`
          this.$http.get(url)
            .then(res=>{
              res = res.data
              if(parseInt(res.code) === 2006){
                this.$Message.success({
                  'content':res.msg
                })
                this._getData()
              }
            })
        },
        //回款
        updateMoney(){
            let url = `${this.url}/updateMoney/${this.moneyId}`
            this.$http.post(url, this.moneyEditModel)
              .then(res=>{
                  res = res.data
                    if(parseInt(res.code) === 2006){
                      this.$Message.success({
                        'content':res.msg
                      })
                      this._getData()
                      this.moneyFlag = !this.moneyFlag
                      setTimeout(()=>{
                         this.toggleMoney(this.index)
                      }, 1000)
                    }
              })
        },
        toggleMoney(index){
            this.index = index
            this.moneyId = this.dataArr[index].id   //不是money表而是contract表的id, 用于orm
            this.moneyFlag = !this.moneyFlag
            this.moneyModel = this.$lodash.cloneDeep(this.dataArr[index].service_money)
            this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[index].service_money.service_money_details)

            if(typeof this.moneyModel !== 'undefined'){
              this.moneyModel.reach = 0
              this.moneyDetailModel.map((item)=>{
                this.moneyModel.reach += parseInt(item.money)
              })
              this.moneyModel.left = this.moneyModel.money - this.moneyModel.reach
            }
        },
        _toggleMoneyEdit(){
            this.moneyEditFlag = !this.moneyEditFlag
            this.moneyEditModel = this.$lodash.cloneDeep(this.moneyModel)
            if(this.moneyEditModel.checker){
              this.setStepObj(this.$lodash.cloneDeep(this.moneyEditModel))
            }

        },
        selectCheckerForMoney(v){
            this.moneyEditModel.checker_id = v
        },
        setMoneyTime1(v){
            this.moneyEditModel.t1 = v
        },
        setMoneyTime2(v){
            this.moneyEditModel.t2 = v
        },
        //CURD
        showList(){
          console.log(this.fileList)
        },
        newSelectCompanyForC(v){
          this.createModel.company_id = v
        },
        newSelectCompanyForU(v){
          this.updateModel.company_id = v
        },
        newSelectEmpForPMC(v){
          this.createModel.PM = v
        },
        newSelectEmpForTMC(v){
          this.createModel.TM = v
        },
        newSelectEmpForPMU(v){
          this.updateModel.PM = v
        },
        newSelectEmpForTMU(v){
          this.updateModel.TM = v
        },
        setCTime1(date){
          this.createModel.time1 = date
        },
        setCTime2(date){
          this.createModel.time2 = date
        },
        setCTime3(date){
          this.createModel.time3 = date
        },
        setUTime1(date){
          this.updateModel.time1 = date
        },
        setUTime2(date){
          this.updateModel.time2 = date
        },
        setUTime3(date){
          this.updateModel.time3 = date
        },
        selectCompanyIdForC(v){
          this.createModel.company_id = v
        },
        selectCompanyIdForU(v){
          this.updateModel.company_id = v
        },
        _getData(){
            this._setLoading()
            let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
            this.$http.get(url)
              .then(res=>{
                  res = res.data.data
                  this.total = res.total
                  this.coors = res.coors
                  this.types = res.types
                  this.setDataArr(res.data)
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
    .page-wrapper
      margin 10px auto
    .contract-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
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
