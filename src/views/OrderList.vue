<template>
  先不用，因為沒有訂單資料
  <Loading :active="isLoading"></Loading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">購買時間</th>
        <th>Email</th>
        <th width="120">購買款項</th>
        <th width="120">應付金額</th>
        <th width="100">是否付款</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr
      v-for="item in orders"
      :key="item.id">
        <td>{{ $filters.date(item.create_at) }}</td>
        <td>{{ item.user.email }}</td>
        <td class="text-right">
          {{ item.products }}
        </td>
        <td class="text-right">
          {{ $filters.currency(item.total) }}
        </td>
        <td>
          <span class="text-success"
          v-if="item.is_paid === true">已付款</span>
          <span class="text-muted" v-else>未付款</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm">編輯</button>
            <button class="btn btn-outline-danger btn-sm">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      pagination: {},
      isLoading: false,
      ordersList: [],
    };
  },
  methods: {
    getOrder(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders/?page=${page}`;
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            console.log(res.data);
            this.orders = res.data.orders;
            this.pagination = res.data.pagination;
            console.log(this.orders, this.pagination);
          }
        });
    },
  },
  created() {
    this.getOrder();
  },
};
</script>
