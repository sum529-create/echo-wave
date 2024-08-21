<template>
  <div class="profile-wrapper">
    <div class="image-wrapper">
      <div class="profile-image-area">
        <img
          v-if="profileImgUrl"
          :src="profileImgUrl"
          :alt="`${user.displayName}'s Profile img`"
        />
        <svg
          v-else
          data-slot="icon"
          fill="#ff9a8b"
          stroke-width="1"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          ></path>
        </svg>
      </div>
      <input
        @change="changeUserImg"
        id="profile"
        type="file"
        accept="image/*"
        class="profile-file"
      />
      <label for="profile">
        <div class="user-change-profile">
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            ></path>
          </svg>
        </div>
      </label>
      <div v-if="profileImgUrl" class="user-change-profile delete-profile">
        <svg
          @click="resetProfileImg"
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          ></path>
        </svg>
      </div>
    </div>
    <div class="profile-txt">
      <div class="profile-id-wrapper">
        <div v-if="flagInputBox">
          <input type="text" v-model="newUserId" @change="onChangeNewUserId" />
          <div class="profile-id-buttons">
            <button @click="editProfileId" class="btn_pink btn-sm">변경</button>
            <button @click="onFlagInputBox" class="btn_coral btn-sm">
              취소
            </button>
          </div>
        </div>
        <div v-else>
          <div class="profile-id-edit-wrapper">
            <span class="profile-id">
              {{ user ? user.displayName : "" }}
            </span>
            <span class="edit-icon" @click="onFlagInputBox">
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                ></path>
              </svg>
            </span>
          </div>
          <span class="profile-email">{{ user ? user.email : "" }}</span>
        </div>
      </div>
      <span @click="onLogOut" class="sign-out">로그아웃</span>
    </div>
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  getDownloadURL,
  uploadBytes,
  ref,
  deleteObject,
} from "firebase/storage";
export default {
  name: "Profile",
  data() {
    return {
      user: null,
      newUserId: "",
      flagInputBox: false,
      profileImgUrl: "",
      isLoading: false,
    };
  },
  mounted() {
    this.user = auth.currentUser;
    this.newUserId = this.user.displayName;
    this.fetchProfileImg();
  },
  watch: {
    profileImgUrl: function (newVal, oldVal) {
      this.fetchProfileImg();
    },
  },
  methods: {
    fetchProfileImg() {
      if (!this.user?.uid) return;
      this.profileImgUrl = this.user.photoURL;
    },
    async onLogOut() {
      if (confirm("로그아웃 하시겠습니까?")) {
        await auth.signOut();
        window.location.href = "/login";
      }
    },
    onChangeNewUserId(e) {
      this.newUserId = e.target.value;
    },
    onFlagInputBox() {
      this.flagInputBox = !this.flagInputBox;
    },
    async editProfileId() {
      if (!this.user) return;
      if (!this.newUserId || this.newUserId === "") {
        alert("변경하실 이름/닉네임을 입력해주세요");
        return;
      }
      try {
        await updateProfile(this.user, {
          displayName: this.newUserId,
        });
        const userQuery = query(
          collection(db, "users"),
          where("userId", "==", this.user.uid)
        );
        const snapshot = await getDocs(userQuery);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          const docRef = doc.ref;
          batch.update(docRef, {
            username: this.newUserId,
          });
        });

        await batch.commit();
        this.flagInputBox = false;
        alert("닉네임/이름이 수정되었습니다.");
      } catch (error) {
        console.error(error);
      }
    },
    async changeUserImg(e) {
      const { files } = e.target;
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (!this.user) return;
      if (files && files.length === 1) {
        const file = files[0];
        if (file.size > MAX_FILE_SIZE) {
          alert("업로드 가능한 파일 크기는 2MB입니다.");
          return;
        }
        try {
          const locationRef = ref(storage, `users/${this.user?.uid}`);
          const result = await uploadBytes(locationRef, file);
          const profileUrl = await getDownloadURL(result.ref);

          await updateProfile(this.user, {
            photoURL: profileUrl,
          });
          const profileDocRef = doc(collection(db, "users"), this.user.uid);
          await setDoc(
            profileDocRef,
            {
              photoURL: profileUrl,
            },
            { merge: true }
          );
          this.fetchProfileImg();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async resetProfileImg() {
      if (!this.user) return;
      if (confirm("프로필 이미지를 초기화 하시겠습니까?")) {
        try {
          await updateProfile(this.user, {
            photoURL: "",
          });
          const locationRef = ref(storage, `users/${this.user.uid}`);
          await deleteObject(locationRef);
          const userRef = doc(collection(db, "users"), this.user.uid);
          await setDoc(
            userRef,
            {
              photoURL: "",
            },
            { merge: true }
          );
          this.fetchProfileImg();
        } catch (error) {
          console.error("Faild to Reset Profile Image", error);
        }
      }
      try {
      } catch (error) {
        console.error("Failed to Reset Profile Image", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-wrapper {
  position: relative;
  grid-column: 1;
  height: fit-content;
}
.image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}
.image-wrapper .profile-file {
  display: none;
}
.image-wrapper .profile-image-area {
  position: absolute;
  border: 2px solid #fff;
  background-color: #fff;
  overflow: hidden;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.image-wrapper .profile-image-area img,
.image-wrapper .profile-image-area svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.image-wrapper svg {
  color: #ff9a8b;
}

.image-wrapper .user-change-profile {
  width: 20%;
  height: 0;
  padding-bottom: 20%;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid #fab1a0;
  background-color: #fab1a0;
  cursor: pointer;
  z-index: 2;
}
.image-wrapper .user-change-profile.delete-profile {
  left: 0;
  border: 2px solid #ff7979;
  background-color: #ff7979;
}

.image-wrapper .user-change-profile svg {
  color: #d63031;
}

.image-wrapper .user-change-profile.delete-profile svg {
  color: #fff;
}

.profile-txt {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 1rem 0;
}

.profile-txt .profile-id-wrapper .profile-id {
  font-size: 24px;
  line-height: 1.25;
  font-weight: 600;
  margin-right: 4px;
}

.profile-txt .profile-id-wrapper .profile-id-edit-wrapper {
  color: #de1b60;
}
.profile-txt .profile-id-wrapper .profile-id-edit-wrapper .edit-icon {
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.profile-txt .profile-email {
  font-size: 18px;
  line-height: 22px;
  color: #636c76;
}

.profile-id-buttons {
  display: flex;
  gap: 10px;
}

.profile-txt .sign-out {
  position: relative;
  cursor: pointer;
  font-size: 14px;
  color: #ff6347;
  padding-left: 24px;
  line-height: 20px;
  margin: 10px 0;
  font-weight: 700;
}

.profile-txt .sign-out::before {
  content: "";
  display: inline-block;
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLXNsb3Q9Imljb24iIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGFyaWEtaGlkZGVuPSJ0cnVlIj4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS43NSA5VjUuMjVBMi4yNSAyLjI1IDAgMCAwIDEzLjUgM2gtNmEyLjI1IDIuMjUgMCAwIDAtMi4yNSAyLjI1djEzLjVhMi4yNSAyLjI1IDAgMCAwIDIuMjUgMi4yNWg2YTIuMjUgMi4yNSAwIDAgMCAyLjI1LTIuMjVWMTVtMyAwIDMtM20wIDAtMy0zbTMgM0g5Ij48L3BhdGg+Cjwvc3ZnPgo=");
  background-size: contain;
  background-repeat: no-repeat;
  filter: invert(44%) sepia(93%) saturate(1154%) hue-rotate(332deg)
    brightness(103%) contrast(102%);
}
</style>
