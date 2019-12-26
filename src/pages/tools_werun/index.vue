<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">微信运动报告</block>
      </cu-custom>
    </view>
    <view class="container">
      <scroll-view scroll-x class="bg-white nav">
        <view class="cu-card shadow shadow-lg rank">
          <view class="month bg-gradual-purple text"
            ><span>{{ stepData.monthStep }}</span></view
          >
          <view class="year bg-gradual-purple text"
            ><span>{{ stepData.yearStep }}</span></view
          >
          <view class="week bg-gradual-purple text"
            ><span>{{ stepData.weekStep }}</span></view
          >
        </view>
        <view class="cu-list menu sm-border card-menu margin-top">
          <view class="cu-item">
            <view class="content">
              <text class="text-grey text-lg">今天</text>
            </view>
            <view class="action">
              <text class="text-grey text-lg today-num">{{
                stepData.dayStep
              }}</text>
            </view>
          </view>
          <navigator
            :url="'/pages/tools_werun_details/main?year=' + item._id"
            hover-class="none"
            class="cu-item arrow"
            v-for="item in stepData.years"
            :key="item"
          >
            <view class="content">
              <text class="text-grey text-lg">{{ item._id }}年</text>
            </view>
            <view class="action">
              <text class="text-grey text-lg">{{ item.step }}</text>
            </view>
          </navigator>
        </view>
      </scroll-view>
      <view class="cu-tabbar-height"></view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <ReTry v-if="isShowReTry" @click="retryGetData"></ReTry>
  </view>
</template>

<script>
import { GET_WERUN_DATA } from "@/store/mutation-types";
import { formatYMD, formatTime, splitNum } from "@/utils";
export default {
  data() {
    return {
      stepData: {},
      isShowLoading: false,
      isShowReTry: false
    };
  },
  onShow() {
    const that = this;
    that.isShowLoading = true;
    wx.getWeRunData({
      success(res) {
        // 拿 encryptedData 到开发者后台解密开放数据
        const { encryptedData, iv } = res;
        that.$store.dispatch(`tools/${GET_WERUN_DATA}`, {
          encryptedData,
          iv,
          onSuccess: that.getWeRunDataSuccess
        });
      },
      fail(err) {
        that.isShowLoading = false;
        wx.showModal({
          title: "微信运动",
          content: "您已拒绝了微信运动授权，如需重新订阅请前往设置打开。",
          confirmText: "去设置",
          //showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.openSetting({});
            }
          }
        });
      }
    });
  },
  methods: {
    getWeRunDataSuccess(data) {
      this.stepData = data;
      this.isShowLoading = false;
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
}
.rank {
  height: 150px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.month,
.year,
.week {
  flex: 1;
  position: relative;
  border-radius: 10px 10px 0 0;
}
.text::after {
  content: "本月";
  height: 30px;
  line-height: 30px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.year.text::after {
  content: "本年";
}
.week.text::after {
  content: "本周";
}
.month {
  height: 30%;
}
.year {
  height: 50%;
  margin: 0 5px;
}
.week {
  height: 20%;
}
span {
  position: absolute;
  left: 50%;
  top: -55px;
  transform: translateX(-50%);
  color: blueviolet;
}
.month span,
.week span {
  font-size: 26px;
}
.year span {
  font-size: 30px;
}
.cu-list.card-menu {
  margin-left: 0;
  margin-right: 0;
}
.today-num {
  font-weight: 700;
  font-size: 20px;
}
</style>
