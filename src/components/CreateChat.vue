<template>
  <div>
    <div v-if="isPopupVisible" @click="closePopup" class="popup-overlay">
      <div class="popup-content" @click.stop>
        <h2 class="popup-title">새로운 채팅방 생성하기</h2>
        <p class="popup-description">
          새로운 채팅방 개설에 앞서 세부내용을 입력해주세요.
        </p>

        <!-- 채팅방 제목 입력 -->
        <input
          type="text"
          v-model="title"
          placeholder="채팅방 제목(최대 25자)"
          class="popup-input"
          maxlength="25"
        />

        <!-- 선택) 나이제한 입력 -->
        <!-- <input
          type="number"
          v-model="ageLimit"
          placeholder="나이제한 (선택)"
          class="popup-input"
        /> -->

        <!-- 인원제한 선택 -->
        <select v-model="peopleLimit" class="popup-input">
          <option :value="0">인원을 설정하세요(최대: 4명)</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select>

        <!-- 버튼들 -->
        <div class="popup-buttons">
          <button @click="closePopup" class="close-popup-button">Cancel</button>
          <button @click="createChatRoom" class="create-popup-button">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "CreateChat",
  props: {
    isPopupVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      title: "",
      ageLimit: "",
      peopleLimit: 0,
    };
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    async createChatRoom() {
      const user = auth.currentUser;
      const chatId = uuidv4();
      if (!this.title) {
        alert("생성하실 채팅방 제목을 입력해주세요.");
        return;
      }
      if (this.title.length > 25) {
        alert("채팅방 제목은 최대 25자이내로 입력해주세요.");
        return;
      }
      if (!this.peopleLimit) {
        alert("채팅 가능 인원을 설정해주세요");
        return;
      }
      try {
        await setDoc(doc(collection(db, "chats"), chatId), {
          chatId: chatId,
          userId: user.uid,
          title: this.title,
          createdAt: new Date().toLocaleString(),
          lastMessage: "",
          lastMessageTimeStamp: new Date().toLocaleString(),
          participants: [user.uid],
          messages: [],
          peopleLimit: this.peopleLimit,
          // ageLimit: this.ageLimit,
        });
        this.$emit("create");
        this.closePopup();
      } catch (error) {
        console.error("Failed to Create Chat Room", error);
      }
    },
  },
};
</script>

<style scoped>
/* 팝업 오버레이 스타일링 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 팝업 컨텐츠 스타일링 */
.popup-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
}

/* 팝업 제목 스타일 */
.popup-title {
  font-size: 1.8rem;
  color: #de1b60;
  margin-bottom: 10px;
}

/* 팝업 설명 텍스트 */
.popup-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

/* 입력 필드 스타일 */
.popup-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #999;
}

/* 버튼 스타일링 */
.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.close-popup-button,
.create-popup-button {
  background-color: #de1b60;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 48%;
}

.close-popup-button:hover {
  background-color: #c53364;
}

.create-popup-button {
  background-color: #4caf50;
}

.create-popup-button:hover {
  background-color: #45a049;
}
</style>
