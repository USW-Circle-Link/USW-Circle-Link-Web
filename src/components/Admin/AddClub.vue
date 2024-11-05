<template>
  <div class="title">동아리 추가</div>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="id">아이디</label>
          <input type="text" id="id" v-model="id" placeholder="아이디" required @input="validateId" />
        </div>
        <span v-if="idError" class="error">{{ idError }}</span>
      </div>

      <div class="form-group-col">
        <div class="form-group-row">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호" required @input="validatePassword" />
        </div>
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
      </div>

      <div class="form-group-col">
        <div class="form-group-row">
          <label for="confirmPassword">비밀번호 확인</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="비밀번호 확인" required />
        </div>
        <span v-if="clubNameError" class="error"></span>
      </div>

      <div class="form-group-col">
        <div class="form-group-row">
          <label for="clubName">동아리명</label>
          <input type="text" id="clubName" v-model="clubName" placeholder="동아리명" required @input="validateClubName" />
        </div>
        <span v-if="clubNameError" class="error">{{ clubNameError }}</span>
      </div>

      <div class="form-group">
        <label for="clubName">분과</label>
        <div class="custom-dropdown" @click="toggleDropdown">
          <div class="dropdown-selected">
            {{ selectedOption || '학술' }}
          </div>
          <span class="dropdown-icon">&#9662;</span>
          <ul v-if="isOpen" class="dropdown-options" >
            <li
                v-for="option in options"
                :key="option"
                :class="{ 'dropdown-option-selected': option === selectedOption }"
                @click="selectOption(option)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
      </div>

      <div class="popupbtn" @click="openPopup()">추가하기</div>
      <div v-if="isPopupVisible" class="popup-overlay">
        <div class="popup">
          <h3>동아리 추가</h3>
          <p>‘{{ clubName }}’(을)를 추가하시겠습니까?</p>
          <input
              type="password"
              placeholder="관리자 비밀번호를 입력해 주세요."
              v-model="adminPw"
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
import store from "@/store/store";
export default {
  data() {
    return {
      id: '',
      password: '',
      confirmPassword: '',
      clubName: '',
      department: '',
      isPopupVisible: false,
      adminPw: '',
      idError: '',
      passwordError: '',
      clubNameError: '',
      selectedOption: null,
      options: ['학술', '종교', '예술', '체육', '공연', '봉사'],
      isOpen: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    validateId() {
      const idPattern = /^[a-zA-Z0-9]{5,20}$/;
      if (!idPattern.test(this.id)) {
        this.idError = '* 아이디는 5~20자 이내의 숫자와 문자만 입력 가능합니다.';
      } else {
        this.idError = '';
      }
    },
    validatePassword() {
      const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+]{5,20}$/;
      if (!passwordPattern.test(this.password)) {
        this.passwordError = '* 비밀번호는 5~20자 이내의 숫자, 문자, 특수문자만 입력 가능합니다.';
      } else {
        this.passwordError = '';
      }
    },
    validateClubName() {
      if (this.clubName.length > 10) {
        this.clubNameError = '* 동아리명은 10자 이내로 입력해야 합니다.';
      } else {
        this.clubNameError = '';
      }
    },
    openPopup() {
      this.isPopupVisible = true;
    },
    cancelDelete() {
      this.isPopupVisible = false;
      this.password = '';
    },
    async submitForm() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (this.idError || this.passwordError || this.clubNameError) {
        alert('입력값을 확인해 주세요.');
        return;
      }

      const DepartmentTypeMap = {
        '학술': "ACADEMIC",
        '종교': "RELIGION",
        '예술': "ART",
        '체육': "SPORT",
        '공연': "SHOW",
        '봉사': "VOLUNTEER"
      };
      this.department = DepartmentTypeMap[this.selectedOption] || null;
      console.log(this.department);

      const formData = {
        leaderAccount: this.id,
        leaderPw: this.password,
        leaderPwConfirm: this.password,
        clubName: this.clubName,
        department: this.department,
        adminPw: this.adminPw
      };
      try {
        await axios.post('http://15.164.246.244:8080/admin/clubs', formData, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`
          }
        });
        alert('성공적으로 추가했습니다.');
        this.navigateTo('clublist');
        this.clearForm();
        this.isPopupVisible = false;
      } catch (error) {
        if (error.response) {
          console.error('응답 에러 상태 코드 : ', error.response.status);
        }
        if (error.response.status === 400) {
          alert('동아리 추가에 실패했습니다. 관리자 비밀번호가 틀렸습니다.');
        }
        if (error.response.status === 409) {
          alert('동아리 추가에 실패했습니다. 이미 존재하는 동아리 입니다.');
        }
        if (error.response.status === 422) {
          alert('동아리 추가에 실패했습니다. 이미 존재하는 동아리 회장 아이디 입니다.');
        }
        this.isPopupVisible = false;
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

.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}

.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px; /* 텍스트 아래쪽 위치 조정 */
  width: 13%;
  height: 19px; /* 형광펜 두께 */
  background-color: #FFB052;
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}
.form-container {
  width: 860px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  height: 530px;
}

h2 {
  text-align: left;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
}

.form-group-col {
  width: 100%;
  height: 90px;
  flex-direction: column;
  display: flex;
  align-items: center;
}

.form-group-col span{
  width: 100%;
  margin-left: 45%;
  padding: 0;
}

.form-group-row {
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;
}

input {
  width: 70%;
  align-items: center;
  margin-bottom: 10px;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 20px 25px 20px 25px;
  background-color: #fff;
}

input::placeholder{
  color: #9D9D9D;
  font-size: 16px;
}

label {
  width: 20%;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.popupbtn {
  margin-left: 88%;
  margin-top: 60px;
  width: 60px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #FFC700;
  color: #ffffff;
  font-size: 15px;
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

.custom-dropdown {
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 8px 15px 8px 15px;
  background-color: #fff;
  justify-content: space-between;
  width: 25%;
  cursor: pointer;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  color: #9D9D9D;
}

.dropdown-icon {
  font-size: 24px;
  color: #9D9D9D;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #D7D7D7;
  border-radius: 8px;
  margin-top: 1px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: #9D9D9D;
  z-index: 1;
  padding: 0; /* 기본 padding 제거 */
}

.dropdown-options li {
  padding: 18px 25px 18px 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  list-style: none; /* 점 없애기 */
}

.dropdown-options li:hover {
  background-color: #FFB052;
  border-radius: 0px 0px 0px 0px;
}

.dropdown-options li:first-child:hover {
  background-color: #FFB052;
  border-radius: 8px 8px 0px 0px;
}

.dropdown-options li:last-child:hover {
  background-color: #FFB052;
  border-radius: 0px 0px 8px 8px;
}

.dropdown-option-selected:first-child {
  background-color: #ffa726;
  color: white;
  border-radius: 8px 8px 0px 0px;
}

.dropdown-option-selected:last-child {
  background-color: #ffa726;
  color: white;
  border-radius: 0px 0px 8px 8px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.popup-overlay button {
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

.error {
  color: red;
  font-size: 12px;
}
</style>
```
