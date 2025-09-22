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
/* ===== 컨테이너 ===== */
.MainBox{
  width: clamp(340px, 92vw, 1120px);
  margin: 0 auto 30px;
  background: #fff;
  border-radius: 8px;
  padding: clamp(16px, 2vw, 24px);
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 12px;
}

/* ===== 헤더 ===== */
.header{ display:flex; justify-content: space-between; align-items: center; }
.common{
  color:#000; letter-spacing:-0.6px; margin:0;
  font-weight:600; line-height:1.2;
  font-size: clamp(18px, 2.1vw, 24px);
}

/* ===== 액션 영역 ===== */
.status-actions{
  display: grid;
  grid-template-columns: 1fr auto; /* 좌: 전송버튼 / 우: 전체합격·불합격 */
  align-items: center;
  gap: 12px;
}
.send-result-btn{
  justify-self: start;
  min-width: 160px; height: 44px;
  border-radius: 8px; border:0;
  background:#000; color:#fff; cursor:pointer; font-weight:600;
  padding: 0 16px;
}
.send-result-btn:focus-visible{ outline:2px solid #ffb052; outline-offset:2px; }

.status-boxes{ display:inline-flex; align-items:center; gap: 8px; }
.status-box{
  display:inline-flex; justify-content:center; align-items:center;
  min-width: 64px; height: 40px; padding: 4px 10px;
  border:1px solid #ddd; border-radius:8px; background:#f7f7f7;
  font-size:12px; line-height:1.1; text-align:center; cursor:pointer;
}
.approve-box{ background:#7FB08C; color:#fff; border-color:transparent; }
.approve-box:hover{ background:#62956d; }
.reject-box{ background:#E57373; color:#fff; border-color:transparent; }
.reject-box:hover{ background:#cd5353; }

/* ===== 본문/리스트 ===== */
.contents{ display:grid; grid-template-rows:1fr; }

.applicant-list{
  display:grid; gap:12px; margin-top: 12px;
  max-height: 60vh; overflow-y:auto; padding-right: 2px;
}

/* 행: 이름 / 학번 / 학과 / 전화 / 토글 */
.applicant-item{
  display:grid; align-items:center; gap:10px;
  background:#f7f7f7; border-radius:8px; padding:10px;
  grid-template-columns: 1.2fr 0.9fr 1.4fr 1fr auto;
}
.applicant-item p{
  margin:0; text-align:center; font-size:14px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.buttons-group{ display:inline-flex; align-items:center; gap:9px; justify-self:end; }
.buttons-group label{
  display:inline-flex; justify-content:center; align-items:center;
  width:55px; height:40px; border-radius:8px; cursor:pointer;
  background:#eee;
}
.buttons-group label.checked{ background:#7FB08C; color:#fff; }
.buttons-group label.checked:nth-child(2){ background:#E57373; }
.check-icon{
  background:url('../../assets/check-solid.svg') no-repeat center/16px 16px;
  width:16px; height:16px;
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}

/* ===== 팝업 ===== */
.popup-overlay{
  position:fixed; inset:0; background:rgba(0,0,0,0.5);
  display:grid; place-items:center; z-index:1000;
}
.popup{
  width: min(92vw, 520px); background:#fff;
  padding: clamp(16px, 2vw, 24px);
  border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.15);
  position:relative; text-align:left;
}
.popup h2{ margin:0 0 10px 0; }
hr{ border:0; border-top:1px solid #ccc; margin:10px 0; }
.confirm-message{ text-align:left; }
.notice-message{ text-align:left; font-size:12px; color:gray; }
.popup-buttons{ display:flex; justify-content:flex-end; gap:10px; margin-top:20px; }
.popup-buttons button{
  min-width:84px; height:34px; border:0; border-radius:8px; cursor:pointer; font-weight:600;
}
.popup-buttons button:first-child{ background:#cecece; color:#fff; }
.popup-buttons button:last-child{ background:#ffb052; color:#fff; }

/* ===== 브레이크포인트 ===== */
/* ≤1024px: 버튼 살짝 축소 */
@media (max-width: 1024px){
  .send-result-btn{ height:42px; }
  .status-box{ height:38px; min-width: 60px; }
  .buttons-group label{ height:38px; width:52px; }
}

/* ≤768px: 리스트 2열 재배치 */
@media (max-width: 768px){
  .status-actions{ grid-template-columns: 1fr auto; }
  .applicant-item{
    grid-template-columns: 1fr 1fr;   /* 2열 */
    grid-auto-rows: auto; row-gap:8px;
  }
  /* 1) 이름: 전체폭 */
  .applicant-item p:nth-of-type(1){ grid-column:1 / -1; text-align:left; padding-left:4px; }
  /* 2) 학번(좌) 3) 학과(우) */
  .applicant-item p:nth-of-type(2){ grid-column:1 / 2; }
  .applicant-item p:nth-of-type(3){ grid-column:2 / 3; }
  /* 4) 전화(좌) 5) 버튼(우) */
  .applicant-item p:nth-of-type(4){ grid-column:1 / 2; }
  .buttons-group{ grid-column:2 / 3; justify-self:end; }
}
@media (max-width: 1024px){
  .status-actions{
    grid-template-columns: 1fr;   /* 1열로 전환 → 아래 줄에 상태 버튼 묶음 */
    row-gap: 10px;
  }
  .send-result-btn{
    width: 100%;
    justify-self: stretch;        /* 전송 버튼은 첫 줄 가득 */
  }
  .status-boxes{
    justify-self: end;            /* 두 버튼은 둘이 함께 오른쪽 정렬 */
  }
}
/* ≤600px: 액션 스택 + 버튼 풀폭 */
@media (max-width: 1200px){
  .status-actions{ grid-template-columns: 1fr; }
  .send-result-btn{ width:100%; justify-self:stretch; }
  .status-boxes{ justify-content:flex-end; }

  .applicant-item{ padding:8px; gap:8px; }
  .applicant-item p{ font-size:13px; }
  .buttons-group label{ width:50px; height:36px; }
}

/* ≤400px: 완전 스택 */
@media (max-width: 400px){
  .applicant-item{ grid-template-columns:1fr; }
  .applicant-item p{ grid-column:1 / -1; text-align:left; }
  .buttons-group{ grid-column:1 / -1; justify-self:stretch; justify-content:flex-end; }
}
</style>
