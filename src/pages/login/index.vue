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
      <p>插画来自 undraw.co</p>
      <p>页面框架 ColorUI</p>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    formSubmit(e) {
      const { formId } = e.target;
      this.login({ formId, ...this.userInfo });
    },
    login(obj) {
      const that = this;
      const wxCode = wx.login({
        success(wxres) {
          const result = that.jsonRequest("POST", "/login", {
            ...obj,
            code: wxres.code
          });
          result
            .then(res => {
              if (res.state) {
                const { _id } = res.data;
                setTimeout(() => {
                  wx.redirectTo({ url: `/pages/event/main?user_id=${_id}` });
                }, 200);
              }
              that.showToast(res.message);
            })
            .catch(err => {});
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
  color: #666;
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
