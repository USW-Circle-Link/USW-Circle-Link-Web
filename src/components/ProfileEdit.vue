<template>
  <div class="profile-edit-container">
    <h2>동아리 정보 수정</h2>
    <div class="profile-edit">
      <div class="image-container">
        <img :src="clubImage" alt="동아리 이미지" />
        <div class="edit-icon" @click="triggerFileInput">
          <img src="@/assets/penbrush.png" alt="Edit Icon" />
        </div>
        <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" />
      </div>
      <div class="vertical-line"></div>
      <div class="form-container">
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="clubName">동아리명</label>
            <div class="club-name">{{ localClubName }}</div>
          </div>
          <div class="form-group">
            <label for="leaderName">동아리장</label>
            <input type="text" id="leaderName" v-model="localLeaderName" />
          </div>
          <div class="form-group">
            <label for="kakaoTalk">카카오톡</label>
            <input type="text" id="kakaoTalk" v-model="localKakaoTalk" />
          </div>
          <div class="form-group">
            <label for="instagram">인스타그램</label>
            <input type="text" id="instagram" v-model="localInstagram" />
          </div>
          <div class="form-group">
            <label for="phoneNumber">전화번호</label>
            <input type="text" id="phoneNumber" v-model="localPhoneNumber" />
          </div>
          <div class="button-container">
            <button type="submit">수정하기</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localClubName: 'FLAG',
      localLeaderName: '',
      localKakaoTalk: '',
      localInstagram: '',
      localPhoneNumber: '',
      clubImage: require('@/assets/logo.png') // 초기 이미지
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    updateProfile() {
      const updatedInfo = {
        leaderName: this.localLeaderName,
        kakaoTalk: this.localKakaoTalk,
        instagram: this.localInstagram,
        phoneNumber: this.localPhoneNumber,
        clubImage: this.clubImage
      };
      localStorage.setItem('clubProfile', JSON.stringify(updatedInfo));
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>

<style scoped>
.profile-edit-container {
  padding-top: 50px;
  text-align: center;
}

.profile-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 820px;
  height: 324px;
  margin: 0 auto;
  border-radius: 8px 0px 0px 0px;
}

.image-container {
  position: relative;
  flex: 1;
}

.image-container img {
  width: 300px;
  height: auto;
  border-radius: 8px;
}

.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.edit-icon img {
  width: 30px;
  height: 30px;
}

.vertical-line {
  width: 0px;
  height: 194px;
  border: 1px solid #CACACA;
  margin-bottom: 40px;
}

.form-container {
  flex: 1;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

label {
  width: 100px;
  font-weight: bold;
  color: #000;
}

.club-name {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  line-height: 1.5;
}

input[type="text"]:not(#clubName) {
  flex: 1;
  padding: 8px;
  border: 0.5px solid #FFC700;
  border-radius: 4px;
  font-size: 12px;
  font-family: Pretendard;
  font-weight: 400;
  line-height: 14px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

button {
  width: 100px;
  height: 40px;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background: #FFC700;
  color: #000;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #FFC700;
}
</style>
