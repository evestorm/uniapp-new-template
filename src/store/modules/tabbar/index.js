import { defineStore } from "pinia";

export const useTabbarStore = defineStore("tabbar", {
  state: () => ({
    tabBar: [
      {
        iconPath: "/static/tabbar/home.png",
        selectedIconPath: "/static/tabbar/home_sel.png",
        text: "首页",
        count: 0,
        isDot: false,
        pagePath: "/pages/home/home",
      },
      {
        iconPath: "/static/tabbar/msg.png",
        selectedIconPath: "/static/tabbar/msg_sel.png",
        text: "消息",
        count: 0,
        isDot: false,
        pagePath: "/pages/message/message",
      },
      {
        iconPath: "/static/tabbar/me.png",
        selectedIconPath: "/static/tabbar/me_sel.png",
        text: "我的",
        count: 0,
        isDot: false,
        pagePath: "/pages/me/me",
      },
    ],
  }),
  actions: {
    // increment() {
    //   this.count++
    // },
  },
});
