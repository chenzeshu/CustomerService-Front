<template>
  <div class="plan">
    <div class="plan-plus" @click="_toggleCreate">
      <Icon type="plus-circled"></Icon>
    </div>

    <div class="plan-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
      <input type="text" v-model.trim="searchWord" placeholder="套餐名称" class="search">
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
      title="编辑"
      width="400"
      @on-ok="_create">
      <!--@on-cancel="cancel"-->
      <Form :model="createModel" :rules="ruleValidate" ref="createForm" :label-width="80">
        <!--自动生成 + 手工填写-->
        <FormItem label="套餐名称" prop="plan_id">
          <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="网络类型" prop="t1">
          <RadioGroup v-model="createModel.t1" type="button">
            <Radio v-for="s in info1s"  :key="s.id" :label="s.name"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="带宽类型" prop="t2">
          <RadioGroup v-model="createModel.t2" type="button">
            <Radio v-for="s in info6s"  :key="s.id" :label="s.name"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否独享" prop="t3">
          <RadioGroup v-model="createModel.t3" type="button">
            <Radio v-for="s in info3s"  :key="s" :label="s"></Radio>
          </RadioGroup>
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
        <FormItem label="套餐名称" prop="plan_id">
          <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="网络类型" prop="t1">
          <RadioGroup v-model="updateModel.t1" type="button">
            <Radio v-for="s in info6s"  :key="s.id" :label="s.name"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="带宽类型" prop="t2">
          <RadioGroup v-model="updateModel.t2" type="button">
            <Radio v-for="v in info1s"  :key="v.id" :label="v.name"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否独享" prop="t3">
          <RadioGroup v-model="updateModel.t3" type="button">
            <Radio v-for="s in info3s"  :key="s" :label="s"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>

    <!--delete-->
    <Modal
      v-model="deleteFlag"
      title="删除"
      @on-ok="_delete">
      <p style="color: red;font-size:14px;font-weight: 700;">
        注意, 删除本套餐很可能造成相关合同错乱!!!
      </p>
    </Modal>
  </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import {curdMixin, pageMixin} from 'common/js/mixin'

  export default {
    mixins:[curdMixin, pageMixin],
    data(){
      return {
        url:'plans',
        pros:[],
        info1s:[],
        info6s:[],
        info3s:['独享', '共享'],
        columns:[
          {
            title: `　#`,
            key: 'id',
            width: 80,
            fixed: 'left'
          },
          {
            title: `　 `,
            key: 'name',
            width: 160,
            fixed: 'left'
          },
          {
            title: `网络类型`,
            key: 't1',
            width: 160,
          },
          {
            title: `带宽类型`,
            key: 't2',
            width: 160,
          },
          {
            title:"操作",
            align: "center",
            width: 200,
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
            t1:null,
            t2:null,
            t3:null
        },
        updateModel:{
            name:null,
            t1:null,
            t2:null,
            t3:null
        },
        ruleValidate:{
//          plan_id:[
//            {required: true, message: '请填写设备型号', trigger: 'blur'}
//          ],
//          company_id:[
//            {type:'number', required: true, message: '请选择公司', trigger: 'blur'}
//          ],
        }
      }
    },
    created(){
      this._getData()
    },
    methods:{
      setCTime(v){
        this.createModel.build_at = v
      },
      _getData(){
        this._setLoading()
        this.$http.get(`/${this.url}/page/${this.page}/${this.pageSize}`)
          .then(res=>{
            res = res.data.data
            this.info1s = res.info1s
            this.info6s = res.info6s
            this.setDataArr(res.data)
            this.total = res.total
            this._setLoading()
          })
      }
    },
    components:{
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .plan
    width 100%
    .page-wrapper
      margin 10px auto
    .plan-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .plan-search
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
