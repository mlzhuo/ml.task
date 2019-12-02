<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{pageTitle}}</block>
    </cu-custom>
    <div class="container">
      <view class="cu-form-group">
        <view class="title">打卡名称</view>
        <input name="input" @input="nameInput" :value="name" />
      </view>
      <view class="cu-form-group">
        <view class="title">开始日期</view>
        <picker
          mode="date"
          :value="start_date"
          :start="picker_start_date"
          @change="DateChangeStart"
        >
          <view class="picker">{{start_date}}</view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">结束日期</view>
        <picker mode="date" :value="end_date" :start="picker_start_date" @change="DateChangeEnd">
          <view class="picker">{{end_date}}</view>
        </picker>
      </view>
      <view class="cu-form-group align-start">
        <view class="title">打卡描述</view>
        <textarea maxlength="-1" @input="descInput" :value="description"></textarea>
      </view>
      <button
        class="cu-btn block bg-gradual-purple shadow lg add-btn"
        @click="punchOperation"
      >{{btnTitle}}</button>
      <view class="cu-tabbar-height"></view>
    </div>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
import { formatYMD } from "@/utils/index";
import { PUNCH_OPERATION, IS_NEED_REFRESH_PUNCH } from "@/store/mutation-types";
export default {
  data() {
    return {
      user_id: "",
      punch_id: "",
      pageTitle: "",
      btnTitle: "",
      name: "",
      description: "",
      picker_start_date: "",
      start_date: "",
      end_date: "",
      isShowLoading: false
    };
  },
  onShow() {
    const { user, tools } = this.$store.state;
    this.user_id = user.userInfo.userId;
    this.punch_id = tools.currentPunch._id;
    const today = formatYMD(new Date());
    const tomorrow = formatYMD(
      new Date(new Date().getTime() + 24 * 3600 * 1000)
    );
    this.picker_start_date = today;
    this.start_date = today;
    this.end_date = tomorrow;
    if (this.punch_id) {
      this.pageTitle = "编辑";
      this.btnTitle = "编辑";
      this.getPunchInfo(tools.currentPunch);
    } else {
      this.pageTitle = "添加";
      this.btnTitle = "添加";
    }
  },
  methods: {
    nameInput(e) {
      this.name = e.target.value;
    },
    descInput(e) {
      this.description = e.target.value;
    },
    DateChangeStart(e) {
      this.start_date = e.target.value;
    },
    DateChangeEnd(e) {
      this.end_date = e.target.value;
    },
    punchOperation() {
      if (!this.name) {
        this.showToast("请输入");
        return;
      }
      if (
        new Date(this.end_date).getTime() -
          new Date(this.start_date).getTime() >
        366 * 24 * 3600 * 1000
      ) {
        this.showToast("先定个小目标，最长一年");
        return;
      }
      this.clickRequestSubscribeMessage()
      this.isShowLoading = true;
      const method = this.punch_id ? "PUT" : "POST";
      let formData = {
        user_id: this.user_id,
        name: this.name,
        description: this.description,
        start_date: this.start_date,
        end_date: this.end_date
      };
      if (this.punch_id) {
        formData.punch_id = this.punch_id;
      }
      this.$store.dispatch(`tools/${PUNCH_OPERATION}`, {
        method,
        formData,
        onSuccess: this.operationSuccess,
        onFailed: this.operationFailed
      });
    },
    operationSuccess(message) {
      this.$store.commit(`tools/${IS_NEED_REFRESH_PUNCH}`, true);
      this.isShowLoading = false;
      this.showToast(message);
      wx.navigateBack({ delta: 1 });
    },
    operationFailed() {
      this.isShowLoading = false;
      this.showToast("请重试");
    },
    getPunchInfo(punch) {
      this.name = punch.name;
      const startYear = formatYMD(new Date(punch.start_date)).slice(0, 5);
      const endYear = formatYMD(new Date(punch.end_date)).slice(0, 5);
      this.description = punch.description;
      this.start_date = startYear + punch.start_date_format.join("-");
      this.end_date = endYear + punch.end_date_format.join("-");
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
.cu-form-group.align-start {
  border-bottom: 1rpx solid #eee;
}
</style>
