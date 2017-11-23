import * as types from "./mutation-types"

export default {
  [types.SET_JWT_TOKEN](state, jwt_token){
    state.jwt_token = jwt_token
  },
  [types.SET_USERNAME](state, username){
    state.username = username
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
  [types.SET_UPDATEINDEX](state, index){
    state.updateIndex = index
  },
  [types.SET_UPDATE_OBJ](state, obj){
    state.updateObj = obj
  },
  [types.SET_STEP_OBJ](state, obj){
    state.stepObj = obj
  }

}
