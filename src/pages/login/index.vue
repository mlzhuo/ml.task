<template>
  <view>
    <image src="/static/images/bg.svg" mode="widthFix" class="response" />
    <form @submit="formSubmit" report-submit>
      <button
        form-type="submit"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
        @click="wxCanIUse"
        class="wx-login-btn cu-btn bg-cyan"
      >登录</button>
    </form>
    <view class="tip">
      <p>版本 {{version}}</p>
      <p>插画来自 undraw.co</p>
      <p>页面框架 ColorUI</p>
    </view>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { version } from "../../config";
export default {
  data() {
    return {
      userInfo: {},
      isShowLoading: false,
      version: "1.0.0"
    };
  },
  mounted() {
    this.getSetting();
    this.version = version;
  },
  methods: {
    formSubmit(e) {
      const { formId } = e.target;
      this.login({ formId, ...this.userInfo });
    },
    login(obj) {
      const that = this;
      that.isShowLoading = true;
      const wxCode = wx.login({
        success(wxres) {
          const result = that.jsonRequest("POST", "/login", {
            ...obj,
            code: wxres.code
          });
          result
            .then(res => {
              that.showToast(res.message);
              that.isShowLoading = false;
              if (res.state) {
                const { _id } = res.data;
                setTimeout(() => {
                  wx.redirectTo({ url: `/pages/event/main?user_id=${_id}` });
                }, 200);
              }
            })
            .catch(err => {
              this.isShowLoading = false;
              this.showToast("登录失败，请重试");
            });
        }
      });
    },
    getSetting() {
      const that = this;
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            //用户已经授权过
            wx.getUserInfo({
              success: function(res) {
                that.userInfo = res.userInfo;
                that.globalData.userInfo = res.userInfo;
              }
            });
          }
        }
      });
    },
    wxCanIUse() {
      //click事件首先触发
      if (!wx.canIUse("button.open-type.getUserInfo")) {
        wx.showToast({
          title: "请升级微信版本",
          duration: 2000
        });
      }
    },
    bindGetUserInfo(e) {
      if (e.mp.detail.rawData) {
        //允许授权
        this.userInfo = JSON.parse(e.mp.detail.rawData);
      }
    }
  }
};
</script>

<style scoped>
.tip {
  width: 100%;
  position: fixed;
  bottom: 10px;
}
.tip p {
  width: 100%;
  text-align: center;
  color: #777;
}
form {
  display: block;
  text-align: center;
}
.wx-login-btn {
  width: 80px;
  height: 80px;
  margin: 100px auto 0;
  border-radius: 50%;
}
</style>
