<template>
  <div>
    <div class="sections-container">
      <!-- Left Section: Member Requests -->
      <div class="section member-requests">
        <h2>회원 가입 요청 목록</h2>
        <p class="request-count">요청 인원: {{ requestedMembers.length }}명</p>
        <p class="instruction">각각의 목록에서 올바른 회원을 선택해주세요.</p>

        <div class="request-list">
          <div class="request-item-container" v-for="(member, index) in requestedMembers" :key="member.studentId">
            <div class="request-item" :class="{ selected: selectedRequestedMembers.includes(index), rejected: member.rejected }" @click="toggleRequestedMember(index)">
              <div class="member-info">
                <span class="name1">{{ member.name }}</span>
                <span class="student-id">{{ member.studentId }}</span>
                <span class="department">{{ member.department }}</span>
                <span class="phone1">{{ member.phone }}</span>
              </div>
            </div>
            <button class="action-button reject-button" @click.stop="rejectMember(index)">거절</button>
          </div>
        </div>
      </div>

      <!--      <div class="vertical-line"></div> 구분선 삭제함-->

      <!-- Right Section: Added Members -->
      <div class="section added-members">
        <h2>엑셀파일로 추가한 동아리 회원 정보</h2>
        <p class="member-count">비회원: {{ addedMembers.length }} 명</p>

        <div class="added-member-list">
          <div class="added-member-container" v-for="(member, index) in addedMembers" :key="index">
            <!-- Normal view mode -->
            <div v-if="editingIndex !== index" class="member-item-wrapper">
              <div class="member-row">
                <div class="added-member-item" :class="{ selected: selectedAddedMembers.includes(index) }" @click="toggleAddedMember(index)">
                  <div class="member-info">
                    <span class="name1">{{ member.name }}</span>
                    <span class="student-id">{{ member.studentId }}</span>
                    <span class="department">{{ member.department }}</span>
                    <span class="phone1">{{ member.phone }}</span>
                  </div>
                </div>
                <div class="action-buttons">
                  <button class="action-button edit-button" @click.stop="editMember(index)">수정</button>
                </div>
              </div>
            </div>

            <!-- Edit mode -->
            <div v-else class="member-item-wrapper">
              <div class="member-row">
                <div class="edit-form">
                  <div class="edit-inputs">
                    <input v-model="editingMember.name" class="edit-input name-input" placeholder="이름"/>
                    <input v-model="editingMember.studentId" class="edit-input id-input" placeholder="학번"/>
                    <select v-model="editingMember.college" class="edit-input college-select" @change="onCollegeChange">
                      <option value="">단과대학 선택</option>
                      <option v-for="college in colleges" :key="college.id" :value="college.name">
                        {{ college.name }}
                      </option>
                    </select>
                    <select v-model="editingMember.department" class="edit-input department-select">
                      <option value="">학과 선택</option>
                      <option v-for="dept in availableDepartments" :key="dept" :value="dept">
                        {{ dept }}
                      </option>
                    </select>
                    <input v-model="editingMember.phone" class="edit-input phone-input" placeholder="전화번호"/>
                  </div>
                </div>
                <div class="action-buttons">
                  <button class="action-button save-button" @click="saveEdit(index)">저장</button>
                </div>
              </div>
              <!-- Error messages section -->
              <div v-if="errorMessagesByIndex[index] && errorMessagesByIndex[index].length > 0" class="error-messages">
                <p v-for="(error, errorIndex) in errorMessagesByIndex[index]" :key="errorIndex" class="error-message">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Accept Button Section -->
        <div class="accept-section">
          <button class="accept-button" :class="{ active: selectedRequestedMembers.length > 0 && selectedAddedMembers.length > 0 }"
                  :disabled="selectedRequestedMembers.length === 0 || selectedAddedMembers.length === 0"
                  @click="selectedRequestedMembers.length > 0 && selectedAddedMembers.length > 0 ? showAcceptPopup = true : null">
            수락
          </button>
        </div>
      </div>
    </div>



    <!-- Popups -->
    <Popup v-if="showEditPopup" :visible="showEditPopup" title="동아리 회원 수정"
           message="해당 동아리 회원을 수정하시겠습니까?"
           @cancel="cancelEditPopup" @confirm="confirmEditPopup"/>

    <Popup v-if="showAcceptPopup"
           :visible="showAcceptPopup"
           title="동아리 회원 가입 요청"
           message="해당 동아리 회원이 맞습니까?"
           sub-message="다시 되돌릴 수 없으니 신중하게 선택해주세요."
           @cancel="cancelAccept"
           @confirm="confirmAccept"/>

    <Popup v-if="showRejectionPopup" :visible="showRejectionPopup" title="동아리 회원 가입 요청"
           message="해당 동아리 회원 가입 요청을 거절하시겠습니까?" subMessage="다시 되돌릴 수 없으니 신중하게 선택해주세요."
           @cancel="cancelRejection" @confirm="confirmRejection"/>

    <Popup v-if="showConfirmationPopup"
           :visible="showConfirmationPopup"
           title="동아리 회원 가입 요청"
           message="회원 가입 요청이 정상적으로 처리되었습니다."
           :hideCancelButton="true"
           @confirm="closeConfirmationPopup"/>

    <Popup v-if="showErrorPopup"
           :visible="showErrorPopup"
           title="동아리 회원 가입 요청"
           :message="`해당 동아리 회원의 정보가 일치하지 않습니다.`"
           :subMessage="`${errorData}`"
           :message2="`을(를) 다시 확인해주세요.`"
           :hideCancelButton="true"
           @confirm="closeErrorPopup"/>

    <Popup v-if="show404ErrorPopup"
           :visible="show404ErrorPopup"
           title="동아리 회원 가입 요청"
           message="해당 동아리 회원은 존재하지 않습니다. 다시 한 번 확인해주세요."
           :hideCancelButton="true"
           @confirm="close404ErrorPopup"/>

    <Popup v-if="realCompletePopup"
           :visible="realCompletePopup"
           title="동아리 회원 가입 요청"
           :message="`회원 가입 요청이 정상적으로 처리되었습니다.`"
           :message2="`${completedMemberName} 동아리 회원에게 회원 가입 완료 소식을 전달해주세요.`"
           :hideCancelButton="true"
           @confirm="closerealCompletePopup"/>
  </div>
