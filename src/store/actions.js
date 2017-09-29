import * as types from './mutation-types'

export const setJwtToken = function ({commit, state}, {jwt_token} ) {
  commit(types.SET_JWT_TOKEN, jwt_token)
}
