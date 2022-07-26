/**
 * Mutations 业务层数据提交
 */

import storage from "../utils/storage";

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem("userInfo", userInfo);
  },
  saveActionList(state, actionList) {
    state.actionList = actionList;
    storage.setItem("actionList", actionList);
  },
  saveMenuList(state, menuList) {
    state.menuList = menuList;
    storage.setItem("menuList", menuList);
  },

  logout(state) {
    state.userInfo = {};
    state.actionList = [];
    state.menuList = [];
    storage.clearItem("userInfo");
    storage.clearItem("actionList");
    storage.clearItem("menuList");
  }
};
