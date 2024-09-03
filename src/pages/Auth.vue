<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>로그인</h1>
      <input
        v-model="email"
        @keyup.enter="login"
        type="email"
        placeholder="이메일"
      />
      <input
        v-model="password"
        @keyup.enter="login"
        type="password"
        placeholder="비밀번호"
      />
      <button @click="login" class="btn_coral mb10">로그인</button>
      <button @click="moveToPage('/sign-up')" class="btn_pink mb10">
        회원가입
      </button>
      <span @click="moveToPage('/pw-inquiry')" class="sub-info-text">
        비밀번호 찾기
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../assets/css/auth.css";

export default {
  name: "Auth",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (!this.email) {
        alert("이메일을 입력해주세요.");
        return;
      }
      if (!this.password) {
        alert("패스워드를 입력해주세요.");
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.moveToPage("/list");
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>
