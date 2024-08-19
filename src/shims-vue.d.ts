// shims-vue.d.ts
import Vue from "vue";
import { Router } from "vue-router";

// Vue 인스턴스의 타입을 확장하여 $router 속성 추가
declare module "vue/types/vue" {
  interface Vue {
    $router: Router;
  }
}

// Vue 컴포넌트에 대한 타입 선언
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
