<template>
  <div class="profile-edit-container">
    <h2 class="profile-title">동아리 정보 수정</h2>
    <div class="profile-edit">
      <div class="image-container">
        <img 
          :src="mainPhoto || defaultPhotoUrl" 
          alt="동아리 이미지" 
          @load="onImageLoad" 
          @error="onImageError" 
        />
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
            <input type="text" id="clubName" v-model="clubName" class="club-name-input" readonly />
          </div>
          <div class="form-group">
            <label for="leaderName">
              동아리장 <span style="color: red;">*</span>
            </label>
            <input type="text" id="leaderName" v-model="leaderName" class="standard-input" />
          </div>
          <div class="form-group">
            <label for="phoneNumber">
              전화번호 <span style="color: red;">*</span>
            </label>
            <input type="text" id="phoneNumber" v-model="leaderHp" class="standard-input" />
          </div>
          <div class="form-group">
            <label for="clubInsta">인스타그램</label>
            <input
              type="text"
              id="clubInsta"
              v-model="clubInsta"
              class="standard-input"
              placeholder="인스타 아이디를 입력해주세요"
              maxlength="25"
            />
          </div>
          <div class="button-container">
            <button type="submit" :disabled="isLoading">{{ isLoading ? '업데이트 중...' : '수정하기' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import store from '@/store/store';
import axios from 'axios';

export default {
  data() {
    return {
      leaderName: '',
      clubInsta: '',
      leaderHp: '',
      mainPhoto: '',  // 미리보기로 표시할 이미지 (수정된 경우)
      defaultPhotoUrl: require('@/assets/profile.png'), // 기본 이미지 URL 설정
      isLoading: false,
      file: null,  // 업로드할 파일
      clubName: '', // 동아리명
      clubInfo: {}, // 클럽 정보를 저장할 객체
      presignedUrl: '' // S3 업로드를 위한 사전 서명된 URL
    };
  },
  async created() {
    await this.fetchClubInfo();
    if (this.defaultPhotoUrl) {
      this.file = await this.urlToFile(this.defaultPhotoUrl, 'image.jpg', 'image/jpeg');
    }
  },
  methods: {
    async fetchClubInfo() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.data) {
          this.clubInfo = response.data.data;
          this.leaderName = this.clubInfo.leaderName || '';
          this.clubInsta = this.clubInfo.clubInsta || '';
          this.leaderHp = this.clubInfo.leaderHp || '';
          this.defaultPhotoUrl = this.clubInfo.mainPhotoUrl || require('@/assets/profile.png');
          this.mainPhoto = this.defaultPhotoUrl;
          this.clubName = this.clubInfo.clubName || '';

          console.log(this.clubInfo); // 클럽 정보 출력
        }
      } catch (error) {
        console.error('Error fetching club info:', error);
        alert('Error fetching club info.');
      }
    },

    async urlToFile(url, filename, mimeType = 'image/jpeg') {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType });
    },

    async updateProfile() {
      this.isLoading = true;
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const formData = new FormData();

        const updatedData = {
          clubName: this.clubName,
          leaderName: this.leaderName || this.clubInfo.leaderName,
          leaderHp: this.leaderHp || this.clubInfo.leaderHp,
          clubInsta: this.clubInsta || this.clubInfo.clubInsta,
          mainPhotoUrl: this.defaultPhotoUrl
        };

        formData.append("clubInfoRequest", new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

        if (this.file) {
          formData.append("mainPhoto", this.file);
        } else if (this.defaultPhotoUrl) {
          const existingFile = await this.urlToFile(this.defaultPhotoUrl, 'existingImage.jpg', 'image/jpeg');
          formData.append("mainPhoto", existingFile);
        }

        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

        const response = await axios.put(
          `http://15.164.246.244:8080/club-leader/${clubId}/info`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        alert('수정 완료!');
        this.$emit('update');

        if (this.file && response.data.data.presignedUrl) {
          this.presignedUrl = response.data.data.presignedUrl;
          await this.uploadFile();
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
          alert(`오류: ${error.response.data.message || '서버 오류가 발생했습니다.'}`);
        }
      } finally {
        this.isLoading = false;
      }
    },

    async uploadFile() {
      try {
        await axios.put(this.presignedUrl, this.file, {
          headers: {
            'Content-Type': this.file.type,
          },
        });
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드 실패!');
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async onFileChange(event) {
      this.file = event.target.files[0];

      if (this.file && !this.validateFile(this.file)) {
        this.file = null;
        return;
      }

      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.mainPhoto = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    },

    validateFile(file) {
      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 2 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert('지원하지 않는 파일 형식입니다. JPG 또는 PNG 파일을 선택해주세요.');
        return false;
      }

      if (file.size > maxSize) {
        alert('파일 크기가 2MB를 초과합니다. 작은 파일을 선택해주세요.');
        return false;
      }

      return true;
    },

    onImageLoad() {
      console.log("이미지가 성공적으로 로딩되었습니다.");
    },

    onImageError() {
      console.error("이미지 로딩에 실패했습니다.");
      this.mainPhoto = this.defaultPhotoUrl;
    }
  }
};
</script>


<style scoped>
.profile-edit-container {
  padding-top: 50px;
  text-align: center;
  position: relative;
}

.profile-title {
  position: absolute;
  top: 20px;
  left: 20px;
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
  margin: 50px auto 0 auto;
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

.club-name-input {
  width: 360.02px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #999;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.club-name-input:focus {
  border-color: #777;
  outline: none;
}

.standard-input {
  flex: 1;
  padding: 8px;
  border: 0.5px solid #FFC700;
  border-radius: 4px;
  font-size: 12px;
  height: 23.99px;
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
