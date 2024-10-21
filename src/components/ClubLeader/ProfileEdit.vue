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
            <input type="text" id="clubInsta" v-model="clubInsta" class="standard-input" />
          </div>
          <div class="form-group">
            <label for="phoneNumber">전화번호</label>
            <input type="text" id="phoneNumber" v-model="leaderHp" class="standard-input" />
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
      defaultPhotoUrl: '', // 서버에서 받아온 이미지 URL
      isLoading: false,
      file: null,  // 업로드할 파일
      clubName: '', // 서버에서 받아올 동아리명
      clubInfo: {}, // 클럽 정보를 저장할 객체
      presignedUrl: '' // S3 업로드를 위한 사전 서명된 URL
    };
  },
  async created() {
    await this.fetchClubInfo();  // 동아리 정보를 불러옴
  },
  methods: {
    // URL로부터 파일을 생성하는 함수
    async urlToFile(url, filename) {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    },

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
          this.clubInfo = response.data.data; // 클럽 정보를 저장
          this.leaderName = this.clubInfo.leaderName || '';
          this.clubInsta = this.clubInfo.clubInsta || '';
          this.leaderHp = this.clubInfo.leaderHp || '';
          this.defaultPhotoUrl = this.clubInfo.mainPhoto ? this.clubInfo.mainPhoto : require('@/assets/profile.png');
          this.mainPhoto = this.defaultPhotoUrl;  // 기본 이미지 또는 서버에서 받아온 이미지로 설정
          this.clubName = this.clubInfo.clubName || '';  // 서버에서 동아리명을 받아옴

          // 이미지 URL을 파일로 변환 (이미지 URL이 있을 경우에만 실행)
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

        // 서버에서 기대하는 필드들로 데이터 구성
        const updatedData = {
          leaderName: this.leaderName || '',  // Null 체크 후 빈 문자열로 대체
          leaderHp: this.leaderHp || '',      // Null 체크 후 빈 문자열로 대체
          clubInsta: this.clubInsta || ''     // Null 체크 후 빈 문자열로 대체
        };

        // JSON 데이터를 FormData에 추가
        formData.append("clubInfoRequest", new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

        // 파일이 있는 경우에만 파일을 전송
        if (this.file) {
          formData.append("mainPhoto", this.file);  // 새로 선택한 이미지가 있으면 전송
        } else {
          formData.append("mainPhoto", "");  // 파일이 없을 때 빈 값 전송
        }

        // formData 내용을 출력하여 확인
        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]); 
        }

        // 서버로 업데이트 요청을 전송
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

      //  console.log("프로필 업데이트 성공:", response.data);
        alert('수정 완료!');

        // 업로드된 파일이 있으면 S3로 전송
        if (this.file && response.data.data.presignedUrl) {
          this.presignedUrl = response.data.data.presignedUrl;
          await this.uploadFile();
        }

        this.$emit('update'); // 부모 컴포넌트에 업데이트 요청
      } catch (error) {
       // console.error('프로필 업데이트 중 오류:', error);
        if (error.response) {
         // console.error('응답 데이터:', error.response.data);
        }
        alert('프로필 업데이트 중 오류가 발생했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    // 파일 업로드 로직 (파일이 있을 때만 실행)
    async uploadFile() {
      try {
        await axios.put(this.presignedUrl, this.file, {
          headers: {
            'Content-Type': this.file ? this.file.type : 'application/octet-stream',
          },
        });

        console.log('파일 업로드 성공');
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async onFileChange(event) {
      this.file = event.target.files[0];

      // 파일 크기 및 형식 검증
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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        alert('지원하지 않는 파일 형식입니다. JPG, PNG 또는 GIF 파일을 선택해주세요.');
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
      this.mainPhoto = '@/assets/logo.png';  // 기본 이미지로 대체
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