<template>
    <div class="contractc">
      <div class="contractc-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="contractc-search">
        <input type="text" v-model.trim="searchWord" placeholder="合同编号" class="search">
      </div>

      <lazy-component>
        <i-table border :columns="columns" :data="dataArr" :width="curWidth" v-if="dataArr.length" v-cloak></i-table>
      </lazy-component>

      <div class="page-wrapper">
        <div class="page">
          <Page :current="page" :total="total" simple @on-change="onChange"></Page>
        </div>
      </div>

      <Loading :loading="loading"></Loading>

      <!--createModel-->
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

          <NewSearchEmps @on-select="newSelectEmpForPMC"></NewSearchEmps>
          <FormItem label="签订日期" prop="time">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime1"></DatePicker>
          </FormItem>
          <FormItem label="生效日期" prop="beginline">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" @on-change="setCTime2"></DatePicker>
          </FormItem>
          <FormItem label="失效日期" prop="deadline">
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
          <FormItem label="合同金额(元)" prop="money">
            <Input v-model.trim="createModel.money"></Input>
          </FormItem>
          <FormItem label="合同描述">
            <Input v-model.trim="createModel.desc" placeholder="合同描述" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!--updateModel-->
      <Modal
        v-model="updateFlag"
        title="修改"
        width="400"
        @on-ok="update">
        <!--@on-cancel="cancel"-->
        <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <FormItem label="合同编号" prop="contractc_id">
            <Input v-model.trim="updateModel.contractc_id" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="合同名称" prop="name">
            <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
          </FormItem>

          <NewSearchCompany @on-select="newSelectCompanyForU"></NewSearchCompany>

          <NewSearchEmps @on-select="newSelectEmpForPMU"></NewSearchEmps>
          <FormItem label="签订日期" prop="time">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px"  :value="updateModel.time" @on-change="setUTime1"></DatePicker>
          </FormItem>
          <FormItem label="生效日期" prop="begline">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.beginline" @on-change="setUTime2"></DatePicker>
          </FormItem>
          <FormItem label="失效日期" prop="deadline">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.deadline" @on-change="setUTime3"></DatePicker>
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
          <FormItem label="合同金额(元)" prop="money">
            <Input v-model.trim="updateModel.money"></Input>
          </FormItem>
          <FormItem label="合同描述">
            <Input v-model.trim="updateModel.desc" placeholder="合同描述" type="textarea"></Input>
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
              <p class="detail-font">合同金额总计: <span style="font-weight: 700">{{contractMoney}} </span> 元</p>
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
          <FormItem label="合同金额(元)">
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
              <Option :value="c.id" v-for="(c, ck) in contractc_plans" :key="ck">{{c.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="套餐名">
            <Input v-model.trim="planCreateModel.alias" placeholder="请输入标准/规格描述(别名)" type="textarea"></Input>
          </FormItem>
          <FormItem label="填写总分钟数">
            <Input v-model.number="planCreateModel.total" placeholder="请输入分钟数"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="planCreateModel.remark" placeholder="有备注吗?" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
    import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
    import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
    import SearchChecker from 'base/SearchEmps/SearchChecker'
    import {mapGetters, mapMutations} from 'vuex'
    import Loading from 'base/Loading/Loading'
    import {curdMixin, pageMixin, moneyMixin} from 'common/js/mixin'
    import {uploadMixin} from 'common/js/baseMixin'

    export default {
       mixins:[curdMixin, pageMixin, uploadMixin, moneyMixin],
       data(){
           return {
             url: 'contractcs',
             columns:[
               {
                 title: `　合同编号`,
                 key: 'contract_id',
                 width: 150,
                 fixed: 'left'
               },
               {
                 title: '合同名称',
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
                 title:'合同金额(元)',
                 width:160,
                 key:'money',
               },
               {
                 title: '是否结清',
                 width: 150,
                 render: (h, params) => {
                   if(this.dataArr[params.index].channel_money){
                     return `${this.dataArr[params.index].channel_money.finish}`
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
                   this._getData()
                 }
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
                 title: '签订日期',
                 key: 'time',
                 width: 120
               },
               {
                 title: '生效日期',
                 key: 'beginline',
                 width: 120
               },
               {
                 title: '失效日期',
                 key: 'deadline',
                 width: 120
               },
               {
                 title: '合同描述',
                 key: 'desc',
                 width: 150
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
                 width: 250,
                 fixed:'right',
                 render: (h, params) => {
                   let planNum = 0
                     if(typeof params.row.contractc_plans !== "undefined"){
                        planNum = params.row.contractc_plans.length
                     }

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
             createModel: {
               name: null,  //合同名称
               company:null,
               company_id:null,
               contractc_id:null,  //合同编号
               PM:null,
               time:null,
               beginline:null,
               deadline:null,
               money:null,
               desc:null,
               document:null,
             },
             updateModel: {
               name: null,  //合同id
               company:null,
               company_id:null,
               contractc_id:null,  //合同编号
               PM:null,
               time:null,
               beginline:null,
               deadline:null,
               money:null,
               desc:null,
               document:null,
             },
             ruleValidate:{
               PM: [
                 {required: true, message: '项目经理不能为空', trigger: 'blur' }
               ],
               company_id: [
                 {type:'number', required: true, message:'请选择单位', trigger: 'blur' }
               ],
               name: [
                 {required: true, message: '合同名不能为空', trigger: 'blur' }
               ],
               time: [
                 { required: true, message: '请填写签订日期', trigger: 'blur' }
               ],
               beginline:[
                 { required: true, message: '请填写签订日期', trigger: 'blur' }
               ],
               deadline: [
                 { required: true, message: '请填写签订日期', trigger: 'blur' }
               ],
               money: [
                 { required: true, message: '请填写合同金额', trigger: 'blur' }
               ]
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
             contractc_plans:[],
             planFlag:false,
             planCreateFlag:false,
             contractc_id : null, //用于存储打开时的合同id便于ORM
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
                 key:"alias",
                 width:150,
               },
               {
                 title:"套餐原名",
                 key:"name",
                 width:120,
                 render: (h, params) => {
                   return params.row.plan.name
                 }
               },
               {
                 title:"总数(分钟)",
                 key:"total",
                 width:100,
                 render: (h, params) => {
                   return params.row.total * 15
                 }
               },
               {
                 title:"已使用(分钟)",
                 key:"use",
                 width:100,
                 render: (h, params) => {
                   return params.row.use * 15
                 }
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
       created(){
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
             this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[this.index].channel_money.channel_money_details)
           }
           if(this.planIndex !== null){
             this.planModel = this.$lodash.cloneDeep(this.dataArr[this.planIndex].contractc_plans)
           }
         }
       },
       methods:{
         //套餐详情
         _togglePlans(index){
           this.planIndex = index
           this.contractc_id = this.dataArr[index].id
           this.planModel = this.$lodash.cloneDeep(this.dataArr[index].contractc_plans)
           this.planFlag = !this.planFlag
         },
         _toggleAddPlan(){
           this.planCreateFlag = !this.planCreateFlag
         },
         addPlan(){
           let url = `/${this.url}/addPlan/${this.contractc_id}`
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
         setMoneyCTime1(v){
           this.moneyDetailCreateModel.t1 = v
         },
         setMoneyCTime2(v){
           this.moneyDetailCreateModel.t2 = v
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
         newSelectCompanyForC(v){
           this.createModel.company_id = v
         },
         newSelectCompanyForU(v){
           this.updateModel.company_id = v
         },
         newSelectEmpForPMC(v){
           this.createModel.PM = v
         },
         newSelectEmpForPMU(v){
           this.updateModel.PM = v
         },
         setCTime1(date){
           this.createModel.time = date
         },
         setCTime2(date){
           this.createModel.beginline = date
         },
         setCTime3(date){
           this.createModel.deadline = date
         },
         setUTime1(date){
           this.updateModel.time = date
         },
         setUTime2(date){
           this.updateModel.beginline = date
         },
         setUTime3(date){
           this.updateModel.deadline = date
         },
          _getData(){
            this._setLoading()
            let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
            this.$http.get(url)
              .then(res=>{
                res = res.data.data
                this.total = res.total
                this.setDataArr(res.data)
                this.contractc_plans = res.contractc_plans
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
  .contractc
    width 100%
    .page-wrapper
      margin 10px auto
    .contractc-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .contractc-search
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
  .detail-font
    font-size: 14px;
    line-height: 32px;
    margin-left: 16px;
</style>
