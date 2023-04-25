<template>
  <button type="button" class="btn btn-info">
    <router-link class="nav-link" to="/loginpage">登入</router-link>
  </button>
  <hr>
  <button type="button" class="btn btn-danger">
    <router-link class="nav-link" to="/user/cart">購物車</router-link>
  </button>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  created() {
    console.log(process.env.VUE_APP_API, process.env.VUE_APP_PATH);
  },
};
</script>
