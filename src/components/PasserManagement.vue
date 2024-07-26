<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 합격 처리</p>
    </div>
    <div class="status-actions">
      <button class="send-result-btn" @click="confirmSendResults">합/불 결과 전송하기</button>
      <div class="status-boxes">
        <div class="status-box approve-box">합격</div>
        <div class="status-box reject-box">불합격</div>
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
  </div>
</template>

<script>
export default {
  name: 'ApplicantManagement',
  data() {
    return {
      applicants: [],
      fetchUrl: 'YOUR_FETCH_URL_HERE', // 지원자 명단을 가져오는 서버 URL
      submitUrl: 'YOUR_SUBMIT_URL_HERE', // 합/불 결과를 보내는 서버 URL
    };
  },
  mounted() {
    this.fetchApplicants();
  },

//서버로부터 가져온값 예시 { id: 1, name: '김길김', department: '무슨학과', phone: '010-1234-5678', decision: null },
// { id: 2, name: '이길이', department: '어떤학과', phone: '010-9876-5432', decision: null },
// { id: 3, name: '박길박', department: '또다른학과', phone: '010-1234-5678', decision: null },

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
    confirmSendResults() {
      if (confirm('전송하시겠습니까?')) {
        this.sendResults();
      }
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
  width: 70px;
  height: 43px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: 8px;
  background-color: #f7f7f7;
}
.approve-box {
  background-color: #4CAF50;
  color: white;
}
.reject-box {
  background-color: #f44336;
  color: white;
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
</style>
