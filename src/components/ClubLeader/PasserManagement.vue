<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 합격 처리</p>
    </div>
    <div class="status-actions">
      <button class="send-result-btn" @click="showPopup">합/불 결과 전송하기</button>
      <div class="status-boxes">
        <p class="whole">일괄 선택</p>
        <button class="status-box approve-box" @click="setAllApplicantsStatus('approved')">전체 합격</button>
        <button class="status-box reject-box" @click="setAllApplicantsStatus('rejected')">전체 불합격</button>
      </div>
    </div>
    <div class="content">
      <div class="applicant-list">
        <div class="applicant-item" v-for="applicant in applicants" :key="applicant.id">
          <p>{{ applicant.name }}</p>
          <p>{{ applicant.id }}</p>
          <p>{{ applicant.department }}</p>
          <p>{{ applicant.phone }}</p>
          <div class="buttons-group">
            <label :class="{ checked: applicant.decision === 'approved' }" @click="toggleDecision(applicant, 'approved')">
              <span>체크</span>
            </label>
            <label :class="{ checked: applicant.decision === 'rejected' }" @click="toggleDecision(applicant, 'rejected')">
              <span>체크</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
        <button class="close-btn" @click="hidePopup">X</button>
        <h2>합격/불합격 처리하기</h2>
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
</template>

<script>
export default {
  name: 'ApplicantManagement',
  data() {
    return {
      applicants: [],
      showConfirmPopup: false,
      fetchUrl: 'YOUR_FETCH_URL_HERE', // 지원자 명단을 가져오는 서버 URL
      submitUrl: 'YOUR_SUBMIT_URL_HERE', // 합/불 결과를 보내는 서버 URL
    };
  },
  mounted() {
    this.fetchApplicants();
  },
  methods: {
    async fetchApplicants() {
      try {
        const response = await fetch(this.fetchUrl);
        if (response.ok) {
          const data = await response.json();
          this.applicants = data.map(applicant => ({
            ...applicant,
            decision: null, // decision 필드 초기화
          }));
        } else {
          console.error('지원자 데이터 가져오기 실패', response.statusText);
        }
      } catch (error) {
        console.error('지원자 데이터 가져오는 중 에러 발생', error);
      }
    },
    showPopup() {
      this.showConfirmPopup = true;
    },
    hidePopup() {
      this.showConfirmPopup = false;
    },
    confirmSendResults() {
      this.hidePopup();
      this.sendResults();
    },
    async sendResults() {
      console.log('결과 전송 중...');
      const results = this.applicants.map(applicant => ({
        id: applicant.id,
        decision: applicant.decision
      }));

      try {
        const response = await fetch(this.submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ applicants: results })
        });

        if (response.ok) {
          console.log('결과 전송 성공');
        } else {
          console.error('결과 전송 실패', response.statusText);
        }
      } catch (error) {
        console.error('결과 전송 중 에러 발생', error);
      }
    },
    toggleDecision(applicant, decision) {
      if (applicant.decision === decision) {
        applicant.decision = null;
      } else {
        applicant.decision = decision;
      }
    },
    setAllApplicantsStatus(status) {
      this.applicants.forEach(applicant => {
        applicant.decision = status;
      });
    }
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
.whole {
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.6px;
  display: flex;
  align-items: flex-end;
  height: 30px;
  margin-inline-end: 1px;
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
  width: 70px;
  height: 43px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: 8px;
  background-color: #f7f7f7;
}
.approve-box {
  background-color: #4CAF50;
  font-size: 12px;
  color: white;
}
.reject-box {
  background-color: #f44336;
  color: white;
  font-size: 12px;
  margin-inline-end: 10px;
}
.send-result-btn {
  width: 140px;
  height: 43px;
  border-radius: 8px;
  background-color: #000;
  color: white;
  cursor: pointer;
}
.content {
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
  width: 70px;
  height: 43px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #eee;
}
.buttons-group label.checked {
  background-color: #4CAF50;
  color: white;
}
.buttons-group label.checked:nth-child(2) {
  background-color: #f44336;
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
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
.popup-buttons button:first-child {
  background: #ccc;
}
.popup-buttons button:last-child {
  background: #f0b700;
  color: white;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: black;
}
</style>
