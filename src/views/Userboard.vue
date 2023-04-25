<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/user/cart">用戶端</router-link>
    </div>
  </nav>
    <div class="container-fluid">
      <ToastMessages></ToastMessages>
      <router-view/>
    </div>
</template>

<script>
import ToastMessages from '@/components/ToastMessages.vue';
import emitter from '@/methods/emitter';

export default {
  components: {
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
  created() {
  },
};
</script>
