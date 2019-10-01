<template>
  <view>
    <image :src="bgUrl" mode="widthFix" class="response" :style="style" />
    <form @submit="formSubmit" report-submit>
      <button
        form-type="submit"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
        @click="wxCanIUse"
        class="cu-btn wx-login-btn"
      >
        <image :src="loginBtnUrl" mode="widthFix" class="response wechat-icon" />
      </button>
      <p class="login-tip">快速登录</p>
    </form>
    <view class="tip">
      <p>{{version}}</p>
    </view>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import {
  LOGIN,
  SAVE_USER_INFO,
  GET_VERSIONS,
  LOAD_CONFIG
} from "@/store/mutation-types";
export default {
  data() {
    return {
      isShowLoading: false,
      version: "",
      fileURL: "",
      style: "",
      bgUrl: "/static/images/login_bg_m.svg",
      loginBtnUrl: "/static/images/login-btn-img.png"
    };
  },
  onShow() {
    this.getVersions();
    this.loadingConfig();
    this.style = `max-height:${this.windowHeight * 0.35}px`;
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    loadingConfig() {
      this.$store.dispatch(`miniapp/${LOAD_CONFIG}`, {
        onSuccess: this.loadingConfigSuccess
      });
    },
    loadingConfigSuccess(config) {
      this.fileURL = config.fileURL;
      // this.loginBtnUrl = this.fileURL && this.fileURL + "/login-btn-img.png";
    },
    getVersions() {
      this.$store.dispatch(`miniapp/${GET_VERSIONS}`, {
        onSuccess: this.getVersionSuccess
      });
    },
    getVersionSuccess() {
      this.version = "v" + this.$store.state.miniapp.version;
    },
    formSubmit(e) {
      const { formId } = e.target;
      this.isShowLoading = true;
      this.$store.dispatch(`user/${LOGIN}`, {
        loginFormObj: { formId, ...this.$store.state.user.userInfo },
        onSuccess: this.loginSuccess,
        onFailed: this.loginFailed
      });
    },
    loginSuccess({ message }) {
      this.showToast(message);
      this.isShowLoading = false;
      wx.reLaunch({ url: "/pages/index/main" });
    },
    loginFailed() {
      this.showToast("登录超时");
      this.isShowLoading = false;
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
                  // that.bgUrl = that.fileURL && that.fileURL + "/login_bg_f.svg";
                  that.bgUrl = "/static/images/login_bg_f.svg";
                } else {
                  // that.bgUrl = that.fileURL && that.fileURL + "/login_bg_m.svg";
                  that.bgUrl = "/static/images/login_bg_m.svg";
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
    }
  }
  // computed: {
  //   getLoadingStatus() {
  //     return this.$store.state.miniapp.isShowLoading;
  //   }
  // },
  // watch: {
  //   getLoadingStatus: {
  //     handler(val) {
  //       this.isShowLoading = val;
  //     },
  //     immediate: true
  //   }
  // }
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
  background-color: #fafafa;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.wechat-icon {
  width: 100%;
}
.login-tip {
  margin-top: 10px;
}
</style>
