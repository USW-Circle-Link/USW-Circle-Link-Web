<template>
  <div class="container">
    <!-- Left Section: Member Requests -->
    <div class="member-requests">
      <h2>회원 가입 요청 목록</h2>
      <p class="request-count">요청 인원: 04명</p>
      <p class="instruction">각각의 목록에서 올바른 회원을 선택해주세요.</p>
      <div class="request-list">
        <div 
          class="request-item-wrapper" 
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
            <i v-if="isEditMode" class="fa fa-pencil"></i> <!-- 모든 회원에 펜 아이콘 표시 -->
          </div>
        </div>
        <button class="reject-button" @click.stop="rejectMember(index)">거절</button>
      </div>
      </div>
    </div>

    

    <!-- Vertical Line -->
    <div class="vertical-line"></div>


    

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
  



    <!-- Right Section: Added Members -->
    <div class="added-members">
      <h2>엑셀파일로 추가한 동아리 회원 정보</h2>
      <p class="member-count">비회원: {{ addedMembers.length }} 명</p>

       <!-- 수정 섹션 (고정된 위치) -->
<!-- 수정된 HTML 구조 -->
<div v-if="currentEditingMember" class="edit-section-wrapper">
  <div class="edit-section">
    <input v-model="currentEditingMember.name" class="edit-input" placeholder="이름" />
    <input v-model="currentEditingMember.studentId" class="edit-input" placeholder="학번" />
    <select v-model="currentEditingMember.college" class="edit-select">
      <option disabled value="">단과대학 선택</option>
      <option v-for="college in colleges" :key="college" :value="college">
        {{ college }}
      </option>
    </select>
    <select v-model="currentEditingMember.department" class="edit-select">
      <option disabled value="">학부 선택</option>
      <option v-for="department in departments" :key="department" :value="department">
        {{ department }}
      </option>
    </select>
    <input v-model="currentEditingMember.phone" class="edit-input" placeholder="전화번호" />
  
  <!-- 수정 버튼: edit-section 외부 -->
  <button @click="validateAndShowPopup" class="save-button">수정</button>
  </div>

</div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessages.length > 0" class="error-messages">
          <p v-for="(error, index) in errorMessages" :key="index" class="error-message">
            {{ error }}
          </p>
        </div>

    <!-- 회원 목록 섹션 -->
    <div class="member-list">
      <div
        class="member-item-wrapper"
        v-for="(member, index) in addedMembers"
        :key="index"
      >
        <div class="member-item"
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
        <button class="edit-button" @click.stop="editMember(index)">수정</button>
      </div>
    </div>
  
  </div>

     
      <button 
      class="accept-button"
      :class="{ active: selectedRequestedMembers.length > 0 }" 
      :disabled="selectedRequestedMembers.length === 0" 
      @click="selectedRequestedMembers.length > 0 ? showAcceptPopup = true : null"
    >
      수락
    </button>


    </div>

    <!-- 회원가입 확인인 -->
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

    <!-- 일치치 -->
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

    <!-- 회원정보 불일치치 -->
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
  
</template>

