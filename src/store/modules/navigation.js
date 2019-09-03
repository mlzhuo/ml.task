import { SET_NAVIGATION } from '../mutation-types'
const state = {
  navigationInfo: {
    isBack: false,
    backText: '返回',
    pageTitle: '',
    isShow: true
  }
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
