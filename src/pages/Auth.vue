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
      <button @click="moveToPage('/sign-up')" class="btn_pink">Sign Up</button>
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
        window.location.href = "/list";
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>
