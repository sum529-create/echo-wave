import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Router } from 'vue-router';

// Vue 인스턴스에 타입을 추가
interface ComponentCustomProperties {
    $router: Router;
}

const globalMixin = {
  methods: {
    moveToPage(this: ComponentCustomProperties,r: string) {
      this.$router.push({ path: r });
    }
  }
};

const app = createApp(App);
app.mixin(globalMixin);
app.use(router).mount('#app');
