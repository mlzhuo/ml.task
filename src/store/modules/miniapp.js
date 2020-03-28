import {
  SET_NAVIGATION,
  LOADING_START,
  LOADING_STOP,
  RETRY_SHOW,
  RETRY_HIDE,
  GET_VERSIONS,
  STORE_VERSIONS,
  LOAD_CONFIG,
  STORE_CONFIG,
  STORE_RETRY_ACTION_TYPE,
  STORE_RETRY_ACTION_PAYLOAD,
  REQUEST_STATUS,
  STORE_REQUEST_STATUS
} from "../mutation-types";
import { $axios } from "@/utils/api";
import { formatYMD } from "@/utils/index";
const state = {
  navigationInfo: {
    isBack: false,
    backText: "返回",
    pageTitle: "",
    isShow: true
  },
  isShowLoading: false,
  isShowReTry: false,
  retryActionType: "",
  retryActionPayload: "",
  version: "",
  versions: [],
  config: {}
};

const getters = {};

const actions = {
  async [GET_VERSIONS]({ commit, state }, { limit, onSuccess, onFailed }) {
    let url = limit && limit === 1 ? "/version?limit=1" : "/version";
    const result = await $axios({ method: "GET", url });
    if (!result) {
      return;
    }
    if (result.state) {
      const versions = result.data.map(v => {
        return { ...v, date: formatYMD(new Date(v.date)) };
      });
      commit(STORE_VERSIONS, { versions, limit });
      onSuccess();
    }
  },
  async [LOAD_CONFIG]({ commit, state }, { onSuccess }) {
    const result = await $axios({ method: "GET", url: "/config" });
    if (result && result.state) {
      commit(STORE_CONFIG, result.data);
      onSuccess(result.data);
    }
  },
  async [REQUEST_STATUS]({ commit, state }, { isShowLoading, isShowReTry }) {
    commit(STORE_REQUEST_STATUS, { isShowLoading, isShowReTry });
  }
};

const mutations = {
  [STORE_CONFIG](state, config) {
    state.config = config;
  },
  [SET_NAVIGATION](state, navigationInfo) {
    state.navigationInfo = Object.assign(
      {},
      state.navigationInfo,
      navigationInfo
    );
  },
  [LOADING_START](state) {
    state.isShowLoading = true;
  },
  [LOADING_STOP](state) {
    state.isShowLoading = false;
  },
  [RETRY_SHOW](state) {
    state.isShowReTry = true;
  },
  [RETRY_HIDE](state) {
    state.isShowReTry = false;
  },
  [STORE_VERSIONS](state, payload) {
    const { versions, limit } = payload;
    if (!limit) {
      state.version = versions.length && versions[0].version;
    }
    state.versions = versions;
  },
  [STORE_RETRY_ACTION_TYPE](state, actionType) {
    state.retryActionType = actionType;
  },
  [STORE_RETRY_ACTION_PAYLOAD](state, actionPayload) {
    state.retryActionPayload = actionPayload;
  },
  [STORE_REQUEST_STATUS](state, requestStatus) {
    state = Object.assign({}, state, requestStatus);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
