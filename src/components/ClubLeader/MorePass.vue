<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 추가 합격 처리</p>
    </div>
    <div class="status-actions">
      <button class="send-result-btn" @click="showPopup">추가 합격 결과 전송</button>
      <div class="status-boxes">
        <button class="status-box approve-box" @click="setAllApplicantsStatus('PASS')">전체<br>합격</button>
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
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
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
import axios from 'axios'; // axios를 가져오기
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
      fetchUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/failed-applicants`, // 지원자 명단을 가져오는 서버 URL
      submitUrl: `${store.state.apiBaseUrl}/club-leader/${store.state.clubUUID}/failed-applicants/notifications`, // 합/불 결과를 보내는 서버 URL
      show401Popup: false,
      showUnexpectedErrorPopup: false,
    };
  },
  //로드 되면 지원자 목록 가져오기
  mounted() {
    this.fetchApplicants();
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      // 에러 응답 O, 상태코드 401인 경우
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
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          // 요청 실패 시 
          alert('동아리 정보를 불러오는데 실패했습니다.', 'error');
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
    hideUnexpectedErrorPopup() {
      this.showUnexpectedErrorPopup = false;
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
      // decision이 없는 지원자가 있는 경우 전송 X
      if (!this.validateResults()) {
        return;
      }

      // 결정된 지원자만 필터링
      const selectedApplicants = this.applicants.filter(applicant => applicant.decision !== null);
      // 서버에 보낼 데이터 포맷 정의
      const results = selectedApplicants.map(applicant => ({
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
        const errorData = error.respose?.data || {};

        if (error.response?.data?.code === "CMEM-202") {
          alert('이미 동아리원으로 등록된 지원자가 있습니다. 관리자에게 문의하세요.', 'error');
        } else if (!this.handle401Error(error)) {
          const errorMessage = error.response?.data?.message || '결과 전송에 실패했습니다.';
          alert(errorMessage, 'error');
        } else if (errorData.code === 'INVALID_ARGUMENT') {
            this.showUnexpectedErrorPopup = true;
        } else {
            alert(errorData.message || '결과 전송에 실패했습니다.', 'error');
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
        alert('잘못된 합격/불합격 상태입니다. 상태는 PASS 또는 FAIL이어야 합니다.', 'error');
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
/* ====== Layout base ====== */
.MainBox{
  width: clamp(340px, 60vw, 960px); /* 최소 340px, 보통은 화면의 60%, 최대 960px */
  margin: 0 auto 30px;
  background: #fff;
  border-radius: 8px;
  padding: clamp(14px, 2vw, 24px);
}

/* ====== Header ====== */
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.common{
  color: var(--text, #000);
  font-weight: 600;
  letter-spacing: -0.6px;
  line-height: 1.2;
  margin: 0;
  font-size: clamp(18px, 2.1vw, 24px); /* 유동 폰트 */
}

/* ====== Actions (좌:전송버튼 / 우:상태박스) ====== */
.status-actions{
  display: flex;
  align-items: center;
  flex-wrap: wrap;          /* 한 줄에 안 들어가면 줄 바꿈 */
  column-gap: 12px;
  row-gap: 10px;
  width: 100%;
}
.send-result-btn{
  justify-self: start;
  min-width: 140px;
  height: 44px;
  border: 0;
  border-radius: var(--radius, 8px);
  background: var(--text, #000);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 0 var(--space-4, 16px);
  flex: 1 1 220px;
}
.send-result-btn:focus-visible{ outline: 2px solid var(--accent, #FFB052); outline-offset: 2px; }

.status-boxes{
  display: inline-flex;
  align-items: center;
  gap: var(--space-2, 8px);
}
.status-box{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 56px;
  height: 40px;
  padding: 4px 10px;
  border-radius: var(--radius, 8px);
  border: 1px solid #ddd;
  background: var(--muted, #f2f4f6);
  font-size: 12px;
  line-height: 1.1;
}
.approve-box{
  background: var(--brand, #7FB08C);
  color: #fff;
  border-color: transparent;
  cursor: pointer;
}
.approve-box:hover{ background: var(--brand-2, #6a9b7a); }

/* ====== Contents / 리스트 래퍼 ====== */
.contents{
  display: grid;
  grid-template-rows: 1fr;
}

.applicant-list{
  display: grid;
  grid-auto-rows: minmax(48px, auto);
  gap: var(--space-3, 12px);
  margin-top: var(--space-3, 12px);
  max-height: 60vh;           /* 화면 높이에 비례 */
  overflow-y: auto;
  padding-right: 2px;         /* 스크롤바 여백 */
}

/* ====== Item (그리드 기반) ====== */
.applicant-item{
  display: grid;
  align-items: center;
  gap: var(--space-3, 12px);
  background: var(--muted, #f2f4f6);
  border-radius: 10px;
  padding: 10px;
  /* 데스크톱: 이름 / 학번 / 학과 / 전화 / 버튼 */
  grid-template-columns: 1.2fr 0.9fr 1.4fr 1fr auto;
}
.applicant-item p{
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: var(--text, #000);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.buttons-group{
  display: inline-flex;
  align-items: center;
  gap: 9px;
  justify-self: end;
}
.buttons-group label{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 40px;
  border-radius: var(--radius, 8px);
  cursor: pointer;
  background: #eee;
  border: 1px solid #e3e3e3;
}
.buttons-group label.checked{
  background: var(--brand, #7FB08C);
  border-color: transparent;
  color: #fff;
}
.check-icon{
  background: url('../../assets/check-solid.svg') no-repeat center center / 16px 16px;
  width: 16px; height: 16px;
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}

/* ====== Popup ====== */
.popup-overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: grid; place-items: center;
  z-index: 1000;
}
.popup{
  width: min(92vw, 520px);    /* 반응형 폭 */
  background: #fff;
  border-radius: var(--radius, 8px);
  padding: clamp(16px, 2vw, 24px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.popup h2{
  margin: 0 0 10px 0;
  text-align: left;
  font-size: clamp(16px, 1.8vw, 18px);
}
hr{ border: 0; border-top: 1px solid #d9d9d9; margin: 10px 0; }
.confirm-message{ text-align: left; margin: 8px 0; }
.notice-message{
  text-align: left; font-size: 12px; color: var(--text-3, #767676); margin: 0;
}
.popup-buttons{
  display: flex; justify-content: flex-end; gap: var(--space-2, 8px);
  margin-top: var(--space-4, 16px);
}
.popup-buttons button{
  min-width: 88px; height: 36px;
  border: none; border-radius: 8px; cursor: pointer;
  font-weight: 600;
}
.popup-buttons button:first-child{ background: #cecece; color: #fff; }
.popup-buttons button:last-child{ background: var(--accent, #FFB052); color: #fff; }
.popup-buttons button:last-child:hover{ background: var(--accent-2, #f49421); }

/* ====== Breakpoints ====== */
/* ≤1024px: 레이아웃 여유 축소, 버튼 조금 작게 */
@media (max-width: 1024px){
  .send-result-btn{ height: 42px; }
  .status-box{ height: 38px; min-width: 52px; }
  .buttons-group label{ height: 38px; width: 52px; }
}

/* ≤768px: 리스트 행을 3줄 레이아웃으로 재배치 */
/* ≤768px: [수정] 리스트를 균형잡힌 2x2 형태로 재배치 */
@media (max-width: 768px) {
  .applicant-item {
    /* 2열 그리드 정의 */
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto; /* 3개의 행 높이는 내용에 맞게 자동 조절 */
    
    /* [핵심] 그리드 영역 이름으로 레이아웃을 시각적으로 정의 */
    grid-template-areas:
      "name   student-id"
      "major  phone"
      "actions actions"; /* 버튼은 맨 아래 한 줄을 모두 차지 */

    row-gap: 10px;
    column-gap: 16px; /* 열 사이 간격 */
    padding: 12px;
  }

  /* 각 요소에 grid-area 이름 할당 */
  .applicant-item p:nth-of-type(1) { grid-area: name; }
  .applicant-item p:nth-of-type(2) { grid-area: student-id; }
  .applicant-item p:nth-of-type(3) { grid-area: major; }
  .applicant-item p:nth-of-type(4) { grid-area: phone; }
  .buttons-group { grid-area: actions; }

  /* 모든 텍스트 왼쪽 정렬 및 스타일 초기화 */
  .applicant-item p {
    text-align: left;
    padding-left: 4px;
    grid-column: auto; /* 기존 grid-column 설정 초기화 */
  }

  /* 버튼 그룹 오른쪽 정렬 */
  .buttons-group {
    justify-self: end;
  }
}
/* ≤600px: 폰 크기 최적화(패딩/폰트/버튼 폭) */
@media (max-width: 600px){
  .MainBox{ padding: var(--space-4, 16px); }
  .send-result-btn{ width: 100%; justify-self: stretch; }  /* 전송 버튼 풀폭 */
  .status-actions{ grid-template-columns: 1fr; }
  .status-boxes{ justify-content: flex-end; }

  .applicant-list{ max-height: 58vh; }
  .applicant-item{ padding: 8px; gap: var(--space-2, 8px); }
  .applicant-item p{ font-size: 13px; }
  .buttons-group label{ width: 50px; height: 36px; }
}

/* ≤400px: 완전 스택 + 터치 여백 확보 */
@media (max-width: 400px){
  .status-boxes{ justify-content: stretch; }
  .status-box{ flex: 1 1 auto; }
  .applicant-item{
    grid-template-columns: 1fr;   /* 세로 스택 */
  }
  .applicant-item p{ grid-column: 1 / -1; text-align: left; }
  .buttons-group{ grid-column: 1 / -1; justify-self: stretch; justify-content: flex-end; }
}
</style>