<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Sign Up</h1>
      <div class="input-icon input-user">
        <input
          v-model="username"
          type="text"
          required
          maxlength="15"
          minlength="2"
          placeholder="이름/닉네임"
          name="username"
        />
      </div>
      <div class="input-icon input-email">
        <input
          v-model="email"
          type="email"
          required
          placeholder="이메일 주소"
          name="email"
        />
      </div>
      <div class="input-icon input-password">
        <input
          v-model="password"
          type="password"
          required
          placeholder="비밀번호"
          name="password"
        />
      </div>
      <span class="info-txt"
        >※ 비밀번호는 8자이상, 대소문자, 소문자, 숫자, 특수문자가
        포함되어야합니다.</span
      >
      <div class="input-icon input-birth">
        <input
          v-model="birth"
          @input="validateDate"
          type="number"
          required
          placeholder="생년월일 6자리 (ex. YYMMDD)"
          name="birth"
        />
      </div>
      <div class="gender-selector">
        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'male' }"
        >
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            v-model="selectedGender"
          />
          <span class="button-text">남성</span>
        </label>

        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'female' }"
        >
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            v-model="selectedGender"
          />
          <span class="button-text">여성</span>
        </label>

        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'other' }"
        >
          <input
            type="radio"
            id="other"
            name="gender"
            value="other"
            v-model="selectedGender"
          />
          <span class="button-text">미선택</span>
        </label>
      </div>
      <button @click="onSubmit()" class="btn_pink btn_sign_up">가입하기</button>
      <span class="info_txt">
        {{ this.errorMessage }}
      </span>
      <br />
      <span class="login_to">
        계정이 있다면
        <a href="/">&rarr; 로그인</a>
      </span>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "../assets/css/auth.css";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      birth: null,
      selectedGender: "",
      isLoading: false,
      errorMessage: "",
      isValidDate: true,
    };
  },
  methods: {
    validatePassword(password) {
      const minLength = 8; // 최소 길이
      const hasUpperCase = /[A-Z]/; // 대문자 확인
      const hasLowerCase = /[a-z]/; // 소문자 확인
      const hasDigit = /\d/; // 숫자 확인
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // 특수 문자 확인
      const forbiddenChars = /[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/; // 허용되지 않는 문자

      if (password.length < minLength) {
        return "비밀번호는 최소 " + minLength + "자 이상이어야 합니다.";
      }
      if (!hasUpperCase.test(password)) {
        return "비밀번호에는 대문자가 포함되어야 합니다.";
      }
      if (!hasLowerCase.test(password)) {
        return "비밀번호에는 소문자가 포함되어야 합니다.";
      }
      if (!hasDigit.test(password)) {
        return "비밀번호에는 숫자가 포함되어야 합니다.";
      }
      if (!hasSpecialChar.test(password)) {
        return "비밀번호에는 특수 문자가 포함되어야 합니다.";
      }
      if (forbiddenChars.test(password)) {
        return "비밀번호에는 허용되지 않는 문자가 포함되어 있습니다.";
      }
    },
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },
    validateDate() {
      const datePattern = /^\d{6}$/; // YYMMDD 형식의 정규 표현식
      const isMatch = datePattern.test(this.birth);

      if (isMatch) {
        // 추가적으로 날짜 유효성 검사를 진행할 수 있습니다.
        const year = parseInt(this.birth.slice(0, 2), 10);
        const month = parseInt(this.birth.slice(2, 4), 10);
        const day = parseInt(this.birth.slice(4, 6), 10);

        // YYMMDD 형식의 년도를 4자리로 변환 (1900년대 또는 2000년대)
        const fullYear =
          year >= 0 && year <= 99
            ? year >= 50
              ? 1900 + year
              : 2000 + year
            : year;

        // 날짜 객체 생성하여 유효성 검사
        const date = new Date(fullYear, month - 1, day);

        // 날짜 객체가 입력값과 일치하는지 확인
        this.isValidDate =
          date.getFullYear() === fullYear &&
          date.getMonth() === month - 1 &&
          date.getDate() === day;
      } else {
        this.isValidDate = false;
      }
    },
    async onSubmit() {
      if (this.isLoading) return;
      if (!this.username) {
        alert("이름/닉네임을 입력해주세요.");
        return;
      }
      if (!this.email) {
        alert("이메일을 입력해주세요.");
        return;
      } else {
        if (!this.isValidEmail(this.email)) {
          alert("유효한 이메일 형식이 아닙니다. 다시 확인해주세요");
          this.email = "";
          return;
        }
      }
      if (!this.password) {
        alert("패스워드를 입력해주세요.");
        return;
      } else {
        const pwd_info = this.validatePassword(this.password);
        if (pwd_info) {
          alert(pwd_info);
          return;
        }
      }
      if (!this.birth) {
        alert("생일을 입력해주세요.");
        return;
      }
      if (!this.isValidDate) {
        alert("유효하지 않은 생일형식입니다.\n다시 입력해주세요 (ex. 990101)");
        this.birth = "";
        return;
      }
      if (!this.selectedGender) {
        alert("성별을 선택해주세요.");
        return;
      }

      try {
        this.isLoading = true;
        const credentials = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = credentials.user;
        await updateProfile(user, {
          displayName: this.username,
        });
        await setDoc(doc(collection(db, "users"), user.uid), {
          userId: user.uid,
          username: user.displayName || "손님",
          birth: this.birth,
          gender: this.selectedGender,
        });
        window.location.href = "/";
        this.isLoading = false;
      } catch (error) {
        console.error("Error during signup:", error);
        if (error) {
          switch (error.code) {
            case "auth/email-already-in-use":
              this.errorMessage =
                "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.";
              break;
            case "auth/invalid-email":
              this.errorMessage =
                "유효하지 않은 이메일 주소입니다. 올바른 이메일 주소를 입력해주세요.";
              break;
            case "auth/operation-not-allowed":
              this.errorMessage =
                "이메일/비밀번호 계정이 활성화되지 않았습니다. 지원팀에 문의해주세요.";
              break;
            case "auth/weak-password":
              this.errorMessage =
                "비밀번호가 너무 약합니다. 더 강력한 비밀번호를 입력해주세요.";
              break;
            default:
              this.errorMessage =
                "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.";
          }
        }
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
input {
  border: none;
  border-left: 1px solid #eee;
  margin-bottom: 0;
  outline: none;
}
.input-wrapper {
  position: relative;
}

.input-icon {
  padding-left: 40px;
  position: relative;
  border: 1px solid #eee;
  margin-bottom: 1rem;
  transition: border-color 0.3s;
}

.input-icon::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  filter: invert(30%) sepia(75%) saturate(7492%) hue-rotate(329deg)
    brightness(90%) contrast(92%);
}

.input-icon:focus-within {
  border-color: #ff6f61; /* 포커스 시 테두리 색상 */
}

.input-user::before {
  background-image: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLXNsb3Q9Imljb24iIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGFyaWEtaGlkZGVuPSJ0cnVlIj4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS43NSA2YTMuNzUgMy43NSAwIDEgMS03LjUgMCAzLjc1IDMuNzUgMCAwIDEgNy41IDBaTTQuNTAxIDIwLjExOGE3LjUgNy41IDAgMCAxIDE0Ljk5OCAwQTE3LjkzMyAxNy45MzMgMCAwIDEgMTIgMjEuNzVjLTIuNjc2IDAtNS4yMTYtLjU4NC03LjQ5OS0xLjYzMloiPjwvcGF0aD4KPC9zdmc+Cg==");
}

.input-email::before {
  background-image: url("data:image/svg+xml;base64, PHN2ZyBkYXRhLXNsb3Q9Imljb24iIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGFyaWEtaGlkZGVuPSJ0cnVlIj4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMS43NSA2Ljc1djEwLjVhMi4yNSAyLjI1IDAgMCAxLTIuMjUgMi4yNWgtMTVhMi4yNSAyLjI1IDAgMCAxLTIuMjUtMi4yNVY2Ljc1bTE5LjUgMEEyLjI1IDIuMjUgMCAwIDAgMTkuNSA0LjVoLTE1YTIuMjUgMi4yNSAwIDAgMC0yLjI1IDIuMjVtMTkuNSAwdi4yNDNhMi4yNSAyLjI1IDAgMCAxLTEuMDcgMS45MTZsLTcuNSA0LjYxNWEyLjI1IDIuMjUgMCAwIDEtMi4zNiAwTDMuMzIgOC45MWEyLjI1IDIuMjUgMCAwIDEtMS4wNy0xLjkxNlY2Ljc1Ij48L3BhdGg+Cjwvc3ZnPg==");
}

.input-password::before {
  background-image: url("../assets/img/Lock.svg");
}

.input-birth::before {
  background-image: url("../assets/img/Cake.svg");
}

.gender-selector {
  display: flex;
  gap: 10px;
}

.gender-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 40px;
  border: 2px solid #ff6f61;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #ff6f61;
  position: relative;
  transition: background-color 0.3s, color 0.3s;
}

.gender-button:hover {
  background-color: #ff6f61;
  color: #fff;
}

.gender-button.selected {
  background-color: #ff6f61;
  color: #fff;
}

.gender-button input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.gender-button .button-text {
  z-index: 1;
}

.btn_sign_up {
  margin: 1rem 0;
}

.login_to a {
  color: #ff6f61;
  font-weight: 600;
  margin-left: 0.5rem;
}
.login_to a:hover {
  color: #f94f40;
}
</style>
