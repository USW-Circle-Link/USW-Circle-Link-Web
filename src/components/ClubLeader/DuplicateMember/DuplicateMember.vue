<template>
  <div class="duplicate-container">
    <div class="title">
      <h2 class="duplicate-title">프로필 중복 회원 추가</h2>
      <p class="duplicate-subtitle">
        동아리 회원을 추가할 때 중복되었던 회원을 추가해주세요.
      </p>
    </div>

    <div class="form-container">
      <div class="form-content-wrapper">
        <div class="form-content">
          <div class="input-group">
            <label>이름</label>
            <input
              type="text"
              v-model="name"
              placeholder="이름 입력"
              :class="{ 'error-input': nameError }"
              @input="validateForm"
            />
          </div>
          <!-- test git merge -->
          <div class="input-group">
            <label>학번</label>
            <input
              type="text"
              v-model="studentId"
              placeholder="숫자 8자리"
              :class="{ 'error-input': studentIdError }"
              @input="validateForm"
            />
          </div>

          <div class="input-group phone-number">
            <label>전화번호</label>
            <input
              type="text"
              v-model="phoneNumber"
              placeholder="- 제외 11자리 숫자"
              :class="{ 'error-input': phoneNumberError }"
              @input="validateForm"
            />
          </div>

          <button
            @click="handleAddMember"
            class="add-button"
            :disabled="!isFormValid"
            :class="{ disabled: !isFormValid }"
          >
            <svg
              class="add-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="#FFFFFF" d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
            동아리 회원 추가
          </button>
        </div>

        <p v-if="showError" class="error-text">
          * 입력 정보를 다시 확인해주세요. (이름:숫자 특수기호 제외, 학번: 8자리
          숫자, 전화번호: - 제외 11자리 숫자)
        </p>
      </div>
    </div>

    <!-- 중복 회원 목록 섹션 수정 -->
    <div v-if="hasOverlappingMembers" class="duplicate-list-section">
      <div class="duplicate-list-header">
        <div class="header-content">
          <h3 class="duplicate-list-title">
            조회된 프로필 중복 회원 목록
            <span class="member-count">총 {{ overlappingMembersCount }}명</span>
          </h3>
          <p class="list-subtitle">
            현재 페이지를 벗어나시면 하단 목록을 다시 확인하실 수 없습니다.
          </p>
        </div>
      </div>
      <div class="member-list-wrapper">
        <div class="member-list">
          <div
            v-for="(member, index) in OverlappingMembers"
            :key="index"
            class="member-item"
          >
            <div class="member-info">
              <span class="info-cell name1">{{ member.userName }}</span>
              <span class="info-cell student-id">{{
                member.studentNumber
              }}</span>
              <span class="info-cell phone1">{{
                formatPhoneNumber(member.userHp)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Popup -->
    <AddPopup
      v-if="showPopup"
      :name="name"
      :studentId="studentId"
      :phoneNumber="phoneNumber"
      @confirm="confirmAdd"
      @cancel="cancelAdd"
    />

    <!-- Success/Fail Popup -->
    <SuccessFailPopup
      v-if="showResultPopup"
      :isSuccess="isSuccess"
      :serverMessage="serverMessage"
      @close="closeResultPopup"
    />

    <Popup401 v-if="show401Popup" />
  </div>
</template>

<script>
import store from '@/store/store';
import AddPopup from './AddPopup.vue';
import SuccessFailPopup from './SuccessFailPopup.vue';
import axios from 'axios';
import Popup401 from '../401Popup.vue';

import { mapState } from 'vuex';
export default {
  name: 'DuplicateMember',
  components: {
    AddPopup,
    SuccessFailPopup,
    Popup401,
  },
  computed: {
    ...mapState(['OverlappingMembers']),
    hasOverlappingMembers() {
      return this.OverlappingMembers && this.OverlappingMembers.length > 0;
    },
    overlappingMembersCount() {
      return this.OverlappingMembers ? this.OverlappingMembers.length : 0;
    },
  },
  data() {
    return {
      name: '',
      studentId: '',
      phoneNumber: '',
      showPopup: false,
      showError: false,
      isFormValid: false,
      showResultPopup: false,
      isSuccess: false,
      nameError: false,
      studentIdError: false,
      phoneNumberError: false,
      serverMessage: '',
      DuplicateMember: [],
      show401Popup: false,
    };
  },
  mounted() {
    // 새로고침 시 localStorage에서 데이터 불러오기
    const savedMembers = localStorage.getItem('saveDuplicateMember');
    if (savedMembers) {
      this.OverlappingMembers = JSON.parse(savedMembers);
    }
    console.log('전달받은 회원 데이터:', this.OverlappingMembers);
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    saveDuplicateMember() {
      localStorage.setItem(
        'saveDuplicateMember',
        JSON.stringify(this.OverlappingMembers)
      );
    },
    validateForm() {
      const nameValid =
        /^[가-힣a-zA-Z\s]+$/.test(this.name) && this.name.trim() !== '';
      const studentIdValid = /^\d{8}$/.test(this.studentId);
      const phoneNumberValid = /^\d{11}$/.test(this.phoneNumber);

      this.nameError = this.name && !nameValid;
      this.studentIdError = this.studentId && !studentIdValid;
      this.phoneNumberError = this.phoneNumber && !phoneNumberValid;

      this.showError =
        this.nameError || this.studentIdError || this.phoneNumberError;
      this.isFormValid = nameValid && studentIdValid && phoneNumberValid;
    },
    handleAddMember() {
      if (this.isFormValid) {
        this.showPopup = true;
      }
    },
    async confirmAdd() {
      try {
        await this.sendToServer();
        this.isSuccess = true;
        this.serverMessage = '해당 회원의 추가가 정상적으로 처리되었습니다.';
      } catch (error) {
        console.error('Error adding member:', error);
        this.isSuccess = false;
        // Extract error message from the server response
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.serverMessage = error.response.data.message;
        } else {
          this.serverMessage = '서버 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
      this.showPopup = false;
      this.showResultPopup = true;
    },
    cancelAdd() {
      this.showPopup = false;
    },
    async sendToServer() {
      const data = {
        userName: this.name,
        studentNumber: this.studentId,
        userHp: this.phoneNumber,
      };

      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        const response = await axios.post(
          `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/duplicate-profiles`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('서버 응답:', response.data);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.show401Popup = true;
        } else if (
          error.response &&
          (error.response.status === 400 || error.response.status === 404)
        ) {
          this.isSuccess = false;
          this.serverMessage =
            error.response.data.message || '요청 처리 중 오류가 발생했습니다.';
          this.showResultPopup = true;
        }
        throw error;
      }
    },
    closeResultPopup() {
      this.showResultPopup = false;
      if (this.isSuccess) {
        this.resetForm();
      }
    },
    resetForm() {
      this.name = '';
      this.studentId = '';
      this.phoneNumber = '';
      this.showError = false;
      this.nameError = false;
      this.studentIdError = false;
      this.phoneNumberError = false;
      this.isFormValid = false;
    },
    formatPhoneNumber(phone) {
      if (!phone) return '';
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    },
  },
};
</script>


<style scoped>
/* ===== 전체 컨테이너 ===== */
.duplicate-container {
  max-width: 1200px;
  width: 90%;
  margin: 0 10% 10% 0;
  padding: 24px;
  box-sizing: border-box;
  --brand-color: #ffb052;
  --brand-color-dark: #e6953e;
  --text-color-primary: #333;
  --text-color-secondary: #666;
  --error-color: #ff3535;
  --border-color: #dee2e6;
  --bg-light: #f0f2f5;
  --bg-white: #fff;
}

/* ===== 상단 타이틀 ===== */
.title {
  margin-bottom: 32px;
}
.duplicate-title {
  font-size: clamp(20px, 2.5vw, 24px); /* 화면 크기에 따라 폰트 크기 조절 */
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text-color-primary);
}
.duplicate-subtitle {
  color: var(--text-color-secondary);
  font-size: 15px;
  margin: 0;
}

/* ===== 입력 폼 카드 ===== */
.form-container {
  background: var(--bg-white);
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  border-radius: 8px;
}
.form-content {
  display: flex; /* Flexbox로 변경하여 유연성 확보 */
  flex-wrap: wrap; /* 화면이 작아지면 자동으로 줄바꿈 */
  gap: 16px;
  align-items: flex-end; /* 하단 정렬 */
}
.input-group {
  display: flex;
  flex-direction: column; /* 라벨과 인풋을 세로로 배치 */
  gap: 6px;
  flex-grow: 1; /* 가능한 공간을 차지하도록 함 */
}
.input-group label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-color-primary);
  text-align: left;
}
.input-group input {
  width: 100%; /* 부모 요소에 너비를 맞춤 */
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
}
.error-input {
  border-color: var(--error-color);
}
.error-text {
  margin-top: 12px;
  color: var(--error-color);
  font-size: 13px;
}

