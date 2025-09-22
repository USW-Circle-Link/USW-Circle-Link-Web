<template>
  <div class="container">
    <!-- 제목 -->
    <div class="title-row">
      <h2>엑셀 파일로 추가할 동아리 회원 정보</h2>
      <div class="buttons">
      <button class="download-btn" @click="downloadExcel">엑셀 양식 다운로드</button>
      <button class="upload-btn" @click="triggerFileInput">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4830_14361)">
            <path d="M14.1733 9.04535H11.6287V7.77304H14.1733V9.04535ZM14.1733 9.77235H11.6287V11.0447H14.1733V9.77235ZM14.1733 3.77441H11.6287V5.0467H14.1733V3.77441ZM14.1733 5.77373H11.6287V7.04601H14.1733V5.77373ZM14.1733 11.7717H11.6287V13.044H14.1733V11.7717ZM15.9309 14.2799C15.8582 14.658 15.4038 14.667 15.1003 14.6798H9.44769V16.3156H8.31897L0 14.8615V2.14045L8.36806 0.68457H9.44769V2.13316H14.9058C15.213 2.14588 15.5511 2.12407 15.8182 2.30763C16.0054 2.57663 15.9873 2.91835 16 3.22732L15.9927 12.6895C15.9837 13.2184 16.0418 13.7583 15.9309 14.2799ZM6.66497 11.4282C6.16334 10.4104 5.65263 9.39976 5.15278 8.38191C5.64716 7.39135 6.13428 6.39716 6.61956 5.40295C6.20697 5.42295 5.79437 5.44838 5.38363 5.47748C5.07644 6.22448 4.71838 6.95151 4.47847 7.72398C4.25491 6.99513 3.95866 6.29354 3.68784 5.58288C3.28797 5.60469 2.88809 5.62832 2.48825 5.65195C2.90991 6.58257 3.35888 7.50038 3.76781 8.43645C3.28616 9.34523 2.83541 10.2668 2.36828 11.181C2.76631 11.1973 3.16438 11.2137 3.56241 11.2191C3.84597 10.4958 4.19856 9.79963 4.44575 9.0617C4.6675 9.85416 5.04372 10.5866 5.35272 11.3445C5.79075 11.3755 6.22694 11.4027 6.66497 11.4282ZM15.1331 2.99638H9.44769V3.77441H10.9017V5.0467H9.44769V5.77373H10.9017V7.04601H9.44769V7.77304H10.9017V9.04535H9.44769V9.77235H10.9017V11.0447H9.44769V11.7717H10.9017V13.044H9.44769V13.8845H15.1331V2.99638Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_4830_14361">
              <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
          </defs>
        </svg>
        엑셀 파일 업로드
        <input type="file" ref="fileInput" @change="handleFileUpload" hidden />
      </button>
      </div>
    </div>

    <!-- 정보 및 버튼 섹션 -->
    <div class="info-section">
        <div class="info-section-col">
          <p>추가 회원: {{ members.length }}명</p>
          <p class="warning-text">
            동아리 회원 추가의 경우, 오타가 없는지 꼼꼼하게 확인해주세요.
          </p>
        </div>
        <div>
          <button class="clear-btn" @click="clearList">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3.25H11.25V2.5C11.25 2.16848 11.1183 1.85054 10.8839 1.61612C10.6495 1.3817 10.3315 1.25 10 1.25H7C6.66848 1.25 6.35054 1.3817 6.11612 1.61612C5.8817 1.85054 5.75 2.16848 5.75 2.5V3.25H3C2.9337 3.25 2.87011 3.27634 2.82322 3.32322C2.77634 3.37011 2.75 3.4337 2.75 3.5C2.75 3.5663 2.77634 3.62989 2.82322 3.67678C2.87011 3.72366 2.9337 3.75 3 3.75H3.75V13C3.75 13.1989 3.82902 13.3897 3.96967 13.5303C4.11032 13.671 4.30109 13.75 4.5 13.75H12.5C12.6989 13.75 12.8897 13.671 13.0303 13.5303C13.171 13.3897 13.25 13.1989 13.25 13V3.75H14C14.0663 3.75 14.1299 3.72366 14.1768 3.67678C14.2237 3.62989 14.25 3.5663 14.25 3.5C14.25 3.4337 14.2237 3.37011 14.1768 3.32322C14.1299 3.27634 14.0663 3.25 14 3.25ZM6.25 2.5C6.25 2.30109 6.32902 2.11032 6.46967 1.96967C6.61032 1.82902 6.80109 1.75 7 1.75H10C10.1989 1.75 10.3897 1.82902 10.5303 1.96967C10.671 2.11032 10.75 2.30109 10.75 2.5V3.25H6.25V2.5ZM12.75 13C12.75 13.0663 12.7237 13.1299 12.6768 13.1768C12.6299 13.2237 12.5663 13.25 12.5 13.25H4.5C4.4337 13.25 4.37011 13.2237 4.32322 13.1768C4.27634 13.1299 4.25 13.0663 4.25 13V3.75H12.75V13ZM7.25 6.5V10.5C7.25 10.5663 7.22366 10.6299 7.17678 10.6768C7.12989 10.7237 7.0663 10.75 7 10.75C6.9337 10.75 6.87011 10.7237 6.82322 10.6768C6.77634 10.6299 6.75 10.5663 6.75 10.5V6.5C6.75 6.4337 6.77634 6.37011 6.82322 6.32322C6.87011 6.27634 6.9337 6.25 7 6.25C7.0663 6.25 7.12989 6.27634 7.17678 6.32322C7.22366 6.37011 7.25 6.4337 7.25 6.5ZM10.25 6.5V10.5C10.25 10.5663 10.2237 10.6299 10.1768 10.6768C10.1299 10.7237 10.0663 10.75 10 10.75C9.9337 10.75 9.87011 10.7237 9.82322 10.6768C9.77634 10.6299 9.75 10.5663 9.75 10.5V6.5C9.75 6.4337 9.77634 6.37011 9.82322 6.32322C9.87011 6.27634 9.9337 6.25 10 6.25C10.0663 6.25 10.1299 6.27634 10.1768 6.32322C10.2237 6.37011 10.25 6.4337 10.25 6.5Z" fill="#969696"/>
            </svg>
            비우기
          </button>
        </div>
    </div>

    <!--추가할 회원 리스트-->
    <div v-if="visible && !isOverlappingMemberListsPopupVisible" class="member-list">
      <div class="member-list" v-for="(member, index) in members" :key="index">
        <div class="member-row">
          <!-- 이름 입력 -->
          <div class="input-wrapper">
            <span v-if="editingIndex !== index">{{ member.userName }}</span>
            <input v-else
                   v-model="editingMember.userName"
                   :class="['edit-input', { error: validationErrors.userName }]"
                   type="text"
                   placeholder="이름">
            <div v-if="editingIndex === index && validationErrors.userName"
                 class="validation-error">
              {{ errorMessages.userName }}
            </div>
          </div>

          <!-- 학번 입력 -->
          <div class="input-wrapper">
            <span v-if="editingIndex !== index">{{ member.studentNumber }}</span>
            <input v-else
                   v-model="editingMember.studentNumber"
                   :class="['edit-input', 'narrow-input', { error: validationErrors.studentNumber }]"
                   type="text"
                   placeholder="학번">
            <div v-if="editingIndex === index && validationErrors.studentNumber"
                 class="validation-error">
              {{ errorMessages.studentNumber }}
            </div>
          </div>

          <!-- 전화번호 입력 -->
          <div class="input-wrapper">
            <span v-if="editingIndex !== index">{{ formatPhoneNumber(member.userHp) }}</span>
            <input v-else
                   v-model="editingMember.userHp"
                   :class="['edit-input', 'narrow-input', { error: validationErrors.userHp }]"
                   type="tel"
                   placeholder="전화번호">
            <div v-if="editingIndex === index && validationErrors.userHp"
                 class="validation-error">
              {{ errorMessages.userHp }}
            </div>
          </div>

          <!-- 단과대학 선택 -->
          <select v-model="member.department" @change="onCollegeChange(index)">
            <option disabled value="">단과대학 선택</option>
            <option v-for="college in colleges" :key="college.id" :value="college.id">
              {{ college.name }}
            </option>
          </select>

          <!-- 학부(학과) 선택 -->
          <select v-model="member.major">
            <option disabled value="">학부(학과) 선택</option>
            <option v-for="dept in member.departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
          <button
              v-if="editingIndex !== index"
              class="edit-btn"
              @click="startEdit(index)"
          >
            수정
          </button>
          <button v-if="editingIndex === index"
                  @click="confirmEdit(index)"
                  class="save-btn">
            수정
          </button>
        </div>
        <div>
          <p class="errorMessage"> {{ member.errorMessage }}</p>
        </div>
      </div>
      <button class="addClubMember" @click="submitMembers">완료</button>
    </div>


    <div v-if="isOverlappingMemberListsPopupVisible" class="popup-overlay1">
      <div class="popup">
        <h2>프로필 중복 회원 목록</h2>
        <p class="confirm-message">타 동아리에도 소속되어 있는 프로필 중복 회원이 <span class="red-text1">총 {{OverlappingMembers.length}}명</span> 존재해요. <br>이후 '프로필 중복 회원 추가'를 통해 아래 회원을 추가해주세요. <br><span class="red-text1">해당 팝업을 닫는 경우 다시 확인할 수 없으니, <span class="red-text2">반드시 별도로 저장</span>해주세요!</span></p>
        <div class="list-item-container">
          <div v-for="(item, index) in OverlappingMembers" :key="index" class="list-item">
            <div class="name">{{ item.userName }}</div>
            <div class="id">{{ item.studentNumber }}</div>
            <div class="Phone">{{ formatPhoneNumber(item.userHp) }}</div>
          </div>
        </div>
        <button class="confirm-button" @click="Delete">확인</button>
      </div>
    </div>

    <div v-if="isSelectDepartmentPopupVisible" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 추가</h3>
        <div class="line3"></div>
        <p class="popup-message">학과를 모두 선택해주세요.</p>
        <button class="confirm-button" @click="SelectDepartment">확인</button>
      </div>
    </div>

    <div v-if="isErrorPopupVisible" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 추가</h3>
        <div class="line3"></div>
        <p class="popup-message">회원 정보에 문제가 있습니다. 파일 검토 후 다시 시도해 주세요. <br>이름: 한글, 영어 최소 2자<br>학번: 숫자 8자<br>전화번호: 숫자 11자</p>
        <button class="confirm-button" @click="Error">확인</button>
      </div>
    </div>

    <div v-if="isOverlappingMembersPopupVisible" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 추가</h3>
        <div class="line3"></div>
        <p class="popup-message">프로필 중복 회원이 <span class="red-text2">{{this.OverlappingMembers.length}}명</span> 존재해요. <br>'프로필 중복 회원 추가' 페이지로 이동할게요.</p>
        <button class="confirm-button" @click="DuplicateMemberPage">확인</button>
      </div>
    </div>

    <div v-if="isPopupVisible" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 추가</h3>
        <div class="line3"></div>
        <p class="popup-message">
          <span class="popup-message-red">총 {{this.members.length}}명</span>
          입니다. <br>
          해당 동아리 회원들을 추가하시겠습니까?
        </p>
        <div class="button-group">
          <button class="cancel-button" @click="closePopup">취소</button>
          <button class="confirm-button" @click="OverlappingMemberLists">확인</button>
        </div>
      </div>
    </div>

    <div v-if="showEditConfirmPopup" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 수정</h3>
        <div class="line3"></div>
        <p class="popup-message">해당 동아리 회원 정보를 수정하시겠습니까?</p>
        <div class="button-group">
          <button class="cancel-button" @click="cancelEdit">취소</button>
          <button class="confirm-button" @click="saveEdit">확인</button>
        </div>
      </div>
    </div>
  </div>
  <Popup401 v-if="show401Popup" />
