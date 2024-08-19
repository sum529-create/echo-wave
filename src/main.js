import Vue from "vue";
import App from "./App.vue";
import router from "./router";

const globalMixin = {
  methods: {
    moveToPage(r) {
      this.$router.push({ path: r });
    },
  },
};

new Vue({
  render: (h) => h(App),
  router,
  mixins: [globalMixin],
}).$mount("#app");
