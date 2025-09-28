<template>
  <div class="profile-edit-container">
    <div class="title">
      <h2 class="profile-title">동아리 정보 수정</h2>
    </div>
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
          <div v-if="hashTagError" class="hashtag-error-message">
            {{ hashTagError }}
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

  <Popup401 v-if="show401Popup" />

</template>


<script>
import store from '@/store/store';
import axios from 'axios';
import ClubRoomModal from './ClubRoomModal.vue';
import CategoryModal from './CategoryModal.vue';
import UpdateSuccessPopup from './UpdateSuccessPopup.vue';
import Popup401 from '../401Popup.vue';


export default {
  components: {
    ClubRoomModal,
    CategoryModal,
    UpdateSuccessPopup,
    Popup401
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

      hashTagError: '',
      show401Popup: false,
    };
  },
  async created() {
    await this.fetchClubInfo();
    if (this.defaultPhotoUrl) {
      this.file = await this.urlToFile(this.defaultPhotoUrl, 'image.jpg', 'image/jpeg');
    }
  },
  methods: {
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    validateLeaderName() {
      // 특수문자 및 공백을 체크하는 정규식
      const specialCharPattern = /[!@#₩$%^&*()_+\-=\[\]{};':"\\|,.<>/?\s]+/;

      // 이모티콘과 특수문자를 모두 체크하는 정규식, 일단 유니코드 기준으로 체크함
      const emojiPattern = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\u2900-\u2BFF]|[\u3000-\u303F]|[\u1F300-\u1F64F]|[\u1F680-\u1F6FF]/;

      // 입력값이 비어있지 않고, 특수문자와 이모티콘이 없으면 true
      this.isLeaderNameValid = !specialCharPattern.test(this.leaderName) && !emojiPattern.test(this.leaderName);
    },

    validateHashTag(input) {
  if (!input) return true;  // 빈 값은 유효

  // 특수문자 포함 여부 검사
  const specialCharPattern = /[^a-zA-Z가-힣]/;
  if (specialCharPattern.test(input)) {
    return false; // 특수문자 포함 시 false 반환
  }

  // 한글 패턴 (1~3자)
  const koreanPattern = /^[가-힣]{1,3}$/;
  // 영문 대문자 패턴 (1~3자)
  const upperPattern = /^[A-Z]{1,3}$/;
  // 영문 소문자 패턴 (1~6자)
  const lowerPattern = /^[a-z]{1,6}$/;

  // 섞인 경우 (소문자 + 대문자/한글 → 3자 이하만 허용)
  const mixedPattern = /^[a-zA-Z가-힣]{1,3}$/;

  return (
    koreanPattern.test(input) ||
    upperPattern.test(input) ||
    lowerPattern.test(input) ||
    mixedPattern.test(input) // 섞인 경우 최대 3자 제한
  );
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
      const clubUUID = store.state.clubUUID;

      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/info`, {
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
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
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
      const clubUUID = store.state.clubUUID;

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

        // 사용자가 새로운 이미지를 선택했는지 판단하는 플래그
        let userSelectedNewImage = false;

        // onFileChange 메소드가 호출되어 사용자가 실제로 새 파일을 선택한 경우에만 true로 설정
        if (this.$refs.fileInput && this.$refs.fileInput.files && this.$refs.fileInput.files.length > 0) {
          userSelectedNewImage = true;
        }

        // 사용자가 새 이미지를 선택한 경우에만 mainPhoto를 추가
        if (userSelectedNewImage) {
          formData.append("mainPhoto", this.file);
          console.log('새 이미지가 첨부되어 mainPhoto를 formData에 추가합니다:', this.file.name);
        } else {
          console.log('새 이미지가 첨부되지 않아 mainPhoto를 formData에 추가하지 않습니다.');
        }

        // FormData 내용을 콘솔에 출력
        console.log('FormData에 포함된 항목들:');
        for (let pair of formData.entries()) {
          if (pair[0] === 'clubInfoRequest') {
            console.log(pair[0] + ': ', JSON.parse(await pair[1].text()));
          } else {
            console.log(pair[0] + ': ', pair[1]);
          }
        }

        const response = await axios.put(
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/info`,
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
        this.$store.dispatch('triggerSidebarUpdate');

        if (userSelectedNewImage && response.data.data.presignedUrl) {
          this.presignedUrl = response.data.data.presignedUrl;
          await this.uploadFile();
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating profile:', error);
          if (error.response && error.response.data) {
            const errorMessages = Object.values(error.response.data).join('\n');
            alert(`${errorMessages}`);
          } else {
            alert('서버 오류가 발생했습니다.');
          }
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
        if (!this.handle401Error(error)) {
          console.error('파일 업로드 실패:', error);
          alert('파일 업로드 실패!');
        }
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
// 파일 형식 & 크기 검증
    validateFile(file) {
      const validTypes = ['image/jpeg', 'image/png']; // JPG, PNG 형식의 파일만 허용
      const maxSize = 10 * 1024 * 1024; // 크기 최대 10MB까지만 허용

      if (!validTypes.includes(file.type)) {
        alert('지원하지 않는 파일 형식입니다. JPG 또는 PNG 파일을 선택해주세요.');
        return false;
      }

      if (file.size > maxSize) {
        alert('파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.');
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
      if (!tag) return;

      if (this.hashtags.length >= 2) {
        this.hashTagError = '*해시태그는 최대 2개까지만 입력 가능합니다.';
        return;
      }

      if (!this.validateHashTag(tag)) {
        this.hashTagError = '*해시태그 입력 형식이 잘못되었습니다.';
        return;
      }

      if (this.hashtags.includes(tag)) {
        this.hashTagError = '*이미 존재하는 해시태그입니다.';
        return;
      }

      this.hashtags.push(tag);
      this.hashTagInput = '';
      this.hashTagError = '';
      this.isHashTagValid = true;
    },

    // 해시태그 입력 감시
    watchHashTagInput() {
      this.isHashTagValid = this.validateHashTag(this.hashTagInput);
      if (this.isHashTagValid) {
        this.hashTagError = '';
      } else {
        this.hashTagError = '*해시태그 입력 형식이 잘못되었습니다.';
      }
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
/* ========== 공통 레이아웃 ========== */
.profile-edit-container {
  text-align: center;
  position: relative;
  padding: 0 16px; /* 좌우 여백 */
}

.title {
  font-size: 20px;
  font-weight: 600;
  max-width: 980px;        /* 유동폭 */
  width: 100%;
  margin: 0 auto;
  padding: 0 8px;
}

.profile-title {
  text-align: left;
  font-size: 20px;
  font-weight: 600;
}

/* 카드(이미지 + 폼) */
.profile-edit {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  border-radius: 12px;
  margin: 20px auto 0;
  max-width: 980px;        /* 유동폭 */
  width: 100%;
  box-sizing: border-box;
}

/* ========== 좌측: 이미지 영역 ========== */
.image-container {
  position: relative;
  flex: 0 0 270px; /* 데스크탑 기본 너비 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  width: 100%;
  max-width: 270px;
  height: auto;
  border-radius: 8px;
  display: block;
}

.edit-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  transform: none;
  cursor: pointer;
}

.edit-icon img {
  width: 30px;
  height: 30px;
}

/* 구분선 */
.vertical-line {
  width: 0;
  border: 1px solid #CACACA;
  margin: 0 8px;
  align-self: stretch; /* 이미지 높이에 맞추기 */
}

/* ========== 우측: 폼 영역 ========== */
.form-container {
  flex: 1 1 auto;
  min-width: 0; /* overflow 방지 */
}

/* 레이블/입력 그리드 통일: 데스크탑은 2열, 모바일은 1열 */
.form-group {
  display: grid;
  grid-template-columns: 110px 1fr; /* 레이블 고정 + 입력 유동 */
  align-items: center;
  gap: 10px 12px;
  margin-bottom: 18px;
  min-height: 42px;
}

label {
  color: #5A5A5A;
  font-family: Pretendard, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  text-align: left;
}

.label-container {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.required {
  position: absolute;
  top: -6px;
  left: -6px;
  color: #FF2E2E;
  font-size: 15px;
  line-height: 1;
}

.club-name-input,
.standard-input {
  width: 100%;
  height: 42px;
  padding: 12px;
  border: 0.5px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  color: #5A5A5A;
  font-weight: 400;
  letter-spacing: -0.3px;
  box-sizing: border-box;
}

.club-name-input {
  background-color: #f9f9f9;
}
.club-name-input:focus,
.standard-input:focus {
  border-color: #FFC700;
  outline: none;
}

/* 에러 */
.standard-input.error { border-color: #FF2E2E; }
.error-message,
.hashtag-error-message {
  grid-column: 2 / -1; /* 입력칸 아래로 */
  color: #FF2E2E;
  font-size: 10px;
  text-align: left;
  padding-left: 4px;
  margin-top: 4px;
}

/* 입력칸을 감싸는 컨테이너(에러 메시지를 아래에 놓기 좋음) */
.input-container { display: flex; flex-direction: column; }

/* ========== 방/카테고리 선택 ========== */
.room-select-container,
.category-select-container {
  display: grid;
  grid-template-columns: auto 1fr; /* 버튼 + 읽기전용 입력 */
  gap: 10px;
}

.room-select-button,
.category-select-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  height: 42px;
  font-size: 13px;
  color: #5A5A5A;
  white-space: nowrap;
}

.room-select-button:hover,
.category-select-button:hover {
  border-color: #FFC700;
  border-width: 1.5px;
}

.room-select-button .map-pin,
.category-select-button .category-pin {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.room-select-button .map-pin {
  background-image: url('@/assets/map-pin.svg');
}
.category-select-button .category-pin {
  background-image: url('@/assets/category.svg');
}

/* 읽기전용 입력 */
.room-select-container .standard-input,
.category-select-container .standard-input {
  background-color: #f9f9f9;
  font-size: 12px;
}

/* ========== 해시태그/카테고리 태그 뱃지 ========== */
.hashtags-display,
.categories-display {
  grid-column: 2 / -1; /* 레이블 영역을 제외하고 입력열에 붙이기 */
  margin-top: -6px;
  margin-bottom: 6px;
}

.hashtags-wrapper,
.categories-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.hashtag-item,
.category-item {
  display: inline-flex;
  align-items: center;
  background: #F2F2F2;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #353535;
  gap: 6px;
}

.remove-tag,
.remove-category {
  cursor: pointer;
  font-size: 16px;
  color: #828282;
  line-height: 1;
}
.remove-tag:hover,
.remove-category:hover { color: #5A5A5A; }

/* ========== 버튼 ========== */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

button {
  min-width: 124px;
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: #FFB052;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
button.update-button:hover { background-color: #e6953e; }
button:disabled,
button.disabled {
  background: #CCCCCC;
  cursor: not-allowed;
  opacity: 0.7;
}

/* ========== 브레이크포인트 ========== */
/* 태블릿 (≤ 1024px): 좌우 여백 줄이고 이미지 영역 살짝 축소 */
@media (max-width: 1024px) {
  .profile-edit { padding: 16px; }
  .image-container { flex-basis: 220px; }
}

/* 모바일 큰 화면 (≤ 900px): 이미지 위, 폼 아래로 세로 스택 */
@media (max-width: 900px) {
  .profile-edit {
    flex-direction: column;
    align-items: stretch;
  }
  .image-container {
    flex-basis: auto;
    max-width: 420px;
    margin: 0 auto;
  }
  .vertical-line { display: none; } /* 구분선 숨김 */
  .form-group {
    grid-template-columns: 1fr; /* 레이블 위, 입력 아래 */
  }
  label { margin-bottom: 4px; }
  .hashtags-display,
  .categories-display,
  .error-message,
  .hashtag-error-message { grid-column: 1 / -1; }
  .room-select-container,
  .category-select-container { grid-template-columns: 1fr; }
  .button-container { justify-content: center; } /* 수정 버튼 가운데 */
}

/* 모바일 작은 화면 (≤ 600px): 폰트/패딩 더 압축 */
@media (max-width: 600px) {
  .profile-edit { padding: 14px; border-radius: 10px; }
  .club-name-input,
  .standard-input { font-size: 11px; height: 40px; }
  .room-select-button,
  .category-select-button,
  button { height: 40px; font-size: 14px; }
  .title { padding: 0 4px; }
}

/* 초소형 (≤ 400px): 버튼/여백 최소화 */
@media (max-width: 400px) {
  .profile-edit { padding: 12px; }
  .image-container { max-width: 100%; }
  .hashtags-wrapper,
  .categories-wrapper { gap: 6px; }
}
</style>