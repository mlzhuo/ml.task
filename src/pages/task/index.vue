<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{event_title}}</block>
    </cu-custom>
    <view class="container">
      <navigator
        hover-class="none"
        :url="'/pages/addTask/main?event_id='+event_id"
        navigateTo
        class="cu-btn block bg-green shadow lg add-btn"
      >
        <text class="cuIcon-add"></text>添加
      </navigator>
      <div class="cu-timeline" v-if="tasks.length===0">
        <div class="cu-item cur cuIcon-noticefill">
          <div class="content bg-grey shadow-blur">暂无记录</div>
        </div>
      </div>
      <div class="cu-timeline" v-for="(daySortItem, key) in tasks" :key="key">
        <div class="cu-time">{{key}}</div>
        <div
          v-for="item in daySortItem"
          :key="item._id"
          :class="{'cu-item':true,'text-green':item.state!==0?true:false}"
        >
          <div class="content">
            <div v-if="item.state===0" class="cu-capsule radius">
              <div class="cu-tag bg-cyan">{{item.time}}</div>
              <div class="cu-tag" v-if="item.level!==0">
                <text class="cuIcon-favorfill"></text>
              </div>
              <text class="cuIcon-edit done-btn edit-btn" @click="editTask(item._id)"></text>
              <text class="cuIcon-check done-btn" @click="doneTask(item._id)"></text>
            </div>
            <div v-else class="cu-capsule radius">
              <div class="cu-tag bg-green">{{item.edit_time}}</div>
              <div class="cu-tag" v-if="item.level!==0">
                <text class="cuIcon-favorfill"></text>
              </div>
            </div>
            <div class="margin-top">{{item.content}}</div>
          </div>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      event_id: "",
      event_title: "",
      tasks: {}
    };
  },
  onShow() {
    this.tasks = {};
    const { event_id, event_title } = this.$root.$mp.query;
    this.event_id = event_id;
    this.event_title = event_title;
    this.getTasks(event_id);
  },
  methods: {
    getTasks(event_id) {
      const result = this.jsonRequest("GET", `/events/${event_id}/tasks`);
      result
        .then(res => {
          if (res.state) {
            let temp = res.data;
            let tempObj = {};
            temp.forEach(item => {
              const formatDateObj = this.formatDate(new Date(item.date));
              item.date = formatDateObj.date;
              item.time = formatDateObj.time;
              item.edit_time =
                item.edit_time.split("T")[0] === "1970-01-01"
                  ? ""
                  : this.formatDate(new Date(item.edit_time)).time;
            });
            temp.forEach(item => {
              var objArray = tempObj[item.date] || [];
              objArray.push(item);
              tempObj[item.date] = objArray;
            });
            this.tasks = tempObj;
          }
        })
        .catch(err => {});
    },
    formatDate: date => {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      let hours = date.getHours();
      if (hours < 10) {
        hours = "0" + hours;
      }
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let seconds = date.getSeconds();
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return {
        date: month + "-" + day,
        time: hours + ":" + minutes
      };
    },
    doneTask(task_id) {
      const result = this.jsonRequest("POST", "/tasks/edit", {
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
    editTask(task_id) {
      wx.navigateTo({
        url: `/pages/addTask/main?task_id=${task_id}&pageTitle=编辑`
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
.cu-tag {
  border-radius: 3px !important;
}
</style>
