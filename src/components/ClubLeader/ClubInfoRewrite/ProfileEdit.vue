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
            ref="mainImage"
        />
        <div class="edit-icon" @click="triggerFileInput">
          <img src="../../../assets/penbrush.png" alt="Edit Icon" />
        </div>
        <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" />
      </div>

      <div class="vertical-line" :style="{ height: imageHeight + 'px' }"></div>

      <div class="form-container">
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="title">
              <div class="label-container">
                동아리 이름
              </div>
            </label>
            <input type="text" id="clubName" v-model="clubName" class="club-name-input" readonly />
          </div>
          <div class="form-group">
            <label for="title">
              <div class="label-container">
                <span class="required">*</span>동아리 회장
              </div>
            </label>
            <input type="text" id="leaderName" v-model="leaderName" class="standard-input" placeholder="이름을 입력해주세요." />
          </div>
          <div class="form-group">
            <label for="title">
              <div class="label-container">
                <span class="required">*</span>전화번호
              </div>
            </label>
            <input type="text" id="phoneNumber" v-model="leaderHp" class="standard-input" placeholder="전화번호를 입력해주세요. ( - 제외 11자)" />
          </div>

          <div class="form-group">
            <label for="title">
              <div class="label-container">
                <span class="required">*</span>동아리방
              </div>
            </label>
            <div class="room-select-container">
              <button type="button" class="room-select-button" @click="openRoomModal">
                <div class="icon map-pin"></div>
                동아리방 선택
              </button>
              <input
                  type="text"
                  v-model="selectedRoom"
                  class="standard-input"
                  readonly
                  :placeholder="selectedRoom || '미선택'"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="title">
              <div class="label-container">
                인스타그램
              </div>
            </label>
            <input
                type="text"
                id="clubInsta"
                v-model="clubInsta"
                class="standard-input"
                placeholder="인스타그램 링크를 입력해주세요."
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

  <ClubRoomModal
      :is-open="showRoomModal"
      @close="closeRoomModal"
      @select="onRoomSelect"
  />
</template>


<script>
import store from '@/store/store';
import axios from 'axios';
import ClubRoomModal from './ClubRoomModal.vue';


export default {
  components: {
    ClubRoomModal,
  },
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
      presignedUrl: '', // S3 업로드를 위한 사전 서명된 URL
      imageHeight: 220, // 초기 높이 설정
      selectedRoom: '',
      showRoomModal: false,
    };
  },
  async created() {
    await this.fetchClubInfo();
    if (this.defaultPhotoUrl) {
      this.file = await this.urlToFile(this.defaultPhotoUrl, 'image.jpg', 'image/jpeg');
    }
  },
  methods: {
    openRoomModal() {
      this.showRoomModal = true;
    },
    closeRoomModal() {
      this.showRoomModal = false;
    },
    onRoomSelect(room) {
      this.selectedRoom = room;
    },
    // 동아리 정보 로드
    async fetchClubInfo() {
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기
      const clubId = store.state.clubId; // 저장된 clubId 가져오기

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/info`, { // 서버에 동아리 정보 요청
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
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
    // URL -> 파일 객체 반환
    async urlToFile(url, filename, mimeType = 'image/jpeg') {
      const response = await fetch(url); // URL에서 데이터 로드
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType }); // blob 데이터를 기반으로 파일 객체 생성
    },
    // 동아리 정보 업데이트
    async updateProfile() {
      this.isLoading = true;
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기
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

        // FormData 내용 로그 출력
        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

        const response = await axios.put(
            `http://15.164.246.244:8080/club-leader/${clubId}/info`, // 서버에 업데이트 요청
            formData,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
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
    // 파일 업로드
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
      this.$refs.fileInput.click(); // 파일 선택 트리거 동작
    },
    // 파일 변경 시 실행
    async onFileChange(event) {
      this.file = event.target.files[0];

      if (this.file && !this.validateFile(this.file)) {
        this.file = null;
        return;
      }

      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.mainPhoto = e.target.result; // 미리보기로 표시할 이미지 업데이트
        };
        reader.readAsDataURL(this.file);
      }
    },
    // 파일 형식 & 크기 검증
    validateFile(file) {
      const validTypes = ['image/jpeg', 'image/png']; // JPG, PNG 형식의 파일만 허용
      const maxSize = 2 * 1024 * 1024; // 크기 최대 2MB까지만 허용

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
      this.updateVerticalLineHeight();
    },
    updateVerticalLineHeight() {
      const imageElement = this.$refs.mainImage;
      if (imageElement) {
        this.imageHeight = imageElement.clientHeight;
      }
    },

    onImageError() {
      console.error("이미지 로딩에 실패했습니다.");
      this.mainPhoto = this.defaultPhotoUrl;
    }
  },
  mounted() {
    this.updateVerticalLineHeight();
  },
};
</script>

<style scoped>
.room-select-container {
  display: flex;
  gap: 10px;
  flex: 1;
}

.room-select-container .standard-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #828282;
  background-color: #f9f9f9;
  box-sizing: border-box;
  height: 42px;
  letter-spacing: -0.3px;
}

.room-select-container .standard-input:focus {
  border-color: #777;
  outline: none;
}
.room-select-button {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  height: 41px;
  font-size: 13px;
  color: #5A5A5A;
  width: 120px;
}

.room-select-button:hover {
  border-color: #FFC700;
  border-width: 1.5px;
}

.room-select-button .map-pin {
  width: 16px;
  height: 16px;
  margin-left: 1px;
  margin-right: 5px;
  margin-bottom: 2px;
  background: url('@/assets/map-pin.svg') no-repeat center center;
  background-size: contain;
}


.profile-edit-container {
  padding-top: 20px;
  text-align: center;
  position: relative;
}

.profile-title {
  position: absolute;
  top: 0px;
}

.profile-edit {
  display: flex;
  justify-content: flex-start; /* Align items to the start horizontally */
  align-items: flex-start;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 820px;
  height: 324px;
  margin: 0 auto;
  border-radius: 8px;
  margin: 50px auto 0 auto;
  position: relative;
}

.image-container {
  position: relative;
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  width: 270px;
  height: auto;
  border-radius: 8px;
  margin: 0; /* Remove any margins */
  padding: 0; /* Remove any padding */
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
  border: 1px solid #CACACA;
  margin-bottom: 40px;
  margin-left: 17px;
  margin-right: 25px;
}

.form-container {
  flex: 1.5;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.label-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.required {
  position: absolute;
  top: -6px; /* Adjust as needed */
  left: -6px; /* Adjust as needed */
  color: red;
  font-size: 15px;
  line-height: 1;
}

label {
  width: 100px;
  color: #5A5A5A;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 87.5% */
  letter-spacing: -0.4px;
  text-align: left;
}

.club-name-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400px;
  text-align: left;
  color: #828282;
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
  border: 0.5px solid #ccc; /* Default border color */
  border-radius: 4px;
  font-size: 12px;
  height: 23.99px;
  line-height: 14px;
  color: #5A5A5A;
  font-family: Pretendard;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
}

.standard-input:focus {
  border-color: #FFC700; /* Border color when focused */
  outline: none; /* Remove default outline */
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


</style>