<template>
    <Loading :active="isLoading"></Loading>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">導覽列</a>
        <button class="navbar-toggler" type="button"
        data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav">
            <router-link class="nav-link" to="/dashboardpage/productspage">產品列表</router-link>
            <router-link class="nav-link" to="/dashboardpage/orderlist">訂單</router-link>
            <router-link class="nav-link" to="/dashboardpage/coupon">優惠券</router-link>
            <a class="nav-link" href="#" @click.prevent="logout">登出</a>
          </div>
        </div>
      </div>
    </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}logout`;
      this.$http.post(api, this.user)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.$router.push('/loginpage');
          }
        });
    },
  },
};
</script>
