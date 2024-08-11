import { createRouter, createWebHistory } from "vue-router";
import Auth from "../pages/Auth.vue";
import Chat from "../pages/Chat.vue";
import ChatList from "../pages/ChatList.vue";
import SignUp from "../pages/SignUp.vue";

const routes = [
  { path: "/", component: Auth },
  { path: "/sign-up", component: SignUp },
  { path: "/list", component: ChatList },
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
