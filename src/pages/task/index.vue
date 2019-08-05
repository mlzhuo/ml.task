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
        class="cu-btn block bg-green shadow lg add-btn"
      >
        <text class="cuIcon-add"></text>添加记录
      </navigator>
      <div class="cu-timeline" v-if="tasks.length===0">
        <div class="cu-item cur cuIcon-noticefill">
          <div class="content bg-grey shadow-blur">暂无记录</div>
        </div>
      </div>
      <div class="cu-timeline" v-for="(daySortItem, key) in tasks" :key="key">
        <div class="cu-time">{{key}} {{daySortItem[0].weekday}}</div>
        <div
          v-for="item in daySortItem"
          :key="item._id"
          :class="{'cu-item':true,'text-cyan':item.state===0?true:false}"
        >
          <div class="content">
            <div v-if="item.state===0" class="cu-capsule radius">
              <div class="cu-tag bg-cyan borderRadius">{{item.time}}</div>
              <text v-if="item.level!==0" class="cuIcon-favorfill favorfillIcon"></text>
              <text class="cuIcon-edit done-btn edit-btn" @click="editTask(event_id,item._id)"></text>
              <text class="cuIcon-check done-btn" @click="doneTask(event_id,item._id)"></text>
            </div>
            <div v-else class="cu-capsule radius">
              <div class="cu-tag bg-grey">完成于</div>
              <div class="cu-tag line-grey">{{item.edit_time}}</div>
            </div>
            <div
              :class="{'margin-top': true,'text-grey':item.state!==0?true:false }"
            >{{item.content}}</div>
          </div>
        </div>
      </div>
    </view>
    <Loading v-if="isShowLoading"></Loading>
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
      isShowLoading: true
    };
  },
  onShow() {
    const { isReNeedRequest } = this.globalData;
    if (isReNeedRequest) {
      this.init();
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
    this.init();
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
    init() {
      this.event_id = "";
      this.event_title = "";
      this.date = "";
      this.description = "";
      this.avatarUrl = "";
      this.tasks = {};
      this.isShowLoading = true;
    },
    getTasks(event_id) {
      const result = this.jsonRequest("GET", `/${event_id}/tasks`);
      result
        .then(res => {
          if (res.state) {
            let temp = res.data;
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
                    new Date(b.date + " " + b.time) -
                    new Date(a.date + " " + a.time)
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
            this.isShowLoading = false;
          }
        })
        .catch(err => {});
    },
    doneTask(event_id, task_id) {
      const result = this.jsonRequest("PUT", `/${event_id}/tasks`, {
        event_id,
        task_id,
        state: 1
      });
      result
        .then(res => {
          if (res.state) {
            this.getTasks(this.event_id);
            this.showToast(res.message);
          }
        })
        .catch(err => {});
    },
    editTask(event_id, task_id) {
      wx.navigateTo({
        url: `/pages/addTask/main?event_id=${event_id}&task_id=${task_id}&pageTitle=编辑`
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
}
.add-btn {
  margin: 0 20px 35px;
  border-radius: 5px;
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
  color: #1cbbb4;
  font-weight: 700;
}
.cu-capsule .edit-btn {
  right: 35px;
}
.cuIcon-favorfill {
  font-size: 20px;
  color: #e54d42;
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
