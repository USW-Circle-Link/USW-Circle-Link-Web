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
            <label for="leaderName">동아리장</label>
            <input type="text" id="leaderName" v-model="leaderName" class="standard-input" />
          </div>
          <div class="form-group">
            <label for="clubInsta">인스타그램</label>
            <input 
              type="text" 
              id="clubInsta" 
              v-model="clubInsta" 
              class="standard-input" 
              placeholder="인스타그램 아이디를 적어주세요" 
              maxlength="25"
            />
          </div>
          <div class="form-group">
            <label for="phoneNumber">전화번호</label>
            <input type="text" id="phoneNumber" v-model="leaderHp" class="standard-input" @input="validatePhoneNumber"/>
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
      mainPhoto: '',
      defaultPhotoUrl: '@/assets/logo.png', // 기본 이미지 URL
      isLoading: false,
      file: null,
      clubName: '',
      clubInfo: {},
      presignedUrl: ''
    };
  },
  async created() {
    await this.fetchClubInfo();
  },
  methods: {
    async urlToFile(url, filename) {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    },

    async fetchClubInfo() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.get(`https://api.donggurami.net/club-leader/${clubId}/info`, {
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
          this.defaultPhotoUrl = this.clubInfo.mainPhotoUrl || '@/assets/logo.png';
          this.mainPhoto = this.defaultPhotoUrl;
          this.clubName = this.clubInfo.clubName || '';

          if (this.defaultPhotoUrl) {
            this.file = await this.urlToFile(this.defaultPhotoUrl, 'image.png');
          }
        }
      } catch (error) {
        console.error('동아리 정보를 불러오는 중 오류 발생:', error);
        alert('동아리 정보를 불러오는 중 오류가 발생했습니다.');
      }
    },

    async updateProfile() {
  this.isLoading = true;
  const accessToken = store.state.accessToken;
  const clubId = store.state.clubId;

  try {
    const formData = new FormData();

    // 필수 데이터 구성 (이름, 전화번호, 인스타)
    const updatedData = {
      leaderName: this.leaderName || '',
      leaderHp: this.leaderHp || '',
      clubInsta: this.clubInsta || ''
    };

    formData.append("clubInfoRequest", new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

    // 이미지를 반드시 전송하기 위해 파일 설정 확인
    if (this.file) {
      // 사용자가 새로 선택한 이미지가 있을 경우 이 파일을 사용
      formData.append("mainPhoto", this.file);
    } else if (this.defaultPhotoUrl || this.mainPhoto) {
      // 기존 이미지가 있을 경우 URL로부터 File 생성 후 전송
      const existingImageUrl = this.defaultPhotoUrl || this.mainPhoto;
      const response = await fetch(existingImageUrl);
      if (!response.ok) throw new Error('기존 이미지를 불러오는 중 오류 발생');
      const blob = await response.blob();
      const existingFile = new File([blob], "existingImage.png", { type: blob.type });
      formData.append("mainPhoto", existingFile);
    } else {
      // 이미지가 없을 경우 기본 빈 파일을 전송
      const emptyFile = new Blob([], { type: 'image/png' });
      formData.append("mainPhoto", emptyFile, "empty.png");
    }

    const response = await axios.put(
      `https://api.donggurami.net/club-leader/${clubId}/info`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    alert('수정 완료!');

    if (this.file && response.data.data.presignedUrl) {
      this.presignedUrl = response.data.data.presignedUrl;
      await this.uploadFile();
    }

    this.$emit('update');
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('응답 데이터:', error.response.data);
    }
    alert('프로필 업데이트 중 오류가 발생했습니다.');
  } finally {
    this.isLoading = false;
  }
},

    async uploadFile() {
      try {
        await axios.put(this.presignedUrl, this.file, {
          headers: {
            'Content-Type': this.file ? this.file.type : 'application/octet-stream',
          },
        });
      } catch (error) {
        alert('파일 업로드 중 오류가 발생했습니다.');
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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff'];
      const invalidExtensions = ['exe', 'bat', 'cmd', 'sh', 'php', 'js', 'py', 'dll', 'msi'];
      const maxSize = 2 * 1024 * 1024;

      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validTypes.includes(file.type) || invalidExtensions.includes(fileExtension)) {
        alert('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, BMP, WebP, 또는 TIFF 파일을 선택해주세요.');
        return false;
      }

      if (file.size > maxSize) {
        alert('파일 크기가 2MB를 초과합니다. 작은 파일을 선택해주세요.');
        return false;
      }

      return true;
    },

    validatePhoneNumber() {
      const phoneNumberRegex = /^[0-9]*$/;
      if (!phoneNumberRegex.test(this.leaderHp)) {
        alert('전화번호는 숫자만 입력할 수 있습니다.');
        this.leaderHp = this.leaderHp.replace(/[^0-9]/g, '');
      }
    },

    onImageLoad() {
      console.log("이미지가 성공적으로 로딩되었습니다.");
    },

    onImageError() {
      console.error("이미지 로딩에 실패했습니다.");
      this.mainPhoto = '@/assets/logo.png';
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