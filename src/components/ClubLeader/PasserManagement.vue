<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 합격/불합격 처리</p>
    </div>
    <div class="status-actions">
      <button class="send-result-btn" @click="showPopup">지원 결과 전송</button>
      <div class="status-boxes">
        <button class="status-box approve-box" @click="setAllApplicantsStatus('PASS')">전체<br>합격</button>
        <button class="status-box reject-box" @click="setAllApplicantsStatus('FAIL')">전체<br>불합격</button>
      </div>
    </div>
    <div class="contents">
      <div class="applicant-list">
        <div class="applicant-item" v-for="applicant in applicants" :key="applicant.aplictUUID">
          <p>{{ applicant.userName }}</p>
          <p>{{ applicant.studentNumber }}</p>
          <p>{{ applicant.major }}</p>
          <p>{{ applicant.userHp }}</p>
          <div class="buttons-group">
            <label :class="{ checked: applicant.decision === 'PASS' }" @click="toggleDecision(applicant, 'PASS')">
              <span class="check-icon"></span>
            </label>
            <label :class="{ checked: applicant.decision === 'FAIL' }" @click="toggleDecision(applicant, 'FAIL')">
              <span class="check-icon"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
        <h2>지원 결과 전송</h2>
        <hr>
        <p class="confirm-message">합격/불합격 처리를 확정 하시겠습니까?</p>
        <p class="notice-message">확정 후 지원자에게 알림이 발송 되니 신중하게 선택해 주세요.</p>
        <div class="popup-buttons">
          <button @click="hidePopup">취소</button>
          <button @click="confirmSendResults">확정</button>
        </div>
      </div>
    </div>

  </div>

  <!-- 예기치 못한 오류 팝업 -->
  <div v-if="showUnexpectedErrorPopup" class="popup-overlay">
    <div class="unexpectedPopup">
      <h2>동구라미</h2>
      <hr />
      <p class="confirm-message">
        <span class="error-highlight">예기치 못한 오류</span>가 발생했습니다.<br>문제가 계속될 시, 관리자에게 문의해주세요.</p>
      <div class="unexpectedPopup-buttons">
        <button @click="hideUnexpectedErrorPopup">확인</button>
      </div>
    </div>
  </div>

  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios'; 
import store from '@/store/store'; // Vuex에서 상태 가져오기
import Popup401 from './401Popup.vue';

