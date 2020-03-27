<template>
  <!-- <view
    class="countdown bg-gradual-purple"
    :class="{ 'countdown-complete': isComplete }"
    :key="countdownId"
  >
    <view class="countdown-title" v-if="isShowTitle">{{ countdownName }}</view>
    <view class="countdown-content">{{ time }}</view>
  </view> -->
  <view
    class="cu-card dynamic"
    :class="{ 'done-punch-item': isComplete }"
    :key="countdownId"
  >
    <view class="cu-item shadow boxshadow">
      <view class="cu-list menu-avatar cu-list-header">
        <view class="cu-item cu-list-header">
          <view class="cu-avatar round lg">
            <image :src="logoUrl" class="logo" />
          </view>
          <view class="content flex-sub">
            <view class="text-cut">{{ countdownName }}</view>
            <view class="text-gray text-sm flex justify-between text-cut">{{
              countdownDescription
            }}</view>
          </view>
        </view>
      </view>
      <view class="title-text text-cut">
        起止：
        <span>{{ editTime }} — {{ targetDate }}</span>
      </view>
      <view class="title-text text-cut fl">
        进度：
        <span style="font-size:20px">{{ time }}</span>
      </view>
      <view class="action-btns">
        <button class="cu-btn round bg-white" v-if="isComplete">
          已结束
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { formatYMD, diffTime } from "@/utils/index";
let timer = null;
export default {
  props: [
    "countdown"
  ],
  data() {
    return {
      logoUrl: "/static/images/ml-task-logo.png",
      time: "",
      countdownName: "",
      countdownDescription: "",
      targetDate: "",
      editTime: "",
      isComplete: "",
      countdownId: ""
    };
  },
  mounted() {
    const { target_date, name, state, _id, description, edit_time } = this.countdown;    
    this.countdownName = name
    this.countdownDescription = description
    this.targetDate = formatYMD(new Date(target_date)).slice(5)
    this.editTime = formatYMD(new Date(edit_time)).slice(5)
    this.isComplete = state
    this.countdownId = _id
  },
  methods: {
    startTimer() {
      timer = setInterval(() => {
        if (+new Date() > new Date(this.countdown.target_date)) {
          this.time = "已结束";
          this.$emit("doneCountdown", this.countdown._id);
        } else {
          this.time = diffTime(new Date(this.countdown.target_date));
        }
      }, 1000);
    }
  },
  watch: {
    countdown: {
      handler() {
        if (
          +new Date() >= +new Date(this.countdown.target_date) ||
          this.countdown.isComplete
        ) {
          this.time = "--:--";
        } else {
          this.startTimer();
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.cu-list-header {
  height: 60px !important;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
  margin-top: 5px;
  margin-bottom: 25px;
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
