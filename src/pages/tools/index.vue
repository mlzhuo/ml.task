<template>
  <view>
    <view class="cu-card">
      <view
        class="cu-item bg-gradual-purple shadow-blur"
        v-for="(item,index) in list"
        :key="index"
        @click="toolsItemClick(item.url)"
      >
        <image class="item-bg-img" :src="item.img" />
        <view class="cardTitle">{{item.title}}</view>
        <view class="subText">在进行：<span class="num">{{toolsOverviewData.punch.isActive}}</span>今日：<span class="num">{{toolsOverviewData.punch.toadyIsDone}}</span></view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import {
  IS_NEED_REFRESH_TOOLS_OVERVIEW,
  GET_TOOLS_OVERVIEW_DATA
} from "@/store/mutation-types";
export default {
  data() {
    return {
      toolsOverviewData: {punch: {}},
      list: [
        {
          title: "打卡计划",
          male: "",
          img: "/static/images/punch.svg",
          url: "/pages/tools_punch/main"
        }
        // {
        //   title: "倒计时",
        //   img: "/static/images/countdown.svg",
        //   url: "/pages/tools_countdown/main"
        // }
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
  onLoad() {
    const isNeedRefreshToolsOverview = this.$store.state.tools
      .isNeedRefreshToolsOverview;
    if (isNeedRefreshToolsOverview) {
      this.getData();
    } else {
      this.onSuccess();
    }
  },
  methods: {
    toolsItemClick(url) {
      wx.navigateTo({ url });
    },
    getData() {
      this.$store.dispatch(`tools/${GET_TOOLS_OVERVIEW_DATA}`, {
        onSuccess: this.onSuccess
      });
    },
    onSuccess() {
      const {toolsOverviewData} = this.$store.state.tools
      this.toolsOverviewData = toolsOverviewData
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
}
.item-bg-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 25%;
}
</style>
