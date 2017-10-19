import * as types from "./mutation-types"

export default {
  [types.SET_JWT_TOKEN](state, jwt_token){
    state.jwt_token = jwt_token
  },
  [types.SET_LOGINED](state, status){
    state.logined = status
  },
  [types.SET_DATAARR](state, dataArr){
    state.dataArr = dataArr
  },
  [types.SPLICE_DATAARR](state, {index, item}){
    if(item){
      state.dataArr.splice(index, 1, item)
    }else{
      state.dataArr.splice(index, 1)
    }

  },
}
