import {
  GET_PUNCH_DATA,
  STORE_ALL_PUNCH,
  PUNCH_OPERATION,
  STORE_PUNCH_BY_PUNCH_ID,
  CLEAR_CURRENT_PUNCH,
  IS_NEED_REFRESH_PUNCH,
  STORE_RETRY_ACTION_TYPE,
  STORE_RETRY_ACTION_PAYLOAD
} from '../mutation-types'
import { jsonRequest } from '@/utils/api'
const state = {
  punch: [],
  currentPunch: {},
  isNeedRefreshPunch: true
}

const getters = {}
const actions = {
  async [GET_PUNCH_DATA](
    { commit, state, rootState },
    { onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId
    const punchResult = await jsonRequest('GET', `/${user_id}/punch`)
    if (!punchResult) {
      onFailed()
      commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `tools/${GET_PUNCH_DATA}`, {
        root: true
      })
      commit(
        `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
        { onSuccess, onFailed },
        {
          root: true
        }
      )
      return
    }
    commit(STORE_ALL_PUNCH, punchResult.data)
    onSuccess()
  },
  async [PUNCH_OPERATION](
    { commit, state, rootState },
    { method, formData, onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId
    let obj = formData
    if (formData.today) {
      obj = {
        punch_id: formData.punch_id,
        today: formData.today
      }
    }
    const result = await jsonRequest(method, `/${user_id}/punch`, obj)
    if (!result) {
      onFailed()
      return
    }
    const { message } = result
    onSuccess(message)
  }
}
const mutations = {
  [STORE_ALL_PUNCH](state, punch) {
    state.punch = punch
  },
  [STORE_PUNCH_BY_PUNCH_ID](state, punch) {
    state.currentPunch = punch
  },
  [CLEAR_CURRENT_PUNCH](state) {
    state.currentPunch = {}
  },
  [IS_NEED_REFRESH_PUNCH](state, isNeedRefreshPunch) {
    state.isNeedRefreshPunch = isNeedRefreshPunch
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
