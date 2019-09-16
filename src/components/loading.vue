<template>
  <view>
    <view class="loading">
      <image src="/static/images/puff.svg" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    getLoadingStatus() {
      return this.$store.state.miniapp.isShowLoading;
    }
  },
  watch: {
    getLoadingStatus(val) {
      this.isShow = val;
    }
  }
};
</script>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(13, 10, 49, 0.2);
  z-index: 9;
}

image {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
