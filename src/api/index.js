/** api统一管理 */

import request from "../utils/request";

export default {
  login(params) {
    return request({
      url: "/users/login",
      data: params,
      method: "post",
      mock: false,
    });
  },

  noticeCount(params) {
    return request({
      url: "/leave/count",
      data: params,
      method: "get",
      mock: true,
    });
  },

  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
      mock: false,
    });
  },

  getUserList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      // mock: false,
    });
  },

  getAllUserList() {
    return request({
      url: "/users/all/list",
      method: "get",
      data: {},
      // mock: false,
    });
  },

  userDel(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      // mock: true,
    });
  },

  getDeptList(params) {
    return request({
      url: "/dept/list",
      method: "get",
      data: params,
      // mock: true,
    });
  },


  getAllRoleList(params) {
    return request({
      url: "/roles/alllist",
      method: "get",
      data: params,
      // mock: true,
    });
  },

  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      // mock: true,
    });
  },


  userSumbit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      // mock: true,
    });
  },

  menuSumbit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },

  roleSumbit(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },

  roleUpdatePermission(params) {
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      mock: false,
    });
  },


  deptSumbit(params) {
    return request({
      url: "/dept/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },

};
