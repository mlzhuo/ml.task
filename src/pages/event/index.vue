<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">事件列表</block>
    </cu-custom>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/addEvent/main"
        navigateTo
        class="cu-btn bg-green shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加事件
      </navigator>
      <scroll-view scroll-y>
        <view class="nav-list">
          <navigator
            hover-class="none"
            class="nav-li"
            navigateTo
            :class="'bg-'+item.color"
            v-for="item in events"
            :key="item._id"
            :url="'/pages/task/main?event_id='+item._id+'&event_title='+item.title+'&date='+item.date+'&description='+item.description"
            @longpress="editEvent(item._id)"
          >
            <view class="nav-title">{{item.title}}</view>
            <view
              class="nav-name"
            >{{(item.isDone || item.all) ? item.isDone + '/' + item.all : '0/0'}}</view>
            <text :class="'cuIcon-' + item.cuIcon" class="icon"></text>
          </navigator>
        </view>
        <view class="cu-tabbar-height"></view>
      </scroll-view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <ReTry v-if="isShowReTry" :retryMethod="['getData']" @getData="getData()"></ReTry>
  </view>
</template>

<script>
import {
  GET_EVENTS_DATA,
  STORE_CURRENT_EVENT_ID,
  CLEAR_CURRENT_EVENT_ID,
  CLEAR_CURRENT_EVENT
} from "@/store/mutation-types";
let color = [
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "cyan",
  "blue",
  "purple",
  "mauve",
  "pink",
  "brown"
];
export default {
  data() {
    return {
      user_id: "",
      events: [],
      isShowLoading: true,
      isShowReTry: false
    };
  },
  onShow() {
    this.$store.commit(`event/${CLEAR_CURRENT_EVENT_ID}`);
    this.$store.commit(`event/${CLEAR_CURRENT_EVENT}`);
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.user_id = this.$store.state.user.userInfo.userId;
      this.$store.dispatch(`event/${GET_EVENTS_DATA}`, {
        user_id: this.user_id,
        onSuccess: this.onSuccess,
        onFailed: this.onFailed,
        color
      });
    },
    onSuccess() {
      this.events = this.$store.state.event.events;
      this.isShowLoading = false;
    },
    onFailed() {
      this.isShowLoading = false;
      this.isShowReTry = true;
      this.showToast("请求失败，请重试");
    },
    editEvent(event_id) {
      this.$store.commit(`event/${STORE_CURRENT_EVENT_ID}`, event_id);
      wx.navigateTo({
        url: `/pages/addEvent/main`
      });
    }
  }
};
</script>

<style scoped>
.page {
  height: 100vh;
  padding-top: 20px;
}
.icon {
  font-size: 16px;
}
.container {
  padding: 16px;
}
.add-btn {
  margin-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
