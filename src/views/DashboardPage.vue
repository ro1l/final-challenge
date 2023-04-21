<template>
  <NavbarCMPT></NavbarCMPT>
  <div class="container-fluid">
    <ToastMessages></ToastMessages>
    <router-view/>
  </div>
</template>

<script>
import ToastMessages from '@/components/ToastMessages.vue';
import emitter from '@/methods/emitter';
import NavbarCMPT from '../components/NavbarCMPT.vue';

export default {
  components: {
    NavbarCMPT,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    console.log(token);
    this.$http.defaults.headers.common.Authorization = token;
    const api = `${process.env.VUE_APP_API}api/user/check`;
    this.$http.post(api, this.user)
      .then((res) => {
        if (!res.data.success) {
          this.$router.push('/loginpage');
        }
      });
  },
};
</script>
