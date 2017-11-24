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
          <!--<FormItem label="上传文件">-->
            <!--<Input v-model.trim="createModel.document" placeholder="请输入"></Input>-->
          <!--</FormItem>-->
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
            <RadioGroup v-model="updateModel.type1" type="button">
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
          <!--<FormItem label="上传文件">-->
            <!--<Input v-model.trim="updateModel.document" placeholder="请输入"></Input>-->
          <!--</FormItem>-->
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
    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
  import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
  import {curdMixin, pageMixin} from 'common/js/mixin'

  export default {
    mixins:[curdMixin, pageMixin],
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
                money: null,  //合同金额 2位小数
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
            money: null,
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
              {required: true, message: '请选择合同类型', trigger: 'blur' }
            ],
            type2: [
              { required: true, message: '请选择签订类型', trigger: 'blur' }
            ],
            time1: [
              { required: true, message: '请填写签订日期', trigger: 'blur' }
            ],
          },
        }
    },
    mounted(){
      this._getData()
    },
    methods:{
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
            this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
              .then(res=>{
                  res = res.data.data
                  this.total = res.total
                  this.coors = res.coors
                  this.types = res.types
                  this.setDataArr(res.data)
                  this._setLoading()
              })
        }
    },
    components:{
        Loading, NewSearchEmps, NewSearchCompany
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
</style>
