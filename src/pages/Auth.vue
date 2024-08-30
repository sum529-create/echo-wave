<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Login</h1>
      <input
        v-model="email"
        @keyup.enter="login"
        type="email"
        placeholder="Email"
      />
      <input
        v-model="password"
        @keyup.enter="login"
        type="password"
        placeholder="Password"
      />
      <button @click="login" class="btn_coral mb10">Login</button>
      <button @click="moveToPage('/sign-up')" class="btn_pink mb10">
        Sign Up
      </button>
      <span @click="moveToPage('/pw-inquiry')" class="find-password">
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

<style scoped>
.find-password {
  font-size: 14px;
  color: #ff6f61;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
  transition: color 0.3s ease;
}
.find-password:hover {
  color: #af5959;
}
</style>
