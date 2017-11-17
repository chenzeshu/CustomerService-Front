<template>
    <div class="customer" ref="customer">
      <div class="customer-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="customer-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="单位名称" class="search">
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
          <FormItem label="单位名称" prop="name">
            <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="是否签约" prop="type">
            <RadioGroup v-model="createModel.type" type="button">
              <Radio label="未签约"></Radio>
              <Radio label="已签约"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属行业" prop="profession">
            <Select v-model.trim="createModel.profession" placeholder="请选择">
              <Option :value="pro.name" v-for="(pro, pk) in professions" :key="pk">{{pro.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位地址" prop="address">
            <Input v-model.trim="createModel.address" placeholder="请输入"></Input>
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
          <FormItem label="单位名称" prop="name">
            <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="是否签约" prop="type">
            <RadioGroup v-model="updateModel.type" type="button">
              <Radio label="未签约"></Radio>
              <Radio label="已签约"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属行业" prop="profession">
            <Select v-model.trim="updateModel.profession" placeholder="请选择">
              <Option :value="pro.name" v-for="(pro, pk) in professions" :key="pk">{{pro.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位地址" prop="address">
            <Input v-model.trim="updateModel.address" placeholder="请输入"></Input>
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

    </div>
</template>

<script>
  import Loading from 'base/Loading/Loading'
  import {curdMixin, pageMixin} from 'common/js/mixin'
  export default {
    mixins:[curdMixin, pageMixin],
    data () {
      return {
        url:"company",
        columns: [
          {
            title: ' ',
            key: 'id',
            width: 100,
            fixed: 'left'
          },
          {
            title: ' ',
            key: 'name',
            width: this.curWidth < 1200 ? 200 : 250,
            fixed:'left'
          },
          {
            title: '地址',
            key : 'address',
            width: this.curWidth < 1200 ? 400 : 600,
          },
          {
            title: '行业',
            key: 'profession',
            width: this.curWidth < 1200 ? 100 : 120
          },
          {
            title: '签约类型',
            key: 'type',
            width: this.curWidth < 1200 ? 100 : 130
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
        professions:[],
        createModel:{
            name:null,
            address:null,
            profession:null,
            type:null,
        },
        updateModel:{
            name:null,
            address:null,
            profession:null,
            type:null,
        },
        ruleValidate: {
          name: [
            { required: true, message: '单位名不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写地址', trigger: 'blur' }
          ],
          profession: [
            { required: true, message: '请选择行业', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择状态', trigger: 'blur' }
          ]
        },
      }
    },
    mounted(){
      this._getData()
    },
    methods:{
        _getData(){
            this.$http
                .get(`/${this.url}/page/${this.page}/${this.pageSize}`)
                .then(res=>{
                  if(parseInt(res.data.code) === 2000){
                    res = res.data.data
                    this.$nextTick(()=>{
                      this.total = res.total
                      this.professions = res.pros
                      this.setDataArr(res.data)
                      this.loading = false
                    })
                  }
                })
        },
    },
    components:{
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .customer
    width 100%
    .page-wrapper
      margin 10px auto
    .customer-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .customer-search
      position absolute
      top 117px
      left 140px
      z-index 50
      .search-icon
        display inline-block
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
