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
        class="cu-btn bg-green shadow-blur round lg add-btn"
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
    <ReTry v-if="isShowReTry" :retryMethod="['getData']" @getData="getData(user_id)"></ReTry>
  </view>
</template>

<script>
let color = ["red", "orange", "olive", "cyan", "blue"];
export default {
  data() {
    return {
      user_id: "",
      events: [],
      eventStatistics: {},
      isShowLoading: true,
      isShowReTry: false
    };
  },
  onShow() {
    const { isReNeedRequest } = this.globalData;
    if (isReNeedRequest) {
      const { user_id } = this.$root.$mp.query;
      this.user_id = user_id;
      this.getData(user_id);
      this.globalData.isReNeedRequest = false;
    }
  },
  mounted() {
    const { user_id } = this.$root.$mp.query;
    this.user_id = user_id;
    this.getData(user_id);
  },
  methods: {
    async getData(user_id) {
      this.isShowLoading = true;
      const eventsResult = await this.jsonRequest("GET", `/${user_id}/events`);
      const tasksResult = await this.jsonRequest(
        "GET",
        `/${user_id}/statistics`
      );
      for (let i = 1; i < color.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [color[i], color[random]] = [color[random], color[i]];
      }
      if (!eventsResult) {
        this.isShowLoading = false;
        this.isShowReTry = true;
        this.showToast("请求失败，请重试");
        return;
      }
      if (eventsResult.state && tasksResult.state) {
        let temp = [];
        let index = 0;
        eventsResult.data.forEach(item => {
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
        for (const key in tasksResult.data) {
          const { isDone, all } = tasksResult.data[key];
          let event = temp.find(event => event._id === key);
          event.isDone = isDone;
          event.all = all;
        }
        this.events = temp;
        this.isShowLoading = false;
      } else {
        this.isShowLoading = false;
        this.isShowReTry = true;
        this.showToast("请求失败，请重试");
      }
    },
    editEvent(event_id) {
      wx.navigateTo({
        url: `/pages/addEvent/main?event_id=${event_id}&user_id=${this.user_id}`
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
  margin-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
