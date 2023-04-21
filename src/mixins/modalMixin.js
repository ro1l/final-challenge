import Modal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  // 加入mounted的生命週期，把實體內容回傳回來
  mounted() {
    // 調用這行之前需要先把bs的Modal的方法給載出來
    // 方法：在檔案總管的node_modules > bs > js>dist
    // 找到 model.js後import 進來
    this.modal = new Modal(this.$refs.modal);
  },
};