</template>

<script>
import { colleges, departmentsByCollege } from '../../departments'; // 학과 정보 가져오기
import Popup from './Popup.vue';
import axios from 'axios';
import store from '../../../store/store';

export default {
  components: {
    Popup
  },
  data() {
    return {
      addedMembers: [], // 엑셀로 추가된 비회원 목록
      requestedMembers: [], // 가입 요청 목록
      showEditPopup: false, // 팝업 표시 상태
      editingIndex: -1,
      editingMember: null,
      tempEditingMember: null, // 임시 저장용 객체 추가함
      colleges: colleges, // 전체 단과대학 정보
      selectedRequestedMembers: [],
      showAcceptPopup: false,
      showConfirmationPopup: false,
      showErrorPopup: false,
      show404ErrorPopup: false,
      showRejectionPopup: false,
      realCompletePopup: false,
      membersToReject: [],
      errorMessages: [], // 에러 메시지 배열
      selectedAddedMembers: [], // 선택된 회원 관리
      errorMessagesByIndex: {},

      errorData: '', // 400 에러시 additionalData 저장
      completedMemberName: '', // 회원가입 완료된 회원 이름 저장
    };
  },
  computed: {
    availableDepartments() {
      if (!this.editingMember?.college) return [];
      const collegeId = this.colleges.find(c => c.name === this.editingMember.college)?.id;
      return collegeId ? departmentsByCollege[collegeId] : [];
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        // 가입 요청 목록 조회
        const requestResponse = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members/sign-up`,{
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
        console.log('Request Response:', requestResponse);

        // 응답 데이터를 컴포넌트에 맞게 변환
        this.requestedMembers = requestResponse.data.data.map(member => ({
          id: member.clubMemberAccountStatusId, // 추후 작업을 위해 저장
          name: member.profileTempName,
          studentId: member.profileTempStudentNumber,
          department: member.profileTempMajor,
          phone: member.profileTempHp,
          rejected: false
        }));

        // 엑셀로 추가된 비회원 목록 조회
        const membersResponse = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members?sort=non-member`,{
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // 응답 데이터를 컴포넌트에 맞게 변환
        this.addedMembers = membersResponse.data.data.map(member => ({
          id: member.clubMemberId, // 추후 작업을 위해 저장
          name: member.userName,
          studentId: member.studentNumber,
          department: member.major,
          phone: member.userHp,
          college: this.findCollegeByDepartment(member.major),
        }));
      } catch (error) {
        console.error('데이터 fetch 중 오류 발생:', error);
        // 에러 처리 로직 추가 필요
      }
    },
    findCollegeByDepartment(department) {
      for (const college of colleges) {
        if (departmentsByCollege[college.id].includes(department)) {
          return college.name;
        }
      }
      return '';
    },
    async updateMemberInfo(memberId, memberData) {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.patch(
            `http://15.164.246.244:8080/club-leader/${clubId}/members/${memberId}/non-member`,
            {
              userName: memberData.name,
              studentNumber: memberData.studentId,
              userHp: memberData.phone.replace(/\D/g, ''), // Ensure phone number is sent as 11-digit number
              major: memberData.department
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        if (response.status === 200) {
          return true;
        }
        return false;
      } catch (error) {
        console.error('회원 정보 수정 중 오류 발생:', error);
        throw error;
      }
    },
    async confirmEditPopup() {
      if (!this.tempEditingMember) {
        console.error('No editing member data available');
        return;
      }

      try {
        const memberId = this.addedMembers[this.editingIndex].id;

        // Clean phone number before sending
        const cleanedPhone = this.tempEditingMember.phone.replace(/\D/g, '');

        const success = await this.updateMemberInfo(memberId, {
          ...this.tempEditingMember,
          phone: cleanedPhone // Send cleaned phone number to server
        });

        if (success) {
          // Store the cleaned phone number in local state
          this.addedMembers[this.editingIndex] = {
            ...this.tempEditingMember,
            phone: cleanedPhone
          };
          this.resetEditing();
          this.showEditPopup = false;
          this.$emit('show-toast', '회원 정보가 성공적으로 수정되었습니다.');
        }
      } catch (error) {
        this.errorMessagesByIndex[this.editingIndex] = ["회원 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요."];
        console.error('Error updating member:', error);
      }
    },

    onCollegeChange() {
      // 단과대학이 변경되면 학과 선택을 초기화
      if (this.editingMember) {
        this.editingMember.department = '';
      }
    },
    saveData() {
      localStorage.setItem("requestedMembers", JSON.stringify(this.requestedMembers));
      localStorage.setItem("addedMembers", JSON.stringify(this.addedMembers));
    },
    toggleRequestedMember(index) {
      if (this.selectedRequestedMembers.includes(index)) {
        this.selectedRequestedMembers = [];
      } else {
        this.selectedRequestedMembers = [index];
      }
    },
    toggleAddedMember(index) {
      const selectedIndex = this.selectedAddedMembers.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedAddedMembers.splice(selectedIndex, 1);
      } else {
        this.selectedAddedMembers = [index];
      }
    },
    rejectMember(index) {
      this.requestedMembers[index].rejected = true;
      this.membersToReject = [index];
      this.showRejectionPopup = true;
      this.saveData();
    },
    cancelRejection() {
      this.membersToReject.forEach((index) => {
        this.requestedMembers[index].rejected = false;
      });
      this.membersToReject = [];
      this.showRejectionPopup = false;
      this.saveData();
    },
    async confirmRejection() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        for (const index of this.membersToReject) {
          const memberId = this.requestedMembers[index].id;

          await axios.delete(`http://15.164.246.244:8080/club-leader/${clubId}/members/sign-up/${memberId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          this.requestedMembers.splice(index, 1);
        }
        this.membersToReject = [];
        this.showRejectionPopup = false;
        this.saveData();
      } catch (error) {
        console.error('회원 삭제 중 오류 발생:', error);
        // 에러 처리 로직 추가 필요
      }
    },

    cancelAccept() {
      this.showAcceptPopup = false;
    },
    async confirmAccept() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const requestedMember = this.requestedMembers[this.selectedRequestedMembers[0]];
        const addedMember = this.addedMembers[this.selectedAddedMembers[0]];

        const requestBody = {
          signUpProfileRequest: {
            id: requestedMember.id,
            userName: requestedMember.name,
            studentNumber: requestedMember.studentId,
            major: requestedMember.department,
            userHp: requestedMember.phone.replace(/-/g, '')
          },
          clubNonMemberProfileRequest: {
            id: addedMember.id,
            userName: addedMember.name,
            studentNumber: addedMember.studentId,
            major: addedMember.department,
            userHp: addedMember.phone.replace(/-/g, '')
          }
        };

        const response = await axios.post(
            `http://15.164.246.244:8080/club-leader/${clubId}/members/sign-up`,
            requestBody,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // 성공 응답 처리
        if (response.data.message === "기존 동아리 회원 가입 요청 수락 완료") {
          this.showConfirmationPopup = true;
        } else if (response.data.message === "기존 동아리 회원 가입 요청 수락 후 계정 생성 완료") {
          this.completedMemberName = response.data.data;
          this.realCompletePopup = true;
        }

        // 목록에서 처리된 회원 제거
        this.requestedMembers.splice(this.selectedRequestedMembers[0], 1);
        this.addedMembers.splice(this.selectedAddedMembers[0], 1);
        this.selectedRequestedMembers = [];
        this.selectedAddedMembers = [];

      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 400 && data.exception === "ProfileException") {
            this.errorData = data.additionalData.join(', ');
            this.showErrorPopup = true;
          } else if (status === 404 && data.exception === "ClubMemberException") {
            this.show404ErrorPopup = true;
          }
        } else {
          console.error('Error accepting member:', error);
        }
      }

      this.showAcceptPopup = false;
      this.saveData();
    },
    closeConfirmationPopup() {
      this.resetPopups();
      this.showConfirmationPopup = false;
    },
    closeErrorPopup() {
      this.resetPopups();
      this.showErrorPopup = false;
      this.errorData = '';
    },
    close404ErrorPopup() {
      this.resetPopups();
      this.show404ErrorPopup = false;
    },
    closerealCompletePopup() {
      this.resetPopups();
      this.realCompletePopup = false;
      this.completedMemberName = '';
    },
    resetPopups() {
      this.showAcceptPopup = false;
      this.showConfirmationPopup = false;
      this.showErrorPopup = false;
      this.show404ErrorPopup = false;
      this.realCompletePopup = false;
      this.errorData = '';
      this.completedMemberName = '';
    },
    editMember(index) {
      this.editingIndex = index;
      this.editingMember = JSON.parse(JSON.stringify(this.addedMembers[index]));
      this.tempEditingMember = JSON.parse(JSON.stringify(this.addedMembers[index]));
      this.errorMessagesByIndex = {}; // Clear any existing error messages
    },

    saveEdit(index) {
      if (this.validateInput()) {
        this.tempEditingMember = { ...this.editingMember }; // 임시 저장
        this.showEditPopup = true;
      }
    },

    validateInput() {
      this.errorMessagesByIndex[this.editingIndex] = [];
      let isValid = true;

      if (!this.editingMember.name || !/^[가-힣a-zA-Z]+$/.test(this.editingMember.name)) {
        this.errorMessagesByIndex[this.editingIndex].push('* 이름(특수 기호 제외 문자)을 입력해주세요.');
        isValid = false;
      }
      if (!this.editingMember.studentId || !/^\d{8}$/.test(this.editingMember.studentId)) {
        this.errorMessagesByIndex[this.editingIndex].push('* 학번(8자리 숫자)을 입력해주세요.');
        isValid = false;
      }
      if (!this.editingMember.college) {
        this.errorMessagesByIndex[this.editingIndex].push('* 단과대를 선택해주세요.');
        isValid = false;
      }
      if (!this.editingMember.department) {
        this.errorMessagesByIndex[this.editingIndex].push('* 학과를 선택해주세요.');
        isValid = false;
      }

      // New phone validation logic
      const cleanedPhone = this.editingMember.phone.replace(/\D/g, '');
      if (!cleanedPhone || cleanedPhone.length !== 11) {
        this.errorMessagesByIndex[this.editingIndex].push('* 전화번호(11자리 숫자)를 입력해주세요.');
        isValid = false;
      } else {
        // Store the cleaned phone number if it's valid
        this.editingMember.phone = cleanedPhone;
      }

      return isValid;
    },

    cancelEditPopup() {
      this.resetEditing();
      this.showEditPopup = false;
    },
    resetEditing() {
      this.editingIndex = -1;
      this.editingMember = null;
      this.tempEditingMember = null;
      this.errorMessages = [];
    },
  },
};
</script>

