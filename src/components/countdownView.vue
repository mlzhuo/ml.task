<template>
  <view
    class="countdown bg-gradual-purple"
    :class="{ 'countdown-complete': isComplete }"
    :key="countdownId"
  >
    <view class="countdown-title" v-if="isShowTitle">{{ countdownName }}</view>
    <view class="countdown-content">{{ time }}</view>
  </view>
</template>

<script>
import { formatYMD, diffTime } from "@/utils/index";
let timer = null;
export default {
  props: [
    "isShowTitle",
    "countdownName",
    "targetDate",
    "isComplete",
    "countdownId"
  ],
  data() {
    return {
      time: ""
    };
  },
  mounted() {},
  methods: {
    startTimer(targetDate) {
      timer = setInterval(() => {
        if (+new Date() > new Date(targetDate)) {
          this.time = "已结束";
          this.$emit("doneCountdown", this.countdownId);
        } else {
          this.time = diffTime(new Date(targetDate));
        }
      }, 1000);
    }
  },
  watch: {
    targetDate: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (+new Date() >= +new Date(newVal) || this.isComplete) {
            this.time = "已结束";
          } else {
            this.startTimer(newVal);
          }
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.countdown {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  /* background: rgba(0, 0, 0, 0.1); */
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
}
.countdown-title {
  display: flex;
  flex: 1;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.countdown-content {
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
}
.countdown-complete {
  opacity: 0.5;
}
</style>
