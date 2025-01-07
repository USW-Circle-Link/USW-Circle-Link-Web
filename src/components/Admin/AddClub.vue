<template>
  <div class="title">동아리 추가</div>
  <!--  동아리 추가 정보 입력 폼  -->
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <!-- 아이디 -->
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="id">아이디</label>
          <input class="from-input" type="text" id="id" v-model="id" placeholder="아이디" required @input="validateId" />
          <button class="DuplicateCheckbtn" @click="idDuplicateCheck">중복 확인</button>
        </div>
        <span v-if="idError" class="warning">{{ idError }}</span>
      </div>
      <!-- 비밀번호 -->
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="password">비밀번호</label>
          <input class="from-input" type="password" id="password" v-model="password" placeholder="비밀번호" required @input="validatePassword" />
        </div>
        <span v-if="passwordError" class="warning">{{ passwordError }}</span>
      </div>
      <!-- 비밀번호 확인 -->
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="confirmPassword">비밀번호 확인</label>
          <input class="from-input" type="password" id="confirmPassword" v-model="confirmPassword" placeholder="비밀번호 확인" required @input="validateConfirmPassword"/>
        </div>
        <span v-if="confirmPasswordError" class="warning">{{confirmPasswordError}}</span>
      </div>
      <!-- 동아리 이름 -->
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="clubName">동아리 이름</label>
          <input class="from-input" type="text" id="clubName" v-model="clubName" placeholder="동아리명" required @input="validateClubName" />
          <button class="DuplicateCheckbtn" @click="clubNameDuplicateCheck">중복 확인</button>
        </div>
        <span v-if="clubNameError" class="warning">{{ clubNameError }}</span>
      </div>
      <!-- 분과 -->
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
      <!-- 동아리방 -->
      <div class="form-group-col">
        <div class="form-group-row">
          <label for="clubName">동아리방</label>
          <button class="club-room-btn" @click="selectClubRoom">
            <i class="icon mappin"></i>
            동아리방 선택
          </button>
          <input class="club-room" v-model="selectedRoom" readonly>
        </div>
        <span v-if="clubRoomError" class="warning">{{ clubRoomError }}</span>
      </div>
      <div class="popupbtn" @click="openPopup()">추가하기</div>
    </form>

    <div v-if="isIdPopupVisible" class="popup-overlay">
      <div class="popup">
        <p class="confirm-message">사용 가능한 아이디입니다.</p>
        <button class="confirm-button" @click="ConfirmedId">확인</button>
      </div>
    </div>

    <div v-if="isClubNamePopupVisible" class="popup-overlay">
      <div class="popup">
        <p class="confirm-message">사용 가능한 동아리 이름입니다.</p>
        <button class="confirm-button" @click="ConfirmedClubName">확인</button>
      </div>
    </div>

    <!-- 동아리 추가 팝업창  -->
    <div v-if="isPopupVisible" class="popup-overlay">
      <div class="popup">
        <h3>동아리 추가</h3>
        <div class="line2"></div>
        <p class="popup-message">'{{clubName}}'을(를) 추가하시겠습니까?</p>
        <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
        <p class="popup-warning">{{adminPwError}}</p>
        <button class="expel-button" @click="submitForm">확인</button>
        <button class="cancel-button" @click="cancelDelete">취소</button>
      </div>
    </div>

    <div v-if="isClubRoomPopupVisible" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>동아리방 선택하기</h3>
          <button class="close-button" @click="closeSelectRoom">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clip-path="url(#clip0_4722_18717)">
                <path d="M17.3588 0.643066L0.644531 17.3574M0.644531 0.643066L17.3588 17.3574" stroke="#969696" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_4722_18717">
                  <rect width="18" height="18" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>


        <div class="modal-body">
          <div class="floor-selector-container">
            <div class="floor-selector">
              <button
                  v-for="floor in floors"
                  :key="floor"
                  :class="['floor-button', { active: selectedFloor === floor }]"
                  @click="selectedFloor = floor"
              >
                {{ floor }}
              </button>
            </div>
          </div>
          <div class="room-container">
            <div class="rooms-wrapper">
              <div class="room-grid">
                <button
                    v-for="room in roomsByFloor"
                    :key="room"
                    :class="['room-button', { active: selectedRoom === room }]"
                    @click="selectedRoom = room"
                >
                  {{ room }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="select-button" @click="selectRoom">선택하기</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import store from "@/store/store";
export default {
  data() {
    return {
      // 동연회/개발팀이 동아리 회장에게 생성해주는 동아리 계정 정보
      id: '', // 아이디
      password: '', // 비밀번호
      confirmPassword: '', // 비밀번호 확인
      clubName: '', // 동아리 이름
      department: '', // 분과

      // 정보 입력 값 에러 메세지 변수
      idError: '',
      passwordError: '',
      confirmPasswordError:'',
      clubNameError: '',
      clubRoomError: '',

      // 동아리 분과 선택을 위한 드롭 다운 리스트 옵션 문자열이 저장된 배열
      options: ['학술', '종교', '예술', '체육', '공연', '봉사'],

      // 선택한 분과 화면에 나타내기
      selectedOption: null,

      // 분과 선택을 위해 드롭다운 리스트 가시성 플래그
      isOpen: false,

      // 동아리 "추가하기" 버튼을 누르면 나오는 팝업창 가시성 플래그
      isPopupVisible: false,

      // 동아리 아이디 "중복확인" 버튼을 누르면 나오는 팝업창 가시성 플래그
      isIdPopupVisible: false,

      // 동아리 이름 "중복확인" 버튼을 누르면 나오는 팝업창 가시성 플래그
      isClubNamePopupVisible: false,

      isClubRoomPopupVisible: false,

      // 동연회/개발팀 비밀번호
      adminPw: '',
      adminPwError: '', // 정보 입력 값 에러 메세지 변수

      // 동아리 방 정보
      floors: ['지하', '1층', '2층'],
      selectedFloor: '1층',
      selectedRoom: '미선택',
      roomMap: {
        '지하': ['B101호', 'B102호', 'B103호', 'B104호', 'B105호', 'B106호', 'B107호', 'B108호', 'B109호', 'B110호', 'B111호', 'B112호', 'B113호','B114호', 'B115호', 'B116호', 'B117호', 'B118호', 'B119호', 'B120호', 'B121호', 'B122호', 'B123호'],
        '1층': ['102호', '103호', '104호', '105호', '106호', '107호', '108호', '109호', '110호', '112호'],
        '2층': ['203호', '205호', '206호','207호', '208호', '209호', '210호',]
      }
    };
  },
  computed: {
    roomsByFloor() {
      return this.roomMap[this.selectedFloor] || []
    }
  },
  methods: {
    // 함수 실행 시 routeName의 컴포넌트로 이동
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },

    // 사용자가 입력안 아이디, 비밀번호, 동아리 이름 값을 검사하여 입력 조건에 맞지 않으면 에러 메세지 출력
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
        this.clubNameError = '* 동아리 이름은 공백 포함 10자 이내로 작성해주세요.';
      } else {
        this.clubNameError = '';
      }
    },
    validateConfirmPassword() {
      if(this.password !== this.confirmPassword){
        this.confirmPasswordError = '* 비밀번호가 일치하지 않습니다.';
      } else {
        this.confirmPasswordError = '';
      }
    },
    idDuplicateCheck() { //아이디 중복 확인
      this.isIdPopupVisible = true;
    },
    clubNameDuplicateCheck() { //동아리 이름 중복 확인
      this.isClubNamePopupVisible = true;
    },
    ConfirmedId(){
      this.isIdPopupVisible = false;
    },
    ConfirmedClubName(){
      this.isClubNamePopupVisible = false;
    },
    // "추가하기" 버튼을 눌러 팝업창 나타내기
    openPopup() {
      this.isPopupVisible = true;

    },

    // 팝업창 "취소" 버튼을 눌러 팝업창을 지우고 입력폼 값 초기화
    cancelDelete() {
      this.isPopupVisible = false;
      this.id = '';
      this.password = '';
      this.confirmPassword = '';
      this.clubName = '';
      this.department = '';
    },

    // 분과 선택을 위해 클릭 시 드롭다운 리스트를 나타내고 지우기
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },

    // 선택한 분과 selectedOption에 저장
    selectOption(option) {
      this.selectedOption = option;
    },

    // 팝업창 동연회/개발팀 비밀번호 입력 후 "추가" 버튼으로 동아리 추가하기
    async submitForm() {

      // 서버로는 영어로 된 분과 정보를 보내야하기 때문에 한글로 된 분과명을 영어로 매핑해주는 객체
      const DepartmentTypeMap = {
        '학술': "ACADEMIC",
        '종교': "RELIGION",
        '예술': "ART",
        '체육': "SPORT",
        '공연': "SHOW",
        '봉사': "VOLUNTEER"
      };
      // 사용자가 선택한 값(selectedOption)을 객체(DepartmentTypeMap)에서 찾아 분과 값(department)에 저장
      this.department = DepartmentTypeMap[this.selectedOption] || null;

      // 서버에 전달할 동아리 추가 정보
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
        alert('성공적으로 추가했습니다.'); // 동아리 추가 성공 알림
        this.navigateTo('clublist');  // 추가를 마치면 메인화면(clublist.vue)으로 이동
        this.clearForm(); // 입력 폼 초기화
        this.isPopupVisible = false;  // 팝업창 닫기
      } catch (error) {
        if (error.response) {
          console.error('응답 에러 상태 코드 : ', error.response.status);
        }
        // 서버에서 보낸 에러 코드에 따라 사용자에게 에러 정보 제공
        if (error.response.status === 400) {
          this.adminPwError = '* 비밀번호를 다시 확인해주세요.';
        }
      }
    },

    // 입력 폼 초기화
    clearForm() {
      this.id = '';
      this.password = '';
      this.confirmPassword = '';
      this.clubName = '';
      this.department = '';
      this.adminPw = '';
    },

    // 동아리 방 선택
    selectRoom() {
      if (this.selectedRoom) {
        this.closeSelectRoom()
      }
    },
    selectClubRoom(){
      this.isClubRoomPopupVisible = true;
    },
    closeSelectRoom(){
      this.isClubRoomPopupVisible = false;
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
  height: 650px;
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
  margin-bottom: 21.5px;
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
  position: relative; /* 부모 요소를 기준으로 자식 요소 위치 지정 */
}

