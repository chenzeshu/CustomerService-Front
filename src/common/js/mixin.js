import {debounce,interval} from 'common/js/utils'

//更改code规则: 2002,2003,2004总是代表创建, 修改, 删除成功, 而不是特指某个模型
//curd 公共repo
export const curdMixin = {
  data(){
    return {
      loading:true,  //等待遮罩层的开关
      createFlag:false,
      updateFlag:false,
      deleteFlag:false,
      updateIndex:null,
      deleteIndex:null,
      cusSearch:null,
    }
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
    },
    _create(){
      let _url =  `/${this.url}`
      this.$http.post(_url, this.createModel).then(res=>{
        this.createModel = {}
        res = res.data
        if(parseInt(res.code) === 2002){
          this.$Message.success(res.msg);
          //并更新dom
          this.dataArr.splice(0,0,res.data)
        }
      })
    },
    _toggleUpdate(index){
      this.updateFlag = !this.updateFlag
      this.index = index
      this.updateModel = Object.assign({}, this.dataArr[index])
    },
    update(){
      let _url =  `/${this.url}/update/${this.updateModel.id}`
      this.$http.post(_url, this.updateModel).then(res=>{
        res = res.data
        if(parseInt(res.code) === 2003){
          //由于vue无法监听数组dom更新, 所以需要使用变异方法
          //删除数组中index元素, 然后重新插入
          this.dataArr.splice(this.index, 1, this.updateModel)
          this.$Message.success(res.msg);
        }
      }, err=>{
        this.$Message.error('删除失败');
      })
    },
    _toggleDelete(index){
      this.deleteFlag = !this.deleteFlag
      this.deleteIndex = index
    },
    _delete(){
      let _url =  `/${this.url}/delete/${this.dataArr[this.deleteIndex].id}`
      this.$http.get(_url).then(res=>{
        res = res.data
        if(parseInt(res.code) === 2004) {
          this.$Message.success('删除成功');
          this.dataArr.splice(this.deleteIndex, 1)
        }
      }, err=>{
        this.$Message.error('删除失败');
      })
    },
    _search(){
      this.$watch('cusSearch', debounce((newS) => {
          if(this.cusSearch === ""){
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
              this.dataArr = res.data
              this.loading = false
            })
        }, 1000)
      )
    },
    _setLoading(){
      this.loading = !this.loading
    },
  }
}

//分页公共repo
export const pageMixin = {
  data(){
    return {
      page:1,  //当前页码
      pageSize:10, //单页数目
      total:100,   //数组总数
    }
  },
  methods:{
    onChange(curPage){
      this._setLoading()
      let _url = `/${this.url}/page/${curPage}/${this.pageSize}`
      this.$http
        .get(_url)
        .then(res=>{
          res = res.data.data
          this.total = res.total  //数组总数
          this.dataArr = res.data
          this.loading = false
        })
    },
  }
}
