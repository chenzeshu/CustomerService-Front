<template>
    <div class="contractc">
      <div class="contractc-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="contractc-search">
        <input type="text" v-model.trim="searchWord" placeholder="合同编号" class="search">
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

      <!--createModel-->
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
          <FormItem label="合同编号" prop="contract_id">
            <Input v-model.trim="updateModel.contract_id" placeholder="请输入"></Input>
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
    </div>
</template>

<script>
    import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
    import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
    import {mapGetters, mapMutations} from 'vuex'
    import Loading from 'base/Loading/Loading'
    import {curdMixin, pageMixin} from 'common/js/mixin'
    import {uploadMixin} from 'common/js/baseMixin'

    export default {
       mixins:[curdMixin, pageMixin, uploadMixin],
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
                 title: '合同金额(元)',
                 key: 'money',
                 width: 150
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
             createModel: {
               name: null,  //合同名称
               company:null,
               company_id:null,
               contract_id:null,  //合同编号
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
               contract_id:null,  //合同编号
               PM:null,
               time:null,
               beginline:null,
               deadline:null,
               money:null,
               desc:null,
               document:null,
             },
             ruleValidate:{
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
             }
           }
       },
       created(){
          this._getData()
       },
       computed:{

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
            this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
              .then(res=>{
                res = res.data.data
                this.total = res.total
                this.setDataArr(res.data)
                this._setLoading()
              })
          },
       },
       components:{
           Loading, NewSearchEmps, NewSearchCompany
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
</style>
