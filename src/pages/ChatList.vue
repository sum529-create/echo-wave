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
        <li
          v-for="chat in chatRooms"
          @click="goToChat(chat.chatId)"
          :key="chat.id"
          class="chat-item"
        >
          <div class="chat-title-wrapper">
            <div class="chat-title-wrapper-left">
              <strong
                class="chat-title"
                :class="isNewChatRoom(chat.createdAt) && 'new-chat-title'"
                >{{ chat.title }}</strong
              >
              <!-- new-chat-title -->
              <span>{{
                chat.participants.length + "/" + chat.peopleLimit
              }}</span>
            </div>
            <div
              v-if="user.uid === chat.userId"
              class="chat-title-wrapper-right"
            >
              <button
                @click="deleteChatRoom(chat.userId, chat.chatId)"
                class="chat-delete-btn"
              >
                X
              </button>
            </div>
          </div>
          <div class="chat-message-wrapper">
            <span class="chat-last-message">{{
              chat.lastMessage ? chat.lastMessage : "채팅방을 개설하였습니다."
            }}</span>
            <div class="chat-message-time">
              {{ chat.lastMessage ? chat.lastMessageTimeStamp : "" }}
              {{ convertChatTime(chat.lastMessageTimeStamp) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <create-chat
      :isPopupVisible="isPopupVisible"
      @close="closePopup"
      @create="getChatRoomList"
    />
  </div>
</template>

<script>
import Profile from "../components/Profile.vue";
import CreateChat from "../components/CreateChat.vue";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
export default {
  name: "ChatList",
  components: { Profile, CreateChat },
  data() {
    return {
      isPopupVisible: false,
      chatRooms: [],
      user: {},
    };
  },
  computed: {},
  async mounted() {
    await this.getChatRoomList();
    this.user = auth.currentUser;
  },
  methods: {
    goToChat(chatId) {
      this.$router.push({ name: "Chat", params: { chatId } });
    },
    async getChatRoomList() {
      try {
        const chatQuery = query(
          collection(db, "chats"),
          orderBy("lastMessageTimeStamp", "desc"),
          limit(12)
        );
        const docSnap = await getDocs(chatQuery);
        this.chatRooms = docSnap.docs.map((doc) => ({
          id: doc.id, // 문서 ID 포함
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Failed to Fetching Chat Romm List", error);
      }
    },
    openPopup() {
      this.isPopupVisible = true;
    },
    closePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
    isTodayChatRoom(chatTime) {
      const dateParts = chatTime.split(". ", 3);
      const date = new Date(
        `${dateParts[0]} ${dateParts[1]} ${dateParts[2]}`
          .replace(/\./g, "-")
          .trim()
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간 부분 무시

      // 비교할 날짜의 시간 부분을 제거
      date.setHours(0, 0, 0, 0);

      // 두 날짜가 동일한지 비교
      return date.getTime() === today.getTime();
    },
    convertChatTime(chatTime) {
      const dateParts = chatTime.split(". ", 3);
      const timeMatch = chatTime.match(/(오전|오후) (\d{1,2}:\d{2})/);
      if (this.isTodayChatRoom(chatTime) && timeMatch) {
        return `${timeMatch[1]} ${timeMatch[2]}`;
      } else {
        return `${dateParts[1]}월 ${dateParts[2]}일`;
      }
    },
    isNewChatRoom(createdAt) {
      if (this.isTodayChatRoom(createdAt)) {
        const today = new Date();
        const todayHour = today.toLocaleString().split(" ")[4];
        const chatCreatedHour = createdAt.split(" ")[4];

        const [hours1, minutes1, seconds1] = todayHour.split(":").map(Number);
        const [hours2, minutes2, seconds2] = chatCreatedHour
          .split(":")
          .map(Number);
        const time1Date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours1,
          minutes1,
          seconds1
        );
        const time2Date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours2 + 4,
          minutes2,
          seconds2
        );
        // 4시간 기준 New
        // console.log(time1Date);
        // console.log(time2Date);
        if (time1Date < time2Date) {
          return true;
        } else {
          return false;
        }
      }
    },
    async deleteChatRoom(userId, chatId) {
      if (this.user?.uid !== userId) return;
      if (confirm("해당 채팅방을 삭제하시겠습니까?")) {
        try {
          await deleteDoc(doc(db, "chats", chatId));
          await this.getChatRoomList();
        } catch (error) {
          console.error("Failed to Delete Chat Room", error);
        }
      }
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
  cursor: pointer;
}

.chat-item:hover {
  background: #ebebeb;
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-item .chat-title-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.chat-item .chat-title-wrapper .chat-title-wrapper-right button {
  color: #333;
  padding: 0;
  line-height: 24px;
}

/* 채팅 제목 스타일링 */
.chat-item .chat-title-wrapper .chat-title-wrapper-left .chat-title {
  margin-right: 0.25rem;
  font-size: 1.2rem;
  color: #de1b60;
}

.chat-item
  .chat-title-wrapper
  .chat-title-wrapper-left
  .chat-title.new-chat-title::before {
  content: "NEW";
  background: linear-gradient(45deg, #ff6f61, #de1b60);
  color: #ffffff;
  font-weight: bold;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}

/* 마지막 메시지 스타일링 */
.chat-message-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.chat-message-wrapper .chat-last-message {
  font-size: 0.9rem;
  color: #555555;
  margin-top: 5px;
}

.chat-message-wrapper .chat-message-time {
  color: #999;
}

@media (max-width: 768px) {
  .chat-list-container {
    min-width: auto;
  }
}
</style>
