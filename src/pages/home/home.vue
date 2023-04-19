<template>
  <view class="home-wrapper">
    <!-- header -->
    <view class="header d-flex flex-nowrap j-sb a-center px-3 py-2">
      <view class="header-left d-flex j-start a-center">
        <!-- 头像 -->
        <image class="avatar mr-2" :src="userInfo.avatar" />
        <!-- 信息 -->
        <view class="info d-flex flex-column">
          <view class="name-wrapper d-flex j-start a-center">
            <view class="name mr-2" @click.stop="gotoUserPage">{{
              userInfo.nickname ? userInfo.nickname : "去登录"
            }}</view>
            <view class="cert d-flex a-center"
              ><image class="img mr-1" src="/static/images/已认证.png" mode="" />已认证</view
            >
          </view>
          <!-- 已登录，没手机号 -->
          <view v-show="hasLogin && userInfo.phone" class="phone">{{
            userInfo.phone ? userInfo.phone : "关联手机号，开启更多功能~"
          }}</view>
          <!-- 登录后才显示，而且得没有手机号 -->
          <button
            v-show="hasLogin && !userInfo.phone"
            class="phone no-style"
            open-type="getPhoneNumber"
            @getphonenumber="getphonenumberTap"
            >关联手机号，开启更多功能~</button
          >
        </view>
      </view>
      <view class="header-right h-100 d-flex flex-column ml-auto j-sb">
        <view class="btn-wrapper a-self-end">
          <!-- 签到 -->
          <view class="btn-inner d-flex j-center a-center">
            <image class="img mr-1" src="/static/images/签到.png" mode="" />
            <text class="text">签到</text>
          </view>
        </view>
        <!-- 积分 -->
        <view class="score-wrapper d-flex j-center a-center">
          <text class="desc">可用积分：</text>
          <text class="score">188</text>
        </view>
      </view>
    </view>
    <!-- banner -->
    <view class="banner-wrapper pt-3 px-3">
      <u-swiper :list="bannerList" name="img" border-radius="16"></u-swiper>
    </view>
    <!-- menu -->
    <view class="menu-wrapper d-flex j-sa a-center p-2">
      <view
        class="item d-flex flex-column a-center j-center"
        v-for="(menu, idx) in menuList"
        :key="idx"
      >
        <image class="img" :src="menu.src" mode="" />
        <view class="name">{{ menu.name }}</view>
      </view>
    </view>
    <!-- notice -->
    <view class="notice-wrapper">
      <u-notice-bar
        mode="horizontal"
        :list="noticeList"
        :border-radius="40"
        padding="5rpx 15rpx"
        bg-color="#F1F1F1"
        color="#555555"
        :is-circular="false"
        speed="1500"
      ></u-notice-bar>
    </view>
    <!-- recommend -->
    <view class="recommend-wrapper py-2 mx-3">
      <!-- title -->
      <view class="title">推荐商品</view>
      <!-- list -->
      <view class="list">
        <view class="card d-flex j-sb a-center my-2" v-for="(item, idx) in cardList" :key="idx">
          <view class="info mr-3">
            <u-image
              class="img"
              width="270rpx"
              height="180rpx"
              :src="item.img"
              border-radius="10rpx"
            ></u-image>
          </view>
          <view class="detail d-flex j-sb flex-column flex-1">
            <view class="title">{{ item.title }}</view>
            <view class="rest">剩余：{{ item.rest }}</view>
            <view class="bottom d-flex j-sb a-end">
              <view class="new-score">{{ item.newScore }}<span>积分</span></view>
              <view class="old-score">¥{{ item.oldScore }}</view>
              <view class="btn d-flex j-center a-center">立即兑换</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import home from "@/api/home/newsService";
import { ref, onMounted, computed } from 'vue';
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

const user = useUserStore();

const bannerList = ref([
  {
    img: "https://placekitten.com/200/200",
  },
  {
    img: "https://placekitten.com/300/300",
  },
]);
const menuList = ref([
  {
    name: "抽奖活动",
    src: "/static/images/menu/抽奖活动.png",
  },
  {
    name: "积分商城",
    src: "/static/images/menu/积分商城.png",
  },
  {
    name: "合作商家",
    src: "/static/images/menu/合作商家.png",
  },
  {
    name: "我的兑换码",
    src: "/static/images/menu/我的兑换码.png",
  },
]);
const noticeList = ref([
  "寒雨连江夜入吴平明送客楚山孤洛阳亲友如相问一片冰心在玉壶",
  "平明送客楚山孤",
  "洛阳亲友如相问",
  "一片冰心在玉壶",
]);
const cardList = ref([
  {
    img: "https://placekitten.com/200/100",
    title: "舒肤佳薰衣草舒缓呵护香皂",
    rest: "25",
    newScore: 50,
    oldScore: 15,
  },
  {
    img: "https://placekitten.com/200/100",
    title: "舒肤佳薰衣草舒缓呵护香皂",
    rest: "25",
    newScore: 50,
    oldScore: 15,
  },
  {
    img: "https://placekitten.com/200/100",
    title: "舒肤佳薰衣草舒缓呵护香皂",
    rest: "25",
    newScore: 50,
    oldScore: 15,
  },
]);
const userInfo = computed(() => user.userInfo);
const hasLogin = computed(() => user.hasLogin);
onShow(() => {
  if (!userInfo.nickname) {
    // checkLocation();
  }
});
const getNews = async () => {
  let [, result] = await home.getNews();
  if (result) {
    console.log(result);
  }
};
// 获取手机号
const getphonenumberTap = (e) => {
  user.getPhoneNumber(e);
};
// 前往用户个人信息页
const gotoUserPage = () => {
  uni.switchTab(
    {
      url: "/pages/me/me",
    },
    true,
  );
};
const gotoProductsList = () => {
  uni.navigateTo({
    url: "/pages/homeSub/productsList/productsList",
  });
};
onMounted(() => {
  getNews();
});
</script>

<style lang="scss" scoped>
@import "./home";
</style>
