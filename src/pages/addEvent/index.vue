<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">事件名称</view>
        <input name="input" @input="titleInput" :value="title" />
      </view>
      <view class="cu-form-group align-start">
        <view class="title">事件描述</view>
        <textarea maxlength="-1" @input="descInput" :value="description"></textarea>
      </view>
      <view class="cu-form-group">
        <view class="title">是否优先</view>
        <switch
          class="red"
          @change="levelSwitch"
          :class="level?'checked':''"
          :checked="level?true:false"
          color="#e54d42"
          :value="level"
        ></switch>
      </view>
      <button class="cu-btn block bg-green shadow lg add-btn" @click="eventOperation">{{btnTitle}}</button>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { GET_EVENT_BY_EVENT_ID, EVENT_OPERATION } from "@/store/mutation-types";
export default {
  data() {
    return {
      user_id: "",
      event_id: "",
      title: "",
      pageTitle: "",
      btnTitle: "",
      description: "",
      level: false,
      isShowLoading: false
    };
  },
  onShow() {
    this.initData();
    const { user, event } = this.$store.state;
    this.user_id = user.userInfo.userId;
    this.event_id = event.currentEventId;
    if (this.event_id) {
      this.pageTitle = "编辑";
      this.btnTitle = "编辑";
      this.getEvent(this.user_id, this.event_id);
    } else {
      this.pageTitle = "添加";
      this.btnTitle = "添加";
    }
  },
  methods: {
    initData() {
      this.user_id = "";
      this.event_id = "";
      this.title = "";
      this.pageTitle = "";
      this.btnTitle = "";
      this.description = "";
      this.level = false;
      this.isShowLoading = false;
    },
    titleInput(e) {
      this.title = e.target.value;
    },
    descInput(e) {
      this.description = e.target.value;
    },
    levelSwitch(e) {
      this.level = e.target.value;
    },
    eventOperation() {
      if (!this.title) {
        this.showToast("请输入");
        return;
      }
      if (this.title.replace(/[^\u0000-\u00ff]/g, "aa").length > 8) {
        this.showToast("简单点，四个字就好");
        return;
      }
      this.isShowLoading = true;
      const method = this.event_id ? "PUT" : "POST";
      this.$store.dispatch(`event/${EVENT_OPERATION}`, {
        method,
        title: this.title,
        description: this.description,
        level: this.level ? 1 : 0,
        user_id: this.user_id,
        event_id: this.event_id,
        onSuccess: this.operationSuccess,
        onFailed: this.operationFailed
      });
      // const result = await this.jsonRequest(method, `/${this.user_id}/events`, {
      //   title: this.title,
      //   description: this.description,
      //   level: this.level ? 1 : 0,
      //   user_id: this.user_id,
      //   event_id: this.event_id
      // });
      // if (!result) {
      //   this.isShowLoading = false;
      //   this.showToast("请重试");
      //   return;
      // }
      // const { message } = result;
      // this.isShowLoading = false;
      // this.showToast(message);
      // this.globalData.isReNeedRequest = true;
      // wx.navigateBack({ delta: 1 });
    },
    operationSuccess(message) {
      this.isShowLoading = false;
      this.showToast(message);
      this.globalData.isReNeedRequest = true;
      wx.navigateBack({ delta: 1 });
    },
    operationFailed() {
      this.isShowLoading = false;
      this.showToast("请重试");
    },
    async getEvent(user_id, event_id) {
      this.isShowLoading = true;
      this.$store.dispatch(`event/${GET_EVENT_BY_EVENT_ID}`, {
        user_id,
        event_id,
        onSuccess: this.getEventSuccess,
        onFailed: this.getEventFailed
      });
    },
    getEventSuccess(data) {
      this.title = data.title;
      this.description = data.description;
      this.level = data.level === 0 ? false : true;
      this.isShowLoading = false;
    },
    getEventFailed() {
      this.isShowLoading = false;
      this.showToast("请重试");
    }
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
</style>
