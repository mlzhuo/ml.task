<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">工具</block>
    </cu-custom>
    <view class="cu-card">
      <!-- <view
        class="cu-item bg-gradual-purple shadow-blur"
        v-for="(item,index) in toolsList"
        :key="index"
        @click="toolsItemClick(item.url)"
      >
        <image class="item-bg-img" :src="item.img" />
        <view class="cardTitle">{{item.title}}</view>
        <view class="subText">在进行：<span class="num">{{toolsOverviewData.punch.isActive}}</span>今日：<span class="num">{{toolsOverviewData.punch.toadyIsDone}}</span></view>
      </view> -->
      <view
        class="cu-item bg-gradual-purple shadow-blur"
        @click="toolsItemClick(0)"
      >
        <image class="item-bg-img" :src="toolsList[0].img" />
        <view class="cardTitle">{{ toolsList[0].title }}</view>
        <view class="subText" v-if="toolsOverviewData.punch.isActive > 0"
          >在进行：<span class="num">{{
            toolsOverviewData.punch.isActive
          }}</span
          >今日：<span class="num">{{
            toolsOverviewData.punch.todayIsDone
          }}</span></view
        >
      </view>

      <view
        class="cu-item bg-gradual-purple shadow-blur"
        @click="toolsItemClick(1)"
      >
        <image class="item-bg-img" :src="toolsList[1].img" />
        <view class="cardTitle">{{ toolsList[1].title }}</view>
      </view>
      <view
        class="cu-item bg-gradual-purple shadow-blur"
        @click="toolsItemClick(2)"
      >
        <image class="item-bg-img" :src="toolsList[2].img" />
        <view class="cardTitle">{{ toolsList[2].title }}</view>
      </view>
      <button
        class="cu-item bg-gradual-purple shadow-blur"
        @click="toolsItemClick(3)"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
      >
        <image class="item-bg-img" :src="toolsList[3].img" />
        <view class="cardTitle">{{ toolsList[3].title }}</view>
      </button>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import {
  IS_NEED_REFRESH_TOOLS_OVERVIEW,
  GET_TOOLS_OVERVIEW_DATA,
  SAVE_USER_INFO
} from "@/store/mutation-types";
export default {
  data() {
    return {
      toolsOverviewData: { punch: {} },
      toolsList: [
        {
          index: 0,
          title: "打卡计划",
          img: "/static/images/punch.svg",
          url: "/pages/tools_punch/main"
        },
        {
          index: 1,
          title: "倒计时",
          img: "/static/images/countdown.svg",
          // url: "/pages/tools_countdown/main"
        },
        {
          index: 2,
          title: "OCR文字识别",
          img: "/static/images/ocr.svg"
          // url: "/pages/tools_countdown/main"
        },
        {
          index: 3,
          title: "微信运动报告",
          img: "/static/images/wechatrun.svg",
          url: "/pages/tools_werun/main"
        }
      ]
    };
  },
  onShow() {
    const isNeedRefreshToolsOverview = this.$store.state.tools
      .isNeedRefreshToolsOverview;
    if (isNeedRefreshToolsOverview) {
      this.getData();
    } else {
      this.onSuccess();
    }
  },
  mounted() {
    // this.getSetting();
  },
  methods: {
    toolsItemClick(index) {
      switch (index) {
        // case 3:
        //   this.wxCanIUse();
        //   wx.navigateTo({ url: this.toolsList[index].url });
        //   break;
        default:
          if (this.toolsList[index].url) {
            wx.navigateTo({ url: this.toolsList[index].url });
          } else {
            this.showToast("暂未上线");
          }
          break;
      }
    },
    getData() {
      this.$store.dispatch(`tools/${GET_TOOLS_OVERVIEW_DATA}`, {
        onSuccess: this.onSuccess
      });
    },
    onSuccess() {
      const { toolsOverviewData } = this.$store.state.tools;
      this.toolsOverviewData = toolsOverviewData;
    },
    getSetting() {
      const that = this;
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              withCredentials: true,
              success: function(res) {
                const { encryptedData, iv, rawData, signature } = res;
                that.$store.dispatch(`user/${SAVE_USER_INFO}`, {
                  ...JSON.parse(rawData),
                  encryptedData,
                  iv,
                  signature,
                  rawData
                });
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
      if (e.mp.detail.errMsg === "getUserInfo:ok") {
        const { encryptedData, iv, rawData, signature } = e.mp.detail;
        this.$store.dispatch(`user/${SAVE_USER_INFO}`, {
          ...JSON.parse(rawData),
          encryptedData,
          iv,
          signature,
          rawData
        });
      }
    }
  }
};
</script>

<style scoped>
.cardTitle {
  color: #fff;
  padding: 45px 30px;
  font-size: 20px;
  font-weight: 300;
  transform: skew(-10deg, 0deg);
  position: relative;
  text-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.3);
}

.cardTitle::before {
  content: "";
  position: absolute;
  width: 30px;
  height: 3px;
  border-radius: 10px;
  background-color: #fff;
  display: block;
  top: 30px;
  left: 25px;
  transform: skew(10deg, 0deg);
}

.cardTitle::after {
  content: "";
  position: absolute;
  width: 70px;
  border-radius: 3px;
  height: 12px;
  background-color: #fff;
  display: block;
  bottom: 38px;
  left: 45px;
  transform: skew(10deg, 0deg);
  opacity: 0.1;
}
.subText {
  position: absolute;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 30px;
  bottom: 5px;
}
.subText .num {
  font-size: 18px;
  font-weight: 700;
  padding-right: 15px;
}
.cu-item {
  position: relative;
  overflow: hidden;
  padding: 0;
  text-align: left;
}
button {
  line-height: inherit;
}
.item-bg-img {
  /* width: 80%; */
  height: 70%;
  position: absolute;
  top: 15%;
  right: -25%;
}
</style>
