<template>
  <h2>동아리 추가</h2>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="id">아이디</label>
        <input type="text" id="id" v-model="id" placeholder="아이디" required />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="비밀번호 확인" required />
      </div>

      <div class="form-group">
        <label for="clubName">동아리명</label>
        <input type="text" id="clubName" v-model="clubName" placeholder="동아리명" required />
      </div>

      <div class="form-group">
        <label for="department">분과</label>
        <select id="department" v-model="department" required>
          <option value="" disabled selected>분과</option>
          <option value="ACADEMIC">학술</option>
          <option value="RELIGION">종교</option>
          <option value="ART">예술</option>
          <option value="SPORT">체육</option>
          <option value="SHOW">공연</option>
          <option value="VOLUNTEER">봉사</option>
          <!-- Add more options here -->
        </select>
      </div>

      <div class="popupbtn" @click="openPopup()">추가하기</div>
      <!-- 팝업창 -->
      <div v-if="isPopupVisible" class="popup-overlay">
        <div class="popup">
          <h3>동아리 추가</h3>
          <p>‘{{ clubName }}’(을)를 추가하시겠습니까?</p>
          <input
              type="password"
              placeholder="관리자 비밀번호를 입력해 주세요."
              v-model="adminPw "
          />
          <div class="buttons">
            <button @click="cancelDelete">취소</button>
            <button type="submit">추가</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      id: '',
      password: '',
      confirmPassword: '',
      clubName: '',
      department: '',
      isPopupVisible: false, // 팝업의 표시 여부
      adminPw: '', // 입력된 비밀번호
    };
  },
  methods: {
    openPopup() {
      this.isPopupVisible = true; // 팝업 열기
    },
    cancelDelete() {
      this.isPopupVisible = false; // 팝업 닫기
      this.password = ''; // 비밀번호 초기화
    },
    confirmDelete() {
      if (this.password === 'your_password') { // 실제 비밀번호 확인 로직 필요
        alert('삭제 완료');
        this.isPopupVisible = false;
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    },
    async submitForm() {
      // Handle form submission
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const formData = {
        leaderAccount: this.id,
        leaderPw: this.password,
        leaderPwConfirm: this.password,
        clubName: this.clubName,
        department: this.department,
        adminPw: this.adminPw
      };
      console.log('Form Submitted:', formData);
      // You can add more form submission logic here
      try {
        const response = await axios.post('http://15.164.246.244:8080/admin/clubs', formData, {
          headers: {
            'admin_Id': '1' // 커스텀 헤더 추가
          }
        });
        console.log('Form Submitted Successfully:', response.data);
        alert('Form Submitted Successfully');
        // Clear the form after successful submission
        this.clearForm();
        this.isPopupVisible = false; // 팝업 닫기
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('동아리 추가에 실패했습니다.');
      }
    },
    clearForm() {
      this.id = '';
      this.password = '';
      this.confirmPassword = '';
      this.clubName = '';
      this.department = '';
      this.adminPw = '';
    }
  }
};
</script>

<style scoped>
.form-container {
  width: 860px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  height: 440px;
}

h2 {
  text-align: left;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popupbtn{
  margin-left: 91%;
  margin-top: 60px;
  width: 60px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #FFC700;
  color: #ffffff;
}

.popupbtn:hover {
  background-color: #e6b800;
}
 .popup-overlay {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
 }

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

h3 {
  margin: 0 0 10px;
}

input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.popup-overlay button{
  margin-top: 20px;
  width: 100px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-overlay button.delete-button {
  background-color: #ffc107;
  color: white;
}

</style>