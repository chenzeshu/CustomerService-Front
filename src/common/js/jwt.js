import {loadFromLocal} from './local'

export function loadJWTfromLocal() {
  //从localStorage获取该用户的jwt, 规定jwt存储键为myJWT
  var jwt = loadFromLocal('myJWT',null)
  //假如没有,返回false
  return jwt ? jwt : false
}
