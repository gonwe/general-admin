<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" width="100" />
        <span v-if="!isCollapse">OA管理系统</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu :default-active="activeMenu" background-color="#001529" text-color="#fff" router :collapse="isCollapse"
        class="nav-menu">
        <!-- <tree-menu :userMenu="userMenu" /> -->
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold">
            <i class="el-icon-s-fold" @click="menuFold"></i>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge class="notice" type="danger" :is-dot="noticeCount > 0 ? true : false">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="logout">
            <span class="user-link">
              {{ userInfo?.userName }}
              <i class="el-icon--right"></i>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo?.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";
export default {
  name: "Home",
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1),
    };
  },
  created() {
    if (!this.$store.state.userInfo) {
      this.$router.push("/login");
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  mounted() {
    this.getNoticesCount();
    this.getPermissionList();
  },
  methods: {
    async getNoticesCount() {
      try {
        const { count } = await this.$api.noticeCount();
        console.log(count);
        if (count) {
          this.noticeCount = count;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getPermissionList() {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList();
        this.userMenu = menuList;
        this.$store.commit("saveActionList", actionList);
        this.$store.commit("saveMenuList", menuList);
      } catch (error) {
        console.log(error);
      }
    },

    menuFold() {
      this.isCollapse = !this.isCollapse;
    },

    //退出登录
    logout(key) {
      console.log(key);
      if (key === 'email') return;
      this.$store.commit("logout");
      this.userInfo = null
      this.$router.push("/login");
    },
  },
};
</script>


<style lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        margin: 0 8px;
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }

    // 合并
    &.fold {
      width: 64px;
    }

    // 展开
    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    // 合并
    &.fold {
      margin-left: 64px;
    }

    // 展开
    &.unfold {
      margin-left: 200px;
    }

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }

      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }

        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);

      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>