<style scoped>
.added-member-item.edit-mode {
  background: #fff;
  border: 1px solid #FFB052;
  padding: 12px;
  border-radius: 8px;
  width: 100%;
}

.added-member-item.edit-mode .member-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-input{
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
  width: 90px;
}

.phone-input {
  flex: 0.8; /* 전화번호 입력창 크기 */
}

/* 선택된 요청 멤버 (request-item) */
.request-item.selected {
  background-color: #FFB05266; /* 엑셀파일과 동일한 배경색 */
  border: 1px solid #FFB052;
  transition: background-color 0.3s ease, border-color 0.3s ease; /* 부드러운 전환 효과 */
}

/* 거절된 요청 멤버 */

.rejected .request-item {
  background-color: #D88181; /* 거절 상태 배경색 */
  color: white; /* 텍스트 색상 */
  transition: background-color 0.3s ease; /* 부드러운 전환 */
}
.added-members .added-member-item.selected {
  background-color: #FFB05266; /* 엑셀파일과 동일한 배경색 */
  border: 1px solid #FFB052;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}


/* 거절된 요청 멤버 */
.request-item.rejected {
  background-color:  #d45f5066; /* 빨간색 배경 */
  color: black; /* 텍스트 색상 */
  border: 1px solid #FFB052; /* 빨간 테두리 */
  transition: background-color 0.3s ease, border-color 0.3s ease; /* 부드러운 전환 효과 */
  pointer-events: none; /* 거절된 항목은 클릭 불가 */
}

.instruction {
  color: #FF3535; /* 텍스트 색상 */
  margin-bottom: 30px;
  /* 목록과의 간격 추가 */
}

.member-count{
  margin-bottom: 69px;

}

.sections-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 1400px;
  position: relative;
  margin-left: -100px;
  height: 100%;
  padding-right: 20px;
}

