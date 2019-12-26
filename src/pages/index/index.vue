<template>
  <view class="page">
    <cu-custom :bgcolor="navigationStyle[selectNavIndex].bgColor" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">{{navigationStyle[selectNavIndex].title}}</block>
    </cu-custom>

    <view class="cu-bar tabbar bg-white">
      <view class="action" @click="selectNavClick(0)">
        <view class="cuIcon-cu-image">
          <image
            :src="selectNavIndex===0?'/static/images/tabbar/event_active.png':'/static/images/tabbar/event.png'"
          />
          <view class="cu-tag badge" v-if="tabBarList[0].badge">{{tabBarList[0].badgeText}}</view>
        </view>
        <!-- <view class="text-green">{{tabBarList[0].text}}</view> -->
      </view>
      <view class="action" @click="selectNavClick(1)">
        <view class="cuIcon-cu-image">
          <image
            :src="selectNavIndex===1?'/static/images/tabbar/tools_active.png':'/static/images/tabbar/tools.png'"
          />
          <view class="cu-tag badge" v-if="tabBarList[1].badge">{{tabBarList[1].badgeText}}</view>
        </view>
        <!-- <view class="text-gray">{{tabBarList[1].text}}</view> -->
      </view>
      <view class="action" @click="selectNavClick(2)">
        <view class="cuIcon-cu-image">
          <image
            :src="selectNavIndex===2?'/static/images/tabbar/user_active.png':'/static/images/tabbar/user.png'"
          />
          <view class="cu-tag badge" v-if="tabBarList[2].badge">{{tabBarList[2].badgeText}}</view>
        </view>
        <!-- <view class="text-gray">{{tabBarList[2].text}}</view> -->
      </view>
    </view>
    <EventView v-if="selectNavIndex===0" />
    <ToolsView v-if="selectNavIndex===1" />
    <UserView v-if="selectNavIndex===2" />
  </view>
</template>

<script>
import EventView from "@/pages/event/index";
import ToolsView from "@/pages/tools/index";
import UserView from "@/pages/user/index";
export default {
  data() {
    return {
      navigationStyle: [
        { bgColor: "bg-gradual-blue", title: "事件" },
        { bgColor: "bg-gradual-purple", title: "工具" },
        { bgColor: "bg-gradual-orange", title: "个人" }
      ],
      selectNavIndex: 0,
      tabBarList: [
        {
          pagePath: "pages/event/main",
          iconPath: "/static/images/tabbar/event.png",
          selectedIconPath: "/static/images/tabbar/event_active.png",
          text: "",
          badge: 0,
          badgeText: ''
        },
        {
          pagePath: "pages/tools/main",
          iconPath: "/static/images/tabbar/tools.png",
          selectedIconPath: "/static/images/tabbar/tools_active.png",
          text: "",
          badge: 0,
          badgeText: ''
        },
        {
          pagePath: "pages/user/main",
          iconPath: "/static/images/tabbar/user.png",
          selectedIconPath: "/static/images/tabbar/user_active.png",
          text: "",
          badge: 0,
          badgeText: ''
        }
      ]
    };
  },
  onShow() {},
  mounted() {},
  components: { EventView, ToolsView, UserView },
  methods: {
    selectNavClick(index) {
      if ((index === 1 || index === 2) && !this.$store.state.user.userInfo.userId) {
        return
      }
      this.selectNavIndex = index;
    }
  }
};
</script>
<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 9999;
}
.action {
  height: 100% !important;
  display: flex !important;
  flex-direction: column;
}
</style>
