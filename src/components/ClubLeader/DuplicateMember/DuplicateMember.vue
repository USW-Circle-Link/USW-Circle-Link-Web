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
/* ===== 공통 컨테이너: 고정폭 제거 + 유동폭 ===== */
.duplicate-container {
  max-width: 1200px;
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 0 16px; /* 좌우 여백 */
  box-sizing: border-box;
}

.title { margin-bottom: 20px; }
.duplicate-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.duplicate-subtitle {
  color: #ff0000; font-size: 14px; font-weight: 350;
}

/* ===== 폼 카드 ===== */
.form-container {
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  border-radius: 8px;
  margin-top: 20px;
  position: relative;
  width: 100%;            /* 고정폭 제거 */
  box-sizing: border-box;
}

.form-content-wrapper { display: flex; flex-direction: column; align-items: flex-start; }

/* 입력 그룹 배치: 큰 화면은 가로, 작은 화면은 세로 */
.form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

/* 라벨 + 인풋 묶음 */
.input-group {
  display: grid;
  grid-template-columns: auto 1fr; /* 라벨 고정 + 인풋 유동 */
  align-items: center;
  gap: 8px;
  min-width: 220px;
}

.input-group label { white-space: nowrap; font-weight: 500; }

.input-group input {
  width: clamp(160px, 22vw, 260px); /* 화면에 따라 유동 */
  height: 42px;
  padding-left: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.input-group.phone-number input { width: clamp(185px, 26vw, 320px); }

.error-input { border-color: #ff0000; }

.error-text {
  margin-top: 16px; margin-bottom: -5px; padding-left: 2px;
  color: #ff3535; font-size: 12px; font-weight: 400;
}

/* 추가 버튼 */
.add-button {
  padding: 0 16px;
  background: #ffb052;
  border: none; border-radius: 4px; color: #fff;
  font-size: 14px; cursor: pointer;
  display: inline-flex; align-items: center; height: 42px;
  white-space: nowrap;
}
.add-button:hover { background: #e6953e; border-color: #f39a30; border-width: 1.5px; }
.add-button.disabled { opacity: .5; cursor: not-allowed; }
.add-icon { margin-right: 5px; transform: translateY(-1px); }

/* ===== 중복 목록 섹션 ===== */
.duplicate-list-section {
  margin-top: 32px;       /* 고정 145px 삭제 */
  width: 100%;
}

.duplicate-list-header { margin-bottom: 10px; }
.header-content { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }

.duplicate-list-title {
  font-size: 16px; font-weight: 600; color: #000;
  margin: 0; display: flex; align-items: center; gap: 8px;
}
.member-count { font-size: 14px; color: #666; font-weight: 400; }

.list-subtitle {
  color: #ff3535; font-size: 14px; font-weight: 400; letter-spacing: -0.35px;
}

.member-list-wrapper {
  max-height: 290px; overflow-y: auto;
  border-radius: 8px; background: #f0f2f5;
}

/* 리스트 아이템: 큰 화면은 가로 정렬, 좁아지면 자동 줄바꿈 */
.member-list { display: flex; flex-direction: column; gap: 8px; }
.member-item { background: #fff; border-radius: 8px; padding: 10px 0; }
.member-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;       /* 이름 / 학번 / 전화 */
  gap: 12px;
  align-items: center;
  padding: 0 14px;
  min-height: 24px;
}

.info-cell {
  color: #000; font-size: 14px; text-align: center;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* 기존 고정폭(260px) 제거 -> 유동 */
.info-cell.name1    { min-width: 140px; }
.info-cell.student-id,
.info-cell.phone1   { min-width: 140px; }

/* 스크롤바 */
.member-list-wrapper::-webkit-scrollbar { width: 8px; }
.member-list-wrapper::-webkit-scrollbar-track { background: transparent; }
.member-list-wrapper::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 4px; }
.member-list-wrapper::-webkit-scrollbar-thumb:hover { background: #adb5bd; }

/* ===== 브레이크포인트 ===== */
/* 1024↓: 버튼을 다음 줄로 밀어도 자연스럽게 */
@media (max-width: 1024px) {
  .form-content {
    grid-auto-flow: row;              /* 입력칸들이 줄바꿈 */
    grid-auto-rows: max-content;
  }
}

/* 768↓: 입력그룹을 세로 스택, 목록은 2열 카드처럼 */
@media (max-width: 768px) {
  .input-group {
    grid-template-columns: 1fr;       /* 라벨 위, 인풋 아래 */
  }
  .input-group input { width: 100%; }
  .add-button { width: 100%; justify-content: center; }

  .member-info {
    grid-template-columns: 1fr 1fr;   /* 이름/전화 한 줄, 학번 아래 */
    grid-template-areas:
      "name1 phone1"
      "student-id student-id";
  }
  .info-cell.name1      { grid-area: name1; }
  .info-cell.phone1     { grid-area: phone1; text-align: right; }
  .info-cell.student-id { grid-area: student-id; }
}

/* 480↓: 완전 세로 스택 */
@media (max-width: 480px) {
  .member-info {
    grid-template-columns: 1fr;
    grid-template-areas:
      "name1"
      "student-id"
      "phone1";
    row-gap: 4px;
  }
  .info-cell { text-align: left; }
}

</style>
