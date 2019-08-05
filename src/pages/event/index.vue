<template>
  <view>
    <cu-custom bgcolor="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">事件列表</block>
    </cu-custom>
    <view class="container">
      <navigator
        hover-class="none"
        :url="'/pages/addEvent/main?user_id='+user_id"
        navigateTo
        class="cu-btn block bg-green shadow lg add-btn"
      >
        <text class="cuIcon-add"></text>添加事件
      </navigator>
      <scroll-view scroll-y>
        <view class="nav-list">
          <navigator
            hover-class="none"
            class="nav-li"
            navigateTo
            :class="'bg-'+item.color"
            v-for="item in events"
            :key="item._id"
            :url="'/pages/task/main?event_id='+item._id+'&event_title='+item.title+'&date='+item.date+'&description='+item.description"
            @longpress="editEvent(item._id)"
          >
            <view class="nav-title">{{item.title}}</view>
            <view
              class="nav-name"
            >{{(item.isDone || item.all) ? item.isDone + '/' + item.all : '0/0'}}</view>
            <text :class="'cuIcon-' + item.cuIcon" class="icon"></text>
          </navigator>
        </view>
        <view class="cu-tabbar-height"></view>
      </scroll-view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
  </view>
</template>

<script>
let color = ["red", "orange", "olive", "cyan", "blue"];
let doneColor = "grey"; //玄灰
export default {
  data() {
    return {
      user_id: "",
      events: [],
      eventStatistics: {},
      isShowLoading: true
    };
  },
  onShow() {
    const { isReNeedRequest } = this.globalData;
    if (isReNeedRequest) {
      const { user_id } = this.$root.$mp.query;
      this.user_id = user_id;
      this.getEvents(user_id);
      this.getEventStatistics(user_id);
      this.globalData.isReNeedRequest = false
    }
  },
  mounted() {
    const { user_id } = this.$root.$mp.query;
    this.user_id = user_id;
    this.getEvents(user_id);
    this.getEventStatistics(user_id);
  },
  methods: {
    getEvents(user_id) {
      const result = this.jsonRequest("GET", `/${user_id}/events`);
      for (let i = 1; i < color.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [color[i], color[random]] = [color[random], color[i]];
      }
      result
        .then(res => {
          if (res.state) {
            let temp = [];
            let index = 0;
            res.data.forEach(item => {
              if (index >= color.length) {
                index = 0;
              }
              item = {
                ...item,
                color: color[index],
                cuIcon: item.level === 0 ? "" : "favorfill"
              };
              index++;
              temp.push(item);
            });
            this.events = temp;
            this.isShowLoading = false;
          }
        })
        .catch(err => {});
    },
    editEvent(event_id) {
      wx.navigateTo({
        url: `/pages/addEvent/main?event_id=${event_id}&user_id=${this.user_id}`
      });
    },
    getEventStatistics(user_id) {
      const result = this.jsonRequest("GET", `/${user_id}/statistics`);
      result.then(res => {
        if (res.state) {
          this.eventStatistics = res.data;
          for (const key in res.data) {
            const { isDone, all } = res.data[key];
            let event = this.events.find(event => event._id === key);
            event.isDone = isDone;
            event.all = all;
          }
        }
      });
    }
  }
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
  margin: 0 20px 35px;
  border-radius: 5px;
}
</style>
