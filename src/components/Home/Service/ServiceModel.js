export default class ServiceModel {

    constructor(){
      this.plan_num = 1
      this.contract_id= null  //合同id
      this.service_id=null
      this.status=null
      this.source=null
      this.type=null
      this.refer_man=null
      this.man=null
      this.customer=null
      this.charge_if=null
      this.charge=null
      this.charge_flag=null
      this.time4=null  //到账时间
      this.time1=null
      this.time2=null
      this.time3=null
      this.day_sum=null
      this.desc1=null
      this.desc2=null
      this.remark=null
      this.document=null
      this.allege=null
      this.problem_if= 0
      this.device_ids = null
      this.problem = {
        problem_step: null,
        problem_type: null,
        problem_desc: null,
        problem_solution: null,
        problem_urgency: null,
        problem_importance: null
      }
    }
}
