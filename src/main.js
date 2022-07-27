import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import { createApp } from "vue";
import api from "./api/index";
import App from "./App.vue";
import store from "./store";
import request from "./utils/request";
import storage from "./utils/storage";
import router from "./router";

const app = createApp(App);
app.directive("has", (el, binding) => {
    const value = binding.value;
    const actionList = storage.getItem("actionList");
    const hasPermission = actionList.includes(value);
    if (!hasPermission) {
        // 转为宏任务
        setTimeout(() => {
            el.style.display = "none";
            el.parentNode?.removeChild(el);
        });
    }
})
app.config.globalProperties.$request = request; //全局属性挂载request
app.config.globalProperties.$storage = storage; //全局属性挂载storage
app.config.globalProperties.$api = api; //全局属性挂载api
app.use(store);
app.use(router);
app.use(ElementPlus, { size: 'small' });
app.mount("#app");

