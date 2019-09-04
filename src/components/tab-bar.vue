<template>
  <view class="cu-bar tabbar bg-white">
    <view class="action">
      <view class="cuIcon-cu-image">
        <image src="/static/images/tabbar/basics_cur.png" />
      </view>
      <view class="text-green">元素</view>
    </view>
    <view class="action">
      <view class="cuIcon-cu-image">
        <image src="/static/images/tabbar/component.png" />
      </view>
      <view class="text-gray">组件</view>
    </view>
    <view class="action">
      <view class="cuIcon-cu-image">
        <image src="/static/images/tabbar/plugin.png" />
        <view class="cu-tag badge">99</view>
      </view>
      <view class="text-gray">扩展</view>
    </view>
    <view class="action">
      <view class="cuIcon-cu-image">
        <image src="/static/images/tabbar/about.png" />
        <view class="cu-tag badge"></view>
      </view>
      <view class="text-gray">关于</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          pagePath: "pages/event/main",
          iconPath: "/static/images/index-default.png",
          selectedIconPath: "/static/images/index-active.png",
          text: "记事"
        },
        {
          pagePath: "pages/countdown/main",
          iconPath: "/static/images/index-default.png",
          selectedIconPath: "/static/images/index-active.png",
          text: "倒计时"
        },
        {
          pagePath: "pages/punch/main",
          iconPath: "/static/images/index-default.png",
          selectedIconPath: "/static/images/index-active.png",
          text: "打卡"
        }
      ]
    };
  }
};
</script>

<style>
</style>