/* 추가 버튼 */
.add-button {
  height: 42px;
  padding: 0 20px;
  background: var(--brand-color);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: background-color 0.2s;
}
.add-button:hover { background: var(--brand-color-dark); }
.add-button.disabled { opacity: .5; cursor: not-allowed; }
.add-icon { margin-right: 6px; }

/* ===== 중복 회원 목록 ===== */
.duplicate-list-section {
  margin-top: 40px;
}
.duplicate-list-header {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.duplicate-list-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.member-count {
  font-size: 16px;
  color: var(--text-color-secondary);
  font-weight: 500;
}
.list-subtitle {
  color: var(--error-color);
  font-size: 14px;
  margin: 0;
}
.member-list-wrapper {
  max-height: 300px;
  overflow-y: auto;
  background: var(--bg-light);
  border-radius: 8px;
  padding: 8px;
}
.member-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.member-item {
  background: var(--bg-white);
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  white-space: nowrap;
}
.member-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3열 구조 유지 */
  gap: 16px;
  align-items: center;
}
.info-cell {
  color: var(--text-color-primary);
  font-size: 15px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-cell.name1 {
  text-align: left; /* 이름은 왼쪽 정렬 */
  font-weight: 500;
}

/* ===== 반응형: 태블릿 (768px 이하) ===== */
@media (max-width: 768px) {
  .form-content {
    flex-direction: column; /* 세로로 쌓기 */
    align-items: stretch; /* 전체 너비 사용 */
  }
  .add-button {
    width: 100%;
    justify-content: center;
  }
  .member-info {
    grid-template-columns: 1fr 1fr; /* 2열 구조로 변경 */
    grid-template-areas:
      "name1     phone1"
      "student-id student-id";
  }
  .info-cell.name1 { grid-area: name1; }
  .info-cell.student-id { grid-area: student-id; text-align: left; color: var(--text-color-secondary); }
  .info-cell.phone1 { grid-area: phone1; text-align: right; }
}

/* ===== 반응형: 모바일 (480px 이하) ===== */
@media (max-width: 480px) {
  .duplicate-container { padding: 16px; }
  .member-info {
    grid-template-columns: 1fr; /* 1열 구조로 변경 */
    grid-template-areas:
      "name1"
      "student-id"
      "phone1";
    gap: 6px;
  }
  .info-cell {
    text-align: left; /* 모든 정보 왼쪽 정렬 */
  }
  .info-cell.phone1 { text-align: left; }
}
</style>