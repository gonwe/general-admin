import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import { createApp } from "vue";
import api from "./api/index";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import request from "./utils/request";
import storage from "./utils/storage";

const app = createApp(App);
console.log(storage.getItem("userInfo"));
app.config.globalProperties.$request = request; //全局属性挂载request
app.config.globalProperties.$storage = storage; //全局属性挂载storage
app.config.globalProperties.$api = api; //全局属性挂载api
app.use(router);
app.use(store);
app.use(ElementPlus, { size: 'small' });
app.mount("#app");