<script>
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
      currentEditingMember: null,
      showEditPopup: false, // 팝업 표시 상태
      editingIndex: null, // 편집 중인 멤버의 인덱스
      colleges: ["단과대학 A", "단과대학 B", "단과대학 C"],
      departments: ["학부 A", "학부 B", "학부 C"],
      requestedMembers: [],
      selectedRequestedMembers: [],
      showAcceptPopup: false,
      showConfirmationPopup: false,
      showErrorPopup: false,
      showRejectionPopup: false,
      membersToReject: [],
      isEditMode: false, // 편집 모드 활성화 여부
            errorMessages: [], // 에러 메시지 배열
            selectedAddedMembers: [], // 선택된 회원 관리
    };
  },
  mounted() {
    this.initializePage();
  },
  methods: {
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
    toggleEditMode() {
  this.isEditMode = !this.isEditMode; // 편집 모드 활성화/비활성화 전환
},

toggleAddedMember(index) {
      const selectedIndex = this.selectedAddedMembers.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedAddedMembers.splice(selectedIndex, 1); // 선택 해제
      } else {
        this.selectedAddedMembers = [index]; // 하나만 선택되도록 설정
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
        this.showAcceptPopup = false;
        this.showConfirmationPopup = true;
        this.performReload();
      } else {
        this.showAcceptPopup = false;
        this.showErrorPopup = true;
      }
      this.saveData();
    },
    validateMemberInfo() {
      const selectedRequested = this.selectedRequestedMembers.map(
        (index) => this.requestedMembers[index]
      );
      const selectedAdded = this.selectedAddedMembers.map(
        (index) => this.addedMembers[index]
      );

      return selectedRequested.every((requested) =>
        selectedAdded.some(
          (added) =>
            requested.name === added.name &&
            requested.studentId === added.studentId &&
            requested.department === added.department &&
            requested.phone === added.phone
        )
      );
    },
    performReload() {
      sessionStorage.setItem("reloaded", "true");
      location.reload();
    },
    closeConfirmationPopup() {
      this.showConfirmationPopup = false;
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
    },
    editMember(index) {
      // Load member's data into the editing section
      this.currentEditingMember = { ...this.addedMembers[index] };
      this.editingIndex = index;
    },
    validateAndShowPopup() {
  // 모든 에러 메시지 기본으로 포함
  this.errorMessages = [
    "* 이름(특수 기호 제외 문자)을 입력해주세요. * 학번(8자리 숫자)을 입력해주세요. * 학과를 선택해주세요.",
    "* 전화번호(- 제외 11자리 숫자)를 입력해주세요."
  ];

  // 유효성 검사
  let isValid = true; // 기본 상태를 유효(true)로 설정
  if (!this.currentEditingMember.name || !/^[가-힣a-zA-Z]+$/.test(this.currentEditingMember.name)) {
    isValid = false;
  }
  if (!this.currentEditingMember.studentId || !/^\d{8}$/.test(this.currentEditingMember.studentId)) {
    isValid = false;
  }
  if (!this.currentEditingMember.college) {
    isValid = false;
  }
  if (!this.currentEditingMember.department) {
    isValid = false;
  }
  if (!this.currentEditingMember.phone || !/^010-\d{4}-\d{4}$/.test(this.currentEditingMember.phone)) {
    isValid = false;
  }

  // 유효성 검사가 실패하면 모든 에러 메시지 표시, 팝업 열지 않음
  if (!isValid) {
    return;
  }

  // 유효성 검사 통과 시 팝업 표시
  this.showEditPopup = true;
},
confirmEditPopup() {
  // 유효성 검사 수행
  this.errorMessages = [];

  if (!this.currentEditingMember.name || !/^[가-힣a-zA-Z]+$/.test(this.currentEditingMember.name)) {
    this.errorMessages.push("* 이름(특수 기호 제외 문자)을 입력해주세요.");
  }
  if (!this.currentEditingMember.studentId || !/^\d{8}$/.test(this.currentEditingMember.studentId)) {
    this.errorMessages.push("* 학번(8자리 숫자)을 입력해주세요.");
  }
  if (!this.currentEditingMember.college) {
    this.errorMessages.push("* 단과대를 선택해주세요.");
  }
  if (!this.currentEditingMember.department) {
    this.errorMessages.push("* 학부를 선택해주세요.");
  }
  if (!this.currentEditingMember.phone || !/^010-\d{4}-\d{4}$/.test(this.currentEditingMember.phone)) {
    this.errorMessages.push("* 전화번호(- 제외 11자리 숫자)를 입력해주세요.");
  }

  // 에러가 있으면 팝업 유지
  if (this.errorMessages.length > 0) {
    return;
  }

  // 유효성 검사 통과 시 데이터 저장 및 팝업 닫기
  if (this.editingIndex !== null) {
    this.addedMembers[this.editingIndex] = { ...this.currentEditingMember };
  }
  this.resetEditing();
  this.showEditPopup = false;
},

    cancelEditPopup() {
      // Cancel editing and close popup
      this.resetEditing();
      this.showEditPopup = false;
    },
    resetEditing() {
      this.currentEditingMember = null;
      this.editingIndex = null;
    },
  },

};
</script>