.DuplicateCheckbtn{
  width: 80px;
  height: 45px;
  position: absolute;
  right: 40px;
  top: 6px;
  border-radius: 5px;
  border: none;
  background-color: #FFC700;
  color: white;
}

.DuplicateCheckbtn:hover{
  background-color: #e6b800;
}

.club-room-btn{
  width: 20%;
  right: 40px;
  border: 0.5px solid #C5C5C5;
  padding: 20px 25px 20px 25px;
  background-color: #FFFFFF;
  border-radius: 5px;
}

.club-room{
  width: 30%;
  align-items: center;
  margin-left: 10px;
  border: 1.5px solid #C5C5C5;
  border-radius: 5px;
  padding: 20px 25px 20px 25px;
  background-color: #efefef;
  color: #828282;
}

.from-input {
  width: 70%;
  align-items: center;
  margin-bottom: 10px;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 20px 25px 20px 25px;
  background-color: #fff;
}

.from-input::placeholder{
  color: #9D9D9D;
  font-size: 16px;
}

label {
  width: 20%;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.warning{
  font-size: 12px;
  font-weight: 300;
  color: #FF4B4B;
  margin: 0 0 0 10px;
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

.mappin{
  background: url('@/assets/mappin.svg') no-repeat center center;
}

/* Popup Overlay and Popup Window */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  flex-direction: column;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.confirm-message{
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 500;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.confirm-button{
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.line2{
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-message {
  font-size: 16px;
  font-weight: 500;
  line-height: 12px;
  color: #2F2F2F;
  margin-top: 20px;
}

.popup input {
  width: 430px;
  padding: 10px;
  font-size: 14px; /* 입력 칸의 글씨 크기를 더 크게 */
  border: 1px solid #C6C6C6;
  border-radius: 8px;
  margin-bottom: 10px;
}

.popup-warning {
  font-size: 12px;
  font-weight: 300;
  color: #FF4B4B;
  margin: 0 0 0 10px;
}

.expel-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.expel-button:hover {
  background-color: #e6953e;
}

.cancel-button {
  background-color: #cccccc;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 120px;
}

.cancel-button:hover {
  background-color: #999999;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
}

.dropdown-options li:first-child:hover {
  background-color: #FFB052;
  border-radius: 8px 8px 0 0;
}

.dropdown-options li:last-child:hover {
  background-color: #FFB052;
  border-radius: 0 0 8px 8px;
}

.dropdown-option-selected:first-child {
  background-color: #ffa726;
  color: white;
  border-radius: 8px 8px 0 0;
}

.dropdown-option-selected:last-child {
  background-color: #ffa726;
  color: white;
  border-radius: 0 0 8px 8px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background: #F3F3F3;
  border-radius: 32px;
  width: 645px;
  height: 399px;
  max-width: 90vw;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  margin-bottom: -25px;
}

.modal-header h3 {
  color: #575757;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px; /* 75% */
  letter-spacing: -0.4px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.close-button:hover {
  stroke: #000; /* Change the stroke color to a darker shade */
}


.modal-body {
  flex: 1;
  padding: 10px 40px;
  overflow: hidden;
}

.floor-selector-container {
  margin-bottom: 10px;
}

.floor-selector {
  background: #E8E8E8;
  border-radius: 10px;
  padding: 4px;
  display: flex;
  position: relative;
  width: fit-content;
}

.floor-button {
  padding: 8px 32px;
  border: none;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}

.floor-button.active {
  background: white;
  color: #000;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.room-container {
  min-height: 160px;
  margin-bottom: 24px;
}

.rooms-wrapper {
  border-radius: 8px;
  border: 1px solid #C3C3C3;
  background: #FFF;
  padding: 16px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.room-button {
  padding: 10px 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #5A5A5A;
  font-family: Pretendard;
  font-style: normal;
  font-weight: 400;
  line-height: 12px; /* 85.714% */
  transition: all 0.2s ease;
  width: 68px;
}

.room-button.active {
  border-color: #FFA000;
  color: #000;
}

.modal-footer {
  padding: 10px 40px;
  text-align: right;
  margin-bottom: 20px;
}

.select-button {
  width: 124px; /* Set the width to 124px */
  height: 40px;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  background: #FFB74D;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.select-button:hover {
  background: #FFA726;
}

</style>
