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
        <text class="cuIcon-add"></text>添加
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
            :url="'/pages/task/main?event_id='+item._id+'&event_title='+item.title"
          >
            <view class="nav-title">{{item.title}}</view>
            <!-- <view
              class="nav-name"
            >{{item.lengthDone.length + '/' + (item.lengthActive.length + item.lengthDone.length)}}</view>-->
            <view class="nav-name" style="color: rgba(0,0,0,0)">0/0</view>
            <text :class="'cuIcon-' + item.cuIcon" class="icon"></text>
          </navigator>
        </view>
        <view class="cu-tabbar-height"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
let color = [
  "red",
  "orange",
  "olive",
  "green",
  "cyan",
  "blue",
  "purple",
  "mauve"
];
let doneColor = "grey"; //玄灰
export default {
  data() {
    return {
      user_id: "",
      events: []
    };
  },
  onShow() {
    const { user_id } = this.$root.$mp.query;
    this.user_id = user_id;
    this.getEvents(user_id);
  },
  methods: {
    getEvents(user_id) {
      const result = this.jsonRequest("GET", `/events/${user_id}`);
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
          }
        })
        .catch(err => {});
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
