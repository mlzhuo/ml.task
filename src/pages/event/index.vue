<template>
  <view>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/event_add/main"
        navigateTo
        class="cu-btn bg-gradual-blue shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加分类
      </navigator>
      <view class="nav-list">
        <navigator
          hover-class="none"
          class="nav-li"
          :class="'bg-'+item.color"
          :style="style"
          navigateTo
          v-for="item in events"
          :key="item._id"
          url="/pages/task/main"
          @click="saveCurrentEvent(item)"
          @longpress="showModal(item)"
        >
          <view class="nav-title">{{item.title}}</view>
          <view
            class="nav-name"
          >{{(item.isDone || item.all) ? item.isDone + '/' + item.all : '0/0'}}</view>
          <text :class="'cuIcon-' + item.cuIcon" class="icon"></text>
        </navigator>
      </view>
      <view class="cu-tabbar-height"></view>
    </view>
    <view class="cu-modal" :class="isShowModal?'show':''" @tap="hideModal">
      <view class="cu-dialog" @tap.stop>
        <view class="cu-list menu text-left">
          <view
            class="cu-item"
            v-for="(item,index) in longPressItemArr"
            :key="index"
            @click="doSomething(index)"
          >
            <label class="flex justify-between align-center flex-sub">
              <view class="flex-sub">{{item}}</view>
            </label>
          </view>
        </view>
      </view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <ReTry v-if="isShowReTry"></ReTry>
  </view>
</template>

<script>
import {
  GET_EVENTS_DATA,
  CLEAR_CURRENT_EVENT,
  STORE_EVENT_BY_EVENT_ID,
  DELETE_EVENT
} from "@/store/mutation-types";
import store from "@/store";
export default {
  data() {
    return {
      events: [],
      isShowLoading: true,
      isShowReTry: false,
      isShowModal: false,
      longPressItemArr: ["编辑", "删除"],
      longPressEventId: "",
      style: ""
    };
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
  onLoad() {
    this.$store.commit(`event/${CLEAR_CURRENT_EVENT}`);
    const isNeedRefreshEvent = this.$store.state.event.isNeedRefreshEvent;
    if (isNeedRefreshEvent) {
      this.getData();
    } else {
      this.onSuccess();
    }
  },
  mounted() {
  },
  methods: {
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
}
</style>
