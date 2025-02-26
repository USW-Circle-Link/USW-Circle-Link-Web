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
           message="해당 동아리 회원의 가입 요청을 수락하시겠습니까?"
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

    <Popup401 v-if="show401Popup" />
  </div>
</template>

<script>
import { colleges, departmentsByCollege } from '../../departments'; // 학과 정보 가져오기
import Popup from './Popup.vue';
import axios from 'axios';
import store from '../../../store/store';
import Popup401 from '../401Popup.vue'; // 401 팝업 컴포넌트 추가

export default {
  components: {
    Popup,
    Popup401,
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

      show401Popup: false,
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
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },

    async fetchData() {
      console.log("🔍 Vuex 상태 확인:", store.state);
    console.log("🔍 Access Token:", store.state.accessToken);
    console.log("🔍 clubUUID:", store.state.clubUUID);
    console.log("🔍 clubMemberUUID:", store.state.clubMemberUUID);
    console.log("🔍 clubMemberAccountStatusUUID:", store.state.clubMemberAccountStatusUUID);

    const accessToken = store.state.accessToken;
    const clubMemberUUID = store.state.clubMemberUUID; //주석 해제 후 값 가져오기
    const clubMemberAccountStatusUUID = store.state.clubMemberAccountStatusUUID;
    const clubUUID = store.state.clubUUID;
    try {
        // Vuex 상태값 확인
        if (!accessToken || !clubUUID) {
            console.error('Access token or clubMemberAccountStatusUUID is missing');
            alert('로그인이 필요합니다.');
            return;
        }

        // 가입 요청 목록 조회
        const requestResponse = await axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/members/sign-up`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Request Response:', requestResponse.data);

        if (!requestResponse.data || !requestResponse.data.data) {
            throw new Error('가입 요청 목록 응답이 올바르지 않습니다.');
        }

        this.requestedMembers = requestResponse.data.data.map(member => ({
          clubMemberAccountStatusUUID: member.clubMemberAccountStatusUUID,
            name: member.profileTempName,
            studentId: member.profileTempStudentNumber,
            department: member.profileTempMajor,
            phone: member.profileTempHp,
            rejected: false
        }));

        // clubMemberUUID가 존재하는지 확인
        if (!clubUUID) {
            console.warn('clubMemberUUID가 존재하지 않습니다. 비회원 목록을 불러오지 않습니다.');
            return;
        }

        // 엑셀로 추가된 비회원 목록 조회
        const membersResponse = await axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/members?sort=non-member`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Members Response:', membersResponse.data);

        if (!membersResponse.data || !membersResponse.data.data) {
            throw new Error('비회원 목록 응답이 올바르지 않습니다.');
        }

        this.addedMembers = membersResponse.data.data.map(member => ({
          clubMemberUUID: member.clubMemberUUID,
            name: member.userName,
            studentId: member.studentNumber,
            department: member.major,
            phone: member.userHp,
            college: this.findCollegeByDepartment(member.major),
        }));

    } catch (error) {
        if (!this.handle401Error(error)) {
            console.error('동아리 정보를 불러오는데 실패했습니다.', error);
            alert('동아리 정보를 불러오는데 실패했습니다.');
        }
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
      const clubUUID = store.state.clubUUID;
     // const memberId = this.requestedMembers[index].clubMemberUUID;

      try {
        const response = await axios.patch(
            `http://15.164.246.244:8080/club-leader/${clubUUID}/members/${memberId}/non-member`,
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
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
    },

    async confirmEditPopup() {
      if (!this.tempEditingMember) {
        console.error('No editing member data available');
        return;
      }

      try {
        const memberId = this.addedMembers[this.editingIndex].clubMemberUUID;

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
      const clubUUID = store.state.clubUUID;

      try {
        for (const index of this.membersToReject) {
          const memberId = this.requestedMembers[index].clubMemberAccountStatusUUID;

          await axios.delete(`http://15.164.246.244:8080/club-leader/${clubUUID}/members/sign-up/${memberId}`, {
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
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
    },

    cancelAccept() {
      this.showAcceptPopup = false;
    },

    async confirmAccept() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      if (!clubUUID) {
        console.error("clubUUID가 없습니다.");
        alert("클럽 정보가 올바르지 않습니다. 다시 로그인하거나 새로고침해 주세요.");
        return;
      }

      try {
        //선택한 회원의 uuid 값 가져오기 (갱신)
        const requestedIndex = this.selectedRequestedMembers[0];
        const addedIndex = this.selectedAddedMembers[0];

        const requestedMember = { ...this.requestedMembers[requestedIndex] };
        const addedMember = { ...this.addedMembers[addedIndex] };

        console.log("선택한 회원 정보 업데이트 확인:", requestedMember, addedMember);

        const requestBody = {
          signUpProfileRequest: {
            uuid: requestedMember.clubMemberAccountStatusUUID,
            userName: requestedMember.name,
            studentNumber: requestedMember.studentId,
            major: requestedMember.department,
            userHp: requestedMember.phone.replace(/-/g, '')
          },
          clubNonMemberProfileRequest: {
            uuid: addedMember.clubMemberUUID,
            userName: addedMember.name,
            studentNumber: addedMember.studentId,
            major: addedMember.department,
            userHp: addedMember.phone.replace(/-/g, '')
          }
        };

        console.log("API 요청 바디:", JSON.stringify(requestBody, null, 2));

        const response = await axios.post(
            `http://15.164.246.244:8080/club-leader/${clubUUID}/members/sign-up`,
            requestBody,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        console.log("가입 요청 성공:", response.data);

        if (response.data.message === "기존 동아리 회원 가입 요청 수락 완료") {
          this.showConfirmationPopup = true;
        } else if (response.data.message === "기존 동아리 회원 가입 요청 수락 후 계정 생성 완료") {
          this.completedMemberName = response.data.data;
          this.realCompletePopup = true;
        }

        // 선택한 회원 제거
        this.requestedMembers.splice(requestedIndex, 1);
        this.addedMembers.splice(addedIndex, 1);
        this.selectedRequestedMembers = [];
        this.selectedAddedMembers = [];

      } catch (error) {
        if (error.response) {
          console.error("API 요청 실패:", error.response.data);

          if (error.response.status === 401) {
            this.show401Popup = true;
          } else if (error.response.status === 404) {
            // 404 에러일 때 show404ErrorPopup 표시
            this.show404ErrorPopup = true;
          } else if (error.response.data.code === "PFL-209") {
            // PFL-209 에러 코드일 때 showErrorPopup 표시하고 additionalData 설정
            this.errorData = error.response.data.additionalData.join(', ');
            this.showErrorPopup = true;
          } else {
            // 기타 에러의 경우 일반 에러 팝업 표시
            this.errorData = '알 수 없는 오류가 발생했습니다.';
            this.showErrorPopup = true;
          }
        } else {
          this.errorData = '네트워크 오류가 발생했습니다.';
          this.showErrorPopup = true;
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
  max-width: 1000px;
  position: relative;
  height: 100%;
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


.added-members .edit-section + .added-member-list {
  margin-top: 20px; /* 수정 섹션과 회원 목록 간 간격 */
}

@media (max-width: 1200px) {
  .member-requests, .added-members {
    width: 100%; /* 작은 화면에서 한 줄로 표시 */
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
  margin-bottom: 30px;
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



/* 메인 컨테이너: 좌우 섹션을 담는 최상위 컨테이너 */
.sections-container {
  display: flex; /* Flexbox 레이아웃 사용 */
  justify-content: space-between; /* 좌우 섹션 사이 공간 균등 분배 */
  gap: 15px; /* 섹션 사이 간격 */
  max-width: 1200px; /* 최대 너비 제한 */
  position: relative;
  height: 100%;
  padding-right: 20px;
  margin-left: -50px;
}

/* 화면 너비가 1300px 미만일 때의 반응형 스타일 */
@media (max-width: 1300px) {
  /* 컨테이너를 세로 방향으로 변경 */
  .sections-container {
    flex-direction: column; /* 섹션들을 세로로 배치 */
    align-items: center; /* 가운데 정렬 */
    padding-right: 0; /* 패딩 제거 */
    gap: 60px;
  }

  /* 각 섹션의 너비 조정 */
  .section {
    flex: 1 1 100%; /* flex-grow: 1, flex-shrink: 1, flex-basis: 100% */
    width: 100%;
    max-width: 500px; /* 섹션 최대 너비 제한 */
  }

  /* 좌우 섹션 공통 스타일 */
  .member-requests,
  .added-members {
    width: 100%;
    min-width: unset; /* 최소 너비 제한 해제 */
  }

  /* 회원 컨테이너 스타일 */
  .request-item-container,
  .added-member-container {
    width: 100%; /* 컨테이너 전체 너비 사용 */
  }

  /* 회원 아이템 스타일 */
  .request-item,
  .added-member-item {
    width: 100%; /* 아이템 전체 너비 사용 */
  }

  /* 편집 폼 스타일 */
  .edit-form {
    width: 100%;
  }

  /* 입력 필드 컨테이너 스타일 */
  .edit-inputs {
    flex-wrap: wrap; /* 입력 필드 줄바꿈 허용 */
    gap: 8px; /* 필드 간 간격 */
  }

  /* 입력 필드 공통 스타일 */
  .edit-input,
  .college-select,
  .department-select {
    flex: 1 1 calc(50% - 4px); /* 2열 배치를 위한 너비 계산 */
    min-width: unset;
    width: auto !important;
  }

  /* 이름, 학번, 전화번호 입력 필드 스타일 */
  .name-input,
  .id-input,
  .phone-input {
    flex: 1 1 calc(33.333% - 6px); /* 3열 배치를 위한 너비 계산 */
    min-width: unset;
    width: auto !important;
  }

  /* 수락 버튼 섹션 스타일 */
  .accept-section {
    min-width: unset;
    width: 100%;
    justify-content: center; /* 버튼 중앙 정렬 */
  }

  /* member-count와 added-member-list 사이 간격 조정 */
  .member-count {
    margin-bottom: 30px; /* 반응형에서는 간격을 줄임 (기존 69px에서 변경) */
  }
}

</style>
