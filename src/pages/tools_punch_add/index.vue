<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">打卡名称</view>
        <input name="input" @input="nameInput" :value="name" />
      </view>
      <view class="cu-form-group">
        <view class="title">开始日期</view>
        <picker mode="date" :value="start_date" :start="start_date" @change="DateChangeStart">
          <view class="picker">{{start_date}}</view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">结束日期</view>
        <picker mode="date" :value="end_date" :start="start_date" @change="DateChangeEnd">
          <view class="picker">{{end_date}}</view>
        </picker>
      </view>
      <view class="cu-form-group align-start">
        <view class="title">打卡描述</view>
        <textarea maxlength="-1" @input="descInput" :value="description"></textarea>
      </view>
      <button
        class="cu-btn block bg-gradual-purple shadow lg add-btn"
        @click="punchOperation"
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
      start_date: "",
      end_date: "",
      isShowLoading: false
    };
  },
  onShow() {
    const { user } = this.$store.state;
    this.user_id = user.userInfo.userId;
    const today = formatYMD(new Date());
    this.start_date = today;
    this.end_date = today;
    this.pageTitle = "添加";
    this.btnTitle = "添加";
  },
  methods: {
    nameInput(e) {
      this.title = e.target.value;
    },
    descInput(e) {
      this.description = e.target.value;
      console.log(this.description);
    },
    DateChangeStart(e) {
      this.start_date = e.target.value;
    },
    DateChangeEnd(e) {
      this.end_date = e.target.value;
    },
    punchOperation() {
      // if (!this.title) {
      //   this.showToast("请输入");
      //   return;
      // }
      // this.isShowLoading = true;
      // const method = this.event_id ? "PUT" : "POST";
      // this.$store.dispatch(`event/${EVENT_OPERATION}`, {
      //   method,
      //   title: this.title,
      //   description: this.description,
      //   level: this.level ? 1 : 0,
      //   user_id: this.user_id,
      //   event_id: this.event_id,
      //   onSuccess: this.operationSuccess,
      //   onFailed: this.operationFailed
      // });
    },
    operationSuccess(message) {
      // this.$store.commit(`event/${IS_NEED_REFRESH_EVENT}`, true);
      // this.isShowLoading = false;
      // this.showToast(message);
      // wx.navigateBack({ delta: 1 });
    },
    operationFailed() {
      // this.isShowLoading = false;
      // this.showToast("请重试");
    },
    getEventInfo(data) {
      // this.title = data.title;
      // this.description = data.description;
      // this.level = data.level === 0 ? false : true;
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
