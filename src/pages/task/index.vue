<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">事件记录</block>
    </cu-custom>
    <view class="cu-card dynamic" :class="isCard?'no-card':''">
      <view class="cu-item shadow">
        <view class="cu-list menu-avatar">
          <view class="cu-item">
            <view class="cu-avatar round lg" :style="{backgroundImage:'url('+avatarUrl+')'}"></view>
            <view class="content flex-sub">
              <view>{{event_title}}</view>
              <view class="text-gray text-sm flex justify-between">{{nickName}}创建于{{date}}</view>
            </view>
          </view>
        </view>
        <view class="text-content">{{description}}</view>
      </view>
    </view>
    <view class="container">
      <navigator
        hover-class="none"
        :url="'/pages/addTask/main?event_id='+event_id"
        navigateTo
        class="cu-btn bg-green shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加记录
      </navigator>
      <div class="cu-timeline" v-if="!isNoTasks">
        <div class="cu-item">
          <div class="content shadow-blur">暂无记录</div>
        </div>
      </div>
      <div class="cu-timeline" v-for="(daySortItem, key) in tasks" :key="key">
        <div class="cu-time">{{key}} {{daySortItem[0].weekday}}</div>
        <div
          v-for="item in daySortItem"
          :key="item._id"
          :class="{'cu-item':true,'text-blue':item.state===0?true:false}"
          @longpress="showModal(item._id)"
        >
          <div class="content light" :class="{'bg-gradual-blue': item.state===0}">
            <div v-if="item.state===0" class="cu-capsule radius">
              <div class="cu-tag bg-cyan borderRadius">{{item.time}}</div>
              <text v-if="item.level!==0" class="cuIcon-favorfill favorfillIcon text-yellow"></text>
              <text class="cuIcon-edit done-btn edit-btn text-white" @click="editTask(item)"></text>
              <text class="cuIcon-check done-btn text-white" @click="doneTask(event_id,item._id)"></text>
            </div>
            <div v-else class="cu-capsule radius">
              <div class="cu-tag bg-grey">完成于</div>
              <div class="cu-tag line-grey">{{item.edit_time}}</div>
            </div>
            <div :class="{'margin-top': true,'':item.state!==0?true:false }">{{item.content}}</div>
          </div>
        </div>
      </div>
    </view>
    <view class="cu-modal" :class="isShowModal?'show':''" @tap="hideModal">
      <view class="cu-dialog" @tap.stop>
        <view class="cu-list menu text-left">
          <view
            class="cu-item"
            v-for="(item,index) in longPressItemArr"
            :key="index"
            @click="doSomething"
          >
            <label class="flex justify-between align-center flex-sub">
              <view class="flex-sub">{{item}}</view>
            </label>
          </view>
        </view>
      </view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <ReTry v-if="isShowReTry" :retryMethod="['getTasks']" @getTasks="getTasks(event_id)"></ReTry>
  </view>
</template>

<script>
import { formatDate } from "@/utils/index";
import {
  GET_ALL_TASKS,
  DONE_TASK,
  STORE_TASK_BY_TASK_ID,
  CLEAR_CURRENT_TASK
} from "@/store/mutation-types";
export default {
  data() {
    return {
      event_id: "",
      event_title: "",
      date: "",
      description: "",
      avatarUrl: "",
      nickName: "",
      tasks: {},
      isNoTasks: true,
      isShowLoading: true,
      isShowReTry: false,
      isShowModal: false,
      longPressItemArr: ["未完成功能 ^_^"],
      longPressTaskId: ""
    };
  },
  onShow() {
    this.$store.commit(`task/${CLEAR_CURRENT_TASK}`);
  },
  mounted() {
    const {
      _id,
      title,
      date,
      description
    } = this.$store.state.event.currentEvent;
    this.event_id = _id;
    this.event_title = title;
    this.date = formatDate(new Date(date)).fullDate;
    this.description = description;
    const { avatarUrl, nickName } = this.$store.state.user.userInfo;
    this.avatarUrl = avatarUrl;
    this.nickName = nickName;
    this.getTasks(this.event_id);
  },
  methods: {
    getTasks(event_id) {
      this.isShowLoading = true;
      this.$store.dispatch(`task/${GET_ALL_TASKS}`, {
        event_id,
        onSuccess: this.getAllTasksSuccess,
        onFailed: this.getAllTasksFailed
      });
    },
    getAllTasksSuccess(tasks) {
      this.tasks = tasks;
      this.checkTasks(tasks);
      this.isShowLoading = false;
    },
    getAllTasksFailed() {
      this.isShowLoading = false;
      this.isShowReTry = true;
      this.showToast("请求失败，请重试");
    },
    checkTasks(obj) {
      Object.keys(obj).length
        ? (this.isNoTasks = true)
        : (this.isNoTasks = false);
    },
    doneTask(event_id, task_id) {
      this.$store.dispatch(`task/${DONE_TASK}`, {
        event_id,
        task_id,
        onSuccess: this.doneTaskSuccess
      });
    },
    doneTaskSuccess(message) {
      this.getTasks(this.event_id);
      this.showToast(message);
    },
    editTask(task) {
      this.$store.commit(`task/${STORE_TASK_BY_TASK_ID}`, task);
      wx.navigateTo({ url: `/pages/addTask/main` });
    },
    showModal(task_id) {
      this.isShowModal = true;
      this.longPressTaskId = task_id;
    },
    hideModal() {
      this.isShowModal = false;
    },
    doSomething() {
      this.isShowModal = false;
      this.showToast("未完成功能 ^_^");
    }
  }
};
</script>

<style scoped>
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
.cu-capsule {
  position: relative;
  width: 100%;
}
.cu-capsule .done-btn {
  position: absolute;
  right: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  font-weight: 700;
}
.cu-capsule .edit-btn {
  right: 35px;
}
.cuIcon-favorfill {
  font-size: 20px;
  /* color: #e54d42; */
}
.cu-tag.borderRadius {
  border-radius: 3px !important;
}
.cu-card > .cu-item {
  margin: 0 16px !important;
}
.cu-timeline .cu-time {
  width: 75px !important;
}
.favorfillIcon {
  line-height: 24px;
  margin-left: 10px;
}
</style>
