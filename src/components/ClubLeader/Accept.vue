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
          </div>
        </div>
        <button class="reject-button" @click.stop="rejectMember(index)">거절</button>
      </div>
      </div>
    </div>

    

    <!-- Vertical Line -->
    <div class="vertical-line"></div>

    <!-- Right Section: Added Members -->
    <div class="added-members">
      <h2>엑셀파일로 추가한 동아리 회원 정보</h2>
      <p class="member-count">비회원: {{ addedMembers.length }} 명</p>
      <div class="member-list">
        <div
          class="member-item"
          v-for="(member, index) in addedMembers"
          :key="index"
          :class="{ selected: selectedAddedMembers.includes(index) }"
          @click="toggleAddedMember(index)"
        >
          <div class="member-info">
            <span class="name">{{ member.name }}</span>
            <span class="student-id">{{ member.studentId }}</span>
            <span class="department">{{ member.department }}</span>
            <span class="phone">{{ member.phone }}</span>
          </div>
          <!-- Penbrush Icon: Outside Member -->
          <img
            v-if="selectedAddedMembers.includes(index)"
            class="penbrush-icon"
            src="../../assets/penbrush.png"
            alt="Edit Icon"
          />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestedMembers: [
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
      ],
      addedMembers: [
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
        { name: "이보영", studentId: "20517055", department: "미디어SW", phone: "010-1234-5678" },
      ],
      selectedRequestedMembers: [],
      selectedAddedMembers: [],
      showAcceptPopup: false,
      showConfirmationPopup: false,
      showErrorPopup: false,
      showRejectionPopup: false,
      membersToReject: [],
    };
  },
  methods: {
    toggleRequestedMember(index) {
      const selectedIndex = this.selectedRequestedMembers.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedRequestedMembers.splice(selectedIndex, 1);
      } else {
        this.selectedRequestedMembers.push(index);
      }
    },
    toggleAddedMember(index) {
      const selectedIndex = this.selectedAddedMembers.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedAddedMembers.splice(selectedIndex, 1);
      } else {
        this.selectedAddedMembers.push(index);
      }
      console.log(this.selectedAddedMembers); // 선택된 멤버 확인
    },
      rejectMember(index) {
    this.requestedMembers[index].rejected = true; // 거절 상태를 true로 설정
    this.membersToReject = [index]; // 팝업을 위한 선택된 멤버 설정
    this.showRejectionPopup = true; // 팝업 표시
  },
  cancelRejection() {
    // 거절 상태 복원
    this.membersToReject.forEach((index) => {
      this.requestedMembers[index].rejected = false;
    });
    this.membersToReject = []; // 선택된 멤버 초기화
    this.showRejectionPopup = false; // 팝업 닫기
  },
    confirmRejection() {
    // requestedMembers에서 멤버 삭제
    this.membersToReject.forEach((index) => {
      this.requestedMembers.splice(index, 1);
    });
    this.membersToReject = [];
    this.showRejectionPopup = false;
  },

    cancelAccept() {
      this.showAcceptPopup = false;
    },
    confirmAccept() {
      if (this.validateMemberInfo()) {
        this.showAcceptPopup = false;
        this.showConfirmationPopup = true;
      } else {
        this.showAcceptPopup = false;
        this.showErrorPopup = true;
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
        selectedAdded.some(
          (added) =>
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
  },
};
</script>


<style scoped>
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
  color: #FF3535; /* 텍스트 색상을 변경 */
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
  justify-content: space-between; /* 좌우로 공간 분배 */
  align-items: flex-start; /* 세로 방향에서 시작 정렬 */
  padding: 40px;
  background-color: #F0F2F5;
  font-family: Arial, sans-serif;
  width: 100%; /* 부모 너비를 100%로 설정 */
  gap: 20px; /* 세로선과 두 섹션 사이 간격 */
}


.member-requests,
.added-members {
  width: 45%;
  background: #F0F2F5;
  padding: 20px;
  border-radius: 10px;
}

.vertical-line {
  width: 2px; /* 세로선의 너비 */
  background-color: #ddd; /* 선 색상 */
  height: 100%; /* 부모 컨테이너의 높이 사용 */
  align-self: stretch; /* 컨테이너의 전체 높이 맞추기 */
  margin: 0 20px; /* 좌우 간격 추가 */
  position: relative; /* 고정된 위치 설정 */
}


.request-list,
.member-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.request-item-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: 400px;
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
  width: 160px;
  height: 40px;
  transition: background-color 0.3s ease;
    /* 새 위치 설정 */
    margin-top: 600px; /* 위쪽 간격 */
  margin-left: 295px; /* 왼쪽 여백 자동 */
  margin-right: auto; /* 오른쪽 여백 자동 */
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
  color: #666;
}

.popup-highlight {
  font-weight: bold;
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
</style>