</template>

<script>
//import * as XLSX from "xlsx";
import axios from "axios";
import store from "@/store/store";
import Popup401 from './401Popup.vue';
import {colleges, departmentsByCollege} from "@/components/departments"; // 401 팝업 컴포넌트 추가

export default {
  components:{
    Popup401,
  },
  data() {
    return {
      members: [], // 업로드된 회원 정보를 저장
      OverlappingMembers: [],
      editingIndex: -1,
      validationErrors: {
        userName: false,
        studentNumber: false,
        major: false,
        userHp: false
      },
      errorMessages: {
        userName: '* 이름은 특수 문자 제외 2~30자 이내로 입력해주세요.',
        studentNumber: '* 학번은 숫자 8자로 입력해주세요.',
        major: '*단과대/학부(학과)를 선택해주세요.',
        userHp: '*전화번호는 - 제외 11자로 입력해주세요.'
      },
      errorList: [],

      isPopupVisible: false,
      isOverlappingMemberListsPopupVisible : false,
      isSelectDepartmentPopupVisible : false,
      isOverlappingMembersPopupVisible: false,
      isErrorPopupVisible: false,
      showEditConfirmPopup: false,

      show401Popup: false,

      colleges, // 가져온 단과대학 정보 사용
      departmentsByCollege, // 가져온 학과 정보 사용
      departments: [],
      editingMember: null,

      visible: false,
    }
  },
  methods: {
    closePopup() {
      this.isPopupVisible = false;
    },
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    formatPhoneNumber(phoneNumber) {
      // 전화번호를 '010-1234-5678' 형식으로 변환
      if (!phoneNumber) return "";
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    },
    downloadExcel() {
      // public 폴더의 template.xlsx 파일 경로
      const fileUrl = '/template.xlsx';
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '동아리 회원추가 양식.xlsx'; // 다운로드될 파일명 설정
      link.click();
    },
    // 파일 입력 필드를 트리거
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    transformErrorObject(errorObj) {
      const result = {};

      Object.entries(errorObj).forEach(([key, message]) => {
        // 인덱스 추출 (clubMembersAddFromExcelRequestList[1] 부분에서 숫자만 추출)
        const match = key.match(/\[(\d+)\]/);
        if (match) {
          const index = match[1]; // 인덱스 값 (문자열 형태)

          // 이미 해당 인덱스가 존재하면 메시지 추가
          if (result[index]) {
            result[index] += `, ${message}`;
          } else {
            result[index] = message;
          }
        }
      });

      return result;
    },
    // 파일 업로드 처리
    async handleFileUpload(event) {
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      console.log("엑셀 파일 업로드")
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData(); // FormData 객체 생성
      formData.append("clubMembersFile", file); // 파일 추가

      try {
        const response = await axios.post(
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/import`,
            formData,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
              }
            });

        this.members = response.data.data.addClubMembers;
        this.members = this.members.map(member => {
          return {
            ...member,
            department: '', // 원하는 값으로 변경 가능,
            major: '',
            departments: [],
            errorMessage: ''
          };
        });
        console.log(this.members);
        this.visible = true;
        this.OverlappingMembers = response.data.data.duplicateClubMembers;

        if(this.OverlappingMembers.length > 0){
          console.log(response);
          this.isOverlappingMemberListsPopupVisible = true;
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }

      //reader.readAsArrayBuffer(file);
    },
    startEdit(index) {
      this.editingIndex = index;

      this.validationErrors = {
        userName: false,
        studentNumber: false,
        major: false,
        userHp: false
      }

      this.editingMember = {
        userName: this.members[index].userName,
        studentNumber: this.members[index].studentNumber,
        userHp: this.members[index].userHp,
      };
    },
    validateInput() {
      // 이름 검증 - 특수문자 제외
      this.validationErrors.userName = !/^[가-힣a-zA-Z\s]{3,20}$/.test(this.editingMember.userName);

      // 학번 검증 - 8자리 숫자
      this.validationErrors.studentNumber = !/^\d{8}$/.test(this.editingMember.studentNumber);

      // 전화번호 검증 - 숫자만 11자리
      const phoneNumber = this.editingMember.userHp.replace(/-/g, '');
      this.validationErrors.userHp = !/^\d{11}$/.test(phoneNumber);

      // 하나라도 에러가 있으면 false 반환
      return !Object.values(this.validationErrors).some(error => error);
    },

    confirmEdit(index) {
      if (this.validateInput()) {
        this.showEditConfirmPopup = true;
      }
      this.members[index].userName = this.editingMember.userName;
      this.members[index].studentNumber = this.editingMember.studentNumber;
      this.members[index].userHp = this.editingMember.userHp;
    },
    cancelEdit() {
      this.showEditConfirmPopup = false;
      this.editingIndex = -1;
      this.editingMember = null;
    },
    saveEdit() {
      if (this.validateInput()) {
        this.showEditConfirmPopup = false;
      }
      this.editingIndex = -1;
    },
    // 리스트 초기화
    clearList() {
      this.members = [];
    },
    Delete(){
      if(this.members.length === 0 ){
        this.isOverlappingMembersPopupVisible = true;
      }
      this.isOverlappingMemberListsPopupVisible = false;
    },
    SelectDepartment(){
      this.isSelectDepartmentPopupVisible = false;
    },
    Error(){
      this.isErrorPopupVisible = false;
    },
    submitMembers(){
      if(!this.members.some(member => member.major === "")) {
        this.isPopupVisible = true;
        console.log(this.members);
      } else {
        this.isSelectDepartmentPopupVisible = true;
      }
    },
    onCollegeChange(index) {
      const selectedCollege = this.members[index].department;

      // 선택한 단과대학의 학부(학과) 목록 설정
      this.members[index].departments = this.departmentsByCollege[selectedCollege] || [];

      // 현재 선택된 major가 유효한지 확인 후 초기화
      if (!this.members[index].departments.includes(this.members[index].major)) {
        this.members[index].major = "";
      }
    },
    async OverlappingMemberLists(){
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      // 필요한 데이터만 추출해서 새 DTO 형식에 맞게 구성
      const membersData = this.members.map(member => ({
        userName: member.userName,
        major: member.major,
        studentNumber: member.studentNumber,
        userHp: member.userHp
      }));

      // 새로운 DTO 구조로 데이터 래핑
      const requestData = {
        clubMembersAddFromExcelRequestList: membersData
      };

      try {
        const response = await axios.post(
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members`,
            requestData,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            });

        console.log(response);
        this.isPopupVisible = false;

        if(this.OverlappingMembers.length > 0){
          this.isOverlappingMembersPopupVisible = true;
        } else {
          // 성공 메시지 수동으로 수정함
          alert(`${this.members.length}명의 회원이 성공적으로 추가되었습니다.`);
          // 회원 정보 초기화
          this.members = [];
        }

      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 회원 정보에 문제가 있습니다.', error);
          alert('동아리 회원 정보에 문제가 있습니다. 수정 후 다시 업로드 해주세요.');
          this.isPopupVisible = false;
        }
        if (error.code === 'ERR_BAD_REQUEST'){
          console.log(error.response.data.additionalData);

          const errorObj = error.response.data.additionalData;

          console.log(this.transformErrorObject(errorObj));

          // 오류 메시지를 members 객체에 추가
          this.members.forEach((member, index) => {
            let errorMessage = this.transformErrorObject(errorObj)[index];  // errors 객체의 인덱스에 맞는 값을 찾기 위해 +1
            if (errorMessage) {
              member.errorMessage = errorMessage;
            }
          });
          console.log(this.members);
        }
      }
    },
    navigateTo(routeName) {
      this.selectedLink = routeName; // Add this line

      store.commit("setOverlappingMembers", this.OverlappingMembers);

      this.$router.push({
        name: routeName
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    DuplicateMemberPage(){
      this.isOverlappingMembersPopupVisible = false;
      this.navigateTo('duplicate-member');
    },
  },
};
</script>



<style scoped>
/* ===== CSS 변수 및 기본 설정 ===== */
.container {
  /* [수정] 고정 너비 제거 -> 유연한 너비로 변경 */
  width: 90%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;

  --brand-color: #FFB052;
  --brand-color-dark: #f49421;
  --green-color: #3F9560;
  --green-color-dark: #14532d;
  --text-color: #333;
  --error-color: #ff4d4f;
  --gray-color: #969696;
  --border-color: #e0e0e0;
}

/* ===== 상단 타이틀 및 버튼 영역 ===== */
.title-row {
  display: flex;
  flex-wrap: wrap; /* 화면이 좁아지면 버튼이 아래로 내려감 */
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
h2 {
  margin: 0;
  font-size: clamp(20px, 2.2vw, 24px); /* 화면 크기에 따라 폰트 크기 조절 */
  font-weight: 600;
  color: var(--text-color);
}
.title-row .buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.download-btn, .upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  border: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
  flex-grow: 1; /* [추가] 모바일에서 공간을 채우도록 함 */
}
.download-btn {
  background-color: #FAFAFA;
  color: #545454;
  border: 1px solid #C9C9C9;
}
.download-btn:hover { background-color: #f0f0f0; }
.upload-btn { background-color: var(--green-color); color: #fff; }
.upload-btn:hover { background-color: var(--green-color-dark); }
svg { margin-right: 8px; }

/* ===== 정보 및 비우기 버튼 영역 ===== */
.info-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.info-section-col p { margin: 4px 0; }
.warning-text { color: var(--error-color); font-size: 14px; }
.clear-btn {
  display: inline-flex;
  align-items: center;
  background-color: #fff;
  color: var(--gray-color);
  border: 1px solid var(--gray-color);
  height: 38px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.clear-btn:hover { background-color: #f0f0f0; }

/* ===== 회원 목록 ===== */
.member-list { margin-top: 24px; }
.member-list-items {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #fff;
}
.member-row {
  display: grid;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color:#fff;
  border-radius: 8px;
  /* --- 데스크톱 레이아웃 (기본) --- */
  grid-template-columns: 1.1fr 0.9fr 1fr 1fr 1fr auto;
  grid-template-areas: "name id phone college major actions";
}
.member-row.editing { border: 1.5px solid var(--brand-color); margin: -1.5px; }

/* [핵심] nth-of-type 선택자를 사용해 각 필드를 grid-area에 할당
  이 방식은 HTML 구조에 의존적이므로 주의가 필요합니다.
*/
.member-row .input-wrapper:nth-of-type(1) { grid-area: name; }
.member-row .input-wrapper:nth-of-type(2) { grid-area: id; }
.member-row .input-wrapper:nth-of-type(3) { grid-area: phone; }
.member-row select:nth-of-type(1) { grid-area: college; }
.member-row select:nth-of-type(2) { grid-area: major; }
.member-row .edit-btn, .member-row .save-btn { grid-area: actions; justify-self: end; }

/* 회원 정보 필드 스타일 */
.input-wrapper, select { text-align: center; }
.edit-input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
select { text-align: left; }
.edit-btn, .save-btn {
  background-color: var(--brand-color);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
}
.edit-btn:hover, .save-btn:hover { background-color: var(--brand-color-dark); }

/* 에러 메시지 스타일 */
.server-error-message, .client-error-message {
  font-size: 12px;
  color: var(--error-color);
  padding: 0 12px 12px;
}
.client-error-message p { margin: 4px 0; }
.edit-input.error { border-color: var(--error-color); }

/* 완료 버튼 */
.addClubMember {
  display: block;
  width: 100%;
  max-width: 200px;
  height: 44px;
  margin: 32px 0 0 auto; /* 오른쪽 정렬 */
  background-color: var(--brand-color);
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.addClubMember:hover { background-color: var(--brand-color-dark); }

/* ===== 팝업 공통 스타일 ===== */
.popup-overlay2 {
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

.popup-overlay2 .popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.popup-overlay2 .confirm-message{
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 500;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.popup-overlay2 .confirm-button{
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

.popup-overlay2 .confirm-button:hover {
  background-color: #e69a3e; /* Slightly darker orange */
}

.popup-overlay2 .popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.line3 {
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-overlay2 .popup-message {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #2F2F2F;
  margin-top: 30px;
}

.popup-overlay2 .popup-message-red{
  line-height: 12px;
  color: #FF5C5C;
}

.popup-overlay2 .button-group {
  gap: 10px;
  justify-content: flex-end;
}

.popup-overlay2 .confirm-button{
  background-color: #FFB052;
  color: white;
  border: none;
  width: 90px;
  height: 35px;
  border-radius: 7px;
  cursor: pointer;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  text-align: center;
}

.cancel-button {
  background-color: #B9B9B9;
  color: #FFFFFF;
  border: none;
  width: 90px;
  height: 35px;
  border-radius: 7px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 125px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  text-align: center;
}

.cancel-button:hover {
  background-color: #7a7a7a;
}

/* (이하 팝업 스타일은 기존과 동일) */
.validation-error{ color: red;}

/* ===== 반응형: 태블릿 (992px 이하) ===== */
@media (max-width: 992px) {
  .member-row {
    grid-template-columns: 1fr 1fr; /* 2열 구조로 변경 */
    grid-template-areas:
      "name    name"
      "id      phone"
      "college major"
      ".       actions"; /* 수정 버튼 오른쪽 하단 배치 */
  }
}

/* ===== 반응형: 모바일 (600px 이하) ===== */
@media (max-width: 600px) {
  .container { padding: 16px; }
  .title-row { flex-direction: column; align-items: stretch; }
  
  .member-row {
    grid-template-columns: 1fr; /* 1열 구조로 변경 */
    grid-template-areas:
      "name" "id" "phone" "college" "major" "actions";
  }
  .member-row .input-wrapper, .member-row select { text-align: left; }
  .member-row .edit-input, .member-row span { text-align: left; }

  /* 모든 버튼 오른쪽 정렬 */
  .member-row .edit-btn, .member-row .save-btn { 
    justify-self: stretch; /* 1열일 때 버튼을 꽉 채움 */
    width: 100%; 
  }

  .addClubMember {
    max-width: none; /* 최대 너비 제한 해제 */
  }
}

</style>