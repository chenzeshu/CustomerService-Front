<template>
    <div class="contract-plans">
        <!--普通合同套餐工具表-->
      <div class="contract-plans-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
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
        <Form :model="createModel" :label-width="80">
          <FormItem label="套餐名称">
            <Input v-model.trim="createModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="计量单位">
            <Input v-model.trim="createModel.unit" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model.trim="createModel.desc" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="createModel.remark" placeholder="请输入" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>

      <!--update-->
      <Modal
        v-model="updateFlag"
        title="创建"
        width="400"
        @on-ok="_create">
        <Form :model="updateModel" :label-width="80">
          <FormItem label="套餐名称">
            <Input v-model.trim="updateModel.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="计量单位">
            <Input v-model.trim="updateModel.unit" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="套餐类型">
            <RadioGroup v-model="updateModel.type2" type="button">
              <Radio :label="t" v-for="t in type2" :key="t"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="有无计划">
            <RadioGroup v-model="updateModel.type" type="button">
              <Radio :label="t" v-for="t in type" :key="t"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="描述">
            <Input v-model.trim="updateModel.desc" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="updateModel.remark" placeholder="请输入" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
    import {curdMixin, pageMixin} from 'common/js/mixin'

    export default {
        mixins:[curdMixin, pageMixin],
        data(){
            return {
                url:"contract_plans",
                type:['无计划', '有计划'],
                type2:['普通', '财务', '其他'],
                columns:[
                  {
                      title:"#",
                      key:"id",
                      width:60,
                  },
                  {
                      title:"名称",
                      key:"name",
                      width:150,
                  },
                  {
                    title:"计量单位",
                    key:"unit",
                    width:120,
                  },
                  {
                    title:"套餐类型",
                    key:"type2",
                    width:100
                  },
                  {
                    title:"计划类型",
                    key:"type",
                    width:100
                  },
                  {
                    title:"描述",
                    key:"desc",
                    width:300,
                  },
                  {
                    title:"备注",
                    key:"remark",
                    width:150,
                  },
                  {
                    title: "操作",
                    align: "center",
                    width: 300,
                    fixed: 'right',
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
                createModel:{},
                updateModel:{}
            }
        },
        created(){
            this._getData()
        },
        methods:{
            _getData(){
              this._setLoading()
              let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
              this.$http.get(url)
                .then(res=>{
                  res = res.data.data
                  this.total = res.total
                  this.setDataArr(res.data)
                  this._setLoading()
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .contract-plans
    width 100%
    .page-wrapper
      margin 10px auto
    .contract-plans-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .contract-plans-search
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
