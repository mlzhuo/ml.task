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
      <button class="cu-btn block bg-gradual-blue shadow lg add-btn" @click="taskOperation">{{pageTitle}}</button>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import {
  TASK_OPERATION,
  IS_NEED_REFRESH_EVENT,
  IS_NEED_REFRESH_TASK
} from "@/store/mutation-types";
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
    const { event } = this.$store.state;
    const event_id = event.currentEvent._id;
    const task_id = event.currentTask._id;
    this.event_id = event_id;
    if (task_id) {
      this.task_id = task_id;
      this.pageTitle = "编辑";
      this.getTaskInfo(event.currentTask);
    } else {
      this.pageTitle = "添加";
    }
  },
  methods: {
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
      this.$store.dispatch(`event/${TASK_OPERATION}`, {
        method,
        event_id: this.event_id,
        data,
        onSuccess: this.operationSuccess,
        onFailed: this.operationFailed
      });
    },
    operationSuccess(message) {
      this.$store.commit(`event/${IS_NEED_REFRESH_EVENT}`, true);
      this.$store.commit(`event/${IS_NEED_REFRESH_TASK}`, {
        [this.event_id]: { isNeed: true }
      });
      this.isShowLoading = false;
      this.showToast(message);
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
</style>
