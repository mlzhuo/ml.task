<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group align-start">
        <view class="title">事件描述</view>
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
      <button
        class="cu-btn block bg-green shadow lg add-btn"
        @click="event_id?addTask():editTask()"
      >{{pageTitle}}</button>
    </div>
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
      task_id: ""
    };
  },
  onShow() {
    this.content = "";
    this.level = false;
    const { event_id, task_id, pageTitle } = this.$root.$mp.query;
    this.event_id = event_id;
    if (task_id && pageTitle) {
      this.task_id = task_id;
      this.pageTitle = pageTitle;
      this.getTask(task_id);
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
    addTask() {
      if (!this.content) {
        this.showToast("请输入");
        return;
      }
      const result = this.jsonRequest("POST", "/tasks/add", {
        content: this.content,
        level: this.level ? 1 : 0,
        event_id: this.event_id
      });
      result
        .then(res => {
          if (res.state) {
            this.level = false;
            wx.navigateBack({ delta: 1 });
          }
          this.showToast(res.message);
        })
        .catch(err => {});
    },
    editTask() {
      const result = this.jsonRequest("POST", "/tasks/edit", {
        content: this.content,
        level: this.level ? 1 : 0,
        task_id: this.task_id
      });
      result
        .then(res => {
          if (res.state) {
            this.showToast(res.message);
            wx.navigateBack({ delta: 1 });
          }
        })
        .catch(err => {});
    },
    getTask(task_id) {
      const result = this.jsonRequest("GET", `/tasks/${task_id}`);
      result
        .then(res => {
          if (res.state) {
            this.content = res.data.content;
            this.level = res.data.level === 0 ? false : true;
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