.section {
  flex: 0 0 calc(50% - 30px); /* 각 섹션이 동일한 너비를 가지도록 설정 */
  position: relative;
}

.accept-section {
  display: flex;
  justify-content: right;
  width: 100%;
  min-width: 500px;
  margin-top: 40px;
}


.member-requests,
.added-members {
  width: 100%;
  min-width: 300px;
}


.added-members {
  margin-top: -4px; /* Adjust this value to align with the left section */
}

.request-item-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  width: 500px;
}

.added-member-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 500px;
}

/* 회원 정보 아이템 공통 스타일 */
.request-item,
.added-member-item {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 450px;
}

/*.vertical-line { */
/*  width: 2px; */
//background-color: #ddd;
//margin: 0 10px; /* 양쪽에 20px의 여백 추가 */
//flex-shrink: 0; /* 크기가 줄어들지 않도록 설정 */
/* height: auto; 높이를 자동으로 설정 */
/* align-self: stretch; 부모 컨테이너의 높이에 맞춤 */
/*z-index: 1;  다른 요소들 위에 표시 }*/


.added-members .edit-section + .added-member-list {
  margin-top: 20px; /* 수정 섹션과 회원 목록 간 간격 */
}

@media (max-width: 1200px) {
  .member-requests, .added-members {
    width: 100%; /* 작은 화면에서 한 줄로 표시 */
    margin-bottom: 20px; /* 섹션 간 간격 */
  }
}

