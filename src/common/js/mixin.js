import {debounce} from 'common/js/utils'
import {mapGetters, mapMutations} from 'vuex'

//更改code规则: 2002,2003,2004总是代表创建, 修改, 删除成功, 而不是特指某个模型
//curd 公共repo
export const curdMixin = {
  data(){
    return {
      loading:false,  //等待遮罩层的开关
      createFlag:false,
      updateFlag:false,
      deleteFlag:false,
      // updateIndex:null, 放进vuex了
      deleteIndex:null,
      searchWord:null,
    }
  },
  computed:{
    ...mapGetters([
      'dataArr', 'updateIndex', 'updateObj', 'stepObj'
    ])
  },
  mounted(){
    this._search()
  },
  destroyed(){
    this.setDataArr([{}])
  },
  watch:{
    dataArr(newdataArr){
      if(newdataArr){
        if(!newdataArr.length){
          this._setLoading()
        }
      }
    },
  },
  methods:{
    _toggleCreate(){
      this.createFlag = ! this.createFlag
      this.setUpdateIndex(null)
    },
    _create(){
      // console.log(this.createModel)
      // return
      switch (this.url){
        // case "contracts":
        //   this.createModel.type1 = parseInt(this.createModel.type1)
        //   break
        case "services":
          if(this.createModel.charge_if==="不收费"){
            this.createModel.charge = null
            this.createModel.charge_flag = "未到款"
            this.createModel.time4 = null
          }
          break
        default:
          break
      }

      this.$refs.createForm.validate((valid) => {
        if (!valid) {
          this.$Message.error('请完善表单!');
          setTimeout(()=>{
            this._toggleCreate()
          }, 500)
          return
        }

        if(!!this.fileList){
          this.createModel.fileList = this.fileList
        }

        this.$http
            .post(`/${this.url}`, this.createModel)
            .then(res=>{
              this.createModel = {}
              res = res.data
              if(parseInt(res.code) === 2002){
                this.$Message.success(res.msg);
                //并更新dom
                this._getData()
                if(!!this.fileList){
                  this.setFileList([])
                }
              }else{
                //后台throw new Excetion
                this.$Message.warning({
                  content:res.msg,
                  duration:3
                });
              }
              this.createModel = {}
            }).catch(error=>{
              // let text = error.response.data.errors
              // let content = ''
              // for ( let key in text){
              //   content += `${key} : ${text[key]}<br>`
              // }
              // this.$Notice.error({
              //   title: '错误通知',
              //   desc: content,
              //   duration:999
              // });
            })
      })
    },
    _toggleUpdate(index){
      this.updateFlag = !this.updateFlag
      this.setUpdateIndex(index)
      if(this.url === "channelduty"){
        this.setStepObj(this.$lodash.cloneDeep(this.dataArr[index]))
      }else{
        this.setUpdateObj(this.$lodash.cloneDeep(this.dataArr[index]))
      }
      this.updateModel = this.$lodash.cloneDeep(this.dataArr[index])
      console.log(this.updateModel)
      if(typeof this.updateModel !== 'undefined' && typeof this.updateModel.document !== 'undefined'){
        if(this.updateModel.document === null) {
          this.editDefaultList = []
        }else{
          this.editDefaultList = this.updateModel.document
        }
      }

    },
    update(){
      switch (this.url){
        case "contracts":
          this.updateModel.type1 = parseInt(this.updateModel.type1)
          break
        case "services":
          if(this.updateModel.charge_if==="不收费"){
            this.updateModel.charge = null
            this.updateModel.charge_flag = "未到款"
            this.updateModel.time4 = null
          }
          break
        default:
          break
      }
      this.$refs['updateForm'].validate((valid) => {
        if (!valid) {
          this.$Message.error('请完善表单!');
          setTimeout(() => {
            this._toggleUpdate()
          }, 500)
          return
        }

        if(!!this.fileList){
          this.updateModel.fileList = this.fileList
        }

        let _url = `/${this.url}/update/${this.updateModel.id}`
        this.$http.post(_url, this.updateModel)
          .then(res => {
            res = res.data
            if (parseInt(res.code) === 2003) {
              this.$Message.success(res.msg);
              this._getData()
              if(!!this.fileList){
                this.setFileList([])
              }

            }
            else{
              //后台throw new Excetion
              this.$Message.warning({
                content:res.msg,
                duration:3
              });
            }
          }, err => {
            this.$Message.error('修改失败');
          })
      })
    },
    _toggleDelete(index){
      this.deleteFlag = !this.deleteFlag
      this.deleteIndex = index
    },
    _delete(){
      let _url = `/${this.url}/delete/${this.dataArr[this.deleteIndex].id}`
      this.$http.get(_url)
        .then(res=>{
          res = res.data
          if(parseInt(res.code) === 2004) {
            this.$Message.success('删除成功');
            this.spliceDataArr({index:this.deleteIndex})
          }
        }, err=>{
          this.$Message.error('删除失败');
        })
    },
    _search(){
      this.$watch('searchWord', debounce((newS) => {
          if(this.searchWord === ""){
            return
          }
          this._setLoading()

          this.$http
            .get(`/${this.url}/s/${newS}/${this.page}/${this.pageSize}`)
            .then(res=>{
              res = res.data.data
              this.$Message.info({
                content:`共检索到${parseInt(res.total)}个数据, 仅展示最前10个数据`,
                duration:3
              })
              // this.total = res.total
              this.total = null  //仅展示前10个搜索结果, 因为如果要展示所有, 需要做2个分页, 不好做啊!
              this.setDataArr(res.data)
              this.loading = false
            })
        }, 1000)
      )
    },
    _setLoading(){
      this.loading = !this.loading
    },
    ...mapMutations({
      setDataArr:'SET_DATAARR',
      setStepObj:'SET_STEP_OBJ',
      setUpdateIndex:'SET_UPDATEINDEX',
      spliceDataArr:'SPLICE_DATAARR',
      setUpdateObj:'SET_UPDATE_OBJ'
    }),
  },
}

