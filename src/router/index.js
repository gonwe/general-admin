import Home from "@/components/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import storage from "../utils/storage";
import utils from "../utils/utils";
import api from "../api/index";
import store from "../store";

//Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块
const modules = import.meta.glob("../views/**.vue")

const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "welcome",
        meta: {
          title: "欢迎页",
        },
        component: () => import("@/views/Welcom.vue"),
      },
      {
        name: "404",
        path: "/404",
        meta: {
          title: "页面不存在",
        },
        component: () => import("@/views/404.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/Login.vue"),
  },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


function checkPerimisson(path) {
  const length = router.getRoutes().filter(router => router.path === path).length > 0
  return length
}


async function loadAsyncRoutes() {
  // 判断有没有token
  const userInfo = storage.getItem("userInfo") || {}
  if (userInfo.token) {
    // 从后台获取权限菜单
    const menuList = store.state.menuList;
    // 生成路由需要的格式
    const routers = utils.generateRoutes(menuList);
    // 添加到路由表
    routers.map(route => {
      route.component = modules[`../views/${route.component}.vue`];
      router.addRoute('home', route);
    })
  }
}
await loadAsyncRoutes()

// 路由拦截
router.beforeEach(async (to, from, next) => {
  if (checkPerimisson(to.path)) {
    console.log(to);
    document.title = to.meta.title;
    next();
  } else {
    next("/404");
    document.title = "页面不存在";
  }
});

export default router;
