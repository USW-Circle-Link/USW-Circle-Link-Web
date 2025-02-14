<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 추가 합격 처리</p>
    </div>
    <div class="status-actions">
      <button class="send-result-btn" @click="showPopup">추가 합격 결과 전송</button>
      <div class="status-boxes">
        <button class="status-box approve-box" @click="setAllApplicantsStatus('PASS')">전체<br>합격</button>
        <!--<button class="status-box reject-box" @click="setAllApplicantsStatus('FAIL')">전체<br>불합격</button>-->
      </div>
    </div>
    <div class="contents">
      <div class="applicant-list">
        <div class="applicant-item" v-for="applicant in applicants" :key="applicant.aplictId">
          <p>{{ applicant.userName }}</p>
          <p>{{ applicant.studentNumber }}</p>
          <p>{{ applicant.major }}</p>
          <p>{{ applicant.userHp }}</p>
          <div class="buttons-group">
            <label :class="{ checked: applicant.decision === 'PASS' }" @click="toggleDecision(applicant, 'PASS')">
              <span class="check-icon"></span>
            </label>
            <!--
            <label :class="{ checked: applicant.decision === 'FAIL' }" @click="toggleDecision(applicant, 'FAIL')">
              <span>체크</span>
            </label>
            -->
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
        <!--<button class="close-btn" @click="hidePopup">X</button>-->
        <h2>추가 합격 결과 전송</h2>
        <hr>
        <p class="confirm-message">추가 합격 처리를 확정 하시겠습니까?</p>
        <p class="notice-message">확정 후 지원자에게 알림이 발송 되니 신중하게 선택해 주세요.</p>
        <div class="popup-buttons">
          <button @click="hidePopup">취소</button>
          <button @click="confirmSendResults">확정</button>
        </div>
      </div>
    </div>
   
  </div>
  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios'; // axios를 가져옵니다.
import store from '@/store/store'; // Vuex에서 상태 가져오기
import Popup401 from './401Popup.vue'; // 401 팝업 컴포넌트 추가

export default {
  name: 'ApplicantManagement',
  components: {
    Popup401
  },
  data() {
    return {
      applicants: [],//지원자 목록 배열
      showConfirmPopup: false,//합/불 확인 팝업 표시 여부
      notification: {
        message: '',
        type: ''
      },
      fetchUrl: `http://15.164.246.244:8080/club-leader/${store.state.clubId}/failed-applicants`, // 지원자 명단을 가져오는 서버 URL
      submitUrl: `http://15.164.246.244:8080/club-leader/${store.state.clubId}/failed-applicants/notifications`, // 합/불 결과를 보내는 서버 URL
      show401Popup: false,
    };
  },
  //로드 되면 지원자 목록 가져오기
  mounted() {
    this.fetchApplicants();
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
    // 지원자 목록을 서버에서 가져오는 메서드
    async fetchApplicants() {
      try {
        const response = await axios.get(this.fetchUrl, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data.data;
        if (data && Array.isArray(data)) {
          this.applicants = data.map(applicant => ({
            aplictId: applicant.aplictId,
            userName: applicant.userName,
            studentNumber: applicant.studentNumber,
            major: applicant.major,
            userHp: applicant.userHp,
            decision: null,
          }));
          this.showNotification('지원자 목록을 성공적으로 가져왔습니다.', 'success');
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          this.showNotification('동아리 정보를 불러오는데 실패했습니다.', 'error');
        }
      }
    },
    showPopup() {
      //합/불 결과 전송 확인 팝업을 표시
      this.showConfirmPopup = true;
    },
    //팝업 숨김
    hidePopup() {
      this.showConfirmPopup = false;
    },
    //팝업 숨기고 결과를 전송하는 메서드 호출
    confirmSendResults() {
      this.hidePopup();
      this.sendResults();
    },
    // 합/불 결과를 서버에 전송하기 전 데이터 검증 메서드
    validateResults() {
      // 선택된 지원자가 하나라도 있는지 확인
      const hasSelectedApplicants = this.applicants.some(applicant => applicant.decision !== null);

      if (!hasSelectedApplicants) {
        alert('최소 한 명 이상의 지원자에 대해 합/불 상태를 설정해 주세요.');
        return false;
      }
      return true;
    },
    // 합/불 결과를 서버에 전송하는 메서드
    async sendResults() {
      if (!this.validateResults()) {
        return;
      }

      // 결정된 지원자만 필터링
      const selectedApplicants = this.applicants.filter(applicant => applicant.decision !== null);

      const results = selectedApplicants.map(applicant => ({
        aplictId: applicant.aplictId,
        aplictStatus: applicant.decision,
      }));

      try {
        const response = await axios.post(this.submitUrl, results, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        this.showNotification('결과가 성공적으로 전송되었습니다.', 'success');
        window.location.reload();
      } catch (error) {
        if (error.response?.data?.code === "CMEM-202") {
          this.showNotification('이미 동아리원으로 등록된 지원자가 있습니다. 관리자에게 문의하세요.', 'error');
          window.location.reload();
        } else if (!this.handle401Error(error)) {
          const errorMessage = error.response?.data?.message || '결과 전송에 실패했습니다.';
          this.showNotification(errorMessage, 'error');
          window.location.reload();
        }
      }
    },
    // 지원자의 합/불 상태를 토글하는 메서드 @
    toggleDecision(applicant, decision) {
      if (['PASS', 'FAIL'].includes(decision)) {
        // 현재 상태와 같은 상태를 선택하면 선택 해제 (null로 설정)
        if (applicant.decision === decision) {
          applicant.decision = null;
        } else {
          // 다른 상태를 선택하면 해당 상태로 변경
          applicant.decision = decision;
        }
      } else {
        console.error("잘못된 상태 값: ", decision);
        this.showNotification('잘못된 합격/불합격 상태입니다. 상태는 PASS 또는 FAIL이어야 합니다.', 'error');
      }
    },
    // 전체 지원자의 합/불 상태를 설정하는 메서드
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
  margin-inline-end: 10px;
}

.approve-box:hover {
  background-color: #6a9b75;
}
/*
.reject-box {
  background-color: #E57373;
  color: white;
  font-size: 12px;
  margin-inline-end: 10px;
  cursor: pointer;
}*/
.send-result-btn {
  width: 180px;
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
  cursor: pointer;
}
/*
.buttons-group label.checked:nth-child(2) {
  background-color: #E57373;
  cursor: pointer;
}*/
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
  z-index: 999;
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

.popup-buttons button:last-child:hover {
  background-color: #e6953e; /* Change to a darker shade on hover */
}
/*
.close-btn {
  position: absolute;
  top: 20px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: black;
}*/
.check-icon {
  background: url('../../assets/check-solid.svg') no-repeat center center;
  width: 16px;
  height: 16px;
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}
</style>