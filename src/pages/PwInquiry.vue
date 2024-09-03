<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>비밀번호 찾기</h1>
      <input
        v-model="email"
        @keyup.enter="handleResetPassword"
        @change="initError"
        type="email"
        placeholder="가입하신 이메일"
      />
      <div v-if="error" class="alert">
        <span class="icon">⚠️</span>
        {{ error }}
      </div>
      <button @click="handleResetPassword" class="btn_coral mt10">확인</button>
      <span @click="moveToPage('/login')" class="sub-info-text">
        로그인 페이지로
      </span>
    </div>
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default {
  name: "PwInquiry",
  data() {
    return {
      email: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    initError() {
      if (this.email === "") {
        this.error = "";
        return;
      }
    },
    async handleResetPassword() {
      if (!this.email) {
        alert("가입하신 이메일을 입력해주세요.");
        return;
      }
      try {
        this.isLoading = true;
        await sendPasswordResetEmail(auth, this.email);
        alert(
          "비밀번호 관련정보를 입력하신 이메일로 전달하였습니다.\n메일을 확인해주세요."
        );
        this.moveToPage("/login");
      } catch (error) {
        let errorMessage = "";
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/email-already-in-use":
              errorMessage =
                "이미 사용 중인 이메일입니다.\n다른 이메일을 사용해주세요.";
              break;
            case "auth/invalid-email":
              errorMessage =
                "유효하지 않은 이메일 주소입니다.\n올바른 이메일 주소를 입력해주세요.";
              break;
            case "auth/operation-not-allowed":
              errorMessage =
                "이메일/비밀번호 계정이 활성화되지\n않았습니다. 지원팀에 문의해주세요.";
              break;
            default:
              errorMessage =
                "알 수 없는 오류가 발생했습니다.\n나중에 다시 시도해주세요.";
          }
        }

        this.error = errorMessage;
        console.error("Failed to reset password", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
/* 경고 문구 컨테이너 */
.alert {
  padding: 15px;
  background-color: #f8d7da; /* 연한 빨간색 배경 */
  color: #721c24; /* 어두운 빨간색 텍스트 */
  border: 1px solid #f5c6cb; /* 연한 빨간색 테두리 */
  border-radius: 4px; /* 둥근 모서리 */
  font-family: Arial, sans-serif; /* 기본 글꼴 */
  font-size: 16px;
  margin: 10px 0;
  word-break: keep-all;
}

/* 경고 아이콘 (선택 사항) */
.alert .icon {
  font-weight: bold;
  margin-right: 10px;
}
</style>
