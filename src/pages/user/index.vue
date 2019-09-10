<template>
  <view>
    <cu-custom bgcolor="bg-gradual-orange" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">个人</block>
    </cu-custom>
    <view class="container"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {},
  methods: {}
};
</script>

<style scoped>
.page {
  height: 100vh;
  padding-top: 20px;
}
.icon {
  font-size: 16px;
}
.container {
  padding: 16px;
}
.add-btn {
  margin-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
