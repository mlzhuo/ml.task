<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">打卡</block>
      </cu-custom>
    </view>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/tools_punch_add/main"
        navigateTo
        class="cu-btn bg-gradual-purple shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加打卡
      </navigator>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  onShow() {},
  mounted() {},
  methods: {}
};
</script>
<style scoped>
</style>