import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  SAVE_USER_INFO,
  STORE_SAVE_USER_INFO,
  STORE_RETRY_ACTION_TYPE,
  STORE_RETRY_ACTION_PAYLOAD
} from "../mutation-types";
import { jsonRequest } from "@/utils/api";
const state = {
  userInfo: {}
};

const getters = {};

const actions = {
  [LOGIN]({ commit, state }, { onSuccess, onFailed }) {
    wx.login({
      timeout: 5000,
      async success(wxres) {
        const result = await jsonRequest(
          "POST",
          "/login",
          Object.assign({}, { code: wxres.code })
        );
        if (result && result.state) {
          const { message, data } = result;
          const { _id, openid, priTmplId } = data;
          commit(LOGIN_SUCCESS, {
            userId: _id,
            openid,
            priTmplId
          });
          onSuccess({ message });
        } else {
          commit(LOGIN_FAILED);
          commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `user/${LOGIN}`, {
            root: true
          });
          commit(
            `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
            { onSuccess, onFailed },
            {
              root: true
            }
          );
          onFailed();
        }
      }
    });
  },
  [SAVE_USER_INFO]({ commit, state }, userInfo) {
    commit(STORE_SAVE_USER_INFO, userInfo);
  }
};

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    delete payload.formId;
    state.userInfo = Object.assign({}, state.userInfo, payload);
  },
  [LOGIN_FAILED](state, payload) {
    console.log(LOGIN_FAILED);
  },
  [STORE_SAVE_USER_INFO](state, payload) {
    state.userInfo = Object.assign({}, state.userInfo, payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
