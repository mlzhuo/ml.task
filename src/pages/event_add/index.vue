<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">分类名称</view>
        <input name="input" @input="titleInput" :value="title" />
      </view>
      <view class="cu-form-group align-start">
        <view class="title">分类描述</view>
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
      <button
        class="cu-btn block bg-gradual-blue shadow lg add-btn"
        @click="eventOperation"
      >{{btnTitle}}</button>
      <view class="cu-tabbar-height"></view>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { EVENT_OPERATION } from "@/store/mutation-types";
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
    const { user, event } = this.$store.state;
    this.user_id = user.userInfo.userId;
    this.event_id = event.currentEvent._id;
    if (this.event_id) {
      this.pageTitle = "编辑";
      this.btnTitle = "编辑";
      this.getEventInfo(event.currentEvent);
    } else {
      this.pageTitle = "添加";
      this.btnTitle = "添加";
    }
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
    eventOperation() {
      if (!this.title) {
        this.showToast("请输入");
        return;
      }
      if (this.title.replace(/[^\u0000-\u00ff]/g, "aa").length > 60) {
        this.showToast("分类名称不能超过30个字");
        return;
      }
      this.clickRequestSubscribeMessage()
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
    },
    operationSuccess(message) {
      this.isShowLoading = false;
      this.showToast(message);
      wx.navigateBack({ delta: 1 });
    },
    operationFailed() {
      this.isShowLoading = false;
      this.showToast("请重试");
    },
    getEventInfo(data) {
      this.title = data.title;
      this.description = data.description;
      this.level = data.level === 0 ? false : true;
    },
    clickRequestSubscribeMessage() {
      const that = this
      wx.requestSubscribeMessage({
        tmplIds: that.$store.state.user.userInfo.priTmplId,
        success(res) {
          for (var key in res) {
            if (key !='errMsg') {
              if (res[key] =='reject') {
                wx.showModal({
                  title:'订阅消息',
                  content:'您已拒绝了订阅消息，如需重新订阅请前往设置打开。',
                  confirmText:'去设置',
                  //showCancel: false,
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({})
                    }
                  }
                })
                return
              }else{
                wx.showToast({
                  title:'订阅成功'
                })
              }
            }
          }
        },
        fail(err) {
          wx.showModal({
            title:'订阅消息',
            content:'您关闭了“接收订阅信息”，请前往设置打开',
            confirmText:'去设置',
            showCancel:false,
            success: res => {
              if (res.confirm) {
                wx.openSetting({})
              }
            }
          })
        }
      });
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
