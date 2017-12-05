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

      <!--step-->
      <Modal
        v-model="stepFlag"
        title="步骤详情"
        width="450"
        @on-ok="_updateStep">
        <div class="step-title">
          <Steps :current="current">
            <Step title="待审核" style="margin-left:2%"></Step>
            <Step title="运营调配"></Step>
            <Step title="已完成" style="width:25%"></Step>
          </Steps>
        </div>

        <div class="first" v-show="current === 0">
          <Form :model="stepModel" :label-width="80">
            <br>
            <FormItem label="套餐">
              <Select v-model.number="stepModel.id1" style="width:200px" disabled>
                <Option v-for="item in plans" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="通信卫星">
              <Select v-model.number="stepModel.id2" style="width:200px" disabled>
                <Option v-for="item in tongxins" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="极化">
              <Select v-model.number="stepModel.id3" style="width:200px" disabled>
                <Option v-for="item in jihuas" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <!--<FormItem label="频率">-->
              <!--<Select v-model.number="stepModel.id4" style="width:200px" disabled>-->
                <!--<Option v-for="item in pinlvs" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="申请时间">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px" :value="stepModel.t1" readonly></DatePicker>
            </FormItem>
            <FormItem label="结束时间">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px" :value="stepModel.t2" readonly></DatePicker>
            </FormItem>
          </Form>
        </div>
        <br>
        <div class="second" v-show=" current === 1"
             v-if="stepModel.channel_operative">
          <Form :model="stepModel" :label-width="80" :rules="ruleValidate2" ref="secondForm">
            <FormItem label="套餐" prop="plan">
              <Select v-model.number="stepModel.channel_operative.id1" style="width:200px">
                <Option v-for="item in plans" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="通信卫星" prop="tongxin">
              <Select v-model.number="stepModel.channel_operative.id2" style="width:200px">
                <Option v-for="item in tongxins" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="极化" prop="jihua">
              <Select v-model.number="stepModel.channel_operative.id3" style="width:200px">
                <Option v-for="item in jihuas" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <!--<FormItem label="频率" prop="pinlv">-->
              <!--<Select v-model.number="stepModel.channel_operative.id4" style="width:200px">-->
                <!--<Option v-for="item in pinlvs" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="开始时间" prop="t1">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                          :value="stepModel.channel_operative.t1" @on-change="setOTime1"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="t2">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                          :value="stepModel.channel_operative.t2" @on-change="setOTime2"></DatePicker>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="stepModel.channel_operative.remark"></Input>
            </FormItem>

          </Form>
        </div>
        <div class="third" v-show="current === 2"
             v-if="stepModel.channel_real">
          <Form :model="stepModel" :label-width="80" :rules="ruleValidate3" ref="thirdForm">
            <SearchChecker @on-select="selectCheckerForStep"></SearchChecker>
            <FormItem label="套餐" prop="plan">
              <Select v-model.number="stepModel.channel_real.id1" style="width:200px">
                <Option v-for="item in plans" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="通信卫星" prop="tongxin">
              <Select v-model.number="stepModel.channel_real.id2" style="width:200px">
                <Option v-for="item in tongxins" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="极化" prop="jihua">
              <Select v-model.number="stepModel.channel_real.id3" style="width:200px">
                <Option v-for="item in jihuas" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <!--<FormItem label="频率" prop="pinlv">-->
              <!--<Select v-model.number="stepModel.channel_real.id4" style="width:200px">-->
                <!--<Option v-for="item in pinlvs" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="开始时间" prop="t1">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                          :value="stepModel.channel_real.t1" @on-change="setRTime1"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="t2">
              <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                          :value="stepModel.channel_real.t2" @on-change="setRTime2"></DatePicker>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="stepModel.channel_real.remark"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="step-buttons" style="margin-left:30%">
          <Button type="ghost" @click="back">上一步</Button>
          <Button type="ghost" @click="next">下一步</Button>
        </div>
      </Modal>

      <!--relations节点-->
      <Modal
        v-model="reFlag"
        title="节点详情"
        :width="curTableWidth">
        <table class="ivu-table ivu-table-border" style="width:50vw;min-width:700px; margin-top:10px"
               cellspacing="0" cellpadding="0">
          <thead class="ivu-table-header">
          <tr>
            <th class="ivu-table-cell">节点</th>
            <th class="ivu-table-cell">所属公司</th>
            <th class="ivu-table-cell">设备型号</th>
            <th class="ivu-table-cell">设备类型</th>
            <th class="ivu-table-cell">设备ip</th>
            <th class="ivu-table-cell">操作</th>
          </tr>
          </thead>
          <tbody class="ivu-table-body">
          <tr class="ivu-table-row" v-for="(device, kd) in relationModel" :key="kd" v-if="device.company && device.device">
            <td class="ivu-table-cell">节点{{ kd+1 }}</td>
            <td class="ivu-table-cell">{{ device.company.name }}</td>
            <td class="ivu-table-cell">{{ device.device.device_id}}</td>
            <td class="ivu-table-cell">{{ device.device.type}}</td>
            <td class="ivu-table-cell">{{ device.device.ip}}</td>
            <td class="ivu-table-cell">
              <i-button type="error" size="small" @click="deleteDevice(device)">删除</i-button>
            </td>
          </tr>
          </tbody>
        </table>
        <br>
        <Button @click="_toggleRelationCreate">新增节点</Button>
      </Modal>

      <!--createRelation-->
      <Modal
        v-model="reFlag2"
        title="新增节点"
        width="500"
        @on-ok="addDevice"
        @on-cancel="resetModel">
        <Form :model="reCreateModel" :label-width="80">
          <NewSearchCompany @on-select="selectCompanyForR" ref="showCompany"></NewSearchCompany>
          <ShowDevice @selectDevice="selectDeviceForR" ref="showDevice"></ShowDevice>
          <FormItem label="站类型">
            <i-select v-model="reCreateModel.zhan_id">
              <i-option v-for="type in zhanTypes" :key="type.id" :value="type.id">{{ type.name }}</i-option>
            </i-select>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
    import Loading from 'base/Loading/Loading'
    import NewSearchEmps from 'base/SearchEmps/NewSearchEmps'
    import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
    import SearchChecker from 'base/SearchEmps/SearchChecker'
    import ShowDevice from 'base/SearchDevice/ShowDevice'
    import NewSearchContract from 'base/SearchContract/NewSearchContract'
    import {curdMixin, pageMixin} from 'common/js/mixin'
