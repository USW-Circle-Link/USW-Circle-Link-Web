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
          * 입력 정보를 다시 확인해주세요. (이름: 특수기호 제외, 학번: 8자리
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
  name: 'DuplicateMember', // 컴포넌트 이름 설정
  components: {
    AddPopup,
    SuccessFailPopup,
    Popup401,
  },
  computed: {
    // 반응형
    ...mapState(['OverlappingMembers']),
    hasOverlappingMembers() {
      //OverlappingMembers 배열이 존재하고 길이가 1 이상이면 true를 return하는 함수
      return this.OverlappingMembers.length > 0;
    },
    overlappingMembersCount() {
      //OverlappingMembers 배열이 존재하면 길이를 return하고, 없으면 0을 return하는 함수
      return this.OverlappingMembers.length;
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
    const savedMembers = localStorage.getItem('saveDuplicateMember'); //
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
      // OverlappingMembers를 localStorage에 저장하는 함수
      localStorage.setItem(
        'saveDuplicateMember',
        JSON.stringify(this.OverlappingMembers) // localStorage에 저장하기 위해 배열을 문자열로 변환
      );
    },

    validateForm() {
      //'동아리 관리자'가 중복 회원 추가 시 기입하는 회원 정보의 양식
      const nameValid =
        /^[가-힣a-zA-Z\s]+$/.test(this.name) && this.name.trim() !== ''; //한글, 영어, 공백 허용
      const studentIdValid = /^\d{8}$/.test(this.studentId); // 8자리 허용
      const phoneNumberValid = /^\d{11}$/.test(this.phoneNumber); // 11자리 허용

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
        if (error.response.code === 401) {
          this.show401Popup = true;
        } else if (
          error.response.code === 'CMEM-202' || // 에러가 CMEM-202 거나
          error.response.code === 'PFL-201' // 에러가 PFL-201 일 때
        ) {
          this.isSuccess = false;

          if (error.response.code === 'CMEM-202') {
            this.serverMessage =
              error.response.data.message ||
              '클럽멤버가 이미 존재합니다. 관리자에게 문의하세요.'; // CMEM-202 error Message
          } else if (error.response.code === 'PFL-201') {
            this.serverMessage =
              error.response.data.message || '프로필이 존재하지 않습니다.'; // PFL-201 error Message
          }

          this.showResultPopup = true;
        }

        throw error;
      }
    },

    closeResultPopup() {
      //
      this.showResultPopup = false;
      if (this.isSuccess) {
        this.resetForm();
      }
    },

    resetForm() {
      // 기입하는 칸을 비우고, 모든 에러 상태를 false로 바꾸는 함수
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
.duplicate-container {
  width: 830px; /* form-container와 동일한 너비 */
  margin: 0 auto; /* 중앙 정렬 */
}

.title {
  margin-bottom: 20px; /* 아래쪽 바깥 여백 */
}

.duplicate-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.duplicate-subtitle {
  color: #ff0000;
  font-size: 14px;
  font-style: normal;
  font-weight: 350;
}

.form-container {
  display: flex;
  justify-content: flex-start; /* 가로 방향 정렬 (왼쪽 정렬) */
  align-items: flex-start; /* 세로 방향 정렬 (위쪽 정렬) */
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 830px;
  border-radius: 8px;
  margin-top: 20px; /* title과의 간격 */
  margin-left: 0; /* 왼쪽 마진 제거 */
  margin-right: 0; /* 오른쪽 마진 제거 */
  position: relative;
}

.form-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding-left: 5px;
}

.form-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 0;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group label {
  white-space: nowrap;
  font-weight: 500;
}

.input-group input {
  display: flex;
  width: 126px;
  height: 42px;
  padding-left: 10px;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
}

.input-group.phone-number input {
  width: 185px;
}

.error-input {
  border-color: #ff0000;
}

.error-text {
  margin-top: 16px;
  margin-bottom: -5px;
  padding-left: 50px;
  color: #ff3535;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.add-button {
  padding: 16px;
  background-color: #ffb052;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 42px;
  white-space: nowrap;
  vertical-align: middle;
}

.add-button:hover {
  background-color: #e6953e; /* Change the background color on hover */
  border-color: #f39a30;
  border-width: 1.5px;
}

.add-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-icon {
  vertical-align: middle;
  margin-right: 5px;
  margin-left: -4px;
  transform: translateY(-1px);
}

.duplicate-list-section {
  margin-top: 145px;
  width: 873px;
}

.duplicate-list-header {
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 26px;
}

.duplicate-list-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-count {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.list-subtitle {
  color: #ff3535;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.35px;
  align-items: center;
}

.member-list-wrapper {
  max-height: 290px;
  overflow-y: auto;
  border-radius: 8px;
  background: #f0f2f5;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 0;
}

.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  height: 24px;
}

.info-cell {
  flex: 1;
  text-align: center;
  color: #000;
  font-size: 14px;
}

.info-cell.name1 {
  flex: 0 0 260px;
}

.info-cell.student-id {
  flex: 0 0 260px;
}

.info-cell.phone1 {
  flex: 0 0 260px;
}

/* 스크롤바 스타일링 */
.member-list-wrapper::-webkit-scrollbar {
  width: 8px;
}

.member-list-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.member-list-wrapper::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 4px;
}

.member-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