export default {
  name: 'ApplicantManagement',
  components: {
    Popup401
  },
  data() {
    return {
      applicants: [],//지원자 목록 배열
      showConfirmPopup: false,//합/불 확인 팝업 표시
      notification: {
        message: '',//사용자에게 표시 할 알림 메세지
        type: '' // 알림 메시지 타입 (성공/실패)
      },
      fetchUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/applicants`, // 지원자 명단을 가져오는 서버 URL
      submitUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/applicants/notifications`, // 합/불 결과를 보내는 서버 URL
      show401Popup: false,
      showUnexpectedErrorPopup: false,
    };
  },
  //지원자 명단 가져오기
  mounted() {
    this.fetchApplicants();
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      // 에러 응답 O, 상태코드 401인 경우
      if (error.response && error.response.status === 401) {
        this.show401Popup = true; //팝업
        return true;
      }
      return false;
    },

    // 지원자 목록을 서버에서 가져오는 메서드
    async fetchApplicants() {
      try {
        const response = await fetch(this.fetchUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        // 여기에 401 체크 추가
        if (response.status === 401) {
          this.show401Popup = true; // 401 에러인 경우 팝업 표시 후 종료
          return;
        }
        //요청 성공 시 
        if (response.ok) {
          const result = await response.json();

          const data = result.data;
          // 응답 데이터가 배열 형태일 경우 처리
          if (data && Array.isArray(data)) {
            // applicant 데이터를 가공하여 상태 저장
            this.applicants = data.map(applicant => ({
              aplictUUID: applicant.aplictUUID, // 지원자 UUID 
              userName: applicant.userName, // 지원자 이름
              studentNumber: applicant.studentNumber, // 지원자 학번
              major: applicant.major, // 지원자 학과 
              userHp: applicant.userHp, // 지원자 연락처 
              decision: null, // 합/불 상태 (초기값 null) 
            }));

            this.showNotification('지원자 목록을 성공적으로 가져왔습니다.', 'success');
          } else {
            this.showNotification('지원자 데이터를 처리하는 중 오류가 발생했습니다.', 'error');
          }
        } else {
          // 요청 실패 시 
          alert('지원자 데이터를 가져오는 데 실패했습니다.', 'error');
        }
      } catch (error) {
        // 네트워크 에러 또는 예외 발생
        alert('동아리 정보를 불러오는데 실패했습니다.');
      }
    },
    //합/불 결과 전송 확인 팝업 표시
    showPopup() {
      this.showConfirmPopup = true;
    },
    //합/불 결과 전송 확인 팝업 숨김
    hidePopup() {
      this.showConfirmPopup = false;
    },
    hideUnexpectedErrorPopup() {
      this.showUnexpectedErrorPopup = false;
    },
    //결과 전송 확인 후 팝업을 숨기고 전송 (팝업에서 '예' 선택 시)
    confirmSendResults() {
      this.hidePopup();
      this.sendResults();
    },
    // 합/불 결과를 서버에 전송하기 전 데이터 검증 메서드
    validateResults() {
      // 모든 지원자의 decision 값 설정됐는지 확인
      const valid = this.applicants.every(applicant => applicant.decision !== null);
      if (!valid) {
        alert('모든 지원자에 대해 합/불 상태를 설정해 주세요.', 'error');
      }
      return valid;
    },
    // 합/불 결과를 서버에 전송하는 메서드
    async sendResults() {
      // decision이 없는 지원자가 있는 경우 전송 X
      if (!this.validateResults()) {
        return;
      }
      // 서버에 보낼 데이터 포맷 정의
      const results = this.applicants.map(applicant => ({
        aplictUUID: applicant.aplictUUID,
        aplictStatus: applicant.decision,
      }));

      try {
        const response = await axios.post(this.submitUrl, results, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        // 성공 시 목록 새로고침
        this.showNotification('결과가 성공적으로 전송되었습니다.', 'success');
        await this.fetchApplicants();
      } catch (error) {
        if (error.response) {
          // 401 체크 추가
          if (error.response.status === 401) {
            this.show401Popup = true;
            return;
          }

          const errorData = error.response.data;
          if (errorData.code === "CMEM-202") {
            alert('이미 동아리원으로 등록된 지원자가 있습니다. 관리자에게 문의하세요.', 'error');
          } else if (errorData.code === 'INVALID_ARGUMENT') {
            this.showUnexpectedErrorPopup = true;
          } else {
            alert(errorData.message || '결과 전송에 실패했습니다.', 'error');
          }
        }
      }
    },
    // 지원자의 합/불 상태를 토글하는 메서드
    toggleDecision(applicant, decision) {
      applicant.decision = decision; // null로 돌아가지 않도록 설정
    },
    // 전체 지원자의 합/불 상태를 한 번에 설정하는 메서드
    setAllApplicantsStatus(status) {
      this.applicants.forEach(applicant => {
        applicant.decision = status;
      });
    },
    // 사용자에게 알림 메시지를 표시하는 메서드
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = '';
      }, 3000); // 3초 후 알림 사라짐
    },
  },
};
</script>





<style scoped>
.MainBox {
  width: 886px;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 8px;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.common {
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.6px;
}
.status-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.status-boxes {
  display: flex;
  align-items: center;
}
.status-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 43px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: 8px;
  background-color: #f7f7f7;
}
.approve-box {
  background-color: #7FB08C;
  font-size: 12px;
  color: white;
  cursor: pointer;
}
.reject-box {
  background-color: #E57373;
  color: white;
  font-size: 12px;
  margin-inline-end: 10px;
  cursor: pointer;
}

.approve-box:hover {
  background-color: #62956d;
}

.reject-box:hover {
  background-color: #cd5353;
}
.send-result-btn {
  width: 140px;
  height: 43px;
  border-radius: 8px;
  background-color: #000;
  color: white;
  cursor: pointer;
}
.contents {
  display: flex;
  flex-direction: column;
}
.applicant-list {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  overflow-y: auto;
  max-height: 500px; /* 필요에 따라 조정 */
  flex: 1;
}
.applicant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.applicant-item p {
  margin: 0;
  text-align: center;
  flex: 1;
}
.buttons-group {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: 5px;
}
.buttons-group label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 43px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #eee;
}
.buttons-group label.checked {
  background-color: #7FB08C;
  color: white;
}
.buttons-group label.checked:nth-child(2) {
  background-color: #E57373;
}
.popup-overlay {
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
.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  position: relative;
}
.popup h2 {
  margin-top: 0;
  text-align: left;
}
hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
.confirm-message {
  text-align: left;
}
.notice-message {
  text-align: left;
  font-size: 12px;
  color: gray;
}
.popup-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.popup-buttons button {
  width: 80px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
}
.popup-buttons button:first-child {
  background: #cecece;
  color: white;
}
.popup-buttons button:last-child {
  background: #ffb052;
  color: white;
}
.check-icon {
  background: url('../../assets/check-solid.svg') no-repeat center center;
  width: 16px;
  height: 16px;
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}
.unexpectedPopup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 180px;
  position: relative;
}
.unexpectedPopup h2 {
  margin-top: 0;
  text-align: left;
}
.unexpectedPopup-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.unexpectedPopup-buttons button {
  width: 80px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
}
.error-highlight {
  color: #ff4d4f;
}
</style>