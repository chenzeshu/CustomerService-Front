export const catlogs = [
  {
    title:"控制台",
    name:"1",
    children:[
      {title:"管理控制台", path:'/home/frontpage', name:"管理控制台"},
    ]
  },
  {
    title:"业务流程管理",
    name:"2",
    children:[
      {title:"注册申请", path:'/home/vcus', name:"注册申请"},
      {title:"服务申请", path:'/home/vser', name:"服务申请"},
      {title:"信道申请", path:'/home/vchan', name:"信道申请"},
      // {title:"临时服务申请", path:'/home/vserTemp', name:"临时服务申请"},
      {title:"临时信道申请", path:'/home/vchanTemp', name:"临时信道申请"},
      {title:"普通服务单", path:'/home/service', name:"普通服务单"},
      {title:"信道服务单", path:'/home/channel', name:"信道服务单"},
    ]
  },
  {
    title:"故障信息库",
    name:"3",
    children:[
      {title:"故障信息列表", path:'/home/problems', name:"故障信息列表"},
      {title:"故障类型列表", path:'/home/ProblemType', name:"故障类型列表"},
      {title:"报警记录列表", path:'/home/ProblemRecord', name:"报警记录列表"},
      {title:"设备列表", path:'/home/device', name:"设备列表"},
    ]
  },
  {
    title:"合同管理",
    name:"4",
    children:[
      {title:"服务合同", path:'/home/contract', name:"服务合同"},
      {title:"信道合同", path:'/home/contractc', name:"信道合同"},
    ]
  },
  {
    title:"单位管理",
    name:"5",
    children:[
      {title:"单位列表", path:'/home/company', name:"单位列表"}
    ]
  },
  {
    title:"用户管理",
    name:"6",
    children:[
      {title:"用户列表", path:'/home/emp', name:"用户列表"}
    ]
  },
  {
    title:"服务目录管理",
    name:"7",
    children:[
      {title:"服务套餐表", path:'/home/contractPlan', name:"服务套餐表"},
      {title:"外协单位", path:'/home/coor', name:"外协单位"},
      {title:"合同类型", path:'/home/contractType', name:"合同类型"},
      {title:"服务信息来源", path:'/home/serviceSource', name:"服务信息来源"},
//                {title:"服务类型", path:'/home/serviceType', name:"服务类型"},
      {title:"行业列表", path:'/home/profession', name:"行业列表"},
      {title:"文件列表", path:'/home/file', name:"文件列表"},
    ]
  },
  {
    title:"信道目录管理",
    name:"8",
    children:[
      {title:"信道值班表", path:'/home/channelDuty', name:"信道值班表"},
      {title:"套餐列表", path:'/home/plan', name:"套餐列表"},
      {title:"带宽列表", path:'/home/info1', name:"带宽列表"},
      {title:"站类型表", path:'/home/info2', name:"站类型列表"},
      {title:"通信卫星表", path:'/home/info3', name:"通信卫星表"},
//                {title:"频率表", path:'/home/info4', name:"频率表"},
      {title:"极化列表", path:'/home/info5', name:"极化列表"},
      {title:"网络类型表", path:'/home/info6', name:"网络类型表"},
    ]
  }
]
