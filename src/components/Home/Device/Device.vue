<template>
    <div class="device">
      <div class="device-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="device-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="设备型号" class="search">
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
          <FormItem label="设备编号" prop="device_id">
            <Input v-model.trim="createModel.device_id" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="设备类型" prop="type">
            <RadioGroup v-model="createModel.type" type="button">
              <Radio label="ad"></Radio>
              <Radio label="非ad"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="ip地址" prop="ip">
            <Input v-model.trim="createModel.ip" placeholder="请输入"></Input>
          </FormItem>
          <NewSearchCompany @on-select="newSelectCompanyForC"></NewSearchCompany>
          <FormItem label="状态" prop="status">
            <Select v-model="createModel.status">
              <Option v-for="s in status" :key="s" :value="s">{{s}}</Option>
            </Select>
          </FormItem>
          <FormItem label="站类型" prop="id5">
            <Select v-model.number="createModel.id5">
              <Option v-for="s in info2s" :key="s.id" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="安装时间" prop="built_at">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="createModel.built_at" @on-change="setCTime"></DatePicker>
          </FormItem>
          <FormItem label="S/N码">
            <Input v-model.trim="createModel.sn" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="行业">
            <Select v-model="createModel.profession_id">
              <Option v-for="s in pros" :key="s.id" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="天线">
            <Input v-model.trim="createModel.aerial" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="功放">
            <Input v-model.trim="createModel.pa" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="lnb">
            <Input v-model.trim="createModel.lnb" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="备注">
            <Input v-model.trim="createModel.remark" placeholder="备注内容" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!--update-->
      <Modal
        v-model="updateFlag"
        title="编辑"
        width="400"
        @on-ok="update">
        <!--@on-cancel="cancel"-->
        <Form :model="updateModel" :rules="ruleValidate" ref="updateForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <FormItem label="设备编号" prop="device_id">
            <Input v-model.trim="updateModel.device_id" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="设备类型" prop="type">
            <RadioGroup v-model="updateModel.type" type="button">
              <Radio v-for="s in type"  :key="s" :label="s"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="ip地址" prop="ip">
            <Input v-model.trim="updateModel.ip" placeholder="请输入"></Input>
          </FormItem>
          <NewSearchCompany @on-select="newSelectCompanyForU"></NewSearchCompany>
          <FormItem label="状态" prop="status">
            <Select v-model="updateModel.status">
              <Option v-for="s in status" :key="s" :value="s">{{s}}</Option>
            </Select>
          </FormItem>
          <FormItem label="站类型" prop="id5">
            <Select v-model.number="updateModel.id5">
              <Option v-for="s in info2s" :key="s.id" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="安装时间" prop="built_at">
            <DatePicker type="date" placeholder="选择日期" style="width: 200px" :value="updateModel.built_at" @on-change="setCTime"></DatePicker>
          </FormItem>
          <FormItem label="S/N码">
            <Input v-model.trim="updateModel.sn" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="行业">
            <Select v-model="updateModel.profession_id">
              <Option v-for="s in pros" :key="s.id" :value="s.id">{{s.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="天线">
            <Input v-model.trim="updateModel.aerial" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="功放">
            <Input v-model.trim="updateModel.pa" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="lnb">
            <Input v-model.trim="updateModel.lnb" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="备注">
            <Input v-model.trim="updateModel.remark" placeholder="备注内容" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--delete-->
      <Modal
        v-model.trim="deleteFlag"
        title="删除"
        @on-ok="_delete">
        <p>确定要删除?</p>
      </Modal>
    </div>
</template>

<script>
    import Loading from 'base/Loading/Loading'
    import NewSearchCompany from 'base/SearchCompany/NewSearchCompany'
    import {curdMixin, pageMixin} from 'common/js/mixin'

    export default {
      mixins:[curdMixin, pageMixin],
      data(){
          return {
            url:'devices',
            pros:[],
            info2s:[],
            status:['停用','重要','一般','自用', '损坏', '专项处理'],
            type:['ad', '非ad'],
            columns:[
              {
                title: `　#`,
                key: 'id',
                width: 80,
                fixed: 'left'
              },
              {
                title: `　 `,
                key: 'device_id',
                width: 160,
                fixed: 'left'
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
                title: `ip地址`,
                key: 'ip',
                width: 150,
              },
              {
                title: `S/N码`,
                key: 'sn',
                width: 120,
              },
              {
                title: `行业`,
                key: 'profession',
                width: 120,
                render: (h, params) => {
                  if(this.dataArr[params.index].profession){
                    return `${this.dataArr[params.index].profession.name}`
                  }
                }
              },
              {
                title: `状态`,
                key: 'status',
                width: 120,
              },
              {
                title: `天线`,
                key: 'aerial',
                width: 120,
              },
              {
                title: `功放(W)`,
                key: 'pa',
                width: 120,
              },
              {
                title: `LNB型号`,
                key: 'lnb',
                width: 130,
              },
              {
                title: `站类型`,
                key: 'id5',
                width: 130,
                render: (h, params) => {
                  if(this.dataArr[params.index].channel_info2){
                    return `${this.dataArr[params.index].channel_info2.name}`
                  }
                }
              },
              {
                title: `安装时间`,
                key: 'built_at',
                width: 120,
              },
              {
                title: `备注`,
                key: 'remark',
                width: 120,
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
                company_id:null,
                type:null,
                id5:null,
                device_id:null,
                ip:null,
                sn:null,
                profession_id:null,
                status:null,
                aerial:null,
                pa:null,
                lnb:null,
                built_at:null,
                remark:null
            },
            updateModel:{
                company_id:null,
                type:null,
                id5:null,
                device_id:null,
                ip:null,
                sn:null,
                profession_id:null,
                status:null,
                aerial:null,
                pa:null,
                lnb:null,
                built_at:null,
                remark:null
            },
            ruleValidate:{
              device_id:[
                {required: true, message: '请填写设备型号', trigger: 'blur'}
              ],
              type:[
                {required: true, message: '请填写设备类型', trigger: 'blur'}
              ],
              ip:[
                {required: true, message: '请填写ip', trigger: 'blur'}
              ],
              status:[
                {required: true, message: '请选择状态', trigger: 'blur'}
              ],
              id5:[
                {type:'number', required: true, message: '请选择站类型', trigger: 'blur'}
              ],
              company_id:[
                {type:'number', required: true, message: '请选择单位', trigger: 'blur'}
              ],
              built_at:[
                {required: true, message: '请填写安装时间', trigger: 'blur'}
              ]
            }
          }
      },
      created(){
        this._getData()
      },
      methods:{
          setCTime(v){
              this.createModel.built_at = v
          },
          newSelectCompanyForC(v){
              this.createModel.company_id = v
          },
          newSelectCompanyForU(v){
            this.updateModel.company_id = v
          },
          _getData(){
            this._setLoading()
            this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
              .then(res=>{
                res = res.data.data
                this.total = res.total
                this.pros = res.professions
                this.setDataArr(res.data)
                this.info2s = res.info2s
                this._setLoading()
              })
          }
      },
      components:{
        Loading, NewSearchCompany
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .device
    width 100%
    .page-wrapper
      margin 10px auto
    .device-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .device-search
      position absolute
      top 117px
      left 100px
      z-index 50
      .search-icon
        display inline-block
        margin-left 20px
        color #39f
        font-size 16px
        line-height: 12px
        vertical-align: middle
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
