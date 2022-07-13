<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="title">欢迎使用！ <el-button @click="goLogin">去登录</el-button></div>
        <div class="sub-title">办公自动化管理系统</div>
      </div>
      <div class="background"></div>
    </div>
  </div>


</template>

<script setup>
import { defineProps, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goLogin = () => {
  router.push("/login");
};

defineProps({
  msg: String,
});

const state = reactive({ count: 0 });

</script>

<style lang="scss" scoped>
.container {
  margin-top: 15%;
  display: flex;

  .content {
    margin-left: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 30px;
      font-weight: bold;
      color: #040404;

    }

    .sub-title {
      margin-top: 30px;
      font-size: 40px;
      color: #409eff;

    }
  }

}

a {
  color: #42b983;
}

.background {
  width: 438px;
  height: 371px;
  background: url(../assets/images/welcome.png) no-repeat;
  margin: 0 auto;
}
</style>
