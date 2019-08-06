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
  props: ["retryMethod"],
  data() {
    return {};
  },
  methods: {
    retryClick() {
      this.$parent.isShowLoading = true;
      this.$parent.isShowReTry = false;
      for (let i = 0; i < this.retryMethod.length; i++) {
        const v = this.retryMethod[i];
        this.$emit(v);
      }
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
