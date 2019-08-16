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
              <text
                class="cuIcon-edit done-btn edit-btn text-white"
                @click="editTask(event_id,item._id)"
              ></text>
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
import { formatDate } from "../../utils/index";
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
    const { isReNeedRequest } = this.globalData;
    if (isReNeedRequest) {
      const { event_id, event_title, date, description } = this.$root.$mp.query;
      this.event_id = event_id;
      this.event_title = event_title;
      this.date = formatDate(new Date(date)).fullDate;
      this.description = description;
      this.getTasks(event_id);
      const { avatarUrl, nickName } = this.globalData.userInfo;
      this.avatarUrl = avatarUrl;
      this.nickName = nickName;
    }
  },
  mounted() {
    const { event_id, event_title, date, description } = this.$root.$mp.query;
    this.event_id = event_id;
    this.event_title = event_title;
    this.date = formatDate(new Date(date)).fullDate;
    this.description = description;
    this.getTasks(event_id);
    const { avatarUrl, nickName } = this.globalData.userInfo;
    this.avatarUrl = avatarUrl;
    this.nickName = nickName;
  },
  methods: {
    async getTasks(event_id) {
      this.isShowLoading = true;
      const result = await this.jsonRequest("GET", `/${event_id}/tasks`);
      if (!result) {
        this.isShowLoading = false;
        this.isShowReTry = true;
        this.showToast("请求失败，请重试");
        return;
      }
      let temp = result.data;
      let tempObj = {};
      temp.forEach(item => {
        const formatDateObj = formatDate(new Date(item.date));
        item.weekday = formatDateObj.weekday;
        item.date = formatDateObj.date;
        item.time = formatDateObj.time;
        item.edit_time =
          formatDate(new Date(item.edit_time)).date === formatDateObj.date
            ? formatDate(new Date(item.edit_time)).time
            : formatDate(new Date(item.edit_time)).date +
              " " +
              formatDate(new Date(item.edit_time)).time;
      });
      temp.forEach(item => {
        var objArray = tempObj[item.date] || [];
        objArray.push(item);
        let isActiveTasks = objArray.filter(v => v.state === 0);
        let isDoneTasks = objArray.filter(v => v.state === 1);
        isActiveTasks.sort((a, b) => {
          if (a.level === b.level) {
            return (
              new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
            );
          } else {
            return b.level - a.level;
          }
        });
        isDoneTasks.sort((a, b) => {
          const editTimeA =
            a.edit_time.split(" ").length === 2
              ? new Date(a.edit_time)
              : new Date(a.date + " " + a.edit_time);
          const editTimeB =
            b.edit_time.split(" ").length === 2
              ? new Date(b.edit_time)
              : new Date(b.date + " " + b.edit_time);
          return editTimeB - editTimeA;
        });
        objArray = isActiveTasks.concat(isDoneTasks);
        tempObj[item.date] = objArray;
      });
      this.tasks = tempObj;
      this.checkTasks(tempObj);
      this.isShowLoading = false;
    },
    checkTasks(obj) {
      Object.keys(obj).length
        ? (this.isNoTasks = true)
        : (this.isNoTasks = false);
    },
    async doneTask(event_id, task_id) {
      const result = await this.jsonRequest("PUT", `/${event_id}/tasks`, {
        event_id,
        task_id,
        state: 1
      });
      const { state, message } = result;
      if (state) {
        this.getTasks(this.event_id);
        this.globalData.isReNeedRequest = true;
      }
      this.showToast(message);
    },
    editTask(event_id, task_id) {
      wx.navigateTo({
        url: `/pages/addTask/main?event_id=${event_id}&task_id=${task_id}&pageTitle=编辑`
      });
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
