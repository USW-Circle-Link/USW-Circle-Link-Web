<template>
  <div class="title">동아리 추가</div>
  <!--  동아리 추가 정보 입력 폼  -->
  <div class="form-container">
    <!-- 아이디 -->
    <div class="form-group-col">
      <div class="form-group-row">
        <label for="id">아이디</label>
        <input class="from-input" type="text" id="id" v-model="id" placeholder="아이디 (5~20자 이내 영어, 숫자)" @input="validateId" />
        <button
            class="DuplicateCheckbtn"
            @click="idDuplicateCheck"
            :disabled="!isIdValid"
        >
          중복 확인
        </button>
      </div>
      <span v-if="idError" :style="getStyleId" class="warning">{{ idError }}</span>
    </div>
    <!-- 비밀번호 -->
    <div class="form-group-col">
      <div class="form-group-row">
        <label for="password">비밀번호</label>
        <input class="from-input" type="password" id="password" v-model="password" placeholder="비밀번호 (영어, 숫자, 특수문자 포함 8~20자)" @input="validatePassword" />
      </div>
      <span v-if="passwordError" class="warning">{{ passwordError }}</span>
    </div>
    <!-- 비밀번호 확인 -->
    <div class="form-group-col">
      <div class="form-group-row">
        <label for="confirmPassword">비밀번호 확인</label>
        <input
            class="from-input"
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="비밀번호 (영어, 숫자, 특수문자 포함 8~20자)"
            @input="validateConfirmPassword"
            @focus="handleConfirmPasswordFocus"
        />
      </div>
      <span v-if="confirmPasswordError" class="warning">{{confirmPasswordError}}</span>
    </div>
    <!-- 동아리 이름 -->
    <div class="form-group-col">
      <div class="form-group-row">
        <label for="clubName">동아리 이름</label>
        <input class="from-input" type="text" id="clubName" v-model="clubName" placeholder="동아리 이름 (10자 이내)" @input="validateClubName" />
        <button
            class="DuplicateCheckbtn"
            @click="clubNameDuplicateCheck"
            :disabled="!isClubNameValid"
        >
          중복 확인
        </button>
      </div>
      <span v-if="clubNameError" :style="getStyleClubName" class="warning">{{ clubNameError }}</span>
    </div>
    <!-- 분과 -->
    <div class="form-group">
      <label for="clubName">분과</label>
      <div class="custom-dropdown" @click="toggleDropdown">
        <div class="dropdown-selected">
          {{ selectedOption || '미선택' }}
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
          <svg width="15" height="18" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 5C9.5 8.5 5 11.5 5 11.5C5 11.5 0.5 8.5 0.5 5C0.5 3.80653 0.974106 2.66193 1.81802 1.81802C2.66193 0.974106 3.80653 0.5 5 0.5C6.19347 0.5 7.33807 0.974106 8.18198 1.81802C9.02589 2.66193 9.5 3.80653 9.5 5Z" stroke="#5A5A5A" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 6.5C5.82843 6.5 6.5 5.82843 6.5 5C6.5 4.17157 5.82843 3.5 5 3.5C4.17157 3.5 3.5 4.17157 3.5 5C3.5 5.82843 4.17157 6.5 5 6.5Z" stroke="#5A5A5A" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          동아리방 선택
        </button>
        <input class="club-room" v-model="displayRoomNumber" readonly>
      </div>
      <span v-if="clubRoomError" class="warning">{{ clubRoomError }}</span>
    </div>
    <button
        class="popupbtn"
        :disabled="!isFormValid"
        :class="{ 'disabled': !isFormValid }"
        @click="openPopup"
    >
      추가하기
    </button>

    <DuplicateCheckPopup
        v-if="showPopup"
        :serverMessage="serverMessage"
        @close="closeResultPopup"
    />

    <!-- 동아리 추가 팝업창  -->
    <div v-if="AddClubPopupVisible" class="popup-overlay">
      <div class="popup">
        <h3>동아리 추가</h3>
        <div class="line33"></div>
        <p class="popup-message">'{{clubName}}'을(를) 추가하시겠습니까?</p>
        <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
        <p class="popup-warning">{{adminPwError}}</p>
        <button class="expel-button" @click="submitForm">확인</button>
        <button class="cancel-button" @click="cancelDelete">취소</button>
      </div>
    </div>

    <div v-if="ClubRoomPopupVisible" class="modal-overlay">
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
                  {{ room }}호
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
  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from "axios";
