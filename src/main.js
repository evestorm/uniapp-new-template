import { createSSRApp } from "vue";
import App from "./App.vue";
import storage from "@/utils/storage";
import enums from "@/utils/enum";
import config from "@/config";
import * as utils from "@/utils";
import interactiveFeedback from "@/utils/interactiveFeedback";
import uniExtend from "@/utils/unExtends";
import { setupStore } from "./store";

export function createApp() {
  const app = createSSRApp(App);
  setupStore(app);
  app.use(interactiveFeedback);
  app.config.globalProperties.$enums = enums;
  app.config.globalProperties.$config = config;
  app.config.globalProperties.$utils = utils;
  app.config.globalProperties.$storage = storage;
  uniExtend();
  return {
    app,
  };
}
