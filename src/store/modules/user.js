import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  SAVE_USER_INFO,
  STORE_SAVE_USER_INFO
} from '../mutation-types'
import { jsonRequest } from '@/utils/api'
const state = {
  userInfo: {}
}

const getters = {}

const actions = {
  [LOGIN]({ commit, state }, { loginFormObj, onSuccess, onFailed }) {
    wx.login({
      timeout: 5000,
      async success(wxres) {
        const result = await jsonRequest(
          'POST',
          '/login',
          Object.assign({}, loginFormObj, { code: wxres.code })
        )
        if (result) {
          const { message, state, data } = result
          if (state) {
            const { _id } = data
            commit(LOGIN_SUCCESS, { userId: _id })
            onSuccess({ message })
          }
        } else {
          commit(LOGIN_FAILED)
          onFailed()
        }
      },
      fail() {
        commit(LOGIN_FAILED)
        onFailed()
      }
    })
  },
  [SAVE_USER_INFO]({ commit, state }, userInfo) {
    commit(STORE_SAVE_USER_INFO, userInfo)
  }
}

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    delete payload.formId
    state.userInfo = Object.assign({}, state.userInfo, payload)
  },
  [LOGIN_FAILED](state, payload) {
    console.log(LOGIN_FAILED)
  },
  [STORE_SAVE_USER_INFO](state, payload) {
    state.userInfo = Object.assign({}, state.userInfo, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
