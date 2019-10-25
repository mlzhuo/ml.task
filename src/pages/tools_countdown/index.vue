<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">倒计时</block>
      </cu-custom>
    </view>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/tools_countdown_add/main"
        navigateTo
        class="cu-btn bg-gradual-purple shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加倒计时
      </navigator>

      <view class="cu-tabbar-height"></view>
      <view class="cu-modal" :class="isShowModal?'show':''" @tap="hideModal">
        <view class="cu-dialog" @tap.stop>
          <view class="cu-list menu text-left">
            <view
              class="cu-item"
              v-for="(item,index) in longPressItemArr"
              :key="index"
              @click="doSomething(index)"
            >
              <label class="flex justify-between align-center flex-sub">
                <view class="flex-sub">{{item}}</view>
              </label>
            </view>
          </view>
        </view>
      </view>
      <Loading v-if="isShowLoading"></Loading>
      <ReTry v-if="isShowReTry"></ReTry>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShowLoading: true,
      isShowReTry: false,
      countdown: [],
      isShowModal: false,
      longPressItemArr: ["编辑", "删除"],
      logoUrl: "/static/images/ml-task-logo.png",
      longPressPunch: {}
    };
  },
  onShow() {},
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.container {
  padding: 15px 5px 5px;
}
.cu-list-header {
  height: 60px !important;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
}
.boxshadow .title-text:nth-child(2) {
  margin-top: 10px;
}
.logo {
  height: 100%;
}
.title-text {
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
}
.action-btns {
  position: absolute;
  right: 10px;
  bottom: 10px;
  text-align: right;
}
.add-btn {
  margin-bottom: 5px;
}
.done-punch-item {
  opacity: 0.3;
}
</style>