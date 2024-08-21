<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="profile-pics">
          <img
            v-for="(data, i) in chatInfo.participants"
            :key="i"
            :src="data.photoUrl ? data.photoUrl : '/logo.png'"
            :alt="`Profile ${i + 1}`"
            class="profile-pic"
            :style="{
              zIndex: chatInfo.participants.length - i,
              left: `${i * 15}px`,
              top: `${Math.floor(i / 2) * 15}px`,
            }"
          />
        </div>
        <div class="chat-info">
          <h1>{{ chatInfo.title }}</h1>
          <span>{{
            (chatInfo.participants && chatInfo.participants.length) +
            "/" +
            chatInfo.peopleLimit
          }}</span>
        </div>
      </div>
      <div @click="exitChatRoom" class="chat-header-right">
        <svg
          data-slot="icon"
          fill="none"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          ></path>
        </svg>
      </div>
    </div>
    <div class="messages-container">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="user.uid === message.userId && 'message-color'"
      >
        <div class="messages-container-left">
          <strong class="message-user">{{ message.userName }}: </strong>
          <span>{{ message.text }}</span>
        </div>
        <span class="message-time">{{ message.createdAt }}</span>
      </div>
    </div>
    <div class="message-input-container">
      <input
        v-model="newMessage"
        placeholder="채팅을 입력해보세요."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export default {
  name: "Chat",
  data() {
    return {
      newMessage: "",
      messages: [],
      chatId: null,
      user: {},
      chatInfo: {},
    };
  },
  created() {
    this.chatId = this.$route.params.chatId;
    this.user = auth.currentUser;
  },
  methods: {
    async fetchChatInfo() {
      if (!this.user?.uid || !this.chatId) return;
      try {
        const chatDocRef = doc(db, "chats", this.chatId);
        const docSnap = await getDoc(chatDocRef);
        if (docSnap.exists());
        this.chatInfo = docSnap.data();
      } catch (error) {
        console.error("Failed to Fetch ChatRomm Info");
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() === "") return;
      const chatDocRef = doc(db, "chats", this.chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          text: this.newMessage,
          user: auth.currentUser.email,
          userName: this.user.displayName,
          userId: this.user.uid,
          createdAt: new Date().toLocaleString(),
        }),
        lastMessage: this.newMessage,
        lastMessageTimeStamp: new Date().toLocaleString(),
      });

      this.newMessage = "";
    },
    exitChatRoom() {
      window.location.href = "/list";
    },
  },
  async mounted() {
    await this.fetchChatInfo();
    const chatDocRef = doc(db, "chats", this.chatId);
    this.unsub = onSnapshot(chatDocRef, (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        this.messages = chatData.messages || []; // 메시지 배열을 가져옴
      }
    });
  },
  beforeDestroy() {
    if (this.unsub) {
      this.unsub(); // onSnapshot 리스너를 정리
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  max-width: 500px;
  width: 100%;
  flex-direction: column;
  height: 100%;
  position: relative;
  background-color: #f4f4f4;
  padding: 20px;
}

.chat-header {
  background-color: #ff6f61; /* 메인 색상 적용 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
}

.chat-header .chat-header-left {
  display: flex;
  gap: 10px;
}

.profile-pics {
  display: flex;
  position: relative;
  width: 50px; /* 전체 프로필 이미지 영역의 넓이 */
  height: 50px; /* 전체 프로필 이미지 영역의 높이 */
}

.profile-pic {
  width: 30px; /* 각 이미지의 크기 */
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  background-color: #f0f0f0; /* 배경색, 이미지를 설정하지 않을 경우 표시 */
  object-fit: cover;
}

.profile-pic:nth-child(1) {
  z-index: 4;
  left: 0;
  top: 0;
}

.profile-pic:nth-child(2) {
  z-index: 3;
  left: 15px; /* 겹치는 부분을 설정 */
  top: 0;
}

.profile-pic:nth-child(3) {
  z-index: 2;
  left: 0;
  top: 15px;
}

.profile-pic:nth-child(4) {
  z-index: 1;
  left: 15px;
  top: 15px;
}

.chat-info {
  text-align: left;
  line-height: 25px;
}

.chat-info h1 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.chat-info span {
  font-size: 14px;
  color: #888;
}

.chat-header .chat-header-right {
  width: 25px;
  color: white;
  box-sizing: border-box;
  cursor: pointer;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.messages-container .message-time {
  color: #999;
  font-size: 12px;
}

.message {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #ddd;
  position: relative;
}

.message.message-color {
  background-color: #ffcccc;
}

.message-user {
  color: #de1b60; /* 강조 색상 적용 */
}

.message-input-container {
  display: grid;
  grid-template-columns: 5fr 1fr;
  gap: 10px;
  margin: 10px 0;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus {
  border-color: #de1b60; /* 포커스 시 강조 색상 적용 */
  outline: none;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #de1b60; /* 강조 색상 적용 */
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c41857; /* 호버 시 색상 변경 */
}
</style>
