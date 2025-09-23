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
        <!--<button class="close-btn" @click="hidePopup">X</button>-->
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
  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios'; // axios를 가져옵니다.
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
        type: '' // 알림 메시지 타입
      },
      fetchUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/applicants`, // 지원자 명단을 가져오는 서버 URL
      submitUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/applicants/notifications`, // 합/불 결과를 보내는 서버 URL
      show401Popup: false,
    };
  },
  //지원자 명단 가져오기
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
        const response = await fetch(this.fetchUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        // 여기에 401 체크 추가
        if (response.status === 401) {
          this.show401Popup = true;
          return;
        }

        if (response.ok) {
          const result = await response.json();
          console.log(':', result);

          const data = result.data;
          if (data && Array.isArray(data)) {
            this.applicants = data.map(applicant => ({
              aplictUUID: applicant.aplictUUID,
              userName: applicant.userName,
              studentNumber: applicant.studentNumber,
              major: applicant.major,
              userHp: applicant.userHp,
              decision: null,
            }));

            this.showNotification('지원자 목록을 성공적으로 가져왔습니다.', 'success');
          } else {
            console.error('지원자 데이터 형식 오류', data);
            this.showNotification('지원자 데이터를 처리하는 중 오류가 발생했습니다.', 'error');
          }
        } else {
          console.error('지원자 데이터 가져오기 실패', response.statusText);
          alert('지원자 데이터를 가져오는 데 실패했습니다.', 'error');
        }
      } catch (error) {
        console.error('동아리 정보를 불러오는데 실패했습니다.', error);
        alert('동아리 정보를 불러오는데 실패했습니다.');
      }
    },
    //합/불 결과 전송 확인 팝업 표시
    showPopup() {
      this.showConfirmPopup = true;
    },
    ////합/불 결과 전송 확인 팝업 숨김
    hidePopup() {
      this.showConfirmPopup = false;
    },
    //결과 전송 확인 후 팝업을 숨기고 전송
    confirmSendResults() {
      this.hidePopup();
      this.sendResults();
    },
    // 합/불 결과를 서버에 전송하기 전 데이터 검증 메서드
    validateResults() {
      const valid = this.applicants.every(applicant => applicant.decision !== null);
      if (!valid) {
        alert('모든 지원자에 대해 합/불 상태를 설정해 주세요.', 'error');
      }
      return valid;
    },
    // 합/불 결과를 서버에 전송하는 메서드
    async sendResults() {
      if (!this.validateResults()) {
        return;
      }
      console.log('결과 전송 중...');
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

        this.showNotification('결과가 성공적으로 전송되었습니다.', 'success');
        await this.fetchApplicants();
        //window.location.reload();
      } catch (error) {
        if (error.response) {
          // 401 체크 추가
          if (error.response.status === 401) {
            this.show401Popup = true;
            return;
          }

          const errorData = error.response.data;
          if (errorData.code === "CMEM-202") {
            console.error('ClubMemberException 발생:', errorData.message);
            alert('이미 동아리원으로 등록된 지원자가 있습니다. 관리자에게 문의하세요.', 'error');
            //window.location.reload();
          } else {
            console.error('결과 전송 실패:', errorData.message || '서버 오류 발생');
            alert(errorData.message || '결과 전송에 실패했습니다.', 'error');
            //window.location.reload();
          }
        }
      }
    },
    // 지원자의 합/불 상태를 토글하는 메서드
    toggleDecision(applicant, decision) {
      applicant.decision = decision; // null로 돌아가지 않도록 설정
    },
    // 전체 지원자의 합/불 상태를 설정하는 메서드
    setAllApplicantsStatus(status) {
      //모든 지원자의 합/불 상태를 일괄 설정
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

/* ===== 전체 컨테이너 ===== */
.MainBox {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto 30px;
  background: #fff;
  border-radius: 8px;
  padding: clamp(16px, 3vw, 32px); /* 화면 크기에 따라 패딩 조절 */
  box-sizing: border-box;
  --brand-color: #ffb052;
  --approve-color: #7FB08C;
  --approve-color-dark: #62956d;
  --reject-color: #E57373;
  --reject-color-dark: #cd5353;
  --text-color: #000;
  --light-text-color: #555;
  --bg-color: #f7f7f7;
  --border-color: #ddd;
}

/* ===== 헤더 ===== */
.header {
  margin-bottom: 24px;
}
.common {
  color: var(--text-color);
  margin: 0;
  font-weight: 600;
  font-size: clamp(20px, 2.2vw, 24px);
}

/* ===== 액션 영역 (버튼) ===== */
.status-actions {
  display: flex; /* Flexbox로 변경 */
  flex-wrap: wrap; /* 화면이 작아지면 줄바꿈 */
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.send-result-btn {
  /* [수정] flex-grow를 이용해 유연한 너비 차지 */
  flex-grow: 1;
  min-width: 200px;
  height: 48px;
  border-radius: 8px;
  border: 0;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: background-color 0.2s;
}
.send-result-btn:hover { background-color: #333; }

.status-boxes {
  display: inline-flex;
  gap: 8px;
}
.status-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 42px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.2s;
}
.approve-box { background: var(--approve-color); }
.approve-box:hover { background: var(--approve-color-dark); }
.reject-box { background: var(--reject-color); }
.reject-box:hover { background: var(--reject-color-dark); }

/* ===== 본문/리스트 ===== */
.contents {
  margin-top: 24px;
}
.applicant-list {
  display: grid;
  gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px; /* 스크롤바 공간 */
}
.applicant-item {
  display: grid;
  align-items: center;
  gap: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  padding: 12px;
  /* 데스크톱 그리드 레이아웃 */
  grid-template-columns: 1.2fr 1fr 1.4fr 1.1fr auto;
}
.applicant-item p {
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
/* 첫 번째 p 태그(이름)는 왼쪽 정렬 */
.applicant-item p:first-child {
  text-align: left;
  font-weight: 500;
}
.buttons-group {
  display: inline-flex;
  gap: 8px;
  justify-self: end;
}
.buttons-group label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  background: #eee;
  transition: background-color 0.2s;
}
.buttons-group label.checked { background: var(--approve-color); }
.buttons-group label.checked:nth-of-type(2) { background: var(--reject-color); }
.check-icon {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>') no-repeat center/16px 16px;
  width: 16px;
  height: 16px;
}

/* ===== 팝업 ===== */
.popup-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: grid; place-items: center; z-index: 1000; padding: 16px;
}
.popup {
  width: 100%; max-width: 480px; background: #fff;
  padding: 24px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.popup h2 { margin: 0 0 16px; }
hr { border: 0; border-top: 1px solid var(--border-color); margin: 16px 0; }
.confirm-message { font-weight: 500; }
.notice-message { font-size: 13px; color: var(--light-text-color); }
.popup-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.popup-buttons button {
  min-width: 90px; height: 40px; border: 0; border-radius: 8px;
  cursor: pointer; font-weight: 500; font-size: 14px;
}
.popup-buttons button:first-child { background: #B9B9B9; color: #fff; }
.popup-buttons button:last-child { background: var(--brand-color); color: #fff; }

/* ===== 반응형: 태블릿 (768px 이하) ===== */
@media (max-width: 768px) {
  .applicant-item {
    grid-template-columns: 1fr 1fr; /* 2열 구조로 변경 */
    row-gap: 12px;
  }
  /* Grid 레이아웃 재배치 (nth-of-type 사용) */
  .applicant-item p:nth-of-type(1) { grid-column: 1 / -1; text-align: left; }
  .applicant-item p:nth-of-type(2), .applicant-item p:nth-of-type(4) { text-align: left; }
  .applicant-item p:nth-of-type(3) { text-align: right; }
  .buttons-group { grid-column: 2 / 3; }
}

/* ===== 반응형: 모바일 (500px 이하) ===== */
@media (max-width: 500px) {
  .status-actions { flex-direction: column; align-items: stretch; }
  .applicant-item {
    grid-template-columns: 1fr; /* 1열 구조로 변경 */
  }
  /* Grid 레이아웃 재배치 (1열) */
  .applicant-item p { grid-column: 1 / -1; text-align: left; }
  .applicant-item p:nth-of-type(3) { text-align: left; }
  .buttons-group { grid-column: 1 / -1; justify-self: stretch; }
  .buttons-group label { flex-grow: 1; }
}
</style>
