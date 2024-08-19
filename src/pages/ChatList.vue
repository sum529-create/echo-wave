<template>
  <div class="container">
    <Profile />
    <div class="chat-list-container">
      <div class="chat-list-header">
        <h2 class="chat-list-title">Chat Rooms</h2>
        <button @click="openPopup" class="create-chat-button">
          + Create New Chat
        </button>
      </div>
      <ul class="chat-list">
        <li v-for="chat in chatRooms" :key="chat.id" class="chat-item">
          <strong class="chat-title">{{ chat.title }}</strong>
          <span class="chat-last-message">{{ chat.lastMessage }}</span>
        </li>
      </ul>
    </div>
    <create-chat :isPopupVisible="isPopupVisible" @close="closePopup" />
  </div>
</template>

<script>
import Profile from "../components/Profile.vue";
import CreateChat from "../components/CreateChat.vue";
export default {
  name: "ChatList",
  components: { Profile, CreateChat },
  data() {
    return {
      isPopupVisible: false,
      chatRooms: [
        { id: 1, title: "General", lastMessage: "Hello everyone!" },
        {
          id: 2,
          title: "Project X",
          lastMessage: "Let's discuss the details.",
        },
        { id: 3, title: "Social", lastMessage: "What's the plan for tonight?" },
      ],
    };
  },
  methods: {
    openPopup() {
      this.isPopupVisible = true;
    },
    closePopup() {
      console.log("??!!");
      this.isPopupVisible = !this.isPopupVisible;
    },
  },
};
</script>

<style scoped>
/* 컨테이너 스타일링 */
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-auto-flow: column;
  gap: 20px;
  margin: 20px auto;
  max-width: 1280px;
  padding: 0 2rem;
}
.chat-list-container {
  grid-column: 2 / span 2;
  width: 100%;
  min-width: 500px;
  max-width: 700px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
}

/* 헤더 스타일링 */
.chat-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chat-list-title {
  font-size: 1.5rem;
  color: #de1b60;
}

/* 버튼 스타일링 */
.create-chat-button {
  background-color: #ff6f61;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.create-chat-button:hover {
  background-color: #e05b50;
}

/* 채팅 리스트 스타일링 */
.chat-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.chat-item:last-child {
  border-bottom: none;
}

/* 채팅 제목 스타일링 */
.chat-title {
  font-size: 1.2rem;
  color: #de1b60;
}

/* 마지막 메시지 스타일링 */
.chat-last-message {
  font-size: 0.9rem;
  color: #555555;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .chat-list-container {
    min-width: auto;
  }
}
</style>
