import {
  SET_NAVIGATION,
  LOADING_START,
  LOADING_STOP,
  RETRY_SHOW,
  RETRY_HIDE
} from '../mutation-types'
const state = {
  navigationInfo: {
    isBack: false,
    backText: '返回',
    pageTitle: '',
    isShow: true
  },
  isShowLoading: false,
  isShowReTry: false,
  retryActionType: '',
  retryActionPayload: ''
}

const getters = {}

const actions = {}

const mutations = {
  [SET_NAVIGATION](state, navigationInfo) {
    state.navigationInfo = Object.assign(
      {},
      state.navigationInfo,
      navigationInfo
    )
  },
  [LOADING_START](state) {
    state.isShowLoading = true
  },
  [LOADING_STOP](state) {
    state.isShowLoading = false
  },
  [RETRY_SHOW](state) {
    state.isShowReTry = true
  },
  [RETRY_HIDE](state) {
    state.isShowReTry = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
