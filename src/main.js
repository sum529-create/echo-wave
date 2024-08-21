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

Vue.mixin(globalMixin);

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
