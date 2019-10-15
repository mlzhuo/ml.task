<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">倒计时名称</view>
        <input name="input" @input="titleInput" :value="title" />
      </view>
      <view class="cu-form-group">
        <view class="title">目标日期</view>
        <picker mode="date" :value="end_date" :start="picker_start_date" @change="DateChange">
          <view class="picker">{{end_date}}</view>
        </picker>
      </view>
      <view class="cu-form-group align-start">
        <view class="title">倒计时描述</view>
        <textarea maxlength="-1" @input="descInput" :value="description"></textarea>
      </view>
      <button
        class="cu-btn block bg-gradual-purple shadow lg add-btn"
        @click="countdownOperation"
      >{{btnTitle}}</button>
      <view class="cu-tabbar-height"></view>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { formatYMD } from "@/utils/index";
export default {
  data() {
    return {
      user_id: "",
      pageTitle: "",
      btnTitle: "",
      name: "",
      description: "",
      end_date: "",
      picker_start_date: "",
      isShowLoading: false
    };
  },
  onShow() {
    const { user } = this.$store.state;
    this.user_id = user.userInfo.userId;
    const today = formatYMD(new Date());
    this.picker_start_date = today;
    this.end_date = today;
    this.pageTitle = "添加";
    this.btnTitle = "添加";
  },
  methods: {
    titleInput(e) {
      this.title = e.target.value;
    },
    descInput(e) {
      this.description = e.target.value;
    },
    DateChange(e) {
      this.end_date = e.target.value;
    },
    countdownOperation() {},
    operationSuccess(message) {
      // this.$store.commit(`event/${IS_NEED_REFRESH_EVENT}`, true);
      // this.isShowLoading = false;
      // this.showToast(message);
      // wx.navigateBack({ delta: 1 });
    },
    operationFailed() {
      // this.isShowLoading = false;
      // this.showToast("请重试");
    }
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>

<style>
.container {
  padding: 16px;
}
.add-btn {
  margin-top: 80px;
}
.cu-form-group.align-start {
  border-bottom: 1rpx solid #eee;
}
</style>