.request-list{}
.added-member-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width:auto;
  max-width: 100%; /* 내용이 초과하지 않도록 설정 */

}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 450px;
}


.request-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  width: 370px;
}


.member-info {
  display: flex;
  padding: 0px 9px;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  flex: 1;
  text-align: center;
}

/* 수정 폼 스타일 */
.edit-form {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #FFB052;
  border-radius: 8px;
  padding: 7px;
  width: 510px;
}

.edit-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-input {
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 각 입력 필드별 너비 조정 */
.name-input {
  width: 40px !important;
  max-width: 50px;
  flex: 0 0 50px;
}

.id-input {
  width: 60px !important;
  max-width: 70px;
  flex: 0 0 70px;
}

.college-select {
  width: 150px !important;
  min-width: 150px;
  flex: 0 0 150px;
}

.department-select {
  width: 150px !important;
  min-width: 150px;
  flex: 0 0 150px;
}

.phone-input {
  width: 130px !important;
  min-width: 130px;
  flex: 0 0 130px;
}

/* 액션 버튼 스타일 */
.action-buttons {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: 39px;
}

.reject-button {
  background: #e57373;
  color: white;
  border: none;
  padding: 2px 5px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  align-self: center;
  Width: 50px;
  Height: 39px;
}

.reject-button:hover {
  background: #e34141;
}

/* 기본 상태 (회색 버튼) */
.accept-button {
  background: #9d9d9d; /* 회색 배경 */
  color: white;
  cursor: not-allowed; /* 클릭 불가 */
  border: none;
  padding: 10px;
  border-radius: 3px;
  font-size: 16px;
  width: 175px;
  height: 45px;
  transition: background-color 0.3s ease;
}

.accept-button.active {
  background: #FFB052; /* 주황 배경 */
  cursor: pointer; /* 클릭 가능 */
}

.accept-button:disabled {
  cursor: not-allowed;
}

/* 회원 가입 요청 목록 타이틀 스타일 */
.member-requests h2,
.added-members h2 {
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
  margin-bottom: 20px; /* Add space below the heading */
}

.request-count,
.member-count {
  font-size: 16px;
  color: #333;
  margin-top: 20px; /* Optional: Adds space above the count text */
}

/* 회원 정보 스타일 */
.added-member-item {
  flex: 1; /* 회원 정보가 버튼을 제외한 전체를 차지하도록 설정 */
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  cursor: pointer; /* 클릭 가능한 상태로 설정 */
}

.edit-button {
  background: #FFB052; /* 주황색 배경 */
  color: white;
  border: none;
  padding: 2px 5px; /* 동일한 패딩 */
  border-radius: 8px; /* 동일한 테두리 반경 */
  cursor: pointer;
  font-size: 12px; /* 동일한 폰트 크기 */
  align-self: center;
  width: 50px; /* 동일한 너비 */
  height: 39px; /* 동일한 높이 */
}

.edit-button:hover {
  background: #e09b4d; /* 호버 시 색상 변경 */
}

.error-message {
  color: #ff3535;
  font-size: 11px;
  margin-top: 5px;
  line-height: 0.3;
}

.edit-input{
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
  min-width: 0;
}

.added-member-item.selected {
  background-color: #FFB05266; /* 엑셀파일과 동일한 배경색 */
  border: 1px solid #FFB052;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}


.edit-input{
  flex: 1; /* 필드들이 동일한 너비로 확장 */
  padding: 8px;
  border: 1px solid #ccc; /* 테두리 설정 */
  border-radius: 4px; /* 필드 모서리 둥글게 */
}

.save-button {
  background: #FFB052; /* 주황색 배경 */
  color: white;
  border: none;
  padding: 2px 5px; /* 동일한 패딩 */
  border-radius: 8px; /* 동일한 테두리 반경 */
  cursor: pointer;
  font-size: 14px; /* 동일한 폰트 크기 */
  align-self: center;
  width: 54px; /* 동일한 너비 */
  height: 47px; /* 동일한 높이 */
}

.save-button:hover {
  background: #e09b4d; /* 호버 시 색상 변경 */
}

.member-item-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
}

.member-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.error-messages {
  margin-top: 5px;
  margin-bottom: -15px;
  width: 100%;
}
</style>