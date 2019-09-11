import {
  SET_NAVIGATION,
  LOADING_START,
  LOADING_STOP,
  RETRY_SHOW,
  RETRY_HIDE,
  GET_VERSIONS,
  STORE_VERSIONS,
  LOAD_CONFIG,
  STORE_CONFIG
} from '../mutation-types'
import { jsonRequest } from '@/utils/api'
import { config } from '@/config'
import { formatYMD } from '@/utils/index'
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
  retryActionPayload: '',
  version: '1.0.0',
  versions: [],
  config: {}
}

const getters = {}

const actions = {
  async [GET_VERSIONS]({ commit, state }, { onSuccess, onFailed }) {
    const result = await jsonRequest('GET', '/version')
    if (!result) {
      return
    }
    if (result.state) {
      const versions = result.data.map(v => {
        return { ...v, date: formatYMD(new Date(v.date)) }
      })
      commit(STORE_VERSIONS, versions)
      onSuccess()
    }
  },
  [LOAD_CONFIG]({ commit, state }, { onSuccess, onFailed }) {
    commit(STORE_CONFIG, config)
    onSuccess(config)
  }
}

const mutations = {
  [STORE_CONFIG](state, config) {
    state.config = config
  },
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
  },
  [STORE_VERSIONS](state, versions) {
    state.version = versions.length && versions[0].version
    state.versions = versions
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
