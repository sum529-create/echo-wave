import { createRouter, createWebHistory } from "vue-router";
import Auth from "../components/Auth.vue";
import Chat from "../components/Chat.vue";

const routes = [
  { path: "/", component: Auth },
  { path: "/chat", component: Chat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  document.title = 'Echo Wave | 파도처럼 전달되는 나의 메시지';
  next();
});

export default router;