import store from "@/store/store";
import Popup401 from "@/components/Admin/401Popup.vue";
import DuplicateCheckPopup from "@/components/Admin/AddClub/DuplicateCheckPopup.vue";
export default {
  components: {DuplicateCheckPopup, Popup401},
  data() {
    return {
      // 동연회/개발팀이 동아리 회장에게 생성해주는 동아리 계정 정보
      id: '', // 아이디
      password: '', // 비밀번호
      confirmPassword: '', // 비밀번호 확인
      clubName: '', // 동아리 이름
      department: '', // 분과
      selectedRoom: '미선택', //동아리 방
      Room : '',

      // 폼 유효성 상태 관리
      formValidation: {
        idValid: false,
        passwordValid: false,
        passwordMatch: false,
        clubNameValid: false,
        departmentValid: false,
        roomValid: false
      },

      // 정보 입력 값 에러 메세지 변수
      idError: '',
      passwordError: '',
      confirmPasswordError:'',
      clubNameError: '',
      clubRoomError: '',

      // 중복확인 체크
      DuplicateCheckId: false,
      DuplicateCheckClubName: false,

      // 동아리 분과 선택을 위한 드롭 다운 리스트 옵션 문자열이 저장된 배열
      options: ['학술', '종교', '예술', '체육', '공연', '봉사'],

      // 선택한 분과 화면에 나타내기
      selectedOption: null,

      // 분과 선택을 위해 드롭다운 리스트 가시성 플래그
      isOpen: false,

      // 동아리 "추가하기" 버튼을 누르면 나오는 팝업창 가시성 플래그
      AddClubPopupVisible: false,

      ClubRoomPopupVisible: false,

      showPopup: false,
      serverMessage: '',

      // 동연회/개발팀 비밀번호
      adminPw: '',
      adminPwError: ' ', // 정보 입력 값 에러 메세지 변수

      // 동아리 방 정보
      floors: ['지하', '1층', '2층'],
      selectedFloor: '1층',
      roomMap: {
        '지하': ['B101', 'B102', 'B103', 'B104', 'B105', 'B106', 'B107', 'B108', 'B110', 'B111', 'B112', 'B113','B114', 'B115', 'B116', 'B117', 'B118', 'B119', 'B120', 'B121', 'B122', 'B123'],
        '1층': ['102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'],
        '2층': ['203', '205', '206','207', '208', '209', '210',]
      },

      isActiveId : true,
      isActiveClubName : true,
      isConfirmPasswordTouched: false, // 비밀번호 확인 필드 터치 여부
      show401Popup: false  // 401 팝업
    };
  },
  computed: {
    isIdValid() {
      const idPattern = /^[a-zA-Z0-9]{5,20}$/;
      return this.id && idPattern.test(this.id);
    },
    isClubNameValid() {
      return this.clubName && !/\s/.test(this.clubName) && this.clubName.length <= 10;
    },
    roomsByFloor() {
      return this.roomMap[this.selectedFloor] || []
    },
    getStyleId(){
      return this.isActiveId
          ? { color : '#FF4B4B' }
          : { color : '#48A661' };
    },
    getStyleClubName(){
      return this.isActiveClubName
          ? { color : '#FF4B4B' }
          : { color : '#48A661' };
    },
    displayRoomNumber() {
      if (!this.selectedRoom || this.selectedRoom === '미선택') {
        return this.selectedRoom;
      }
      // 모든 호수에 '호'를 붙여서 표시
      return `${this.selectedRoom}호`;
    },
    isFormValid() {
      // 모든 필수 조건 확인
      const allFieldsFilled =
          this.id !== '' &&
          this.password !== '' &&
          this.confirmPassword !== '' &&
          this.clubName !== '' &&
          this.selectedOption !== null &&
          this.selectedRoom !== '미선택';

      // 모든 유효성 검사 통과 확인
      const allValidationsPass =
          this.formValidation.idValid &&
          this.formValidation.passwordValid &&
          this.formValidation.passwordMatch &&
          this.formValidation.clubNameValid &&
          this.formValidation.departmentValid &&
          this.formValidation.roomValid;

      // 중복 확인 완료 확인
      const duplicateChecksPass =
          this.DuplicateCheckId &&
          this.DuplicateCheckClubName;

      return allFieldsFilled && allValidationsPass && duplicateChecksPass;
    }
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
      if (!this.id) {
        this.isActiveId = true;
        this.idError = '* 아이디를 입력해 주세요.';
        this.formValidation.idValid = false;
      } else if (!idPattern.test(this.id)) {
        this.isActiveId = true;
        this.idError = '* 아이디는 5~20자 이내의 숫자와 문자만 입력 가능합니다.';
        this.formValidation.idValid = false;
      } else {
        this.formValidation.idValid = true;
        // 값이 변경되면 중복 확인 상태 초기화
        if (this.DuplicateCheckId) {
          this.DuplicateCheckId = false;
          this.idError = '* 중복 확인이 필요합니다.';
          this.isActiveId = true;
        }
      }
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,20}$/;
      if (!this.password) {
        this.passwordError = '* 비밀번호를 입력해 주세요.';
        this.formValidation.passwordValid = false;
      } else if (!passwordPattern.test(this.password)) {
        this.passwordError = '* 비밀번호는 영어, 숫자, 특수문자를 모두 포함하여 8~20자 이내로 작성해주세요.';
        this.formValidation.passwordValid = false;
      } else {
        this.passwordError = '';
        this.formValidation.passwordValid = true;
      }
      // 비밀번호가 변경되면 확인도 다시 체크
      this.validateConfirmPassword();
    },
    validateClubName() {
      if (!this.clubName) {
        this.isActiveClubName = true;
        this.clubNameError = '* 동아리 이름을 입력해 주세요.';
        this.formValidation.clubNameValid = false;
      } else if (this.clubName.length > 20) {
        this.isActiveClubName = true;
        this.clubNameError = '* 동아리 이름은 1~20자 이내 한글, 영어로 작성해주세요.';
        this.formValidation.clubNameValid = false;
      } else if (/\s/.test(this.clubName)){
        this.clubNameError = '* 동아리명에는 공백 또는 특수문자를 포함할 수 없습니다.';
        this.formValidation.clubNameValid = false;
      } else {
        this.formValidation.clubNameValid = true;
        // 값이 변경되면 중복 확인 상태 초기화
        if (this.DuplicateCheckClubName) {
          this.DuplicateCheckClubName = false;
          this.clubNameError = '* 중복 확인이 필요합니다.';
          this.isActiveClubName = true;
        }
      }
    },

    validateConfirmPassword() {
      if (!this.isConfirmPasswordTouched) {
        this.confirmPasswordError = '';
        return;
      }
      if (!this.confirmPassword) {
        this.confirmPasswordError = '* 비밀번호 확인을 입력해 주세요.';
        this.formValidation.passwordMatch = false;
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = '* 비밀번호가 일치하지 않습니다.';
        this.formValidation.passwordMatch = false;
      } else {
        this.confirmPasswordError = '';
        this.formValidation.passwordMatch = true;
      }
    },
    handleConfirmPasswordFocus() {
      this.isConfirmPasswordTouched = true;
      this.validateConfirmPassword();
    },
    async idDuplicateCheck() { //아이디 중복 확인
      if(this.id !== ''){
        const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기
        try {
          await axios.get(`${store.state.apiBaseUrl}/admin/clubs/leader/check?leaderAccount=${this.id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
            }
          });
          this.serverMessage = '사용 가능한 아이디입니다.';
          this.showPopup = true;
          this.DuplicateCheckId = true;
        } catch (error) {
          if (!this.handle401Error(error)) {
            console.error('Error updating member:', error);
          }
          if (error.response.status === 422) {
            this.isActiveId = true;
            this.idError = '* 이미 존재하는 아이디입니다.';
            this.DuplicateCheckId = false;
          }
        }
      } else {
        this.isActiveId = true;
        this.idError = '* 아이디를 입력해 주세요.';
      }
    },
    async clubNameDuplicateCheck() { //동아리 이름 중복 확인
      if(this.clubName !== '') {
        const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기
        try {
          await axios.get(`${store.state.apiBaseUrl}/admin/clubs/name/check?clubName=${this.clubName}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
            }
          });
          this.serverMessage = '사용 가능한 동아리 이름입니다.';
          this.showPopup = true;
          this.DuplicateCheckClubName = true;
        } catch (error) {
          if (!this.handle401Error(error)) {
            console.error('Error updating member:', error);
          }
          if (error.response.status === 409) {
            this.isActiveClubName = true;
            this.clubNameError = '* 이미 존재하는 동아리 이름입니다.';
            this.DuplicateCheckClubName = false;
          }
        }
      } else {
        this.isActiveClubName = true;
        this.clubNameError = '* 동아리 이름을 입력해 주세요.';
      }
    },

    // "추가하기" 버튼을 눌러 팝업창 나타내기
    openPopup() {
      if(this.DuplicateCheckClubName === true &&
          this.DuplicateCheckId === true &&
          this.id !== '' &&
          this.password !== '' &&
          this.confirmPassword !== '' &&
          this.clubName !== '' &&
          this.selectedOption !== '' &&
          this.selectedRoom !== '')
      {
        this.AddClubPopupVisible = true;
      }  else {
        alert("중복 확인 진행 및 빈칸을 모두 채워주세요.");
        console.log(this.DuplicateCheckClubName, this.DuplicateCheckId, this.id, this.password, this.confirmPassword, this.clubName, this.selectedOption, this.selectedRoom);
      }
    },

    // 팝업창 "취소" 버튼을 눌러 팝업창을 지우기
    cancelDelete() {
      this.AddClubPopupVisible = false;
    },

    // 분과 선택을 위해 클릭 시 드롭다운 리스트를 나타내고 지우기
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },

    // 선택한 분과 selectedOption에 저장
    selectOption(option) {
      this.selectedOption = option;
      this.formValidation.departmentValid = true;
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
        adminPw: this.adminPw,
        clubRoomNumber: this.selectedRoom
      };

      try {
        await axios.post(`${store.state.apiBaseUrl}/admin/clubs`, formData, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`
          }
        });
        alert('성공적으로 추가했습니다.'); // 동아리 추가 성공 알림
        this.navigateTo('clublist');  // 추가를 마치면 메인화면(clublist.vue)으로 이동
        this.clearForm(); // 입력 폼 초기화
        this.AddClubPopupVisible = false;  // 팝업창 닫기
      } catch (error) {
        if (error.response) {
          if (!this.handle401Error(error)) {
            console.error('Error updating member:', error);
          }
          if (error.response.status === 400) {
            this.adminPwError = '* 비밀번호를 다시 확인해주세요.';
          }
        }
      }
    },
    closeResultPopup(newMessage, index) {
      this.showPopup = false
      if(index === true){
        this.idError = newMessage;
        this.isActiveId = false;
        this.DuplicateCheckId = true;
      } else if(index === false){
        this.clubNameError = newMessage;
        this.isActiveClubName = false;
        this.DuplicateCheckClubName = true;
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
      if (this.selectedRoom && this.selectedRoom !== '미선택') {
        this.formValidation.roomValid = true;
        this.closeSelectRoom();
      }
    },
    selectClubRoom(){
      this.ClubRoomPopupVisible = true;
    },
    closeSelectRoom(){
      this.ClubRoomPopupVisible = false;
    },
  },
  created() {
    // 컴포넌트 생성 시 모든 유효성 상태 초기화
    this.formValidation = {
      idValid: false,
      passwordValid: false,
      passwordMatch: false,
      clubNameValid: false,
      departmentValid: false,
      roomValid: false
    };
  },
};
</script>

<style scoped>

.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
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
  margin-left: 40%;
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
  height: 35px;
  position: absolute;
  right: 50px;
  top: 6px;
  border-radius: 5px;
  border: none;
  background-color: #FFB052;
  color: white;
}

.DuplicateCheckbtn:hover{
  background-color: #f49421;
}

.club-room-btn{
  display: flex;
  width: 20%;
  right: 40px;
  border: 0.5px solid #C5C5C5;
  padding: 15px 15px 15px 20px;
  background-color: #FFFFFF;
  border-radius: 5px;
  font-size: 14px;
  color: #5A5A5A;
  align-items: center;
}

.club-room-btn:hover {
  border: 1.1px solid #f49421;
}

.club-room-btn svg{
  margin-right: 20px;
}

.club-room{
  width: 30%;
  align-items: center;
  margin-left: 10px;
  border: 1.5px solid #C5C5C5;
  border-radius: 5px;
  padding: 15px 20px 15px 20px;
  background-color: #efefef;
  color: #828282;
}

.club-room:focus{
  border-color: #C5C5C5;
}

.from-input {
  width: 70%;
  align-items: center;
  margin-bottom: 10px;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 15px 20px 15px 20px;
  background-color: #fff;
}

.from-input::placeholder{
  color: #9D9D9D;
  font-size: 14px;
}

label {
  width: 20%;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.warning{
  font-weight: 400;
  color: #FF4B4B;
  margin-top: 0;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.popupbtn {
  display: flex;
  margin-top: 30px;
  margin-right: 40px;
  width: 140px;
  height: 40px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #FFB052;
  color: #ffffff;
  font-size: 15px;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  border: none;
  transition: background-color 0.2s ease;
}

.popupbtn.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 활성화된 버튼의 hover 스타일 */
.popupbtn:not(.disabled):hover {
  background-color: #f49421; /* 더 진한 노란색으로 변경 */
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
  z-index: 1000;
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

.popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.line33{
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
  margin-top: 1px;
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
  background-color: #f49421;
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
  padding: 15px 20px 15px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  list-style: none; /* 점 없애기 */
}

.dropdown-options li:hover {
  background-color: #f49421;
  color: white;
}

.dropdown-options li:first-child:hover {
  background-color: #f49421;
  border-radius: 8px 8px 0 0;
}

.dropdown-options li:last-child:hover {
  background-color: #f49421;
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
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
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
  background: #f49421;
}

.DuplicateCheckbtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

</style>