<style scoped>


.edit-row {
  display: flex;
  align-items: center;
  gap: 10px; /* 각 필드 간의 간격 */
}

.edit-input,
.edit-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1; /* 동일한 너비로 설정 */
  width: 90px;
  
}

.phone-input {
  flex: 0.8; /* 전화번호 입력창 크기 */
}

.save-button {
  background-color: #ffc107;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  flex: 0.3; /* 버튼 크기 */
}
.edit-section {
  position: absolute; /* 독립적으로 배치 */
  top: 270px; /* 부모 기준으로 위쪽 간격 */
  left: 76%; /* 부모 기준 중앙 정렬 */
  transform: translateX(-50%); /* 정확한 중앙 정렬 */
  margin-bottom: 20px; /* 아래 리스트와 간격 유지 */
  width: 660px; /* 고정 너비 */
  padding: 10px; /* 내부 여백 */
  background-color: #fff; /* 흰색 배경 */
  border: 1px solid #FFB052; /* 주황색 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  display: flex; /* 필드가 한 줄로 정렬 */
  gap: 20px; /* 입력 필드 간격 */
  align-items: center; /* 필드 세로 정렬 */
  z-index: 10; /* 리스트 위에 표시 */
  height: 20px;
}


.member-item {
  cursor: pointer; /* 클릭 가능한 상태로 설정 */
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
.added-members .member-item.selected {
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

.popup {
  width: 452px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.popup-divider {
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

.popup p {
  font-size: 14px;
  color: #666;
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


.container {
  display: flex;
  flex-wrap: wrap; /* 화면 너비에 따라 줄바꿈 가능 */
  justify-content: space-between; /* 섹션 간격 유지 */
  gap: 20px; /* 각 섹션 간 간격 */
  padding: 20px;
  margin: 0 auto; /* 화면 가운데 정렬 */
  max-width: 1200px; /* 최대 너비 제한 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  overflow-x: hidden; /* 가로 스크롤 제거 */
}

.member-requests,
.added-members {
  width: calc(50% - 10px); /* 두 섹션이 화면을 반반 차지 */
  min-width: 300px; /* 최소 너비 */
  flex: 1; /* 가변 너비 */
}


.vertical-line {
  width: 2px; /* 세로선의 너비 */
  background-color: #ddd; /* 선 색상 */
  height: 100%; /* 부모 컨테이너의 높이 사용 */
  align-self: stretch; /* 컨테이너의 전체 높이 맞추기 */
  margin: 0 20px; /* 좌우 간격 추가 */
  position: relative; /* 고정된 위치 설정 */
}

.added-members .edit-section + .member-list {
  margin-top: 20px; /* 수정 섹션과 회원 목록 간 간격 */
}

@media (max-width: 1200px) {
  .member-requests, .added-members {
    width: 100%; /* 작은 화면에서 한 줄로 표시 */
    margin-bottom: 20px; /* 섹션 간 간격 */
  }

  .accept-button {
    bottom: 10px; /* 버튼 위치 재조정 */
    right: 10px;
  }
}

.request-list{}
.member-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width:auto;
  max-width: 100%; /* 내용이 초과하지 않도록 설정 */
  
}

.request-item-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  width: 471px;
  margin-right:200px ;
}
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid transparent;
  position: relative; /* 자식 요소 위치 설정 */
  transition: all 0.3s;
  cursor: pointer;
  width: 250px;
  
}

.request-item-wrapper.selected,
.member-item.selected {
  border: 1px solid var(--hover, #FFB052);
  background-color: var(--hover, #FFB052);
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
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  flex: 1;
  text-align: center;
}

.reject-button {
  margin-left: 10px;
  background: #D88181;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  align-self: center;
  Width:60px;
  Height:44px;
}


.reject-button:hover {
  background: #C76C6C;
}

/* Penbrush Icon */
.penbrush-icon {
  width: 24px;
  height: 24px;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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
    /* 새 위치 설정 */
    margin-top: 900px; /* 위쪽 간격 */
    position: fixed; /* 화면에 고정 */
  bottom: 20px;
  right: 250px; /* 버튼이 화면 안에 있도록 조정 */
  max-width: calc(100% - 40px); /* 버튼이 부모 영역을 넘지 않도록 제한 */
  /* display: block; 가운데 정렬을 위해 block 요소로 설정 */
  
}

/* 활성화된 상태 (회원 선택 시) */
.accept-button.active {
  background: #FFB052; /* 주황 배경 */
  cursor: pointer; /* 클릭 가능 */
}

/* 비활성화 상태 */
.accept-button:disabled {
  cursor: not-allowed;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  width: 452px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.popup-divider {
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

.popup p {
  font-size: 14px;
  color: black;
  font-weight: 500px;
}

.popup-highlight {
  font-weight: 500px;
  color: black;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button,
.confirm-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #666;
}

.confirm-button {
  background-color: #FFB052;
  color: white;
}

.cancel-button:hover {
  background-color: #d5d5d5;
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
  margin-top: 40px; /* Optional: Adds space above the count text */
}

.member-item-wrapper {
  display: flex; /* 버튼과 정보를 한 줄로 정렬 */
  justify-content: space-between; /* 정보와 버튼 사이 간격 확보 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 20px; /* 정보와 버튼 간격 */
}

/* 회원 정보 스타일 */
.member-item {
  flex: 1; /* 회원 정보가 버튼을 제외한 전체를 차지하도록 설정 */
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.edit-button {
  background: #FFB052; /* 주황색 배경 */
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 200;
  width: 55px; /* 버튼 너비 */
  height: 44px; /* 버튼 높이 */
  margin-left: auto; /* 버튼을 오른쪽 끝으로 정렬 */
  display: block; /* 블록 형태로 변경 */
}


.error-message {
  color: #ff3535;
  font-size: 10px;
  margin-top: 5px;
}

.edit-input,
.edit-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #FFB052;
  color: white;
}

.cancel-button {
  background-color: #e0e0e0;
  color: black;
}

.member-item.selected {
  background-color: #FFB05266; /* 엑셀파일과 동일한 배경색 */
  border: 1px solid #FFB052;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}


.edit-section {
  display: flex; /* 입력 필드와 버튼을 한 줄로 정렬 */
  gap: 10px; /* 필드 간 간격 */
  align-items: center; /* 버튼과 필드를 세로 정렬 */
  border: 1px solid #FFB052; /* 주황 테두리 */
  border-radius: 8px; /* 테두리 둥글게 */
  padding: 10px; /* 내부 여백 */
  background-color: white; /* 배경 흰색 */
  width:540px;
}

.edit-input,
.edit-select {
  flex: 1; /* 필드들이 동일한 너비로 확장 */
  padding: 8px;
  border: 1px solid #ccc; /* 테두리 설정 */
  border-radius: 4px; /* 필드 모서리 둥글게 */
}

.save-button {
  background-color: #FFB052; /* 주황색 배경 */
  color: white; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 8px 16px; /* 내부 여백 */
  cursor: pointer; /* 클릭 가능 */
  font-size: 14px; /* 텍스트 크기 */
  width: auto; /* 텍스트 길이에 맞게 너비 조정 */
  height: auto; /* 높이 자동 조정 */
  text-align: center; /* 텍스트 가운데 정렬 */
  display: inline-block; /* 버튼을 가로로 정렬 */
  line-height: normal; /* 텍스트 세로 정렬 해제 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  writing-mode: horizontal-tb; /* 텍스트 방향을 가로로 설정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  vertical-align: middle; /* 버튼이 부모 안에서 가운데 정렬 */
}




</style>
