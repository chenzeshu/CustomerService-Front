const state = {
  jwt_token : null,
  username:null,
  logined:false,
  dataArr:[],  //用于承接各个模块的AJAX数据
  total:null,
  updateIndex:null,
  updateObj:[],
  stepObj:{},
  company_id:null, //用于选择单位后记录单位id   ->  目前用于<ShowDevice>
  fileList:[], //上传的文件列表
  visitObj:{
  },  //回访对象副本, 用于初始化(而不是用于提交, 因为`do not change value outside mutation`)
}

export default state
