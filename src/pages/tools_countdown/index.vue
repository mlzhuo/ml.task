<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">倒计时</block>
      </cu-custom>
    </view>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/tools_countdown_add/main"
        navigateTo
        class="cu-btn bg-gradual-purple shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加倒计时
      </navigator>
      <view v-if="countdowns.length">
        <view
          class="cu-item shadow-blur countdown-item"
          v-for="item in countdowns"
          :key="item._id"
          @longpress="showModal(item)"
        >
          <countdownView
            :isShowTitle="true"
            :targetDate="item.target_date"
            :countdownName="item.name"
            :isComplete="item.state"
            :countdownId="item._id"
            @doneCountdown="doneCountdown"
          ></countdownView>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
      <view
        class="cu-modal"
        :class="isShowModal ? 'show' : ''"
        @tap="hideModal"
      >
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
      <Loading v-if="isShowLoading"></Loading>
      <ReTry v-if="isShowReTry"></ReTry>
    </view>
  </view>
</template>

<script>
import {
  GET_ALL_COUNTDOWN,
  COUNTDOWN_OPERATION,
  STORE_CURRENT_COUNTDOWN,
  DELETE_COUNTDOWN,
  CLEAR_CURRENT_COUNTDOWN
} from "@/store/mutation-types";
import countdownView from "@/components/countdownView";
export default {
  data() {
    return {
      isShowLoading: false,
      isShowReTry: false,
      countdowns: [],
      isShowModal: false,
      longPressItemArr: ["编辑", "删除"],
      logoUrl: "/static/images/ml-task-logo.png",
      currentCountdown: {}
    };
  },
  components: {
    countdownView
  },
  onShow() {
    this.$store.commit(`tools/${CLEAR_CURRENT_COUNTDOWN}`);
    this.getCountdown();
  },
  mounted() {},
  methods: {
    getCountdown() {
      this.countdowns = []
      this.$store.dispatch(`tools/${GET_ALL_COUNTDOWN}`, {
        onSuccess: this.onSuccess,
        onFailed: this.onFailed
      });
    },
    onSuccess(data) {
      this.countdowns = [...data];
    },
    onFailed() {},
    doneCountdown(countdown_id) {
      this.$store.dispatch(`tools/${COUNTDOWN_OPERATION}`, {
        method: "PUT",
        obj: { state: 1, countdown_id },
        onSuccess: this.getCountdown
      });
    },
    showModal(countdown) {
      this.$store.commit(`tools/${STORE_CURRENT_COUNTDOWN}`, countdown);
      this.currentCountdown = countdown;
      this.isShowModal = true;
    },
    hideModal() {
      this.$store.commit(`tools/${CLEAR_CURRENT_COUNTDOWN}`);
      this.isShowModal = false;
    },
    delCountdown() {
      this.$store.dispatch(`tools/${DELETE_COUNTDOWN}`, {
        onSuccess: this.delCountdownSuccess,
        onFail: this.delCountdownFail
      });
    },
    delCountdownSuccess(msg) {
      this.showToast(msg);
      this.getCountdown()
    },
    delCountdownFail() {
      this.showToast("删除失败，请重试");
    },
    editCountdown() {
      wx.navigateTo({ url: "/pages/tools_countdown_add/main" });
    },
    doSomething(index) {
      this.isShowModal = false;
      switch (index) {
        case 0:
          this.editCountdown();
          break;
        case 1:
          this.delCountdown();
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style scoped>
.container {
  padding: 15px;
}
.cu-list-header {
  height: 60px !important;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
}
.boxshadow .title-text:nth-child(2) {
  margin-top: 10px;
}
.logo {
  height: 100%;
}
.title-text {
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
}
.action-btns {
  position: absolute;
  right: 10px;
  bottom: 10px;
  text-align: right;
}
.done-punch-item {
  opacity: 0.3;
}
.countdown-item {
  height: 100px;
}
</style>
