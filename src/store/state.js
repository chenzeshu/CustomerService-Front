const state = {
  jwt_token : null,
  username:null,
  logined:false,
  dataArr:[],  //用于承接各个模块的AJAX数据
  updateIndex:null,
  updateObj:[],
  stepObj:{},
  company_id:null, //用于选择单位后记录单位id   ->  目前用于<ShowDevice>
}

export default state
