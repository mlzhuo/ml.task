<template>
  <view class="retry">
    <view class="inner-div">
      <button class="cu-btn cuIcon retry-btn" @click="retryClick">
        <text class="cuIcon-refresh retry-icon"></text>
      </button>
      <text class>重试</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    retryClick() {
      const { retryActionType, retryActionPayload } = this.$store.state.miniapp;
      this.$store.dispatch(retryActionType, retryActionPayload);
    }
  }
};
</script>

<style scoped>
.retry {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
.inner-div {
  width: 60px;
  height: 90px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.retry-btn {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}
.retry-icon {
  font-size: 25px;
}
</style>
