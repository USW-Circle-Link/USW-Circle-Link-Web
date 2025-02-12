<template>
  <div class="duplicate-container">
    <h2 class="duplicate-title">중복되는 동아리 회원 추가</h2>
    <p class="duplicate-subtitle">동아리 회원을 추가할 때 중복되었던 회원을 추가해주세요.</p>

    <div class="form-container">
      <div class="form-content-wrapper">
        <div class="form-content">
          <div class="input-group">
            <label>이름</label>
            <input
                type="text"
                v-model="name"
                placeholder="이름 입력"
                :class="{'error-input': nameError}"
                @input="validateForm"
            />
          </div>

          <div class="input-group">
            <label>학번</label>
            <input
                type="text"
                v-model="studentId"
                placeholder="숫자 8자리"
                :class="{'error-input': studentIdError}"
                @input="validateForm"
            />
          </div>

          <div class="input-group phone-number">
            <label>전화번호</label>
            <input
                type="text"
                v-model="phoneNumber"
                placeholder="- 제외 11자리 숫자"
                :class="{'error-input': phoneNumberError}"
                @input="validateForm"
            />
          </div>

          <button
              @click="handleAddMember"
              class="add-button"
              :disabled="!isFormValid"
              :class="{ 'disabled': !isFormValid }"
          >
            <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#FFFFFF" d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/>
            </svg> 동아리 회원 추가
          </button>
        </div>

        <p v-if="showError" class="error-text">
          * 입력 정보를 다시 확인해주세요. (이름: 특수기호 제외, 학번: 8자리 숫자, 전화번호: - 제외 11자리 숫자)
        </p>
      </div>
    </div>


    <!-- 중복 회원 목록 섹션 수정 -->
    <div v-if="hasOverlappingMembers" class="duplicate-list-section">
      <div class="duplicate-list-header">
        <div class="header-content">
          <h3 class="duplicate-list-title">
            조회된 중복회원 목록
            <span class="member-count">총 {{ overlappingMembersCount }}명</span>
          </h3>
          <p class="list-subtitle">현재 페이지를 벗어나시면 하단 목록을 다시 확인하실 수 없습니다.</p>
        </div>
      </div>
      <div class="member-list-wrapper">
        <div class="member-list">
          <div v-for="(member, index) in OverlappingMembers" :key="index" class="member-item">
            <div class="member-info">
              <span class="info-cell name1">{{ member.userName }}</span>
              <span class="info-cell student-id">{{ member.studentNumber }}</span>
              <span class="info-cell phone1">{{ formatPhoneNumber(member.userHp) }}</span>
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
  </div>
</template>


<script>
import store from '@/store/store';
import AddPopup from './AddPopup.vue'
import SuccessFailPopup from './SuccessFailPopup.vue'
import axios from 'axios'

import { mapState } from "vuex";
export default {
  name: 'DuplicateMember',
  components: {
    AddPopup,
    SuccessFailPopup,
  },
  computed: {
    ...mapState(["OverlappingMembers"]),
    hasOverlappingMembers() {
      return this.OverlappingMembers && this.OverlappingMembers.length > 0;
    },
    overlappingMembersCount() {
      return this.OverlappingMembers ? this.OverlappingMembers.length : 0;
    }
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
      }
  },
  mounted() {
    // 새로고침 시 localStorage에서 데이터 불러오기
    const savedMembers = localStorage.getItem("saveDuplicateMember");
    if (savedMembers) {
      this.OverlappingMembers = JSON.parse(savedMembers);
    }
    console.log("전달받은 회원 데이터:", this.OverlappingMembers);
  },
  methods: {
    saveDuplicateMember() {
      localStorage.setItem("saveDuplicateMember", JSON.stringify(this.OverlappingMembers));
    },
    validateForm() {
      const nameValid = /^[가-힣a-zA-Z\s]+$/.test(this.name) && this.name.trim() !== ''
      const studentIdValid = /^\d{8}$/.test(this.studentId)
      const phoneNumberValid = /^\d{11}$/.test(this.phoneNumber)

      this.nameError = (this.name && !nameValid)
      this.studentIdError = (this.studentId && !studentIdValid)
      this.phoneNumberError = (this.phoneNumber && !phoneNumberValid)

      this.showError = this.nameError || this.studentIdError || this.phoneNumberError
      this.isFormValid = nameValid && studentIdValid && phoneNumberValid
    },
    handleAddMember() {
      if (this.isFormValid) {
        this.showPopup = true
      }
    },
    async confirmAdd() {
      try {
        await this.sendToServer()
        this.isSuccess = true
        this.serverMessage = '해당 회원의 추가가 정상적으로 처리되었습니다.'
      } catch (error) {
        console.error('Error adding member:', error)
        this.isSuccess = false
        // Extract error message from the server response
        if (error.response && error.response.data && error.response.data.message) {
          this.serverMessage = error.response.data.message
        } else {
          this.serverMessage = '서버 오류가 발생했습니다. 다시 시도해주세요.'
        }
      }
      this.showPopup = false
      this.showResultPopup = true
    },
    cancelAdd() {
      this.showPopup = false
    },
    async sendToServer() {
      const data = {
        userName: this.name,
        studentNumber: this.studentId,
        userHp: this.phoneNumber
      };

      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.post(
            `http://15.164.246.244:8080/club-leader/${clubId}/members/duplicate-profiles`,
            data,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              }
            }
        );
        console.log('서버 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error('서버 에러 응답:', error);
        throw error;
      }
    },
    closeResultPopup() {
      this.showResultPopup = false
      if (this.isSuccess) {
        this.resetForm()
      }
    },
    resetForm() {
      this.name = ''
      this.studentId = ''
      this.phoneNumber = ''
      this.showError = false
      this.nameError = false
      this.studentIdError = false
      this.phoneNumberError = false
      this.isFormValid = false
    },
    formatPhoneNumber(phone) {
      if (!phone) return '';
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    },
  }
}
</script>
<style scoped>

.duplicate-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.duplicate-subtitle {
  color: #FF0000;
  font-size: 14px;
  margin-bottom: 20px;
  font-style: normal;
  font-weight: 350;
}

.form-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 820px;
  border-radius: 8px;
  margin: 20px auto 0 auto;
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
  border-color: #FF0000;
}

.error-text {
  margin-top: 16px;
  margin-bottom: -5px;
  padding-left: 50px;
  color: #FF3535;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.add-button {
  padding: 16px;
  background-color: #FFB052;
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
  margin-top: 165px;
  width: 820px;
}

.duplicate-list-header {
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
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
  color: #FF0000;
  font-size: 14px;
  margin: 8px 0 0 0;
}

.member-list-wrapper {
  max-height: 290px;
  overflow-y: auto;
  border-radius: 8px;
  background: #F0F2F5;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  background: #FFFFFF;
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
  background: #CED4DA;
  border-radius: 4px;
}

.member-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #ADB5BD;
}
</style>