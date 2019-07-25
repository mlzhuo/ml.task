<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">添加</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">事件名称</view>
        <input name="input" @input="titleInput" />
      </view>
      <view class="cu-form-group align-start">
        <view class="title">事件描述</view>
        <textarea maxlength="-1" @input="descInput"></textarea>
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
      <button class="cu-btn block bg-green shadow lg add-btn" @click="addEvent">添加</button>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user_id: "",
      title: "",
      description: "",
      level: false
    };
  },
  onShow() {
    this.title = "";
    this.description = "";
    this.level = false;
    const { user_id } = this.$root.$mp.query;
    this.user_id = user_id;
  },
  methods: {
    titleInput(e) {
      this.title = e.target.value;
    },
    descInput(e) {
      this.description = e.target.value;
    },
    levelSwitch(e) {
      this.level = e.target.value;
    },
    addEvent() {
      if (!this.title) {
        this.showToast("请输入");
        return;
      }
      if (this.title.replace(/[^\u0000-\u00ff]/g, "aa").length > 8) {
        this.showToast("简单点，四个字就好");
        return;
      }
      const result = this.jsonRequest("POST", "/events/add", {
        title: this.title,
        description: this.description,
        level: this.level ? 1 : 0,
        user_id: this.user_id
      });
      result
        .then(res => {
          if (res.state) {
            this.level = false;
          }
          this.showToast(res.message);
          wx.navigateBack({ delta: 1 });
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
