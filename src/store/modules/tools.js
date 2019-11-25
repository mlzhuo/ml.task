import {
  GET_PUNCH_DATA,
  STORE_ALL_PUNCH,
  PUNCH_OPERATION,
  STORE_PUNCH_BY_PUNCH_ID,
  CLEAR_CURRENT_PUNCH,
  IS_NEED_REFRESH_PUNCH,
  STORE_RETRY_ACTION_TYPE,
  STORE_RETRY_ACTION_PAYLOAD,
  DELETE_PUNCH,
  IS_NEED_REFRESH_TOOLS_OVERVIEW,
  GET_TOOLS_OVERVIEW_DATA,
  STORE_TOOLS_OVERVIEW_DATA
} from "../mutation-types";
import { jsonRequest } from "@/utils/api";
import { formatYMD } from "@/utils/index";
const state = {
  toolsOverviewData: {},
  isNeedRefreshToolsOverview: true,
  punch: [],
  currentPunch: {},
  isNeedRefreshPunch: true
};

const getters = {};
const actions = {
  async [GET_TOOLS_OVERVIEW_DATA](
    { commit, state, rootState },
    { onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId;
    const result = await jsonRequest("GET", `/${user_id}/tools_data_overview`);
    if (result) {
      commit(IS_NEED_REFRESH_TOOLS_OVERVIEW, false);
      commit(STORE_TOOLS_OVERVIEW_DATA, result.data);
      onSuccess();
    }
  },
  async [GET_PUNCH_DATA](
    { commit, state, rootState },
    { onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId;
    const punchResult = await jsonRequest("GET", `/${user_id}/punch`);
    if (!punchResult) {
      onFailed();
      commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `tools/${GET_PUNCH_DATA}`, {
        root: true
      });
      commit(
        `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
        { onSuccess, onFailed },
        {
          root: true
        }
      );
      return;
    }
    punchResult.data.forEach(v => {
      v.start_date_format = v.start_date.slice(5).split("-");
      v.end_date_format = v.end_date.slice(5).split("-");
    });
    commit(STORE_ALL_PUNCH, punchResult.data);
    onSuccess();
  },
  async [PUNCH_OPERATION](
    { commit, state, rootState },
    { method, formData, onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId;
    let obj = formData;
    if (formData.today) {
      obj = {
        punch_id: formData.punch_id,
        today: formData.today
      };
    }
    const result = await jsonRequest(method, `/${user_id}/punch`, obj);
    if (!result) {
      onFailed();
      return;
    }
    commit(IS_NEED_REFRESH_PUNCH, true);
    commit(IS_NEED_REFRESH_TOOLS_OVERVIEW, true);
    const { message } = result;
    onSuccess(message);
  },
  async [DELETE_PUNCH]({ commit, state, rootState }, { onSuccess, onFailed }) {
    const user_id = rootState.user.userInfo.userId;
    const punch_id = state.currentPunch._id;
    const delResult = await jsonRequest(
      "DELETE",
      `/${user_id}/punch/${punch_id}`
    );
    if (delResult && delResult.state) {
      commit(IS_NEED_REFRESH_TOOLS_OVERVIEW, true);
      onSuccess(delResult.message);
    } else {
      onFailed();
    }
  }
};
const mutations = {
  [STORE_ALL_PUNCH](state, punch) {
    state.punch = punch;
  },
  [STORE_PUNCH_BY_PUNCH_ID](state, punch) {
    state.currentPunch = punch;
  },
  [CLEAR_CURRENT_PUNCH](state) {
    state.currentPunch = {};
  },
  [IS_NEED_REFRESH_PUNCH](state, isNeedRefreshPunch) {
    state.isNeedRefreshPunch = isNeedRefreshPunch;
  },
  [IS_NEED_REFRESH_TOOLS_OVERVIEW](state, isNeedRefreshToolsOverview) {
    state.isNeedRefreshToolsOverview = isNeedRefreshToolsOverview;
  },
  [STORE_TOOLS_OVERVIEW_DATA](state, toolsOverviewData) {
    state.toolsOverviewData = toolsOverviewData;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