//分页公共repo
export const pageMixin = {
  data(){
    return {
      page:1,  //当前页码
      pageSize:10, //单页数目
      total:100,   //数组总数
      filterValueOne:"",
      filterValueTwo:"",
    }
  },
  computed:{
    //iview的table的自适应宽度, 先放这里, 等多了再提取
    curWidth(){
      let w = document.documentElement.clientWidth
      return w >1200 ? 1403: 800
    },
    curTableWidth(){
      let w = document.documentElement.clientWidth
      return w >1200 ? 1003: 800
    },
    MoneyTableWidth(){
      let w = document.documentElement.clientWidth
      return w >1200 ? 670: 650
    }
  },
  methods:{
    onChange(curPage){
      this.page = curPage
      this._setLoading()
      let url = `/${this.url}/page/${this.page}/${this.pageSize}/${this.filterValueOne}/${this.filterValueTwo}`
      this.$http.get(url)
        .then(res=>{
          res = res.data.data
          this.total = res.total  //数组总数
          this.setDataArr(res.data)
          this.loading = false
        })
    },
  }
}

//回款mixin
export const moneyMixin = {
  data(){
    return {
      contractMoney:null, //合同金额
      index:null,
      moneyId : null,
      moneyEditModel:{  //详情修改model
        money:null,
        t1:null,
        t2:null
      },
      moneyFlag:false,
      moneyEditFlag:false,
      moneyModel:{},    //详情展示model
      moneyDetailModel:[],  //历次回款展示数组model
    }
  },
  methods:{
    updateMoney(){
      let url = `${this.url}/updateMoney/${this.moneyId}`
      if(this.moneyEditModel.type === "不分次"){
        this.moneyEditModel.num = 1
      }
      this.$http.post(url, this.moneyEditModel)
        .then(res=>{
          res = res.data
          if(parseInt(res.code) === 2006){
            this.$Message.success({
              'content':res.msg
            })
            this._getData()
            this.moneyFlag = !this.moneyFlag
            setTimeout(()=>{
              this.toggleMoney(this.index)
            }, 1000)
          }
        })
    },
    toggleMoney(index){
      this.index = index
      this.moneyId = this.dataArr[index].id   //不是money表而是contract表的id, 用于orm
      this.contractMoney = this.dataArr[index].money
      this.moneyFlag = !this.moneyFlag

      switch (this.url){
        case "contracts":
          this.moneyModel = this.$lodash.cloneDeep(this.dataArr[index].service_money)
          this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[index].service_money.service_money_details)
          break
        default : //contractcs
          this.moneyModel = this.$lodash.cloneDeep(this.dataArr[index].channel_money)
          this.moneyDetailModel = this.$lodash.cloneDeep(this.dataArr[index].channel_money.channel_money_details)
          break
      }


      if(typeof this.moneyModel !== 'undefined'){
        this.moneyModel.reach = 0
        this.moneyDetailModel.map((item)=>{
          this.moneyModel.reach += parseInt(item.money)
        })
        this.moneyModel.left = this.contractMoney - this.moneyModel.reach
      }
    },
    _toggleMoneyEdit(){
      this.moneyEditFlag = !this.moneyEditFlag
      this.moneyEditModel = this.$lodash.cloneDeep(this.moneyModel)
      if(this.moneyEditModel.checker){
        this.setStepObj(this.$lodash.cloneDeep(this.moneyEditModel))
      }
    },
    //回款细节
    _toggleMoneyDetailCreate(){
      //校验是否超过次数
      if(this.moneyDetailModel.length >= this.moneyModel.num){
        this.$Message.error({
          'content' : '已达回款分次次数上限',
          'duration' : 3
        })
        return
      }

      this.moneyDetailCreateFlag = !this.moneyDetailCreateFlag
    },
    _createMoneyDetail(){
      let url = `${this.url}/createMoneyDetail/${this.moneyId}`
      this.$http.post(url, this.moneyDetailCreateModel)
        .then(res=>{
          res = res.data
          if(parseInt(res.code) === 2006){
            this.$Message.success({
              'content':res.msg
            })
            this._getData()
          }
        })
    },
    _updateMoneyDetail(){

    },
    _deleteMoneyDetail(id){
      let url = `${this.url}/delMoneyDetail/${id}`
      this.$http.get(url)
        .then(res=>{
          res = res.data
          if(parseInt(res.code) === 2006){
            this.$Message.success({
              'content':res.msg
            })
            this._getData()
          }
        })
    },
  }
}
