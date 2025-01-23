<template>
  <div class="duplicate-container">
    <h2 class="duplicate-title">중복되는 동아리 회원 추가</h2>
    <p class="duplicate-subtitle">동아리 회원을 추가할 때 중복되었던 회원을 추가해주세요.</p>

    <div class="form-container">
      <div class="form-content-wrapper">
        <div class="form-content">
          <div class="input-group">
            <label>학번</label>
            <input
                type="text"
                v-model="studentId"
                placeholder="숫자 8자리"
                :class="{'error-input': showError}"
                @input="validateForm"
            />
          </div>

          <div class="input-group phone-number">
            <label>전화번호</label>
            <input
                type="text"
                v-model="phoneNumber"
                placeholder="- 제외 11자리 숫자"
                :class="{'error-input': showError}"
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
          * 학번, 전화번호를 다시 확인해주세요. (학번: 8자리 숫자, 전화번호 - 제외 11자리 숫자)
        </p>
      </div>
    </div>

    <!-- Confirmation Popup -->
    <AddPopup
        v-if="showPopup"
        :studentId="studentId"
        :phoneNumber="phoneNumber"
        @confirm="confirmAdd"
        @cancel="cancelAdd"
    />

    <!-- Success/Fail Popup -->
    <SuccessFailPopup
        v-if="showResultPopup"
        :isSuccess="isSuccess"
        @close="closeResultPopup"
    />
  </div>
</template>

<script>
import AddPopup from './AddPopup.vue'
import SuccessFailPopup from './SuccessFailPopup.vue'

export default {
  name: 'DuplicateMember',
  components: {
    AddPopup,
    SuccessFailPopup
  },
  data() {
    return {
      studentId: '',
      phoneNumber: '',
      showPopup: false,
      showError: false,
      isFormValid: false,
      showResultPopup: false,
      isSuccess: false
    }
  },
  methods: {
    validateForm() {
      const studentIdValid = /^\d{8}$/.test(this.studentId)
      const phoneNumberValid = /^\d{11}$/.test(this.phoneNumber)

      this.showError = (this.studentId && !studentIdValid) || (this.phoneNumber && !phoneNumberValid)
      this.isFormValid = studentIdValid && phoneNumberValid
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
      } catch (error) {
        console.error('Error adding member:', error)
        this.isSuccess = false
      }
      this.showPopup = false
      this.showResultPopup = true
    },
    cancelAdd() {
      this.showPopup = false
    },
    async sendToServer() {
      // Implement your API call here
      const data = {
        studentId: this.studentId,
        phoneNumber: this.phoneNumber
      }
      // Example API call
      // await axios.post('/api/members', data)
    },
    closeResultPopup() {
      this.showResultPopup = false
      if (this.isSuccess) {
        this.resetForm()
      }
    },
    resetForm() {
      this.studentId = ''
      this.phoneNumber = ''
      this.showError = false
      this.isFormValid = false
    }
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
  justify-content: flex-start; /* Align items to the start horizontally */
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
  gap: 50px;
  padding-left: 50px;
}

.form-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 0px;
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
  width: 146px;
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
  width: 200px; /* Adjust the width as needed */
}

.error-input {
  border-color: #FF0000;
}

.error-text {
  margin-top: 16px;
  margin-bottom: -5px;
  padding-left: 50px;
  color: #FF3535;
  font-family: Pretendard;
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
</style>