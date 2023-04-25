<template>
  優惠券
  <Loading :active="isLoading"></Loading>
  <div class="text-end">
    <button type="button" class="btn btn-primary"
    @click="openModal(true)">
      增加優惠券
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>優惠碼</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ item.due_date }}</td>
          <td>{{ item.code }}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm"
              @click="openDelCoupon(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
  </table>
  <CouponModal ref="couponModal"
  :coupon="tempCoupon"
  @update-coupon="updateCoupon"></CouponModal>
  <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon"/>
</template>

<script>
import CouponModal from '../components/CouponModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      isLoading: false,
      coupons: [],
      isNew: false,
      pagination: {},
      tempCoupon: {},
    };
  },
  components: {
    CouponModal,
    DelModal,
  },
  inject: ['emitter'],
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons/?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          console.log(res.data);
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
        }
      });
    },
    openModal(isNew, item) {
      this.isLoading = true;
      if (isNew) {
        this.tempCoupon = {};
      } else {
        this.tempCoupon = {
          ...item,
        };
      }
      this.isNew = isNew;
      const couponComponent = this.$refs.couponModal;
      this.isLoading = false;
      couponComponent.showModal();
    },
    updateCoupon(item) {
      this.isLoading = true;
      this.tempCoupon = item;
      // 新增
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      // eslint-disable-next-line prefer-const
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`;
        httpMethod = 'put';
      }
      const couponComponent = this.$refs.couponModal;
      this.$http[httpMethod](api, {
        data: this.tempCoupon,
      }).then((response) => {
        this.isLoading = false;
        console.log(response);
        couponComponent.hideModal();
        if (response.data.success) {
          this.getCoupons();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功',
          });
        } else {
          this.getCoupons();
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新失敗',
            content: response.data.message.join('、'),
          });
        }
      });
    },
    openDelCoupon(item) {
      this.isLoading = true;
      this.tempCoupon = { ...item };
      const delComponent = this.$refs.delModal;
      this.isLoading = false;
      delComponent.showModal();
    },
    delCoupon() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http.delete(url).then((response) => {
        this.isLoading = false;
        console.log(response.data);
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.getCoupons();
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
