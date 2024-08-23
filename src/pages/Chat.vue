<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="chat-header-left">
        <div @click="moveToPage('/list')" class="chat-return"></div>
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
      <div @click="exitChatRoom" class="chat-header-right icon-exit"></div>
    </div>
    <div class="messages-container">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="user.uid === message.userId && 'message-color'"
      >
        <div class="messages-container-left">
          <strong class="message-user"
            >{{ message.isAnnouncement ? "❤️ " : message.userName + ": " }}
          </strong>
          <span :class="{ 'message-notice': message.isAnnouncement }">{{
            message.text
          }}</span>
        </div>
        <span class="message-time">{{
          message.isAnnouncement ? "" : message.createdAt
        }}</span>
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
    async exitChatRoom() {
      if (confirm("채팅방을 나가시겠습니까?")) {
        this.moveToPage("/list");
        try {
        } catch (error) {
          console.error("Failed To Exit ChatRoom", error);
        }
      }
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
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chat-header {
  background-color: #ff6f61; /* 메인 색상 적용 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}

.chat-header .chat-header-left {
  display: flex;
  gap: 10px;
}

.chat-header .chat-header-left .chat-return::before {
  content: "";
  display: inline-block;
  width: 25px;
  height: 25px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLXNsb3Q9Imljb24iIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGFyaWEtbGFiZWw9InRydWUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDE5LjUgOC4yNSAxMkwxNS43NSA0LjV6Ii8+Cjwvc3ZnPg==");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: invert(100%) sepia(36%) saturate(3%) hue-rotate(261deg)
    brightness(105%) contrast(100%);
  transform: translateY(-50%);
  position: relative;
  top: 50%;
  cursor: pointer;
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
  color: #333;
}

.chat-header .chat-header-right {
  width: 25px;
  color: white;
  box-sizing: border-box;
}
.chat-header .chat-header-right.icon-exit::before {
  content: "";
  display: inline-block;
  width: 25px;
  height: 25px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLXNsb3Q9Imljb24iIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWhpZGRlbj0idHJ1ZSI+CiAgPHBhdGgKICAgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICBkPSJNOC4yNSA5VjUuMjVBMi4yNSAyLjI1IDAgMCAxIDEwLjUgM2g2YTIuMjUgMi4yNSAwIDAgMSAyLjI1IDIuMjV2MTMuNWEyLjI1IDIuMjUgMCAwIDEtMi4yNSAyLjI1aC02YTIuMjUgMi4yNSAwIDAgMS0yLjI1LTIuMjVWMTVtLTMgMC0zLTMKbTAgMCAzLTMKbS0zIDNIMTUiCiAgLz48L3N2Zz4=");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: invert(100%) sepia(36%) saturate(3%) hue-rotate(261deg)
    brightness(105%) contrast(100%);
  cursor: pointer;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: white;
  border-radius: 0 0 8px 8px;
  border: 1px solid #ddd;
}

.messages-container .message-notice {
  font-weight: 700;
  color: #c0392b;
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
