export default {
  //手机
  validatePhone : (rule, value, callback) => {
    if(value === ''){
      callback(new Error('请输入手机号码'))
    } else {
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
        callback(new Error('手机号码格式不正确'))
      }
      callback();
    }
  },
  //邮箱
  validateEmail :(rule, value, callback) => {
    if(value === ''){
      callback(new Error('请输入邮箱地址'))
    } else {
      if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value))) {
        callback(new Error('邮箱格式不正确'))
      }
      callback();
    }
  }
}
