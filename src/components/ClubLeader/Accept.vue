<template>
  <div>
    <!-- Main Content Section -->
    <div class="sections-container">
      <!-- Left Section: Member Requests -->
      <div class="section member-requests">
        <h2>회원 가입 요청 목록</h2>
        <p class="request-count">요청 인원: {{ requestedMembers.length }}명</p>
        <p class="instruction">각각의 목록에서 올바른 회원을 선택해주세요.</p>

        <div class="request-list">
          <div
              class="request-item-container"
              v-for="(member, index) in requestedMembers"
              :key="member.studentId"
          >
            <div
                class="request-item"
                :class="{ selected: selectedRequestedMembers.includes(index), rejected: member.rejected }"
                @click="toggleRequestedMember(index)"
            >
              <div class="member-info">
                <span class="name">{{ member.name }}</span>
                <span class="student-id">{{ member.studentId }}</span>
                <span class="department">{{ member.department }}</span>
                <span class="phone">{{ member.phone }}</span>
              </div>
            </div>
            <button class="action-button reject-button" @click.stop="rejectMember(index)">
              거절
            </button>
          </div>
        </div>
      </div>

      <!-- Vertical Line -->
      <div class="vertical-line"></div>

      <!-- Right Section: Added Members -->
      <div class="section added-members">
        <h2>엑셀파일로 추가한 동아리 회원 정보</h2>
        <p class="member-count">비회원: {{ addedMembers.length }} 명</p>

        <div class="added-member-list">
          <div
              class="added-member-container"
              v-for="(member, index) in addedMembers"
              :key="index"
          >
            <div
                v-if="editingIndex !== index"
                class="added-member-item"
                :class="{ selected: selectedAddedMembers.includes(index) }"
                @click="toggleAddedMember(index)"
            >
              <div class="member-info">
                <span class="name">{{ member.name }}</span>
                <span class="student-id">{{ member.studentId }}</span>
                <span class="department">{{ member.department }}</span>
                <span class="phone">{{ member.phone }}</span>
              </div>
            </div>

            <div v-else class="edit-form">
              <div class="edit-inputs">
                <input
                    v-model="editingMember.name"
                    class="edit-input name-input"
                    placeholder="이름"
                />
                <input
                    v-model="editingMember.studentId"
                    class="edit-input id-input"
                    placeholder="학번"
                />
                <select
                    v-model="editingMember.college"
                    class="edit-input college-select"
                    @change="onCollegeChange"
                >
                  <option value="">단과대학 선택</option>
                  <option v-for="college in colleges" :key="college.id" :value="college.name">
                    {{ college.name }}
                  </option>
                </select>
                <select
                    v-model="editingMember.department"
                    class="edit-input department-select"
                >
                  <option value="">학과 선택</option>
                  <option v-for="dept in availableDepartments" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>

                <input
                    v-model="editingMember.phone"
                    class="edit-input phone-input"
                    placeholder="전화번호"
                />
              </div>
            </div>
            <div class="action-buttons">
              <template v-if="editingIndex === index">
                <button class="action-button save-button" @click="saveEdit(index)">저장</button>
              </template>
              <button v-else class="action-button edit-button" @click.stop="editMember(index)">
                수정
              </button>
            </div>
          </div>
        </div>

        <!-- Error Messages -->
        <div v-if="errorMessages.length > 0" class="error-messages-container">
          <p v-for="(error, index) in errorMessages" :key="index" class="error-message">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Accept Button Section -->
    <div class="accept-section">
      <button
          class="accept-button"
          :class="{ active: selectedRequestedMembers.length > 0 }"
          :disabled="selectedRequestedMembers.length === 0"
          @click="selectedRequestedMembers.length > 0 ? showAcceptPopup = true : null"
      >
        수락
      </button>
    </div>

    <!-- Popup Section -->
    <div v-if="showEditPopup" class="popup-overlay">
      <div class="popup">
        <h3 class="popup-title">동아리 회원 수정</h3>
        <div class="popup-divider"></div>
        <p>해당 동아리 회원을 수정하시겠습니까?</p>
        <div class="popup-buttons">
          <button @click="cancelEditPopup" class="cancel-button">취소</button>
          <button @click="confirmEditPopup" class="confirm-button">확인</button>
        </div>
      </div>
    </div>

    <!-- 회원가입 확인 -->
    <div v-if="showAcceptPopup" class="popup-overlay">
      <div class="popup">
        <h3 class="popup-title">동아리 회원 가입 요청</h3>
        <div class="popup-divider"></div>
        <p>
          <span class="popup-highlight">해당 동아리 회원이 맞습니까?</span><br />
          다시 되돌릴 수 없으니 신중하게 선택해주세요.
        </p>
        <div class="popup-buttons">
          <button @click="cancelAccept" class="cancel-button">취소</button>
          <button @click="confirmAccept" class="confirm-button">확인</button>
        </div>
      </div>
    </div>

    <!-- 일치 -->
    <div v-if="showConfirmationPopup" class="popup-overlay">
      <div class="popup">
        <h3 class="popup-title">처리 결과</h3>
        <div class="popup-divider"></div>
        <p>회원 가입 요청이 정상적으로 처리되었습니다.</p>
        <div class="popup-buttons">
          <button @click="closeConfirmationPopup" class="confirm-button">확인</button>
        </div>
      </div>
    </div>

    <!-- 회원정보 불일치 -->
    <div v-if="showErrorPopup" class="popup-overlay">
      <div class="popup">
        <h3 class="popup-title">동아리 회원 가입 요청</h3>
        <div class="popup-divider"></div>
        <p>해당 동아리 회원의 정보가 일치하지 않습니다.<br />다시 확인해주세요.</p>
        <div class="popup-buttons">
          <button @click="closeErrorPopup" class="confirm-button">확인</button>
        </div>
      </div>
    </div>

    <!-- 거절 -->
    <div v-if="showRejectionPopup" class="popup-overlay">
      <div class="popup">
        <h3 class="popup-title">동아리 회원 가입 요청</h3>
        <div class="popup-divider"></div>
        <p>
          해당 동아리 회원 가입 요청을 거절하시겠습니까?
        </p>
        <div class="popup-buttons">
          <button @click="cancelRejection" class="cancel-button">취소</button>
          <button @click="confirmRejection" class="confirm-button">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { colleges, departmentsByCollege } from '../departments'; // 학과 정보 가져오기

