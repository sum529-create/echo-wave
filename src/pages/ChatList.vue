<template>
  <div class="container">
    <Profile />
    <div class="chat-list-container">
      <div class="chat-list-header">
        <h2 class="chat-list-title">Chat Rooms</h2>
        <div class="chat-total-counts">
          <svg
            data-slot="icon"
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            ></path>
          </svg>
          <span class="chat-counts">
            {{ getChatTotalUnreadMessages }}
          </span>
        </div>
      </div>
      <ul class="chat-list">
        <li v-for="chat in chatRooms" :key="chat.id" class="chat-item">
          <div class="chat-img-wrapper">
            <img
              v-for="(data, i) in chat.participants"
              :key="i"
              :src="data.photoUrl ? data.photoUrl : '/logo.png'"
              :alt="`Profile ${i + 1}`"
              class="profile-pic"
            />
            <!-- :style="{
                zIndex: chat.participants.length - i,
                left: `${i * 15}px`,
                top: `${Math.floor(i / 2) * 15}px`,
              }" -->
          </div>
          <div class="chat-text-wrapper">
            <div class="chat-title-wrapper">
              <div @click="goToChat(chat)" class="chat-title-wrapper-left">
                <strong
                  class="chat-title"
                  :class="{
                    'new-chat-title': isNewChatRoom(chat.createdAt),
                    'chat-participating': isParticipantingChat(
                      chat.participants
                    ),
                  }"
                  >{{ chat.title }}</strong
                >
                <span class="chat-limit-people">{{
                  chat.participants.length +
                  "/" +
                  chat.peopleLimit +
                  (isParticipantingChat(chat.participants) ? " (참여중)" : "")
                }}</span>
              </div>
              <div class="chat-title-wrapper-right">
                <span
                  v-if="unreadCounts[chat.chatId] !== 0"
                  class="chat-counts"
                >
                  {{ unreadCounts[chat.chatId] }}
                </span>
                <button
                  v-if="user.uid === chat.userId"
                  @click="deleteChatRoom(chat.userId, chat.chatId)"
                  :class="{
                    'chat-delete-btn': true,
                    'chat-delete-btn-position': unreadCounts[chat.chatId] !== 0,
                  }"
                >
                  X
                </button>
              </div>
            </div>
            <div class="chat-message-wrapper">
              <span class="chat-last-message">{{ chat.lastMessage }}</span>
              <div class="chat-message-time">
                {{ convertChatTime(chat.lastMessageTimeStamp) }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <button @click="openPopup" class="create-chat-button">
        + Create New Chat
      </button>
    </div>
    <create-chat
      v-if="isPopupVisible"
      :isPopupVisible="isPopupVisible"
      @close="closePopup"
      @create="getChatRoomList"
    />
    <button id="scrollToTopBtn" class="fixedBtn" @click="scrollToTop">
      <svg
        data-slot="icon"
        fill="none"
        stroke-width="1.5"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
        ></path>
      </svg>
    </button>
    <button
      id="scrollAddChatBtn"
      class="fixedBtn create-chat-button-mo"
      @click="openPopup"
    >
      <svg
        data-slot="icon"
        fill="none"
        stroke-width="1.5"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script>
import Profile from "../components/Profile.vue";
import CreateChat from "../components/CreateChat.vue";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  onSnapshot,
  where,
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
      unsubscribe: null,
      unSub: null,
      unreadCounts: {},
    };
  },
  computed: {
    getChatTotalUnreadMessages() {
      return Object.values(this.unreadCounts).reduce(
        (total, count) => total + count,
        0
      );
    },
  },
  async mounted() {
    await this.getChatRoomList();
    this.user = auth.currentUser;
    window.addEventListener("scroll", this.toggleScrollButton);
  },
  watch: {
    chatRooms(newVal) {
      if (newVal.length > 0) {
        newVal.forEach((chat) => {
          this.getForUnreadMessages(chat.chatId, this.user.uid, (count) => {
            this.$set(this.unreadCounts, chat.chatId, count);
          });
        });
      }
    },
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe(); // 리스너 정리
      this.unsubscribe = null; // 리스너 함수 초기화
    }
    if (this.unSub) {
      this.unSub();
      this.unSub = null;
    }
    window.removeEventListener("scroll", this.toggleScrollButton);
  },
  methods: {
    async goToChat(chatInfo) {
      if (chatInfo) {
        const isParticipant = chatInfo.participants.find(
          (participant) => participant.uid === this.user.uid
        );
        const chatId = chatInfo.chatId;
        if (!isParticipant && chatInfo.createdUserId !== this.user.uid) {
          if (chatInfo.participants.length === chatInfo.peopleLimit) {
            alert("채팅가능 인원이 초과하였습니다.");
            return;
          }
          if (confirm("해당 채팅룸에 입장하시겠습니까?")) {
            const chatDocRef = doc(db, "chats", chatId);

            const existingIndexes = chatInfo.participants
              .map((msg) => msg.idx)
              .filter((idx) => idx !== undefined && idx !== null);

            // 0부터 시작해서 빈 인덱스를 찾음
            let newIdx = 1;
            while (existingIndexes.includes(newIdx) && newIdx <= 4) {
              newIdx++;
            }

            await updateDoc(chatDocRef, {
              participants: arrayUnion({
                uid: this.user.uid,
                photoUrl: this.user.photoURL,
                idx: newIdx,
              }),
              messages: arrayUnion({
                text: "[🙋‍♀️ " + this.user.displayName + "님이 입장하셨습니다.]",
                user: this.user.email,
                userName: this.user.displayName,
                userId: this.user.uid,
                createdAt: new Date().toLocaleString(),
                isAnnouncement: true,
              }),
              lastMessage:
                "[🙋‍♀️ " + this.user.displayName + "님이 입장하셨습니다.]",
              lastMessageTimeStamp: new Date().toLocaleString(),
            });
          } else {
            return;
          }
        }
        this.$router.push({ name: "Chat", params: { chatId } });
      }
    },
    async getChatRoomList(chatId) {
      try {
        const chatQuery = query(
          collection(db, "chats"),
          orderBy("lastMessageTimeStamp", "desc"),
          limit(12)
        );
        this.unsubscribe = onSnapshot(
          chatQuery,
          (snapshot) => {
            // 문서 데이터를 배열로 변환
            this.chatRooms = snapshot.docs.map((doc) => ({
              id: doc.id, // 문서 ID 포함
              ...doc.data(),
            }));
          },
          (error) => {
            // 에러 핸들링
            console.error("채팅 방 목록 가져오기 실패", error);
          }
        );
        // 채팅방 생성시 자동으로 채팅방 입성
        if (chatId) this.$router.push({ name: "Chat", params: { chatId } });
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
    isParticipantingChat(person) {
      return person.find((e) => e.uid === this.user.uid) ? true : false;
    },
    async getForUnreadMessages(chatId, userId, callback) {
      try {
        const chatDocRef = doc(db, "chats", chatId);

        this.onSub = onSnapshot(chatDocRef, async (doc) => {
          if (doc.exists()) {
            const chatData = doc.data();

            // 사용자 마지막 읽은 메시지 타임스탬프 가져오기
            const userParticipant = chatData.participants.find(
              (p) => p.uid === userId
            );
            const userLastReadTimeStampString =
              userParticipant?.lastReadMessageTimestamp ||
              "1970. 1. 1. 오전 00:00:00";
            const userLastReadTimestamp = this.parseCustomDateToTimestamp(
              userLastReadTimeStampString
            );
            // 메시지 타임스탬프를 Unix 타임스탬프로 변환하여 비교
            const unreadMessages = chatData.messages.filter((doc) => {
              const messageCreatedAtString = doc.createdAt;
              const messageCreatedAtTimestamp = this.parseCustomDateToTimestamp(
                messageCreatedAtString
              );
              return messageCreatedAtTimestamp > userLastReadTimestamp;
            });

            const unreadCnt = unreadMessages.length;

            callback(unreadCnt);
          } else {
            console.log("Chat document does not exist.");
            callback(0);
          }
        });
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        callback(0);
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    toggleScrollButton() {
      const button1 = document.getElementById("scrollToTopBtn");

      if (window.scrollY > 300) {
        button1.classList.add("show");
      } else {
        button1.classList.remove("show");
      }
    },
  },
};
</script>

<style scoped>
/* 컨테이너 스타일링 */
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100vh - 123px);
  justify-content: center;
  gap: 40px;
  margin: 0px auto;
  max-width: 1280px;
  padding: 2rem;
  background-color: #f4f4f4;
}
.chat-list-container {
  flex: 3;
  width: 100%;
  min-width: 500px;
  max-width: 700px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  padding-bottom: 58px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 헤더 스타일링 */
.chat-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  gap: 10px;
}

.chat-list-title {
  font-size: 1.5rem;
  color: #de1b60;
}

.chat-total-counts {
  position: relative;
  min-width: 50px;
  height: 48px;
}

.chat-total-counts .chat-counts {
  position: absolute;
  top: 0;
  left: 28px;
}

.chat-total-counts svg {
  width: 35px;
  height: 35px;
  fill: #f7cbc1c0;
  color: #ff6f61;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* 버튼 스타일링 */
.create-chat-button {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #ff6f61;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 0px;
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
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

.chat-item {
  display: flex;
  flex-direction: row;
  padding: 15px;
  padding-right: 25px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  gap: 5px;
}

.chat-item:hover {
  background: #ebebeb;
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-item .chat-img-wrapper {
  display: flex;
  position: relative;
  width: 50px; /* 전체 프로필 이미지 영역의 넓이 */
  height: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.chat-item .chat-img-wrapper .profile-pic {
  width: 30px; /* 각 이미지의 크기 */
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  background-color: #f0f0f0; /* 배경색, 이미지를 설정하지 않을 경우 표시 */
  object-fit: cover;
}

.chat-item .chat-img-wrapper .profile-pic:nth-child(1) {
  z-index: 4;
  left: 0;
  top: 0;
}

.chat-item .chat-img-wrapper .profile-pic:nth-child(2) {
  z-index: 3;
  left: 15px; /* 겹치는 부분을 설정 */
  top: 0;
}

.chat-item .chat-img-wrapper .profile-pic:nth-child(3) {
  z-index: 2;
  left: 0;
  top: 15px;
}

.chat-item .chat-img-wrapper .profile-pic:nth-child(4) {
  z-index: 1;
  left: 15px;
  top: 15px;
}

.chat-item .chat-text-wrapper {
  display: flex;
  flex: 1;
  width: calc(100% - 55px);
  flex-direction: column;
}

.chat-item .chat-text-wrapper .chat-title-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 20px;
}

.chat-item .chat-text-wrapper .chat-title-wrapper .chat-title-wrapper-left {
  flex: 1;
  cursor: pointer;
}

.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-left
  .chat-title {
  margin-right: 0.25rem;
  font-size: 1.2rem;
  color: #ff6f61;
}
.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-left
  .chat-limit-people {
  color: #666;
  word-break: keep-all;
}
.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-left
  .chat-title.chat-participating {
  color: #de1b60;
}

.chat-item
  .chat-text-wrapper
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

.chat-item .chat-text-wrapper .chat-title-wrapper .chat-title-wrapper-right {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center; /* 원형 요소를 세로로 정렬 */
  justify-content: center; /* 원형 요소를 가로로 정렬 */
  position: relative;
}

.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-right
  .chat-delete-btn {
  color: #333;
  padding: 0;
  line-height: 24px;
  position: absolute;
  right: -8px;
}

.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-right
  .chat-delete-btn.chat-delete-btn-position {
  right: -23px;
}

.chat-item
  .chat-text-wrapper
  .chat-title-wrapper
  .chat-title-wrapper-right
  .chat-counts,
.chat-counts {
  min-width: 20px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e74c3c; /* 원형 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

/* 마지막 메시지 스타일링 */
.chat-message-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.chat-message-wrapper .chat-last-message {
  font-size: 0.9rem;
  color: #555555;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-message-wrapper .chat-message-time {
  color: #999;
  min-width: 65px;
  text-align: right;
}

/* mobile scroll to */
.fixedBtn {
  width: auto;
  position: fixed;
  bottom: 50px;
  right: 20px;
  background-color: #f9825e;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: none;
}

.fixedBtn:hover {
  background-color: #fa5928;
}

.fixedBtn.show {
  display: block;
}

.fixedBtn svg {
  width: 20px;
}
.create-chat-button-mo {
  background-color: #ff7979;
  bottom: 100px;
}
.create-chat-button-mo:hover {
  background-color: #d63031;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    justify-content: center;
    padding: 2rem 1rem;
    height: 100%;
    gap: 20px;
  }
  .chat-list-container {
    min-width: auto;
    padding: 20px;
  }
  .chat-list {
    overflow-y: hidden;
  }
  .chat-list .chat-item {
    flex-direction: column-reverse;
    padding: 10px;
    padding-right: 20px;
  }
  .chat-list .chat-item .chat-img-wrapper {
    top: 0;
    transform: translateY(0px);
    width: 100%;
    height: auto;
    gap: 3px;
  }
  .chat-list .chat-item .chat-img-wrapper .profile-pic {
    position: relative;
    top: 0;
    left: 0;
  }
  .chat-item .chat-text-wrapper {
    width: 100%;
    gap: 10px;
  }
  .create-chat-button {
    display: none;
  }
  .create-chat-button-mo {
    display: block;
  }
}
</style>
