/**
 * Vue公共状态管理
 */

import { createStore } from "vuex";
import mutations from "./mutations";
import storage from "../utils/storage";

const state = {
  userInfo: storage.getItem("userInfo") || {}, //获取用户消息
  actionList: storage.getItem("actionList") || [], //获取用户操作权限
  menuList: storage.getItem("menuList") || [], //获取用户菜单
};

export default createStore({
  state,
  mutations,
});
