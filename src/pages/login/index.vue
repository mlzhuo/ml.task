<template>
  <view>
    <image :src="bgUrl" mode="widthFix" class="response" />
    <form @submit="formSubmit" report-submit>
      <button
        form-type="submit"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
        @click="wxCanIUse"
        class="wx-login-btn cu-btn bg-gradual-blue"
      >登录</button>
    </form>
    <view class="tip">
      <p>版本 {{version}}</p>
      <p>MPVue ColorUI</p>
      <p>插画 undraw.co</p>
    </view>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { LOGIN, SAVE_USER_INFO } from "@/store/mutation-types";
import { config } from "@/config";
export default {
  data() {
    return {
      isShowLoading: false,
      version: "1.0.0",
      bgUrl: "/static/images/login_bg_m.svg"
    };
  },
  mounted() {
    this.getSetting();
    this.version = config.version;
  },
  methods: {
    formSubmit(e) {
      const { formId } = e.target;
      this.isShowLoading = true;
      this.$store.dispatch(`user/${LOGIN}`, {
        loginFormObj: { formId, ...this.$store.state.user.userInfo },
        onSuccess: this.onSuccess,
        onFailed: this.onFailed
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
                that.$store.dispatch(`user/${SAVE_USER_INFO}`, res.userInfo);
                const { gender } = res.userInfo;
                if (gender === 2) {
                  that.bgUrl = "/static/images/login_bg_f.svg";
                }
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
        this.$store.dispatch(
          `user/${SAVE_USER_INFO}`,
          JSON.parse(e.mp.detail.rawData)
        );
      }
    },
    onSuccess({ message }) {
      this.showToast(message);
      wx.reLaunch({ url: "/pages/event/main" });
      this.isShowLoading = false;
    },
    onFailed() {
      this.showToast("登录超时");
      this.isShowLoading = false;
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
