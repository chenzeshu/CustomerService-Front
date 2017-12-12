<template>
    <div class="channel-duty">
      <div class="channel-duty-plus" @click="_toggleCreate">
        <Icon type="plus-circled"></Icon>
      </div>

      <div class="channel-duty-search">
        <span class="search-icon">
          <Icon type="search"></Icon>
        </span>
        <input type="text" v-model.trim="searchWord" placeholder="人员名称" class="search">
      </div>

      <i-table border :columns="columns" :data="dataArr" :width="curWidth"></i-table>

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
        <Form :model="createModel" ref="createForm" :label-width="80">
          <SearchChecker @on-select="selectEmpForMan" type="MAN"></SearchChecker>
          <FormItem label="开始时间">
            <DatePicker type="datetime" placeholder="选择日期" style="width: 200px" @on-change="setCTime1"></DatePicker>
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker type="datetime" placeholder="选择日期" style="width: 200px" @on-change="setCTime2"></DatePicker>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="createModel.remark" placeholder="备注" type="textarea"></Input>
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
        <Form :model="updateModel" ref="updateForm" :label-width="80">
          <!--自动生成 + 手工填写-->
          <SearchChecker @on-select="selectEmpForManU" type="MAN"></SearchChecker>
          <FormItem label="开始时间">
            <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                        :value="updateModel.t1" @on-change="setUTime1"></DatePicker>
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker type="datetime" placeholder="选择日期" style="width: 200px"
                        :value="updateModel.t2" @on-change="setUTime2"></DatePicker>
          </FormItem>
          <FormItem label="备注">
            <Input v-model.trim="updateModel.remark" placeholder="备注" type="textarea"></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
    import {curdMixin, pageMixin} from 'common/js/mixin'
    import SearchChecker from 'base/SearchEmps/SearchChecker'

    export default {
        mixins:[curdMixin, pageMixin],
        data(){
            return {
                url:"channelduty",
                columns:[
                  {
                      title:`　`,
                      key:'id',
                      width:60
                  },
                  {
                      title:`  `,
                      key:'man',
                      width:150,
                    render : (h, params) => {
                      let customer = this.dataArr[params.index].checker
                      return h('div', [
                        h('Button', {
                          props: {size: 'small'},
                          style: {margin: '3px'},
                        }, customer.name)
                      ]);
                    }
                  },
                  {
                      title:"起始时间",
                      key:"t1",
                      width: 150
                  },
                  {
                    title:"结束时间",
                    key:"t2",
                    width: 150
                  },
                  {
                    title: '备注',
                    key: 'remark',
                  },
                  {
                    title: "操作",
                    align: "center",
                    width: 200,
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
                createModel : {
                    remark:null
                },
                updateModel: {

                }
            }
        },
        created(){
            this._getData()
        },
        methods:{
          selectEmpForMan(v){
            this.createModel.employee_id = v
          },
          selectEmpForManU(v){
            this.updateModel.employee_id = v
          },
          setCTime1(date){
            this.createModel.t1 = date
          },
          setCTime2(date){
            this.createModel.t2 = date
          },
          setUTime1(date){
            this.updateModel.t1 = date
          },
          setUTime2(date){
            this.updateModel.t2 = date
          },
          _getData(){
            this._setLoading()
            let url = `/${this.url}/page/${this.page}/${this.pageSize}`
            this.$http.get(url)
              .then(res=>{
                res = res.data.data
                this.total = res.total
                this.setDataArr(res.data)
                this._setLoading()
              })
          }
        },
        components:{
          SearchChecker
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-form-item
    width: 90%;
  .channel-duty
    width 100%
    .page-wrapper
      margin 10px auto
    .channel-duty-plus
      position absolute
      top 117px
      left 40px
      color #39f
      z-index 50
    .channel-duty-search
      position absolute
      top 117px
      left 95px
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
