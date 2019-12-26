<template>
  <view>
    <image :src="bgUrl" mode="widthFix" class="response" :style="style" />
    <form @submit="formSubmit" report-submit>
      <!-- open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
      @click="wxCanIUse"-->
      <button form-type="submit" class="cu-btn wx-login-btn">
        <image :src="loginBtnUrl" mode="widthFix" class="response wechat-icon" />
      </button>
      <p class="login-tip">{{loginBtnText}}</p>
    </form>
    <view class="tip">
      <p>{{version}}</p>
    </view>
    <view class="cu-modal" :class="isShowModal?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{currentVersion.version}} 更新日志</view>
          <view class="action" @tap="isShowModal = false">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          更新日期：{{currentVersion.date}}
          <br />
          <view
            :class="{'padding-l-5em': index > 0}"
            v-for="(item, index) in updateInfo"
            :key="index"
          >{{index===0 ? '更新日志：1. ' + item : index + 1 + '. ' + item}}</view>
        </view>
      </view>
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
import { formatVersionText } from "@/utils";
export default {
  data() {
    return {
      isShowLoading: false,
      isShowModal: false,
      version: "",
      currentVersion: {},
      updateInfo: [],
      style: "",
      bgUrl: "/static/images/login_bg.svg",
      loginBtnUrl: "/static/images/login-btn-img.png",
      loginBtnText: "微信登录"
    };
  },
  onShow() {
    this.getVersions();
    this.loadingConfig();
    this.style = `max-height:${this.windowHeight * 0.35}px`;
  },
  mounted() {
    // this.getSetting();
  },
  methods: {
    loadingConfig() {
      this.$store.dispatch(`miniapp/${LOAD_CONFIG}`, {
        onSuccess: this.loadingConfigSuccess
      });
    },
    loadingConfigSuccess(configData) {
      if (configData && configData.config && configData.config.login) {
        const { bg_url, btn_url, btn_text } = configData.config.login;
        bg_url && (this.bgUrl = bg_url);
        btn_url && (this.loginBtnUrl = btn_url);
        btn_text && (this.loginBtnText = btn_text);
      }
    },
    getVersions() {
      this.$store.dispatch(`miniapp/${GET_VERSIONS}`, {
        onSuccess: this.getVersionSuccess
      });
    },
    getVersionSuccess() {
      this.version = "v" + this.$store.state.miniapp.version;
      this.currentVersion = this.$store.state.miniapp.versions[0];
      this.updateInfo = formatVersionText(this.currentVersion.description);
      try {
        var localVersion = wx.getStorageSync("version");
        if (localVersion && localVersion === this.version.replace("v", "")) {
        } else {
          this.isShowModal = true;
          wx.setStorage({
            key: "version",
            data: this.version.replace("v", "")
          });
        }
      } catch (e) {}
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
  margin: 150px auto 0;
  border-radius: 50%;
  padding: 10px;
  /* overflow: hidden; */
  background-color: transparent;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.wechat-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.login-tip {
  margin-top: 10px;
  max-width: 75%;
  display: block;
  margin: 0 auto;
  text-align: center;
}
.padding-xl {
  text-align: left;
}
.padding-l-5em {
  padding-left: 5em;
}
</style>
