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
    this.task_id = "";
    this.content = "";
    this.level = false;
    const { event_id, task_id, pageTitle } = this.$root.$mp.query;
    this.event_id = event_id;
    if (task_id && pageTitle) {
      this.task_id = task_id;
      this.pageTitle = pageTitle;
      this.isShowLoading = true;
      this.getTask(event_id, task_id);
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
      const result = this.jsonRequest(method, `/${this.event_id}/tasks`, data);
      result
        .then(res => {
          this.isShowLoading = false;
          this.showToast(res.message);
          this.globalData.isReNeedRequest = true
          if (res.state) {
            wx.navigateBack({ delta: 1 });
          }
        })
        .catch(err => {});
    },
    getTask(event_id, task_id) {
      const result = this.jsonRequest("GET", `/${event_id}/tasks/${task_id}`);
      result
        .then(res => {
          if (res.state) {
            this.content = res.data.content;
            this.level = res.data.level === 0 ? false : true;
            this.isShowLoading = false;
          }
        })
        .catch(err => {});
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
