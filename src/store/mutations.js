import * as types from "./mutation-types"

export default {
  [types.SET_JWT_TOKEN](state, jwt_token){
    state.jwt_token = jwt_token
  },
  [types.SET_LOGINED](state, status){
    state.logined = status
  }
}
