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
          <div class="input-container">
            <input
                type="text"
                id="leaderName"
                v-model="leaderName"
                :class="['standard-input', { 'error': !isLeaderNameValid && leaderName }]"
                placeholder="이름을 입력해주세요."
                @input="validateLeaderName"
            />
            <span v-if="!isLeaderNameValid && leaderName" class="error-message">
        *동아리 회장 입력 형식이 잘못되었습니다.
      </span>
          </div>
        </div>
        <div class="form-group">
          <label for="title">
            <div class="label-container">
              <span class="required">*</span>전화번호
            </div>
          </label>
          <div class="input-container">
            <input
                type="text"
                id="phoneNumber"
                v-model="leaderHp"
                :class="['standard-input', { 'error': !isPhoneNumberValid && leaderHp }]"
                placeholder="전화번호를 입력해주세요. ( - 제외 11자)"
                @input="validatePhoneNumber"
            />
            <span v-if="!isPhoneNumberValid && leaderHp" class="error-message">
        *전화번호 입력 형식이 잘못되었습니다.
            </span>
          </div>
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
          <label for="hashTag">
            <div class="label-container">
              해시태그
            </div>
          </label>
          <div class="input-container">
            <input
                type="text"
                id="hashTag"
                v-model="hashTagInput"
                :class="['standard-input', { 'error': !isHashTagValid && hashTagInput }]"
                placeholder="해시태그를 입력해주세요. ( # 제외 한글, 대문자 3자, 소문자 6자)"
                maxlength="25"
                @keyup.enter="addHashTag"
            />
          </div>
        </div>

        <!-- 해시태그 표시 영역 (새로 추가) -->
        <div class="hashtags-display" v-if="hashtags.length > 0">
          <div class="hashtags-wrapper">
            <div v-for="(tag, index) in hashtags" :key="index" class="hashtag-item">
              {{ '#' + tag }}
              <span class="remove-tag" @click="removeHashTag(index)">×</span>
            </div>
          </div>
          <div v-if="!isHashTagValid && hashTagInput" class="hashtag-error-message">
            *해시태그 입력 형식이 잘못되었습니다.
          </div>
        </div>

        <div class="form-group">
          <label for="title">
            <div class="label-container">
              인스타그램
            </div>
          </label>
          <div class="input-container">
            <input
                type="text"
                id="clubInsta"
                v-model="clubInsta"
                :class="['standard-input', { 'error': !isInstaValid && clubInsta }]"
                placeholder="인스타그램 링크를 입력해주세요."
                maxlength="70"
                @input="validateInstagram"
            />
            <span v-if="!isInstaValid && clubInsta" class="error-message">
      *인스타그램 입력 형식이 잘못되었습니다. (https://www.instagram.com으로 시작)
    </span>
          </div>
        </div>

        <div class="form-group">
          <label for="title">
            <div class="label-container">
              카테고리
            </div>
          </label>
          <div class="category-select-container">
            <button type="button" class="category-select-button" @click="openCategoryModal">
              <div class="icon category-pin"></div>
              카테고리 설정하기
            </button>
          </div>
        </div>
        <!-- 선택된 카테고리 표시 영역 -->
        <div class="categories-display" v-if="selectedCategories.length > 0">
          <div class="categories-wrapper">
            <div v-for="(category, index) in selectedCategories" :key="index" class="category-item">
              {{ category.clubCategoryName }}
              <span class="remove-category" @click="removeCategory(index)">×</span>
            </div>
          </div>
        </div>

        <div class="button-container">
          <button
              type="button"
              @click="updateProfile"
              :disabled="isLoading || !isPhoneNumberValid || !leaderHp || !isHashTagValid || !isLeaderNameValid || !leaderName || (!isInstaValid && clubInsta)"
              :class="{ 'disabled': !isPhoneNumberValid || !leaderHp || !isHashTagValid || !isLeaderNameValid || !leaderName || (!isInstaValid && clubInsta), 'update-button': true }"
          >
            수정하기
          </button>
        </div>

      </div>
    </div>
  </div>

  <ClubRoomModal
      :is-open="showRoomModal"
      :current-room="selectedRoom"
      @close="closeRoomModal"
      @select="onRoomSelect"
  />
  <CategoryModal
      :is-open="showCategoryModal"
      :current-selected="selectedCategories"
      @close="closeCategoryModal"
      @select="onCategorySelect"
  />
  <UpdateSuccessPopup
      :isVisible="showSuccessPopup"
      @close="closeSuccessPopup"
  />

</template>


<script>
import store from '@/store/store';
import axios from 'axios';
import ClubRoomModal from './ClubRoomModal.vue';
import CategoryModal from './CategoryModal.vue';
import UpdateSuccessPopup from './UpdateSuccessPopup.vue';


export default {
  components: {
    ClubRoomModal,
    CategoryModal,
    UpdateSuccessPopup,
  },
  data() {
    return {
      // Existing variables
      leaderName: '',
      clubInsta: '',
      leaderHp: '',
      mainPhoto: '',
      hashTagInput: '',
      hashtags: [],
      defaultPhotoUrl: require('@/assets/profile.png'),

      // New variables added
      clubRoomNumber: '',
      clubHashtag: [],
      clubCategoryName: [],

      // Existing variables
      isLoading: false,
      file: null,
      clubName: '',
      clubInfo: {},
      presignedUrl: '',
      imageHeight: 220,

      // Room selection variables
      selectedRoom: '',
      originalRoom: '',
      showRoomModal: false,

      // Category selection variables
      showCategoryModal: false,
      selectedCategories: [],

      // Validation flags
      isPhoneNumberValid: true,
      isHashTagValid: true,
      isLeaderNameValid: true,
      isInstaValid: true,
      showSuccessPopup: false,
    };
  },
  async created() {
    await this.fetchClubInfo();
    if (this.defaultPhotoUrl) {
      this.file = await this.urlToFile(this.defaultPhotoUrl, 'image.jpg', 'image/jpeg');
    }
  },
  methods: {
    validateLeaderName() {
      // 특수문자를 체크하는 정규식 (공백은 허용)
      const specialCharPattern = /[!@#₩$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;

      // 입력값이 비어있지 않고 특수문자가 없으면 true
      this.isLeaderNameValid = !specialCharPattern.test(this.leaderName);
    },

    validateHashTag(input) {
      if (!input) return true;  // 빈 값은 유효하다고 처리

      // 한글 패턴
      const koreanPattern = /^[가-힣]+$/;
      // 영문 대문자 패턴 (3자 이하)
      const upperPattern = /^[A-Z]{1,3}$/;
      // 영문 소문자 패턴 (6자 이하)
      const lowerPattern = /^[a-z]{1,6}$/;

      // 입력값이 한글이거나 대문자(3자 이하) 또는 소문자(6자 이하)인지 확인
      return koreanPattern.test(input) ||
          upperPattern.test(input) ||
          lowerPattern.test(input);
    },
    // 전화번호 유효성 검사 메서드 추가
    validatePhoneNumber() {
      // 숫자만 남기고 모든 문자 제거
      this.leaderHp = this.leaderHp.replace(/[^0-9]/g, '');

      // 11자리 숫자인지 검사
      const phoneNumberPattern = /^[0-9]{11}$/;
      this.isPhoneNumberValid = phoneNumberPattern.test(this.leaderHp);
    },
    validateInstagram() {
      if (!this.clubInsta) {
        this.isInstaValid = true;
        return;
      }
      this.isInstaValid = this.clubInsta.startsWith('https://www.instagram.com'); //인스타그램 url로 시작하는지 검사
    },
    openRoomModal() {
      this.showRoomModal = true;
    },
    closeRoomModal() {
      this.showRoomModal = false;
    },
    onRoomSelect(room) {
      this.originalRoom = room;
      this.selectedRoom = `학생회관 ${room}호`;
    },
    openCategoryModal() {
      this.showCategoryModal = true;
    },
    closeCategoryModal() {
      this.showCategoryModal = false;
    },
    onCategorySelect(categories) {
      this.selectedCategories = categories;
    },
    removeCategory(index) {
      this.selectedCategories.splice(index, 1);
    },

    // 동아리 정보 로드
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

          // Existing fields
          this.leaderName = this.clubInfo.leaderName || '';
          this.clubInsta = this.clubInfo.clubInsta || '';
          this.leaderHp = this.clubInfo.leaderHp || '';
          this.defaultPhotoUrl = this.clubInfo.mainPhotoUrl || require('@/assets/profile.png');
          this.mainPhoto = this.defaultPhotoUrl;
          this.clubName = this.clubInfo.clubName || '';

          // New fields
          this.clubRoomNumber = this.clubInfo.clubRoomNumber || '';
          this.selectedRoom = this.clubRoomNumber ? `학생회관 ${this.clubRoomNumber}호` : '';

          // Handle clubHashtag
          this.clubHashtag = this.clubInfo.clubHashtag || [];
          this.hashtags = this.clubHashtag;


          this.clubCategoryName = this.clubInfo.clubCategoryName || [];// 문자열 배열을 객체 배열로 변환
          this.selectedCategories = this.clubCategoryName.map(category => ({
            clubCategoryName: category.trim() // 혹시 모를 공백 제거
          }));

          console.log(this.clubInfo);
        }
      } catch (error) {
        console.error('동아리 정보를 불러오는데 실패했습니다.', error);
        alert('동아리 정보를 불러오는데 실패했습니다.');
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
      if (!this.leaderName || !this.isLeaderNameValid) {
        return;
      }
      if (!this.isPhoneNumberValid) {
        alert('전화번호 형식을 확인해주세요.');
        return;
      }
      if (!this.isInstaValid && this.clubInsta) {
        alert('인스타그램 입력 형식이 잘못되었습니다.');
        return;
      }

      this.isLoading = true;
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const formData = new FormData();

        const updatedData = {
          clubName: this.clubName,
          leaderName: this.leaderName || this.clubInfo.leaderName,
          leaderHp: this.leaderHp || this.clubInfo.leaderHp,
          clubRoomNumber: this.selectedRoom ? this.selectedRoom.replace('학생회관 ', '').replace('호', '') : '',
          clubHashtag: this.hashtags,
          clubCategoryName: this.selectedCategories.map(category => category.clubCategoryName),
          clubInsta: this.clubInsta,
        };

        formData.append("clubInfoRequest", new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

        // 사용자가 새로운 이미지를 선택한 경우
        if (this.file) {
          formData.append("mainPhoto", this.file);
        }
        // 기존에 서버에 저장된 이미지가 있는 경우 (mainPhotoUrl이 빈 문자열이 아닌 경우)
        else if (this.clubInfo.mainPhotoUrl) {
          const existingFile = await this.urlToFile(this.mainPhoto, 'existingImage.jpg', 'image/jpeg');
          formData.append("mainPhoto", existingFile);
        }
        // 초기 계정이고(mainPhotoUrl이 빈 문자열) 사용자가 새로운 이미지를 선택하지 않은 경우
        else {
          formData.append("mainPhoto", null);
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

        this.showSuccessPopup = true;
        this.$emit('update');

        if (this.file && response.data.data.presignedUrl) {
          this.presignedUrl = response.data.data.presignedUrl;
          await this.uploadFile();
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response && error.response.data) {
          const errorMessages = Object.values(error.response.data).join('\n');
          alert(`${errorMessages}`);
        } else {
          alert('서버 오류가 발생했습니다.');
        }
      } finally {
        this.isLoading = false;
      }
    },
    closeSuccessPopup() {
      this.showSuccessPopup = false;
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
    },

    // 해시태그 추가 메소드
    addHashTag() {
      const tag = this.hashTagInput.trim();
      if (tag && !this.hashtags.includes(tag) && this.validateHashTag(tag)) {
        this.hashtags.push(tag);
        this.hashTagInput = '';
        this.isHashTagValid = true;
      }
    },

    // 해시태그 입력 감시
    watchHashTagInput() {
      this.isHashTagValid = this.validateHashTag(this.hashTagInput);
    },

    // 해시태그 제거 메소드
    removeHashTag(index) {
      this.hashtags.splice(index, 1);
    },
  },
  mounted() {
    this.updateVerticalLineHeight();
  },
  watch: {
    hashTagInput: {
      handler: function(newValue) {
        this.watchHashTagInput();
      },
      immediate: true
    },
    leaderName: {
      handler: function(newValue) {
        this.validateLeaderName();
      },
      immediate: true
    },
    clubInsta: {
      handler: function(newValue) {
        this.validateInstagram();
      },
      immediate: true
    },
  }
};
</script>

<style scoped>
.category-select-container {
  display: flex;
  gap: 10px;
  flex: 1;
}

.category-select-container .standard-input {
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

.category-select-container .standard-input:focus {
  border-color: #777;
  outline: none;
}

.category-select-button {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  height: 42px;
  font-size: 13px;
  color: #5A5A5A;
  width: 140px;
}

.category-select-button:hover {
  border-color: #FFC700;
  border-width: 1.5px;
}

.category-select-button .category-pin {
  width: 16px;
  height: 16px;
  margin-left: 1px;
  margin-right: 5px;
  margin-bottom: 2px;
  background: url('@/assets/category.svg') no-repeat center center;
  background-size: contain;
}


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
  height: 42px;
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
  text-align: center;
  position: relative;
}

.profile-title {
  text-align: left;
  font-size: 20px;
  font-weight: 600;
}

.profile-edit {
  display: flex;
  justify-content: flex-start; /* Align items to the start horizontally */
  align-items: flex-start;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 846px;
  border-radius: 8px;
  margin: 20px auto 0 auto;
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
  width: 124px;
  height: 40px;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background: #FFB052;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}

button.update-button:hover {
  background-color: #e6953e;
}

button:disabled,
button.disabled {
  background: #CCCCCC;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  height: 42px; /* 입력폼 높이 통일 */
}

.standard-input {
  width: 100%;
  height: 42px; /* 입력칸 높이 통일 */
  padding: 12px;
  border: 0.5px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  color: #5A5A5A;
  font-family: Pretendard;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
  box-sizing: border-box;
}

/* 해시태그 표시 영역 스타일 */
.hashtags-display {
  margin-left: 110px; /* label 너비 + gap */
  margin-top: -30px;
  margin-bottom: 21px;
}

.hashtags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.hashtag-item {
  display: flex;
  align-items: center;
  background: #F2F2F2;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 10px;
  color: #353535;
  gap: 6px;
  margin-top: 7px;
}

.remove-tag {
  cursor: pointer;
  font-size: 16px;
  color: #828282;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-tag:hover {
  color: #5A5A5A;
}


.categories-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.category-item {
  display: flex;
  align-items: center;
  background: #F2F2F2;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #353535;
  gap: 6px;
  margin-top: 7px;
}

.remove-category {
  cursor: pointer;
  font-size: 16px;
  color: #828282;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-category:hover {
  color: #5A5A5A;
}

.categories-display {
  margin-left: 110px; /* label 너비 + gap */
  margin-bottom: 15px;
  margin-top: -30px;
}

.input-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.standard-input.error {
  border-color: #FF2E2E;
}

.error-message {
  color: #FF2E2E;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  margin-top: 5px;
  text-align: left;
  padding-left: 4px;
}


.hashtag-error-message {
  color: #FF2E2E;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  text-align: left;
  padding-left: 4px;
  margin-top: 2px;
}

.standard-input.error {
  border-color: #FF2E2E;
}
</style>