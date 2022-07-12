import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import request from "./utils/request";
import storage from "./utils/storage";
import api from "./api/index";
import store from "./store";
import config from "./config";

const app = createApp(App);
console.log(storage.getItem("userInfo"));
app.config.globalProperties.$request = request; //全局属性挂载request
app.config.globalProperties.$storage = storage; //全局属性挂载storage
app.config.globalProperties.$api = api; //全局属性挂载api
app.use(router);
app.use(store);
app.use(ElementPlus, { size: 'small' });
app.mount("#app");

console.log(config.mockApi);

request({
    url: `${config.mockApi}/users/login`,
    method: "post",
    data: {
        username: "admin",
        password: "admin"
    }
}).then(res => {
    console.log(res);
    storage.setItem("userInfo", res);
}
).catch(err => {
    console.log(err);
}
);