export default {
  data() {
    return {
      addedMembers: [
        { name: "김길동", studentId: "12345678", college: "단과대학 A", department: "학부 A", phone: "010-1234-5678" },
        { name: "박철수", studentId: "87654321", college: "단과대학 B", department: "학부 B", phone: "010-9876-5432" },
      ],
      requestedMembers : [
        { name: "김길동", studentId: "12345678",phone: "010-1234-5678" },
        { name: "박철수", studentId: "87654321", phone: "010-9876-5432" },
      ],
      showEditPopup: false, // 팝업 표시 상태
      editingIndex: -1,
      editingMember: null,
      tempEditingMember: null, // 임시 저장용 객체 추가함
      colleges: colleges, // 전체 단과대학 정보
      selectedRequestedMembers: [],
      showAcceptPopup: false,
      showConfirmationPopup: false,
      showErrorPopup: false,
      showRejectionPopup: false,
      membersToReject: [],
      errorMessages: [], // 에러 메시지 배열
      selectedAddedMembers: [], // 선택된 회원 관리
    };
  },
  computed: {
    availableDepartments() {
      if (!this.editingMember?.college) return [];
      const collegeId = this.colleges.find(c => c.name === this.editingMember.college)?.id;
      return collegeId ? departmentsByCollege[collegeId] : [];
    }
  },
  mounted() {
    this.initializePage();
  },
  methods: {
    onCollegeChange() {
      // 단과대학이 변경되면 학과 선택을 초기화
      if (this.editingMember) {
        this.editingMember.department = '';
      }
    },
    initializePage() {
      this.loadData();
      const isFirstVisit = localStorage.getItem("firstVisit") === null;
      const reloaded = sessionStorage.getItem("reloaded");

      if (isFirstVisit) {
        localStorage.setItem("firstVisit", "true");
        sessionStorage.setItem("reloaded", "true");
        location.reload(); // 첫 방문 시 새로고침
      } else if (!reloaded) {
        sessionStorage.setItem("reloaded", "true");
        location.reload(); // 새로고침 여부 확인
      } else {
        sessionStorage.removeItem("reloaded");
      }
    },
    loadData() {
      const requested = localStorage.getItem("requestedMembers");
      const added = localStorage.getItem("addedMembers");

      this.requestedMembers = requested
          ? JSON.parse(requested)
          : [
            { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
          ];
      this.addedMembers = added
          ? JSON.parse(added)
          : [
            { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
          ];
    },
    saveData() {
      localStorage.setItem("requestedMembers", JSON.stringify(this.requestedMembers));
      localStorage.setItem("addedMembers", JSON.stringify(this.addedMembers));
    },
    toggleRequestedMember(index) {
      if (this.selectedRequestedMembers.includes(index)) {
        this.selectedRequestedMembers = []; // 선택 해제
      } else {
        this.selectedRequestedMembers = [index]; // 하나만 선택
      }
    },
    toggleAddedMember(index) {
      const selectedIndex = this.selectedAddedMembers.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedAddedMembers.splice(selectedIndex, 1);
      } else {
        this.selectedAddedMembers.push(index);
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
    confirmRejection() {
      this.membersToReject.forEach((index) => {
        this.requestedMembers.splice(index, 1);
      });
      this.membersToReject = [];
      this.showRejectionPopup = false;
      this.saveData();
    },
    cancelAccept() {
      this.showAcceptPopup = false;
    },
    confirmAccept() {
      if (this.validateMemberInfo()) {
        this.saveData();
      }
    },
    validateMemberInfo() {
      const selectedRequested = this.selectedRequestedMembers.map(
          (index) => this.requestedMembers[index]
      );
      const selectedAdded = this.selectedAddedMembers.map(
          (index) => this.addedMembers[index]
      );

      return selectedRequested.every((requested) =>
          selectedAdded.some((added) =>
              requested.name === added.name &&
              requested.studentId === added.studentId &&
              requested.department === added.department &&
              requested.phone === added.phone
          )
      );
    },
    closeConfirmationPopup() {
      this.showConfirmationPopup = false;
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
    },
    editMember(index) {
      this.editingIndex = index;
      // 깊은 복사를 통해 원본 데이터 보존
      this.editingMember = JSON.parse(JSON.stringify(this.addedMembers[index]));
      this.tempEditingMember = JSON.parse(JSON.stringify(this.addedMembers[index]));
      this.errorMessages = [];
    },
    saveEdit(index) {
      if (this.validateInput()) {
        this.tempEditingMember = { ...this.editingMember }; // 임시 저장
        this.showEditPopup = true;
      }
    },
    validateInput() {
      this.errorMessages = [];
      let isValid = true;

      if (!this.editingMember.name || !/^[가-힣a-zA-Z]+$/.test(this.editingMember.name)) {
        this.errorMessages.push('* 이름(특수 기호 제외 문자)을 입력해주세요.');
        isValid = false;
      }
      if (!this.editingMember.studentId || !/^\d{8}$/.test(this.editingMember.studentId)) {
        this.errorMessages.push('* 학번(8자리 숫자)을 입력해주세요.');
        isValid = false;
      }
      if (!this.editingMember.college) {
        this.errorMessages.push('* 단과대를 선택해주세요.');
        isValid = false;
      }
      if (!this.editingMember.department) {
        this.errorMessages.push('* 학과를 선택해주세요.');
        isValid = false;
      }
      if (!this.editingMember.phone || !/^010-\d{4}-\d{4}$/.test(this.editingMember.phone)) {
        this.errorMessages.push('* 전화번호(-제외 11자리 숫자)를 입력해주세요.');
        isValid = false;
      }

      return isValid;
    },
    confirmEditPopup() {
      if (!this.tempEditingMember) {
        console.error('No editing member data available');
        return;
      }

      // 유효성 검사 수행
      this.errorMessages = [];

      if (!this.tempEditingMember.name || !/^[가-힣a-zA-Z]+$/.test(this.tempEditingMember.name)) {
        this.errorMessages.push("* 이름(특수 기호 제외 문자)을 입력해주세요.");
      }
      if (!this.tempEditingMember.studentId || !/^\d{8}$/.test(this.tempEditingMember.studentId)) {
        this.errorMessages.push("* 학번(8자리 숫자)을 입력해주세요.");
      }
      if (!this.tempEditingMember.college) {
        this.errorMessages.push("* 단과대를 선택해주세요.");
      }
      if (!this.tempEditingMember.department) {
        this.errorMessages.push("* 학부를 선택해주세요.");
      }
      if (!this.tempEditingMember.phone || !/^010-\d{4}-\d{4}$/.test(this.tempEditingMember.phone)) {
        this.errorMessages.push("* 전화번호(- 제외 11자리 숫자)를 입력해주세요.");
      }

      // 에러가 있으면 팝업 유지
      if (this.errorMessages.length > 0) {
        return;
      }

      // 유효성 검사 통과 시 데이터 저장 및 팝업 닫기
      this.addedMembers[this.editingIndex] = { ...this.tempEditingMember };
      this.resetEditing();
      this.showEditPopup = false;
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
.confirm-button {
  background-color: #FFB052;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.sections-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 1400px;
  position: relative;
  margin-left: -70px;
  height: 100%;
  padding-right: 20px;
}

.section {
  flex: 0 0 calc(50% - 30px); /* 각 섹션이 동일한 너비를 가지도록 설정 */
  position: relative;
}

.accept-section {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  max-width: 1400px;
  margin-top: 20px;
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
  margin-bottom: 10px;
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

.vertical-line {
  width: 2px;
  background-color: #ddd;
  margin: 0 10px; /* 양쪽에 20px의 여백 추가 */
  flex-shrink: 0; /* 크기가 줄어들지 않도록 설정 */
  height: auto; /* 높이를 자동으로 설정 */
  align-self: stretch; /* 부모 컨테이너의 높이에 맞춤 */
  z-index: 1; /* 다른 요소들 위에 표시 */
}

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
  padding: 12px;
  width: 450px;
}

.edit-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 각 입력 필드별 너비 조정 */
.name-input {
  width: 80px !important;
  min-width: 80px;
  flex: 0 0 80px;
}

.id-input {
  width: 100px !important;
  min-width: 100px;
  flex: 0 0 100px;
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
  margin-left: 10px;
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

.popup {
  position: relative;
  width: 451px;
  height: 152px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 20px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup-title {
  color: #2F2F2F;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px; /* 75% */
}

.popup-divider {
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

.popup-highlight {
  color: #2F2F2F;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.popup-buttons {
  position: absolute;
  bottom: 20px; /* Adjust as needed */
  right: 20px; /* Adjust as needed */
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.confirm-button {
  display: flex;
  width: 80px;
  height: 32px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-size: 14px;
}

.confirm-button:hover {
  background-color: #e09b4d;
}
/* 추가된 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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

.error-messages-container {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping if there are too many messages */
  gap: 4px; /* Space between messages */
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


.save-button,
.cancel-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.cancel-button {
  background-color: #B9B9B9;
  color: white; /* Change text color to white */
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.cancel-button:hover {
  background-color: #8e8e8e; /* Change background color on hover */
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
  width: 65px; /* 동일한 너비 */
  height: 55px; /* 동일한 높이 */
}

.save-button:hover {
  background: #e09b4d; /* 호버 시 색상 변경 */
}
</style>
