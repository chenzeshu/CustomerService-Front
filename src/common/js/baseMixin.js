import {mapGetters, mapMutations} from 'vuex'
import url from 'common/js/url'

export const selectMixin = {
  data(){
    return {
      model: [],
      names: [],
      options: [],
      loading: false,
      query:null
    }
  },
  computed:{
    ...mapGetters([
      'updateObj', 'updateIndex'
    ]),
  },
  watch:{
    updateIndex(nIndex){
      if(nIndex === null){
        this.model = []
        this.names = []
      }
    },
  },
  methods:{
    remoteMethod (query) {
      if (query != null) {
        if(this.names.length>0 &&  query[0] === ""){  //坑点:这个query在输入东西后是个对象
          return
        }
        this.query = query
        //搜索放在created的$watch - debounce里
      } else {
        this.options = [];
      }
    }
  }
}

export const uploadMixin = {
  data(){
    return {
      action : url.uploadAction,  //上传到临时temp目录
      uploadName : "uploadFiles[]",
      defaultList:[],
      editDefaultList:[]
    }
  },
  computed:{
    ...mapGetters([
      'fileList'
    ])
  },
  methods:{
    handleUpload(file){

    },
    handleSuccess(response, file, fileList){
      file.path = response.path
      this.setFileList(this.$lodash.cloneDeep(fileList))
      this.$Message.success('上传成功')
    },
    handleError(err, file, fileList){
      this.$Message.error(file.name+"上传失败")
    },
    handleRemove(file, fileList){
      let files = {
        filePath:file.path
      }
      this.$http
        .post('/deleteFile/', files)
        .then(res=>{
          this.$Message.success(file.name+"已删除")
          this.setFileList(this.$lodash.cloneDeep(fileList))
        })
    },
    ...mapMutations({
        setFileList : 'SET_FILE_LIST'
    })
  }
}
