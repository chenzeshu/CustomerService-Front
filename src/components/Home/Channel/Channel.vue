<template>
    <div class="channel">
      <div class="channel-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="channel-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="服务单编号" class="search">
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
          <!--自动生成 + 手工填写-->
          <FormItem label="服务单编号" prop="channel_id">
            <Input v-model.trim="createModel.channel_id" placeholder="请输入"></Input>
          </FormItem>
          <NewSearchContract @on-select="selectContractForC" type="channel"></NewSearchContract>
          <NewSearchEmps @on-select="selectEmpForCus" type="CUS"></NewSearchEmps>
          <FormItem label="状态" prop="status">
            <Select v-model="createModel.status" style="width:200px">
              <Option v-for="item in status" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="来源" prop="source">
            <Select v-model.number="createModel.source" style="width:200px">
              <Option v-for="s in sources" :value="s.id" :key="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="用星类型" prop="type">
            <RadioGroup v-model="createModel.type" type="button">
              <Radio label="外部用星"></Radio>
              <Radio label="内部用星"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>

      <!--update-->
      <Modal
        v-model="updateFlag"
        title="创建"
        width="400"
        @on-ok="update">
        <!--@on-cancel="cancel"-->
        <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <FormItem label="服务单编号" prop="channel_id">
            <Input v-model.trim="updateModel.channel_id" placeholder="请输入"></Input>
          </FormItem>
          <NewSearchContract @on-select="selectContractForU" type="channel"></NewSearchContract>
          <NewSearchEmps @on-select="selectEmpForCusU" type="CUS"></NewSearchEmps>
          <FormItem label="状态" prop="status">
            <Select v-model="updateModel.status" style="width:200px">
              <Option v-for="item in status" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="来源" prop="source">
            <Select v-model.number="updateModel.source" style="width:200px">
              <Option v-for="s in sources" :value="s.id" :key="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="用星类型" prop="type">
            <RadioGroup v-model="updateModel.type" type="button">
              <Radio label="外部用星"></Radio>
              <Radio label="内部用星"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除服务单?</p>
      </Modal>
    </div>
</template>

<script>
    import Loading from 'base/Loading/Loading'
    import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
    import NewSearchContract from 'base/SearchContract/NewSearchContract'
    import {curdMixin, pageMixin} from 'common/js/mixin'

    export default {
      mixins:[curdMixin, pageMixin],
      data(){
          return {
              url:"channels",
              sources:[],
              status:[
                  '待审核','运营调配', '已完成', '拒绝'
              ],
              columns:[
              {
                title: `　`,
                key: 'channel_id',
                width: 200,
                fixed: 'left'
              },
              {
                title: '状态',
                key:'status',
                width: 200
              },
              {
                title: '客户联系人',
                key: 'customer',
                width: 300,
                render: (h, params) => {
                  let data = this.dataArr[params.index].customer
                  let dom = []
                  if(data && data.length){
                    for(let cus of data){
                      dom.push(h('Button', {props:{size:'small'}, style: {margin:'3px'},}, cus.name))
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
                title: '来源',
                width: 200,
                render: (h, params) => {
                    let info = this.dataArr[params.index].source_info
                    if(typeof info !== "undefined" && typeof info[0] !=='undefined'){
                      return this.dataArr[params.index].source_info[0].name
                    }
                }
              },
              {
                title: '用星类型',
                key: 'type',
                width: 200
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
                  channel_id:null,
                  employee_id:null,
                  contractc_id:null,
                  status:null,
                  source:null,
                  type:null
              },
              updateModel:{
                channel_id:null,
                employee_id:null,
                contractc_id:null,
                status:null,
                source:null,
                type:null
              },
              ruleValidate:{
                channel_id: [
                  {required: true, message: '服务单编号不能为空', trigger: 'blur' }
                ],
                contractc_id: [
                  {type:"number", required: true, message: '合同编号不能为空', trigger: 'blur' }
                ],
                type: [
                  {required: true, message: '请选择合同类型', trigger: 'blur' }
                ],
                source: [
                  { type:"number", required: true, message: '请选择来源', trigger: 'blur' }
                ],
                status: [
                  { required: true, message: '请选择状态', trigger: 'blur' }
                ],
              }
          }
      },
      computed:{

      },
      created(){
          this._getData()
      },
      methods:{
        selectContractForC(v){
          this.createModel.contractc_id = v
        },
        selectContractForU(v){
          this.updateModel.contractc_id = v
        },
        selectEmpForCus(v){
          this.createModel.employee_id = v
        },
        selectEmpForCusU(v){
          this.updateModel.employee_id = v
        },
        _getData(){
          this._setLoading()
          this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
            .then(res=>{
              res = res.data.data
              this.total = res.total
              this.sources = res.sources
              this.setDataArr(res.data)
              this._setLoading()
            })
        }
      },
      components:{
          Loading, NewSearchEmps, NewSearchContract
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .channel
    width 100%
    .page-wrapper
      margin 10px auto
    .channel-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .channel-search
      position absolute
      top 117px
      left 60px
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
        width: 5vw
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