//    import {uploadMixin} from 'common/js/baseMixin'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
      mixins:[curdMixin, pageMixin],
      data(){
          return {
              url:"channels",
              sources:[],
              status:['待审核','运营调配', '已完成', '拒绝'],
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
                width: 200,
                filters:[
                  {
                    label: '运营调配',
                    value: '运营调配'
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
                      this.setDataArr(res.data)
                      //utils
                      this.sources = res.sources
                      this.plans = res.plans
//              this.pinlvs = res.pinlvs
                      this.jihuas = res.jihuas
                      this.tongxins = res.tongxins
                      this.zhanTypes = res.zhantypes
                      this._setLoading()
                    })
                }
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
                width: 300,
                fixed:'right',
                render: (h, params) => {
                  if(typeof params.row.channel_applys === 'undefined'){
                      return
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
                          this._toggleRelations(params.index)
                        }
                      }
                    }, `${params.row.channel_applys[0].channel_relations.length}个节点`),
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
                          this._toggleSteps(params.index)
                        }
                      }
                    }, '展开详情'),
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
              apply_id:null,
              index:null,
              reFlag:false,
              reFlag2:false,
              relationModel:{
                company:{},
                device:{}
              },
              reCreateModel:{
                company_id:null,
                device_id:null,
                zhan_id:null
              },
              stepFlag:false,
              current:1,
              stepModel:{
                  channel_operative:{},
                  channel_real:{},
              },
              jihuas:[],
              tongxins:[],
              pinlvs:[],
              plans:[],
              zhanTypes : [],
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
              },
              ruleValidate2:{
//                pinlv:[ {type:'number',required: true, message: '频率不能为空', trigger: 'blur' }],
                jihua:[ {type:'number',required: true, message: '极化不能为空', trigger: 'blur' }],
                tongxin:[ {type:'number',required: true, message: '通信卫星不能为空', trigger: 'blur' }],
                plan:[ {type:'number',required: true, message: '套餐不能为空', trigger: 'blur' }],
                t1:[{required: true, message: '开始时间不能为空', trigger: 'blur' }],
                t2:[{required: true, message: '结束时间不能为空', trigger: 'blur' }]
              },
              ruleValidate3:{
//                pinlv:[ {type:'number',required: true, message: '频率不能为空', trigger: 'blur' }],
                jihua:[ {type:'number',required: true, message: '极化不能为空', trigger: 'blur' }],
                tongxin:[ {type:'number',required: true, message: '通信卫星不能为空', trigger: 'blur' }],
                plan:[ {type:'number',required: true, message: '套餐不能为空', trigger: 'blur' }],
                checker:[ {required: true, message: '责任人不能为空', trigger: 'blur' }],  //虽然最后出来的是checker_id, 但是这里保证了checker的存在
                t1:[{required: true, message: '开始时间不能为空', trigger: 'blur' }],
                t2:[{required: true, message: '结束时间不能为空', trigger: 'blur' }]
              },
          }
      },
      computed:{
        ...mapGetters([
            'stepObj'
        ])
      },
      watch:{
        dataArr(){
            if(this.index !==null){
              this.relationModel = this.$lodash.cloneDeep(this.dataArr[this.index].channel_applys[0].channel_relations)
            }
        }
      },
      created(){
          this._getData()
      },
      methods:{
        addDevice(){
          let body = {
              channel_apply_id:this.apply_id,
              company_id:this.reCreateModel.company_id,
              device_id:this.reCreateModel.device_id,
              id5:this.reCreateModel.zhan_id,
          }
          this.$http.post(`/channel_apply/addDeviceToChannel`, body)
            .then(res=>{
                res = res.data
                if(res.code === 2003){
                    this.$Message.success(res.msg)
                    this.resetModel()
                    this._getData()
                }else if (res.code===2006){
                  this.$Message.warning({
                    content:res.msg,
                    duration:3
                  })
                  this._toggleRelationCreate()
                }
            })
        },
        deleteDevice(item){
          let body = {
              channel_apply_id:item.channel_apply_id,
              device_id:item.device_id,
          }
          this.$http.post(`/channel_apply/deleteRelation`, body)
            .then(res=>{
              res = res.data
              if(res.code === 2005){
                this.$Message.success('成功删除')
                this.resetModel()
                this._getData() //其实更好的是做一个refresh接口, 但是这么长的orm都做了, 算了
              }
            })
        },
        resetModel(){
          this.$refs.showDevice._reset()
          this.$refs.showCompany._reset()
          this.reCreateModel.zhan_id = null
        },
        _toggleRelationCreate(){
            this.reFlag2 = !this.reFlag2
        },
        selectCompanyForR(v){
          this.setCompany_id(v)
          this.reCreateModel.company_id = v
        },
        selectDeviceForR(v){
            this.reCreateModel.device_id = v
        },
        _toggleRelations(index){
            this.index = index
            this.reFlag = !this.reFlag
            this.apply_id = this.dataArr[index].channel_applys[0].id
            this.relationModel = this.$lodash.cloneDeep(this.dataArr[index].channel_applys[0].channel_relations)
        },
        _toggleSteps(index){
          this.stepFlag = !this.stepFlag
          this.stepModel = this.$lodash.cloneDeep(this.dataArr[index].channel_applys[0])
          this.setStepObj(this.$lodash.cloneDeep(this.stepModel.channel_real))
          switch (this.dataArr[index].status){
            case "运营调配":
                this.current = 1
                break
            case "已完成":
                this.current = 2
                break
            default:
                this.stepFlag = !this.stepFlag
                alert("不必展开")
                break
          }
        },
        _updateStep(){
          switch (this.current){
            case 1:
                //更新运营调配表
                let obj = this.stepModel.channel_operative
                this.$http.post(`/apply/operative/${obj.id}`, obj)
                  .then(res=>{
                    res = res.data
                    if (parseInt(res.code) === 2003) {
                      this.$Message.success(res.msg);
                      this._getData()
                    }
                  }, err => {
                    this.$Message.error('请完善表单');
                  })
              break
            case 2:
                //更新实际表
                let obj2 = this.stepModel.channel_real
                this.$http.post(`/apply/real/${obj2.id}`, obj2)
                  .then(res=>{
                    res = res.data
                    if (parseInt(res.code) === 2003) {
                      this.$Message.success(res.msg);
                      this._getData()
                    }
                  }, err => {
                    this.$Message.error('修改失败');
                  })
                 break
          }
        },
        setOTime1(v){
          this.stepModel.channel_operative.t1 = v
        },
        setOTime2(v){
          this.stepModel.channel_operative.t2 = v
        },
        setRTime1(v){
          this.stepModel.channel_real.t1 = v
        },
        setRTime2(v){
          this.stepModel.channel_real.t2 = v
        },
        selectCheckerForStep(v){
            this.stepModel.channel_real.checker_id = v
        },
        back () {
          if (this.current == 0) {
            this.current = 2;
          } else {
            this.current -= 1;
          }
        },
        next () {
          if (this.current == 2) {
            this.current = 0;
          } else {
            this.current += 1;
          }
        },
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
          let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
          this.$http.get(url)
            .then(res=>{
              res = res.data.data
              this.total = res.total
              this.setDataArr(res.data)
              //utils
              this.sources = res.sources
              this.plans = res.plans
//              this.pinlvs = res.pinlvs
              this.jihuas = res.jihuas
              this.tongxins = res.tongxins
              this.zhanTypes = res.zhantypes
              this._setLoading()
            })
        },
        ...mapMutations({
          setStepObj: 'SET_STEP_OBJ',
          setCompany_id: 'SET_COMPANY_ID',
        })
      },
      components:{
          Loading, NewSearchEmps, NewSearchContract,
          SearchChecker, NewSearchCompany, ShowDevice
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
    .step-title
      display block
      padding-left 50px
    .first
      display flex
    .second
      display block
    .third
      display block
      padding-left 50px
</style>
