// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Auth from "../pages/Auth.vue";
import Chat from "../pages/Chat.vue";
import ChatList from "../pages/ChatList.vue";
import SignUp from "../pages/SignUp.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/login", component: Auth },
  { path: "/sign-up", component: SignUp },
  { path: "/list", component: ChatList, meta: { requiresAuth: true } },
  { path: "/chat", component: Chat, meta: { requiresAuth: true } },
  { path: "/", component: Auth }, // 기본 경로를 Auth 컴포넌트로 설정
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// 비동기 인증 상태 확인 함수
const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // 더 이상 리스닝하지 않도록 함
      resolve(user);
    });
  });
};

router.beforeEach(async (to, from, next) => {
  document.title = "Echo Wave | 파도처럼 전달되는 나의 메시지";

  // 인증이 필요한 경로 접근 시
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      const user = await checkAuthState();
      if (user) {
        next(); // 인증이 필요한 페이지로 접근
      } else {
        next("/login"); // 인증이 필요한 페이지에 비인증 상태로 접근 시 /login으로 리디렉션
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      next("/login"); // 오류 발생 시 /login으로 리디렉션
    }
  } else {
    // 기본 경로에 대해 리디렉션 처리
    if (to.path === "/") {
      try {
        const user = await checkAuthState();
        if (user) {
          next("/list"); // 로그인 상태일 때 /list로 리디렉션
        } else {
          next("/login"); // 로그인하지 않았을 때 /login으로 리디렉션
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        next("/login"); // 오류 발생 시 /login으로 리디렉션
      }
    } else {
      next(); // 인증이 필요 없는 페이지는 항상 이동
    }
  }
});

export default router;
