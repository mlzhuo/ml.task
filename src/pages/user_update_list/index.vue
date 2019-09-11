<template>
  <view>
    <cu-custom bgcolor="bg-gradual-orange" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">更新日志</block>
    </cu-custom>
    <view class="cu-list menu sm-border card-menu margin-top">
      <navigator
        v-for="item in versions"
        :key="item.version"
        url
        hover-class="none"
        class="cu-item arrow"
      >
        <view class="content" hover-class="none">
          <text class="cuIcon-tagfill text-green"></text>
          <text class="text-grey">{{item.version}} 更新日志</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{item.date}}</text>
        </view>
      </navigator>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      versions: []
    };
  },
  onShow() {
    this.versions = this.$store.state.miniapp.versions;
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.cardTitle {
  color: #fff;
  padding: 90rpx 60rpx;
  font-size: 40rpx;
  font-weight: 300;
  transform: skew(-10deg, 0deg);
  position: relative;
  text-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.3);
}

.cardTitle::before {
  content: "";
  position: absolute;
  width: 60rpx;
  height: 6rpx;
  border-radius: 20rpx;
  background-color: #fff;
  display: block;
  top: 60rpx;
  left: 50rpx;
  transform: skew(10deg, 0deg);
}

.cardTitle::after {
  content: "";
  position: absolute;
  width: 140rpx;
  border-radius: 6rpx;
  height: 24rpx;
  background-color: #fff;
  display: block;
  bottom: 76rpx;
  left: 90rpx;
  transform: skew(10deg, 0deg);
  opacity: 0.1;
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
