<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">记录</block>
    </cu-custom>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/event_add/main"
        navigateTo
        class="cu-btn bg-gradual-blue shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加分类
      </navigator>
      <!-- <button
        class="cu-btn bg-white shadow-blur round sm add-btn change-type filter-icon"
        v-show="showList"
      >
        <text class="cuIcon-filter" style="font-size:14px"></text>
      </button>
      <button
        class="cu-btn bg-white shadow-blur round sm add-btn change-type"
        @click="changeType()"
      >
        <text class="cuIcon-cascades" style="font-size:14px" v-if="showList"></text>
        <text class="cuIcon-sort" style="font-size:14px" v-if="!showList"></text>
      </button> -->
      <view class="nav-list">
        <navigator
          hover-class="none"
          class="nav-li"
          :class="'bg-' + item.color"
          navigateTo
          v-for="item in events"
          :key="item._id"
          url="/pages/task/main"
          @click="saveCurrentEvent(item)"
          @longpress="showModal(item)"
        >
          <view class="nav-title">{{ item.title }}</view>
          <view class="nav-name">{{
            item.isDone || item.all ? item.isDone + "/" + item.all : "0/0"
          }}</view>
          <text :class="'cuIcon-' + item.cuIcon" class="icon"></text>
        </navigator>
      </view>
      <view class="cu-tabbar-height"></view>
    </view>
    <view class="cu-modal" :class="isShowModal ? 'show' : ''" @tap="hideModal">
      <view class="cu-dialog" @tap.stop>
        <view class="cu-list menu text-left">
          <view
            class="cu-item"
            v-for="(item, index) in longPressItemArr"
            :key="index"
            @click="doSomething(index)"
          >
            <label class="flex justify-between align-center flex-sub">
              <view class="flex-sub">{{ item }}</view>
            </label>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="isShowUpdateModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ currentVersion.version }} 更新日志</view>
          <view class="action" @tap="isShowUpdateModal = false">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          更新日期：{{ currentVersion.date }}
          <br />
          <view
            :class="{ 'padding-l-5em': index > 0 }"
            v-for="(item, index) in updateInfo"
            :key="index"
            >{{
              index === 0 ? "更新日志：1. " + item : index + 1 + ". " + item
            }}</view
          >
        </view>
      </view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <ReTry v-if="isShowReTry" @click="retryGetData"></ReTry>
  </view>
</template>

<script>
import {
  LOGIN,
  GET_EVENTS_DATA,
  CLEAR_CURRENT_EVENT,
  STORE_EVENT_BY_EVENT_ID,
  DELETE_EVENT,
  GET_VERSIONS
} from "@/store/mutation-types";
import store from "@/store";
import { formatVersionText } from "@/utils";
export default {
  data() {
    return {
      events: [],
      isShowLoading: true,
      isShowReTry: false,
      isShowModal: false,
      longPressItemArr: ["编辑", "删除"],
      longPressEventId: "",
      isShowUpdateModal: false,
      currentVersion: {},
      updateInfo: [],
      showList: false
    };
  },
  created() {
    const versions = this.$store.state.miniapp.versions;
    if (!versions.length) {
      this.getVersions();
    }
    const { userInfo } = this.$store.state.user;
    const isNeedLogin =
      Object.keys(userInfo).length === 0 ||
      (userInfo && (!userInfo.openid || !userInfo.userId));
    if (isNeedLogin) {
      this.Login();
      return;
    }
  },
  onShow() {
    this.$store.commit(`event/${CLEAR_CURRENT_EVENT}`);
    const isNeedRefreshEvent = this.$store.state.event.isNeedRefreshEvent;
    if (isNeedRefreshEvent) {
      this.getData();
    } else {
      this.onSuccess();
    }
  },
  mounted() {},
  methods: {
    Login() {
      this.isShowLoading = true;
      this.$store.dispatch(`user/${LOGIN}`, {
        onSuccess: this.loginSuccess,
        onFailed: this.onFailed
      });
    },
    loginSuccess({ message }) {
      this.getData();
    },
    getVersions() {
      this.$store.dispatch(`miniapp/${GET_VERSIONS}`, {
        onSuccess: this.getVersionSuccess,
        limit: 1
      });
    },
    getVersionSuccess() {
      this.currentVersion = this.$store.state.miniapp.versions[0];
      this.updateInfo = formatVersionText(this.currentVersion.description);
      try {
        var localVersion = wx.getStorageSync("version");
        if (localVersion && localVersion === this.currentVersion.version) {
        } else {
          this.isShowUpdateModal = true;
          wx.setStorage({
            key: "version",
            data: this.currentVersion.version
          });
        }
      } catch (e) {}
    },
    getData() {
      this.isShowLoading = true;
      this.isShowReTry = false;
      this.$store.dispatch(`event/${GET_EVENTS_DATA}`, {
        onSuccess: this.onSuccess,
        onFailed: this.onFailed
      });
    },
    onSuccess() {
      this.events = this.$store.state.event.events;
      this.isShowLoading = false;
      this.isShowReTry = false;
    },
    onFailed() {
      this.isShowLoading = false;
      this.isShowReTry = true;
      this.showToast("请求失败，请重试");
    },
    editEvent() {
      wx.navigateTo({
        url: `/pages/event_add/main`
      });
    },
    delEvent() {
      this.isShowLoading = true;
      this.isShowReTry = false;
      this.$store.dispatch(`event/${DELETE_EVENT}`, {
        onSuccess: this.delSuccess,
        onFailed: this.delFailed
      });
    },
    delSuccess(message) {
      this.getData();
      this.isShowLoading = false;
      this.isShowReTry = false;
      this.showToast(message);
    },
    delFailed() {
      this.isShowLoading = false;
      this.showToast("删除失败，请重试");
    },
    saveCurrentEvent(event) {
      this.$store.commit(`event/${STORE_EVENT_BY_EVENT_ID}`, event);
    },
    showModal(event) {
      this.saveCurrentEvent(event);
      this.isShowModal = true;
    },
    hideModal() {
      this.isShowModal = false;
      this.$store.commit(`event/${CLEAR_CURRENT_EVENT}`);
    },
    doSomething(index) {
      this.isShowModal = false;
      switch (index) {
        case 0:
          this.editEvent();
          break;
        case 1:
          this.delEvent();
          break;
        default:
          break;
      }
    },
    retryGetData() {
      this.isShowReTry = false;
      this.isShowLoading = true;
      const { retryActionPayload, retryActionType } = this.$store.state.miniapp;
      this.$store.dispatch(retryActionType, retryActionPayload);
    },
    changeType() {
      this.showList = !this.showList
    }
  }
};
</script>

<style scoped>
.icon {
  font-size: 16px;
}
.container {
  padding: 15px 5px 5px;
  position: relative;
}
.padding-xl {
  text-align: left;
}
.padding-l-5em {
  padding-left: 5em;
}
.change-type {
  position: absolute;
  width: 30px;
  height: 30px;
  left: auto;
  right: 5px;
  top: 20px;
  border: 1px solid #efefef;
}
.filter-icon {
  right: 50px;
}
</style>
