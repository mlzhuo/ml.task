<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group align-start">
        <view class="title">记录描述</view>
        <textarea maxlength="-1" @input="taskInput" :value="content"></textarea>
      </view>
      <view class="cu-form-group">
        <view class="title">是否优先</view>
        <switch
          class="red"
          @change="levelSwitch"
          :class="level?'checked':''"
          :checked="level?true:false"
          color="#e54d42"
        ></switch>
      </view>
      <button class="cu-btn block bg-green shadow lg add-btn" @click="taskOperation">{{pageTitle}}</button>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { TASK_OPERATION } from "@/store/mutation-types";
export default {
  data() {
    return {
      event_id: "",
      content: "",
      level: false,
      pageTitle: "添加",
      task_id: "",
      isShowLoading: false
    };
  },
  onShow() {
    this.initData();
    const { event, task } = this.$store.state;
    const event_id = event.currentEvent._id;
    const task_id = task.currentTask._id;
    this.event_id = event_id;
    if (task_id) {
      this.task_id = task_id;
      this.pageTitle = "编辑";
      this.getTaskInfo(task.currentTask);
    } else {
      this.pageTitle = "添加";
    }
  },
  methods: {
    initData() {
      this.event_id = "";
      this.content = "";
      this.level = false;
      this.pageTitle = "添加";
      this.task_id = "";
      this.isShowLoading = false;
    },
    taskInput(e) {
      this.content = e.target.value;
    },
    levelSwitch(e) {
      this.level = e.target.value;
    },
    taskOperation() {
      if (!this.content) {
        this.showToast("请输入");
        return;
      }
      this.isShowLoading = true;
      const method = this.task_id ? "PUT" : "POST";
      let data = {
        content: this.content,
        level: this.level ? 1 : 0,
        task_id: this.task_id,
        event_id: this.event_id
      };
      this.$store.dispatch(`task/${TASK_OPERATION}`, {
        method,
        event_id: this.event_id,
        data,
        onSuccess: this.operationSuccess,
        onFailed: this.operationFailed
      });
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
    getTaskInfo(task) {
      this.content = task.content;
      this.level = task.level === 0 ? false : true;
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
