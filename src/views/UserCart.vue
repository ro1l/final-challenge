<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-7">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td style="width: 200px">
                <div style="height: 100px; background-size: cover; background-position: center"
                  :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
              </td>
              <td><p class="text-dark">{{ item.title }}</p></td>
              <td>
                <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn
                  btn-outline-secondary" @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <button type="button" class="btn btn-outline-danger"
                  @click="addCart(item.id)"
                  :disabled="this.status.loadingItem === item.id">
                    <div class="spinner-grow spinner-grow-sm text-danger" role="status"
                    v-if="this.status.loadingItem === item.id">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 購物車列表 -->
      <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="cart.carts">
                <tr
                v-for="item in cart.carts" :key="item.id">
                  <td>
                    <button type="button" class="btn btn-outline-danger btn-sm"
                    :disabled="status.loadingItem === item.id"
                    @click="removeCartItem(item.id)">
                      <i class="bi bi-x"></i>
                    </button>
                  </td>
                  <td>
                    {{ item.product.title }}
                    <div class="text-success"
                    v-if="item.coupon">
                      已套用優惠券
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input type="number" class="form-control"
                      min="1"
                      @change="updateCart(item)"
                      :disabled="item.id === status.loadingItem"
                      v-model.number="item.qty">
                      <div class="input-group-text">/ {{ item.product.unit }}</div>
                    </div>
                  </td>
                  <td class="text-end">
                    <small class="text-success"
                    v-if="cart.final_total !== cart.total">折扣價：</small>
                    {{ $filters.currency(item.final_total) }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3" class="text-end">總計</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success">折扣價</td>
              <td class="text-end text-success">{{ $filters.currency(cart.final_total )}}</td>
            </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼"
            v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button"
              @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 建立訂單 -->
    <div class="my-5 row justify-content-center">
      <Form class="col-md-6" v-slot="{ errors }"
      @submit="createOrder">

        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <Field class="form-control" id="email" name="email" type="email" placeholder="請輸入電子郵件"
          rules="email|required"
          :class="{ 'is-invalid': errors['email'],
          'is-valid': !errors['email'] && form.user.email }"
          v-model="form.user.email"></Field>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label class="form-label" for="name">收件人姓名</label>
          <Field class="form-control" id="name" name="姓名" type="name" placeholder="請輸入收件人姓名"
          rules="required"
          :class="{ 'is-invalid': errors['姓名'],
          'is-valid': !errors['姓名'] && form.user.name }"
          v-model="form.user.name"></Field>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label class="form-label" for="tel">收件人電話</label>
          <Field class="form-control" id="tel" name="電話" type="tel" placeholder="請輸入收件人電話"
          :rules="isPhone"
          :class="{ 'is-invalid': errors['電話'],
          'is-valid': !errors['電話'] && form.user.tel }"
          v-model="form.user.tel"></Field>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label class="form-label" for="address">收件人地址</label>
          <Field class="form-control" id="address" name="地址" type="address" placeholder="請輸入收件人地址"
          :rules="isAddress"
          :class="{ 'is-invalid': errors['地址'],
          'is-valid': !errors['地址'] && form.user.address }"
          v-model="form.user.address"></Field>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea name="" id="message" cols="30" rows="10" class="form-control"></textarea>
        </div>

        <div class="text-end">
          <button class="btn btn-danger">送出訂單</button>
        </div>

      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: '', // 對應品項 id
      },
      cart: {},
      coupon_code: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      orderId: '',
    };
  },
  methods: {
    getProducts() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(url).then((response) => {
        this.products = response.data.products;
        console.log('products:', response);
        this.isLoading = false;
      });
    },
    getProduct(id) {
      this.$router.push(`/user/product/${id}`);
    },
    addCart(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty: 1,
      };
      this.$http.post(url, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
        this.getCart();
      });
    },
    getCart() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      this.$http.get(url).then((response) => {
        console.log(response);
        this.status.loadingItem = '';
        this.cart = response.data.data;
        this.isLoading = false;
      });
    },
    updateCart(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      this.isLoading = true;
      this.status.loadingItem = item.id;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.$http.put(url, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
        this.getCart();
      });
    },
    removeCartItem(id) {
      this.status.loadingItem = id;
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.isLoading = true;
      this.$http.delete(url)
        .then((response) => {
          this.$httpMessageState(response, '移除購物車品項');
          this.status.loadingItem = '';
          this.getCart();
          this.isLoading = false;
        });
    },
    addCouponCode() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.$http.post(url, { data: coupon })
        .then((res) => {
          console.log('優惠碼', res);
          this.getCart();
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },
    isAddress(value) {
      const addressRegex = /(?:(?<city>[^市縣]+[市縣])(?<district>[^市區鄉鎮鄉鎮市區]+[市區鄉鎮鄉鎮市區])?(?<neighborhood>[^村里]+[村里])?(?<lin>[0-9]+[鄰])?(?<street>[^路段]+[路段])?(?<section>[^段]*段)?(?<alley>[0-9]+巷)?(?<lane>[0-9]+弄)?(?<number>[0-9]+號)?(?:-(?<number2>[0-9]+號))?(?<floor>[0-9]+樓)?(?<other>.+)?)/;
      return addressRegex.test(value) ? true : '需要正確的地址';
    },
    createOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      const order = this.form;
      this.$http.post(url, { data: order })
        .then((res) => {
          console.log('建立表單', res);
          if (res.data.success) {
            this.$router.push(`/user/checkout/${res.data.orderId}`);
          }
        });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
